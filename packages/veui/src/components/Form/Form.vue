<template>
<veui-form-provider :value="validation">
  <form
    :ui="realUi"
    :class="$c('form')"
    @submit.prevent="handleSubmit"
    @reset.prevent="reset(null)"
  >
    <slot/>
    <div
      v-if="$scopedSlots.actions || $slots.actions"
      :class="$c('form-actions')"
    >
      <slot
        name="actions"
        v-bind="{ submit }"
      />
    </div>
  </form>
</veui-form-provider>
</template>

<script>
import {
  isFunction,
  includes,
  assign,
  zipObject,
  map,
  uniq,
  fill,
  omit,
  intersection
} from 'lodash'
import { getVnodes } from '../../utils/context'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import '../../common/uiTypes'
import { ValidationProvider, getValidation } from './_ValidationContext'

export default {
  name: 'veui-form',
  uiTypes: ['form', 'form-container'],
  components: {
    'veui-form-provider': ValidationProvider
  },
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
      fields: []
    }
  },
  computed: {
    validation () {
      return getValidation()
    },
    fieldsMap () {
      let targets = this.fields.filter(target => target.realName)
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
            acc[field].concat(triggers[index].filter(item => item !== 'submit'))
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

      return Promise.resolve()
        .then(() =>
          isFunction(this.beforeValidate)
            ? this.beforeValidate.call(getVnodes(this)[0].context, data)
            : undefined
        )
        .then(result => (isValid(result) ? this.validate() : result))
        .then(result => {
          return isValid(result)
            ? isFunction(this.afterValidate)
              ? this.afterValidate.call(getVnodes(this)[0].context, data)
              : undefined
            : result
        })
        .then(result => {
          if (isValid(result)) {
            this.$emit('submit', data, e)
          } else {
            this.$emit('invalid', result)
          }
        })
    },
    validate (fieldNames) {
      // 1. disabled 不参与校验
      // 2. 将 field 和 validator 组件称为 formItem
      const hasName = Array.isArray(fieldNames) && fieldNames.length
      const formItems = this.fields.filter(item => {
        return item.realDisabled
          ? false
          : hasName
            ? fieldNames.indexOf(item.realName) >= 0
            : true
      })

      const validators = hasName
        ? this.normalizedValidators.filter(
          ({ fields }) => !!intersection(fields, fieldNames).length
        )
        : this.normalizedValidators

      return Promise.all([
        ...formItems.map(target => {
          return Promise.resolve()
            .then(() => target.validate())
            .then(validity => {
              // 兼容之前逻辑：没有 name 的错误直接忽略
              return !isValid(validity) && target.realName
                ? { [target.realName]: validity }
                : true
            })
        }),
        ...validators.map(({ validate, fields }) => {
          return (
            Promise.resolve()
              // 每个校验出结果时直接更新，而非等到所有结果出来
              .then(() => this.execValidator(validate, fields))
          )
        })
      ]).then(allRes => {
        return allRes.every(mixed => isValid(mixed))
          ? true
          : assign({}, ...allRes.filter(mixed => !isValid(mixed)))
      })
    },
    execValidator (validate, fields) {
      let targets = fields.map(name => this.fieldsMap[name])
      return Promise.resolve()
        .then(() =>
          validate.apply(
            this, // TODO remove
            targets.map(target => target && target.getFieldValue())
          )
        )
        .then(validity => {
          const validityName = fields.join(',') // 之前就是这么标记的
          validity = isValid(validity) ? undefined : validity
          this.validation.updateValidatorValidities(validityName, validity)
          return validity
        })
    },
    handleInteract (eventName, fieldName) {
      this.normalizedValidators.forEach(({ fields, triggers, validate }) => {
        const fIndex = fields.indexOf(fieldName)
        if (fIndex >= 0 && triggers[fIndex].indexOf(eventName) >= 0) {
          this.execValidator(validate, fields)
        }
      })
    },
    reset (names) {
      let formItems = this.fields
      if (names) {
        formItems = this.fields.filter(
          field => field.realName && includes(names, field.realName)
        )
      } else {
        this.validation.clearValidity()
      }
      formItems.forEach(target => {
        if (names) {
          this.validation.removeValidity(target.realName)
        }
        target.resetValue && target.resetValue()
      })
    }
  }
}

// TODO remove submit
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
  return triggers.map(item => {
    return typeof item === 'string' ? item.split(/\s*,\s*/) : item
  })
}

function isValid (validity) {
  return typeof validity === 'undefined' || validity === true
}
</script>
