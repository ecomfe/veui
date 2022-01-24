<template>
<form
  :ui="realUi"
  :class="$c('form')"
  @submit.prevent="handleSubmit"
  @reset.prevent="reset(null)"
>
  <slot v-bind="{ submit, validating: isValidating }"/>
  <div
    v-if="hasActions()"
    :class="$c('form-actions')"
  >
    <slot
      name="actions"
      v-bind="{ submit, validating: isValidating }"
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
  uniq,
  fill,
  omit,
  uniqueId
} from 'lodash'
import { getVnodes } from '../../utils/context'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import '../../common/global'

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
      errorMap: {},
      submissionValidating: false,
      interactiveValidationRecord: {} // 能够构造出提交校验时出交互事件，所以分开标记
    }
  },
  computed: {
    interactiveValidating () {
      return !!Object.keys(this.interactiveValidationRecord).length
    },
    isValidating () {
      return this.submissionValidating || this.interactiveValidating
    },
    fieldsMap () {
      let targets = this.fields.filter((target) => target.name)
      return zipObject(map(targets, 'name'), targets)
    },
    normalizedValidators () {
      return (this.validators || [])
        .filter(
          ({ validate, handler, fields }) =>
            fields && isFunction(validate || handler)
        )
        .map(({ validate, handler, fields, triggers }) => {
          fields = Array.isArray(fields) ? fields : [fields]
          // triggers 和 fields 数组长度一致了
          triggers = normalizeTriggers(triggers, fields.length)
          const fn = validate || handler
          return {
            validate: fn,
            fields, // string[]
            triggers // string[][]
          }
        })
    },
    fieldEvents () {
      return this.normalizedValidators.reduce((acc, { fields, triggers }) => {
        fields.forEach((field, index) => {
          acc[field] = acc[field] || []
          acc[field] = uniq(
            acc[field].concat(
              triggers[index].filter((item) => item !== 'submit')
            )
          )
        })
        return acc
      }, {})
    }
  },
  created () {
    this.$on('interact', this.handleInteract)
  },
  methods: {
    hasActions () {
      return this.$slots.actions || this.$scopedSlots.actions
    },
    submit () {
      this.handleSubmit(null)
    },
    handleSubmit (e) {
      if (this.submissionValidating) {
        return this.validationPromise
      }

      // 把 field 上边 disabled 的项去掉
      this.submissionValidating = true
      let data = omit(
        this.data,
        this.fields
          .filter((field) => field.realDisabled)
          .map(({ realField }) => realField)
      )
      this.validationPromise = new Promise((resolve) =>
        // 处理 beforeValidate 返回 Promise 的情况，通过 resolve 直接把返回值传递到下层
        isFunction(this.beforeValidate)
          ? resolve(this.beforeValidate.call(getVnodes(this)[0].context, data))
          : resolve()
      )
        .then((res) => (this.isValid(res) ? this.validate() : res))
        .then((res) =>
          this.isValid(res)
            ? new Promise((resolve) =>
            // 处理 afterValidate 返回 Promise 的情况，通过 resolve 直接把返回值传递到下层
              isFunction(this.afterValidate)
                ? resolve(
                  this.afterValidate.call(getVnodes(this)[0].context, data)
                )
                : resolve()
            )
            : res
        )
        .then((res) => {
          this.submissionValidating = false
          if (this.isValid(res)) {
            this.$emit('submit', data, e)
          } else {
            this.$emit('invalid', res)
          }
        })
      return this.validationPromise
    },
    validate (names) {
      // fieldset 可以有 name，但是不会有 field 属性，也不要校验 disabled 的
      let targets = (this.fields || []).filter(
        (item) => item.realField && !item.realDisabled
      )
      let validators = this.validators || []
      if (Array.isArray(names) && names.length) {
        targets = targets.filter(
          (target) => includes(names, target.name) && !target.realDisabled
        )
        validators = validators.filter(
          (validator) =>
            validator.fields &&
            validator.fields.some((fieldName) => includes(names, fieldName))
        )
      }

      return Promise.all([
        ...targets.map((target) => {
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
      ]).then((allRes) => {
        return allRes.every((mixed) => this.isValid(mixed))
          ? Promise.resolve(true)
          : Promise.resolve(
            assign({}, ...allRes.filter((mixed) => !this.isValid(mixed)))
          )
      })
    },
    startValidator (validatorName) {
      const key = uniqueId('validator-')
      this.$set(this.interactiveValidationRecord, validatorName, key)
      return () => this.endValidator(validatorName, key)
    },
    endValidator (validatorName, key) {
      const keyInRecord = this.interactiveValidationRecord[validatorName]
      if (keyInRecord && keyInRecord === key) {
        this.$delete(this.interactiveValidationRecord, validatorName)
      }
    },
    execValidator (validate, fields) {
      let targets = fields.map((name) => this.fieldsMap[name])
      let validities = validate.apply(
        this,
        targets.map((target) => target && target.getFieldValue())
      )

      // 本来可以统一成 Promise 的，但是为了同步校验时不要闪 Loading，需要尽量保证同步校验
      if (validities && isFunction(validities.then)) {
        const end = this.startValidator(`validator:${fields.join(',')}`)
        return validities.then((validities) => {
          end()

          // TODO 不是最后一个如何处理validities
          this.handleValidities(validities, fields)
          return this.isValid(validities) || validities
        })
      }

      this.handleValidities(validities, fields)
      return validities
    },
    handleInteract (eventName, fieldName) {
      this.normalizedValidators.forEach(({ fields, triggers, validate }) => {
        const fIndex = fields.indexOf(fieldName)
        if (fIndex >= 0 && triggers[fIndex].indexOf(eventName) >= 0) {
          this.execValidator(validate, fields)
        }
      })
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
        fields.forEach((name) => {
          // 找到真正显示错误的地方
          let vectors = this.errorMap[validityName]

          if (vectors && vectors.length) {
            vectors.forEach((vector) => {
              let target = this.fieldsMap[vector]
              target && target.hideValidity(validityName)
            })
            delete this.errorMap[validityName]
          }
        })
      } else {
        Object.keys(validities).forEach((name) => {
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
              (validity) => validity.fields === validityName
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
                (validity) => validity.fields === validityName
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
        ? this.fields.filter((field) => includes(names, field.name))
        : this.fields
      fields.forEach((target) => {
        target.resetValue()
      })
    }
  }
}

function normalizeTriggers (triggers, length) {
  triggers = triggers || 'submit'
  if (typeof triggers === 'string') {
    triggers = fill(Array(length), triggers)
  } else if (Array.isArray(triggers)) {
    let len = triggers.length
    triggers =
      len < length
        ? triggers.concat(fill(Array(length - len), triggers))
        : triggers.slice(0, length)
  } else {
    throw new Error(
      '[veui-form] The triggers of validators must be an Array or a string.'
    )
  }
  return triggers.map((item) => {
    return typeof item === 'string' ? item.split(/\s*,\s*/) : item
  })
}
</script>
