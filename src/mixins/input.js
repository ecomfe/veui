import { getTypedAncestorTracker, getModelProp, isTopestType } from '../utils/helper'
import { getByName } from '../utils/object'
import { clone } from '../managers'

const { computed: computedFormField } = getTypedAncestorTracker('form-field')

export default {
  uiTypes: ['input'],
  props: {
    name: String,
    readonly: Boolean,
    disabled: Boolean
  },
  data () {
    return {
      initialData: undefined
    }
  },
  computed: {
    realName () {
      return (this.formField && this.formField.name) || this.name
    },
    isTopestInput () {
      return isTopestType(this, 'input')
    },
    realDisabled () {
      return this.disabled || getByName('formField.realDisabled', this)
    },
    realReadOnly () {
      return this.readonly || getByName('formField.realDisabled', this)
    },
    ...computedFormField
  },
  created () {
    if (this.formField && this.isTopestInput) {
      this.formField.inputs.push(this)
      this.formField.bindInteractiveRules([this])
      this.formField.form && this.formField.form.bindInteractiveValidators({ input: this })
    }
    this.initialData = clone.exec(this[getModelProp(this)])
  },
  beforeDestroy () {
    if (this.formField && this.isTopestInput) {
      this.formField.inputs.splice(this.formField.inputs.indexOf(this), 1)
    }
  }
}
