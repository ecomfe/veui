<template>
<form
  :ui="realUi"
  :class="$c('form')"
  @submit.prevent="handleSubmit"
  @reset.prevent="reset(null)"
>
  <slot/>
  <div
    v-if="hasActions"
    :class="$c('form-actions')"
  >
    <slot
      name="actions"
      v-bind="{ submit }"
    />
  </div>
</form>
</template>

<script>
import {
  isBoolean,
  isUndefined,
  isFunction,
  includes,
  assign,
  zipObject,
  map,
  debounce,
  omit
} from 'lodash'
import { getVnodes } from '../../utils/context'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import '../../common/uiTypes'

export default {
  name: 'veui-form',
  uiTypes: ['form', 'form-container'],
  mixins: [prefix, ui],
  props: {
    /**
     * 假设 validator 的 fields 为 ['a','b','c']，triggers 如下，最后生成的结果如下
     * ['change', 'blur,input,xxx', 'submit'] => a(change), b(blur,input,xxx), c(submit)
     * ['blur']                               => a(blur), b(submit), c(submit)
     * 'blur,input'                           => a(blur,input), b(blur,input), c(blur,input)
     * 'blur'                                 => a(blur), b(blur), c(blur)
     *
     * validator的返回值说明：
     * 1. undefined/true 同步校验成功，清空前置同类错误
     * 2. false 同步校验失败，无错误消息
     * 3. Promise resolve(true) 异步校验成功，清空前置同类错误
     * 4. Promise resolve(errObject) 同步校验失败，errOjbect为错误消息
     */
    validators: Array,
    beforeValidate: Function,
    afterValidate: Function,
    disabled: Boolean,
    readonly: Boolean,
    /* eslint-disable vue/require-prop-types */
    data: {}
    /* eslint-enable vue/require-prop-types */
  },
  data () {
    return {
      fields: [],
      errorMap: {}
    }
  },
  computed: {
    hasActions () {
      return this.$slots.actions || this.$scopedSlots.actions
    },
    fieldsMap () {
      let targets = this.fields.filter(target => target.name)
      return zipObject(map(targets, 'name'), targets)
    },
    interactiveValidatorsMap () {
      let map = {}
      if (this.validators) {
        this.validators.forEach(({ validate, handler, triggers, fields }) => {
          let fn = validate || handler
          // 没有 trigger 代表 submit 检查，这里只存交互的
          if (!isFunction(fn) || !fields || !triggers) {
            return
          }

          // 参照上述 props.validator 支持的格式
          triggers = Array.isArray(triggers) ? triggers : [triggers]
          triggers.forEach(events => {
            events.split(',').forEach(event => {
              if (event === 'submit') {
                return
              }

              let debounceFn = debounce(() => {
                this.execValidator(fn, fields)
              }, 300)
              let item = {
                fields,
                validate: debounceFn,
                handler: debounceFn
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
  created () {
    this.$on('interact', this.handleInteract)
  },
  methods: {
    submit () {
      this.handleSubmit(null)
    },
    handleSubmit (e) {
      // 把 field 上边 disabled 的项去掉
      let data = omit(
        this.data,
        this.fields
          .filter(field => field.realDisabled)
          .map(({ realField }) => realField)
      )
      return new Promise(resolve =>
        // 处理 beforeValidate 返回 Promise 的情况，通过 resolve 直接把返回值传递到下层
        isFunction(this.beforeValidate)
          ? resolve(this.beforeValidate.call(getVnodes(this)[0].context, data))
          : resolve()
      )
        .then(res => (this.isValid(res) ? this.validate() : res))
        .then(res =>
          this.isValid(res)
            ? new Promise(resolve =>
            // 处理 afterValidate 返回 Promise 的情况，通过 resolve 直接把返回值传递到下层
              isFunction(this.afterValidate)
                ? resolve(
                  this.afterValidate.call(getVnodes(this)[0].context, data)
                )
                : resolve()
            )
            : res
        )
        .then(res => {
          if (this.isValid(res)) {
            this.$emit('submit', data, e)
          } else {
            this.$emit('invalid', res)
          }
        })
    },
    validate (names) {
      // fieldset 可以有 name，但是不会有 field 属性，也不要校验 disabled 的
      let targets = (this.fields || []).filter(
        item => item.realField && !item.realDisabled
      )
      let validators = this.validators || []
      if (Array.isArray(names) && names.length) {
        targets = targets.filter(
          target => includes(names, target.name) && !target.realDisabled
        )
        validators = validators.filter(
          validator =>
            validator.fields &&
            validator.fields.some(fieldName => includes(names, fieldName))
        )
      }

      return Promise.all([
        ...targets.map(target => {
          let validity = target.validate()
          // utils/Validator 是同步的，检查一下不是 true 就好，返回其他的都当成错误信息
          if (!isBoolean(validity) || !validity) {
            // 没有name的无法描述，invalid的时候就不抛了
            return Promise.resolve(
              target.name ? { [target.name]: validity } : {}
            )
          }
          return Promise.resolve(true)
        }),
        ...validators.map(({ validate, handler, fields }) => {
          let fn = validate || handler
          if (isFunction(fn) && fields) {
            let validities = this.execValidator(fn, fields)

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
      ]).then(allRes => {
        return allRes.every(mixed => this.isValid(mixed))
          ? Promise.resolve(true)
          : Promise.resolve(
            assign({}, ...allRes.filter(mixed => !this.isValid(mixed)))
          )
      })
    },
    execValidator (validate, fields) {
      let targets = fields.map(name => this.fieldsMap[name])
      let validities = validate.apply(
        this,
        targets.map(target => target && target.getFieldValue())
      )

      // 异步校验，详细返回值说明请看prop.validators
      if (validities && isFunction(validities.then)) {
        return validities.then(res => {
          this.handleValidities(res, fields)
          return this.isValid(res) || res
        })
      }

      this.handleValidities(validities, fields)
      return validities
    },
    handleInteract (eventName, name) {
      let validators = this.interactiveValidatorsMap[eventName]
      if (validators) {
        validators.forEach(({ validate, handler, fields }) => {
          let fn = validate || handler
          if (includes(fields, name) && isFunction(fn)) {
            fn()
          }
        })
      }
    },
    /**
     * 处理validator产生的校验信息
     *
     * @param  {Boolean|Object} validities true或者出错的Object
     * @param  {Array} [fields] 校验的 field 的 name 集合，可能是fieldset
     */
    handleValidities (validities, fields) {
      // 加个前缀避免单 field 冲突
      let validityName = `validator:${fields.join(',')}`
      if (this.isValid(validities)) {
        fields.forEach(name => {
          // 找到真正显示错误的地方
          let vectors = this.errorMap[validityName]

          if (vectors && vectors.length) {
            vectors.forEach(vector => {
              let target = this.fieldsMap[vector]
              target && target.hideValidity(validityName)
            })
            delete this.errorMap[validityName]
          }
        })
      } else {
        Object.keys(validities).forEach(name => {
          let vectors = this.errorMap[validityName] || []
          let target = this.fieldsMap[name]

          let validity = {
            valid: false,
            message: validities[target.name],
            fields: validityName
          }
          // 看下是否之前这个校验规则出过错，没出过错就直接塞进去
          if (
            target &&
            !target.validities.some(
              validity => validity.fields === validityName
            )
          ) {
            target.validities.unshift(validity)
            // 防止使用 fieldset 定位错误之后，上边找不到，所以都要记住
            if (!includes(vectors, target.name)) {
              this.errorMap[validityName] = [
                ...(this.errorMap[validityName] || []),
                target.name
              ]
            }
          } else {
            // 之前出过错，要把这个 validities 更新一下
            this.$set(target, 'validities', [
              validity,
              ...target.validities.filter(
                validity => validity.fields === validityName
              )
            ])
          }
        })
      }
    },
    isValid (res) {
      return isUndefined(res) || res === true
    },
    reset (names) {
      let fields = names
        ? this.fields.filter(field => includes(names, field.name))
        : this.fields
      fields.forEach(target => {
        target.resetValue()
      })
    }
  }
}
</script>
