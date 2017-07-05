<template>
  <form class="veui-form" @submit.prevent="handleSubmit">
    <slot></slot>
  </form>
</template>

<script>
import { isBoolean, isFunction, includes, assign, zipObject, map, keys } from 'lodash'
import { allSettled } from '../../utils/promise'

export default {
  name: 'veui-form',
  uiTypes: ['form', 'form-container'],

  props: {
    // 假设 validator 的 fields 为 'a,b,c'，triggers 如下，最后生成的结果如下
    // ['change', 'blur,input,xxx', 'submit'] => a(change), b(blur,input,xxx), c(submit)
    // ['blur']                               => a(blur), b(submit), c(submit)
    // 'blur,input'                           => a(blur,input), b(blur,input), c(blur,input)
    // 'blur'                                 => a(blur), b(blur), c(blur)
    validators: Array,
    beforeValidate: Function,
    afterValidate: Function,
    disabled: Boolean,
    readonly: Boolean,
    data: null
  },

  data () {
    return {
      fields: [],
      handlers: {}
    }
  },

  computed: {
    fieldsMap () {
      let targets = this.fields.filter(target => target.name)
      return zipObject(map(targets, 'name'), targets)
    },

    interactiveValidatorsMap () {
      let map = {}
      this.validators && this.validators.forEach(({ handler, triggers, fields }) => {
        // 没有 trigger 代表 submit 检查，这里只存交互的
        if (!isFunction(handler) || !fields || !triggers) {
          return
        }

        // 参照上述 props.validator 支持的格式
        triggers = (Array.isArray(triggers) ? triggers : [triggers])
        triggers.forEach(events => {
          events.split(',').forEach(event => {
            if (event === 'submit') {
              return
            }

            let item = {
              fields,
              handler
            }
            if (map[event]) {
              map[event].push(item)
            } else {
              map[event] = [item]
            }
          })
        })
      })
      return map
    }
  },

  methods: {
    handleSubmit (e) {
      let data = this.data
      return new Promise((resolve, reject) =>
        isFunction(this.beforeValidate)
          ? resolve(this.beforeValidate.call(this.$vnode.context, data))
          : resolve()
      )
      .then(this.validate.bind(this))
      .then(
        () => new Promise((resolve, reject) =>
          isFunction(this.afterValidate)
            ? resolve(this.afterValidate.call(this.$vnode.context, data))
            : resolve()
        )
      )
      .then(
        this.$emit.bind(this, 'submit', data, e),
        err => {
          this.$emit('invalid', err)
        }
      )
    },

    validate (names) {
      // fieldset 可以有 name，但是不会有 field 属性
      let targets = (this.fields || []).filter(item => item.field)
      let validators = this.validators || []
      if (Array.isArray(names) && names.length) {
        targets = targets.filter(target => includes(names, target.name))
        validators = validators.filter(validator => includes(names, validator.fields))
      }

      return allSettled(
        [
          ...targets.map(target => {
            let validity = target.validate()
            // utils/Validator 是同步的，检查一下不是 true 就好，返回其他的都当成错误信息
            if (!isBoolean(validity) || !validity) {
              // 没有name的无法描述，invalid的时候就不抛了
              return Promise.reject(target.name ? { [target.name]: validity } : {})
            }
            return Promise.resolve(true)
          }),

          ...validators.map(({ handler, fields }) => {
            if (isFunction(handler) && fields) {
              let fieldsArr = fields.split(',')
              let defaultErr = zipObject(fieldsArr, [])

              let validities = this.execValidator(handler, fields, defaultErr)

              // 异步校验交给返回的 Promise，对于同步校验，true 代表校验通过，false 代表不通过但是没有出错信息，其他当成 { fieldName1: errMsg, ... } 处理
              // 异步校验
              if (validities && isFunction(validities.then)) {
                return validities
              }

              // 同步校验但是出错
              if (!isBoolean(validities) || !validities) {
                return Promise.reject(validities)
              }
              // 同步校验并且通过
              return Promise.resolve(validities)
            } else {
              // 没有回调或者校验项
              // TODO: 补个warn？
              return Promise.resolve(true)
            }
          })
        ]
      )
      .then(
        allRes => {
          if (allRes.every(mixed => {
            return 'val' in mixed
          })) {
            return Promise.resolve()
          }

          return Promise.reject(assign({}, ...allRes.filter(res => 'err' in res).map(res => res.err)))
        }
      )
    },

    execValidator (handler, fields, defaultErr) {
      let fieldsArr = fields.split(',')
      let targets = fieldsArr.map(name => this.fieldsMap[name])
      let validities = handler.apply(
        this,
        targets.map(target => target && target.getFieldValue())
      )

      // 异步校验
      if (validities && isFunction(validities.then)) {
        return validities.then(
          val => {
            this.handleValidities(true, fields)
            return { val }
          },
          err => {
            let res = err || defaultErr
            this.handleValidities(res, fields)
            return Promise.reject(res)
          }
        )
      }

      let res = validities || defaultErr
      this.handleValidities(res, fields)

      return res
    },

    handleInteract (eventName, name) {
      let validators = this.interactiveValidatorsMap[eventName]
      if (validators) {
        validators.forEach(({ handler, fields }) => {
          let fieldsArr = fields.split(',')
          if (includes(fieldsArr, name) && isFunction(handler)) {
            let defaultErr = zipObject(fields, [])
            let validities = this.execValidator(handler, fields, defaultErr)

            // 异步校验交给返回的 Promise，由于这里是 interact 的，所以不需要返回
            if (!validities.then || !isFunction(validities.then)) {
              let res = validities || defaultErr
              this.handleValidities(res, fields)
            }
          }
        })
      }
    },

    /**
     * 处理validator产生的校验信息
     *
     * @param  {Boolean|Object} validities true或者出错的Object
     * @param  {String} [fieldNames] 校验的field集合
     */
    handleValidities (validities, fieldNames) {
      if (isBoolean(validities) && validities) {
        fieldNames.split(',').forEach(name => {
          let target = this.fieldsMap[name]
          target && target.hideValidity(fieldNames)
        })
      } else {
        keys(validities).forEach(name => {
          let target = this.fieldsMap[name]
          target && target.validities.unshift({
            valid: false,
            message: validities[target.name],
            invalidType: fieldNames
          })
        })
      }
    },

    reset () {
      this.fields.forEach(target => {
        target.resetValue()
      })
    }
  },

  created () {
    this.$on('interacting', this.handleInteract)
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";

.veui-form[ui~="inline"] {
  .clearfix();

  .veui-field-set,
  .veui-field {
    display: inline-block;
    margin-bottom: 0;
    clear: none;

    & > .veui-form-key {
      width: auto;
    }

    & + .veui-field-set,
    & + .veui-field {
      margin-left: 15px;
    }
  }
}
</style>
