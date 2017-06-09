<template>
  <form class="veui-form" @submit.prevent="handleSubmit">
    <slot></slot>
  </form>
</template>

<script>
import { isBoolean, isFunction, includes, assign, zipObject, map, keys, partial } from 'lodash'
import { allSettled } from '../../utils/promise'
import { rule } from '../../managers'
import Vue from 'vue'

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
    readonly: Boolean
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
    interactiveValidators () {
      return this.validators
        ? this.validators.filter(validator => {
          let fn = validator.handler
          let triggers = validator.triggers
          if (!isFunction(fn) || !validator.fields || !triggers) {
            return false
          }

          // 参照上述 props.validator 支持的格式
          triggers = (Array.isArray(triggers) ? triggers : [triggers])
            .filter(events => events.split(',').filter(event => event !== 'submit').length)

          // 去掉都是submit的
          return triggers.length
        })
        : null
    },
    interactiveValidatorsMap () {
      let singleFieldMap = {}
      this.interactiveValidators && this.interactiveValidators.forEach(validator => {
        let fieldNames = validator.fields
        let triggers = validator.triggers
        // 这里肯定有 triggers
        fieldNames.split(',').forEach((name, index) => {
          let event = (Array.isArray(triggers) ? triggers[index] : triggers)
            .split(',').filter(event => event !== 'submit')
          if (event) {
            singleFieldMap[name] = singleFieldMap[name] || []
            singleFieldMap[name].push({
              event,
              validator
            })
          }
        })
      })
      return singleFieldMap
    },
    formData () {
      let fields = this.fields.filter(field => !field.isAllDisabled)
      return assign({}, ...fields.map(field => ({ [field.name]: field.submittedValue })))
    }
  },

  watch: {
    interactiveValidators (newVal, oldVal) {
      let added = newVal || []
      if (oldVal && oldVal.length) {
        let diff = rule.diffRules(newVal, oldVal)
        diff.removed.forEach(validator => {
          let triggers = validator.triggers
          let fieldNames = validator.fields.split(',')

          // 这里的 triggers 应该也过滤过了
          if (Array.isArray(triggers)) {
            let justified = fieldNames.map((name, index) => ({name, event: triggers[index]}))
            justified.forEach(({ name, event }) => {
              if (event) {
                let handlerName = `${fieldNames.join(',')}-${name}-${event}`
                this.fieldsMap[name].removeInteractiveValidator(
                  event,
                  this.handlers[handlerName]
                )
                delete this.handlers[handlerName]
              }
            })
          } else {
            fieldNames.forEach(name => {
              triggers.split(',').forEach(event => {
                let handlerName = `${fieldNames.join(',')}-${name}-${event}`
                this.fieldsMap[name].removeInteractiveValidator(event, this.handlers[handlerName])
                delete this.handlers[handlerName]
              })
            })
          }
        })
        added = diff.added
      }
      this.bindInteractiveValidators({ validators: added })
    }
  },

  methods: {
    handleSubmit (e) {
      let data = this.formData
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

    /**
     * 存在两种情况进入这个函数
     * 1. input 被添加到 form 中，包括动态添加field或者在field中动态添加input，这个时候传递新增的 input
     * 2. validators 产生更新，不需要指定 input
     *
     * @param  {Component} [input] InputComponent
     * @param  {Array} [validators=this.interactiveValidators] 配置
     */
    bindInteractiveValidators ({ input, validators = this.interactiveValidators }) {
      let cb = (fieldNames, handler, e) => {
        fieldNames = fieldNames.split(',')
        Vue.nextTick(() => {
          let validities = handler(
            ...fieldNames.map(name => this.fieldsMap[name].submittedValue)
          )
          // 这里不需要 return 了，因为是 interactive 的，没人接 Promise，直接 catch 掉
          let defaultErr = zipObject(fieldNames, [])
          if (validities && isFunction(validities.then)) {
            return validities.then(val => true)
              .catch(err => err)
              .then(res => this.handleValidities(res || defaultErr, fieldNames))
          }
          this.handleValidities(validities || defaultErr, fieldNames)
        })
      }

      if (input) {
        let fieldName = input.formField.name
        let config = this.interactiveValidatorsMap[fieldName]
        config && config.forEach(({ event, validator }) => {
          let fieldNames = validator.fields
          // 比如写了个多组件联合校验
          //
          // {
          //   fields: ['start', 'end'],
          //   handler (start, end) {
          //     if (!start || !end) {
          //       return true
          //     }

          //     if (parseInt(start, 10) >= parseInt(end, 10)) {
          //       return {
          //         start: '下限必须小于上限'
          //       }
          //     }
          //     return true
          //   },
          //   triggers: 'change,input'
          // }
          //
          //
          // 那么这里就是 'start,end-start-change', 'start,end-end-input'
          let handlerName = `${fieldNames}-${fieldName}-${event}`
          !this.handlers[handlerName] && assign(
            this.handlers,
            { [handlerName]: partial(cb, fieldNames, validator.handler) }
          )
          input.$on(event, this.handlers[handlerName])
        })
      } else {
        validators && validators.forEach(validator => {
          let triggers = validator.triggers
          let fieldNames = validator.fields

          fieldNames.split(',').forEach((name, index) => {
            let events = Array.isArray(triggers) ? triggers : triggers.split(',')
            events.forEach(event => {
              if (!event || event === 'submit') {
                return
              }

              let handlerName = `${fieldNames}-${name}-${event}`
              assign(this.handlers, { [handlerName]: partial(cb, fieldNames, validator.handler) })
              this.fieldsMap[name].addInteractiveValidator(event, this.handlers[handlerName])
            })
          })
        })
      }
    },

    validate (names) {
      // fieldset 可以有 name，但是不会有直接的 input，没有校验规则，只能显示集合校验的出错信息，校验的时候要排除
      let fields = (this.fields || []).filter(field => field.inputs && field.inputs.length)
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
                targets.map(field => field && field.submittedValue)
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
    }
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";

.veui-form[ui~="inline"] {
  .clearfix();

  .veui-form-field-set,
  .veui-form-field {
    display: inline-block;
    margin-bottom: 0;
    clear: none;

    & > .veui-form-key {
      width: auto;
    }

    & + .veui-form-field-set,
    & + .veui-form-field {
      margin-left: 15px;
    }
  }
}
</style>
