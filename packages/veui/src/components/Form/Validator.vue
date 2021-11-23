<script>
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import { getTypedAncestorTracker, cloneVnode } from '../../utils/helper'
import warn from '../../utils/warn'
import '../../common/uiTypes'
import {
  useValidationConsumer,
  getNewRuleValidities
} from './_ValidationContext'
import useValidation from './_useValidation'

const { computed: form } = getTypedAncestorTracker('form')
const { computed: formField } = getTypedAncestorTracker('form-field')

// error-class 加的dom 和 事件触发的dom 需要区分开吗
// 校验的值从dom上拿 还是从 form.data[field] 上拿

// validator 下的 input-like 不再被劫持
// validator 不支持 resetValue

export default {
  name: 'veui-validator',
  uiTypes: ['form-validator', 'form-validatable'],
  mixins: [
    prefix,
    ui,
    useValidationConsumer('validation'),
    useValidation({
      getName () {
        return this.name
      },
      getFieldValue () {
        return this._getFieldValue()
      },
      getRuleValidities () {
        return this.realRuleValidities
      },
      // 没有 ruleNames 直接更新 val
      // 有 ruleNames 表示指定的 rules 结果更新成 val
      updateRuleValidities (val, ruleNames) {
        if (ruleNames) {
          val = getNewRuleValidities(this.realRuleValidities, ruleNames, val)
        }
        this.realRuleValidities = val
      }
    })
  ],
  props: {
    name: String,
    valueProp: String
  },
  data () {
    return {
      localRuleValidities: []
    }
  },
  computed: {
    realValidaties () {
      return this.validation && this.name
        ? this.validation.realValidities[this.name] || []
        : this.localRuleValidities
    },
    realRuleValidities: {
      get () {
        return this.validation && this.name
          ? this.validation.getRuleValidities(this.name)
          : this.localRuleValidities
      },
      set (val) {
        this.localRuleValidities = val || []
        if (this.validation && this.name) {
          if (!val) {
            this.validation.clearRuleValidities(this.name)
          } else {
            this.validation.updateRuleValidities(this.name, val)
          }
        }
      }
    },
    isInvalid () {
      return !!this.realValidaties.length
    },
    validity () {
      return this.realValidaties[0]
    },
    ...form,
    ...formField
  },
  created () {
    if (this.form) {
      this.form.fields.push(this)
    }
    if (this.formField) {
      this.formField.validators.push(this)
    }
  },
  beforeDestroy () {
    if (this.form) {
      this.form.fields.splice(this.form.fields.indexOf(this), 1)
    }
    if (this.formField) {
      this.formField.validators.splice(
        this.formField.validators.indexOf(this),
        1
      )
    }
  },
  methods: {
    _getFieldValue () {
      if (!this.childVnode) {
        return undefined
      }

      if (isComponent(this.childVnode)) {
        const vm = this.childVnode.componentInstance
        return vm[this.valueProp || guessValueProp(vm)]
      }
      return this.childVnode.elm[this.valueProp || 'value']
    },
    getPatchedVnode () {
      let vnode = this.$slots.default
      if (Array.isArray(vnode)) {
        vnode = vnode[0]
      }

      let newData = {
        listeners: this.interactiveListeners
      }
      if (this.isInvalid) {
        newData.class = this.$c('validator-error')
      }

      vnode = cloneVnode(vnode, newData)
      this.childVnode = vnode
      return vnode
    }
  },
  render () {
    if (this.$slots.default) {
      return this.getPatchedVnode()
    } else if (this.$scopedSlost.default) {
      const result = this.$scopedSlost.default({
        class: this.isInvalid ? this.$c('validator-error') : undefined,
        listeners: { ...this.interactiveListeners }
      })
      this.childVnode = Array.isArray(result) ? result[0] : result
      return result
    }
    return undefined
  }
}

function isComponent (vnode) {
  return !!vnode.componentOptions
}

function guessValueProp (vm) {
  const { model, name, propsData } = vm.$options
  let prop
  if (model) {
    prop = model.prop
  } else if (name.indexOf('veui') === 0) {
    prop = getVeuiValueProp(name)
  }
  prop = prop || 'value'

  if (!(prop in propsData)) {
    warn('[veui-validator] The `Validator` must wrap a controlled component.')
  }
  return prop
}

function getVeuiValueProp (name) {
  return {
    'veui-table': 'selected'
  }[name]
}
</script>

<style>
.veui-validator-error {
  border-color: red !important;
}
</style>
