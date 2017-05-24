<template>
  <div class="veui-form-value" :class="{'veui-form-value-invalid': invalid}">
    <slot></slot>
    <p v-if="invalid" class="veui-form-value-error"><veui-icon name="exclamation-circle"></veui-icon>{{ errMsg }}</p>
  </div>
</template>

<script>
import validator from '../../utils/validators'
import cloneDeep from '../../managers/cloneDeep'
import { includes, isBoolean, assign } from 'lodash'
import { genParentTracker, getCustomModelProp, getCustomModelEvent } from '../../utils/helper'
import Icon from '../Icon'
import 'vue-awesome/icons/exclamation-circle'
const { computed: computedForm } = genParentTracker('form')

export default {
  name: 'veui-form-value',
  uiTypes: ['formValue'],
  components: {
    'veui-icon': Icon
  },
  props: {
    rules: [String, Array]
  },
  data () {
    return {
      invalid: false,
      initialData: null,
      errMsg: '',
      ruleCbStore: {}
    }
  },
  computed: assign(
    {
      input () {
        return this.$children && this.$children.find(child => includes(child.$options.uiTypes, 'input'))
      }
    },
    {
      _validateRules () {
        if (!this.rules) {
          return null
        } else {
          let rules
          if (Array.isArray(this.rules)) {
            rules = cloneDeep(this.rules)
            validator.initRules(rules)
          } else {
            rules = this.rules.trim().split(/\s+/).map(rule => {
              return {
                name: rule,
                value: true
              }
            })
            validator.initRules(rules)
          }
          return rules
        }
      }
    },
    {
      _reactiveRules () {
        return this._validateRules
          ? this._validateRules.filter(rule => {
            if (!rule.trigger) {
              return false
            }

            let trigger = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]
            // 没有写trigger按submit处理，写了trigger且不含submit才放进来
            return !!rule.trigger && !includes(trigger, 'submit')
          })
          : []
      }
    },
    computedForm
  ),
  watch: {
    _reactiveRules (newVal, oldVal) {
      let added = newVal || []
      if (oldVal && oldVal.length) {
        let diff = validator.diffRules(newVal, oldVal)
        diff.removed.forEach(rule => {
          let trigger = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]
          trigger.forEach(trigger => {
            this.input.$off(trigger, this.ruleCbStore[rule.name])
          })
        })
        added = diff.added
      }
      this._bindReactiveRules(added)
    }
  },
  methods: {
    resetValue () {
      let input = this.input
      let event = getCustomModelEvent(input)
      input.$emit(event, cloneDeep(this.initialData))
    },
    validate () {
      let rules = this._validateRules
      let input = this.input
      let prop = getCustomModelProp(input)
      let res = validator.validate(input[prop], rules)
      if (this._isValid(res)) {
        this.hideValidity()
      } else {
        this.setValidity(res)
      }

      return res
    },
    _bindReactiveRules (rules) {
      let input = this.input
      let prop = getCustomModelProp()
      rules && rules.forEach(rule => {
        let trigger = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]
        trigger.forEach(trigger => {
          let me = this
          // TODO: dirty
          assign(this.ruleCbStore, {
            [trigger]: e => {
              let res = validator.validate(input[prop], [rule])
              if (me._isValid(res)) {
                me.hideValidity()
              } else {
                me.setValidity(res)
              }
            }
          })
          input.$on(trigger, this.ruleCbStore[trigger])
        })
      })
    },
    setValidity (err) {
      this.invalid = true
      this.errMsg = err
    },
    hideValidity () {
      this.invalid = false
      this.errMsg = ''
    },
    _isValid (res) {
      return isBoolean(res) && res
    }
  },
  created () {
    this.form.items.push(this)
  },
  mounted () {
    this._bindReactiveRules(this._reactiveRules)
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";

.veui-form-value {
  display: inline-block;
  vertical-align: top;

  & + & {
    margin-left: 10px;
  }

  &-invalid {
    > .veui-input,
    > .veui-textarea {
      border-color: @veui-alert-color-primary;
    }
  }
}

.veui-form-value-error {
  position: absolute;
  margin: 4px 0 0;
  color: @veui-alert-color-primary;
  vertical-align: top;

  svg {
    vertical-align: -2px;
    margin-right: 7px;
  }
}

.veui-form-value-invalid:last-child {
  .veui-form-value-error  {
    position: static;
    display: inline-block;
    height: @veui-height-normal;
    line-height: @veui-height-normal;
    margin: 0 0 0 10px;
  }
}

</style>
