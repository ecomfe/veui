<template>
  <form class="veui-form" @submit.prevent="handleSubmit">
    <slot></slot>
  </form>
</template>

<script>
import { isBoolean, isUndefined, isFunction, includes, assign, zipObject, map, keys } from 'lodash'
import { getVnodes } from '../../utils/context'

export default {
  name: 'veui-form',
  uiTypes: ['form', 'form-container'],

  props: {
    // 假设 validator 的 fields 为 ['a,b,c']，triggers 如下，最后生成的结果如下
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
      errorMap: {},
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
      if (this.validators) {
        this.validators.forEach(({ handler, triggers, fields }) => {
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
      }
      return map
    }
  },

  methods: {
    submit () {
      this.handleSubmit(null)
    },
    handleSubmit (e) {
      let data = this.data
      return new Promise(resolve =>
        isFunction(this.beforeValidate)
          ? resolve(this.beforeValidate.call(getVnodes(this)[0].context, data))
          : resolve()
      )
      .then(res =>
        this.isValid(res)
          ? this.validate()
          : res
      )
      .then(res =>
        this.isValid(res)
          ? new Promise(resolve =>
              isFunction(this.afterValidate)
                ? resolve(this.afterValidate.call(getVnodes(this)[0].context, data))
                : resolve()
            )
          : res
      )
      .then(res =>
        this.isValid(res)
          ? this.$emit('submit', data, e)
          : this.$emit('invalid', res)
      )
    },

    validate (names) {
      // fieldset 可以有 name，但是不会有 field 属性
      let targets = (this.fields || []).filter(item => item.field)
      let validators = this.validators || []
      if (Array.isArray(names) && names.length) {
        targets = targets.filter(target => includes(names, target.name))
        validators = validators.filter(
          validator => validator.fields && validator.fields.some(
            fieldName => includes(names, fieldName)
          )
        )
      }

      return Promise.all(
        [
          ...targets.map(target => {
            let validity = target.validate()
            // utils/Validator 是同步的，检查一下不是 true 就好，返回其他的都当成错误信息
            if (!isBoolean(validity) || !validity) {
              // 没有name的无法描述，invalid的时候就不抛了
              return Promise.resolve(target.name ? { [target.name]: validity } : {})
            }
            return Promise.resolve(true)
          }),

          ...validators.map(({ handler, fields }) => {
            if (isFunction(handler) && fields) {
              let validities = this.execValidator(handler, fields)

              // 异步校验交给返回的 Promise，对于同步校验，true 代表校验通过，false 代表不通过但是没有出错信息，其他当成 { fieldName1: errMsg, ... } 处理
              // 异步校验
              if (validities && isFunction(validities.then)) {
                return validities
              }

              return Promise.resolve(validities)
            }
            // 没有回调或者校验项
            // TODO: 补个warn？
            return Promise.resolve(true)
          })
        ]
      )
      .then(
        allRes => {
          return allRes.every(mixed => this.isValid(mixed))
            ? Promise.resolve(true)
            : Promise.resolve(assign({}, ...allRes.filter(mixed => !this.isValid(mixed))))
        }
      )
    },

    execValidator (handler, fields) {
      let targets = fields.map(name => this.fieldsMap[name])
      let validities = handler.apply(
        this,
        targets.map(target => target && target.getFieldValue())
      )

      // 异步校验
      if (validities && isFunction(validities.then)) {
        return validities.then(
          res => {
            this.handleValidities(res, fields)
            return this.isValid(res) || res
          }
        )
      }

      this.handleValidities(validities, fields)
      return validities
    },

    handleInteract (eventName, name) {
      let validators = this.interactiveValidatorsMap[eventName]
      if (validators) {
        validators.forEach(({ handler, fields }) => {
          if (includes(fields, name) && isFunction(handler)) {
            this.execValidator(handler, fields)
          }
        })
      }
    },

    /**
     * 处理validator产生的校验信息
     *
     * @param  {Boolean|Object} validities true或者出错的Object
     * @param  {Array} [fields] 校验的field集合
     */
    handleValidities (validities, fields) {
      let fieldStrings = fields.join(',')
      if (this.isValid(validities)) {
        fields.forEach(name => {
          let target = this.fieldsMap[name]
          let promotion = this.errorMap[fieldStrings]
          if (promotion) {
            target = this.fieldsMap[promotion]
            delete this.errorMap[fieldStrings]
          }
          target && target.hideValidity(fieldStrings)
        })
      } else {
        keys(validities).forEach(name => {
          let target = this.fieldsMap[name]
          if (target && !target.validities.some(validity => validity.fields === fieldStrings)) {
            target.validities.unshift({
              valid: false,
              message: validities[target.name],
              fields: fieldStrings
            })
            // 防止使用 fieldset 定位错误之后，上边找不到
            if (!includes(fields, target.name)) {
              this.errorMap[fieldStrings] = target.name
            }
          }
        })
      }
    },

    isValid (res) {
      return isUndefined(res) || (isBoolean(res) && res)
    },

    reset () {
      this.fields.forEach(target => {
        target.resetValue()
      })
    }
  },

  created () {
    this.$on('interact', this.handleInteract)
  }
}
</script>
