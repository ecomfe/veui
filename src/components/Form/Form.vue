<template>
  <form class="veui-form" @submit.prevent="handleSubmit">
    <slot></slot>
  </form>
</template>

<script>
import { isBoolean, isFunction, includes, assign, zipObject, map, keys, each } from 'lodash'
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
      let fields = this.fields.filter(field => field.name)
      return zipObject(map(fields, 'name'), fields)
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
      // fieldset 可以有 name，但是不会有 field
      let fields = (this.fields || []).filter(item => item.field)
      let validators = this.validators || []
      if (Array.isArray(names) && names.length) {
        fields = fields.filter(field => includes(names, field.name))
        validators = validators.filter(validator => includes(names, validator.fields))
      }

      return allSettled(
        [
          ...fields.map(field => {
            let validity = field.validate()
            // utils/Validator 是同步的，检查一下不是 true 就好，返回其他的都当成错误信息
            if (!isBoolean(validity) || !validity) {
              // 没有name的无法描述，invalid的时候就不抛了
              return Promise.reject(field.name ? { [field.name]: validity } : {})
            }
            return Promise.resolve(true)
          }),

          ...validators.map(validator => {
            let fn = validator.handler
            if (isFunction(fn) && validator.fields) {
              let fields = validator.fields.split(',')
              let targets = fields.map(name => this.fieldsMap[name])
              let validities = fn.apply(
                this,
                targets.map(field => field && field.getFieldValue())
              )

              let defaultErr = zipObject(fields, [])
              // 异步校验交给返回的 Promise，对于同步校验，true 代表校验通过，false 代表不通过但是没有出错信息，其他当成 { fieldName1: errMsg, ... } 处理
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
              // 同步校验但是出错
              if (!isBoolean(validities) || !validities) {
                return Promise.reject(res)
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

    /**
     * 处理validator产生的校验信息
     *
     * @param  {Boolean|Object} validities true或者出错的Object
     * @param  {Array} [fieldNames] 校验的field集合
     */
    handleValidities (validities, fieldNames) {
      if (isBoolean(validities) && validities) {
        fieldNames.forEach(name => {
          let field = this.fieldsMap[name]
          field && field.hideValidity(fieldNames.join(','))
        })
      } else {
        keys(validities).forEach(name => {
          let field = this.fieldsMap[name]
          field && field.validities.unshift({
            valid: false,
            message: validities[field.name],
            invalidType: fieldNames.join(',')
          })
        })
      }
    },

    reset () {
      this.fields.forEach(field => {
        field.resetValue()
      })
    },

    handleInteract (eventName, name) {
      let validators = this.interactiveValidatorsMap[eventName]
      if (validators) {
        validators.forEach(({ handler, fields }) => {
          fields = fields.split(',')
          if (includes(fields, name) && isFunction(handler)) {
            let res = handler.apply(
              this,
              fields.map(name => this.fieldsMap[name] && this.fieldsMap[name].getFieldValue())
            )
            if (res.then && isFunction(res.then)) {

            } else if (isBoolean(res) && !res) {
              each(res, (message, name) => {
                this.fieldsMap[name].validities.push({
                  message
                })
              })
            }
          }
        })
      }
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
