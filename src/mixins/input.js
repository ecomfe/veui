import { getTypedAncestorTracker, getModelProp, isTopMostOfType } from '../utils/helper'
import { clone } from '../managers'
import { get } from 'lodash'

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
    isTopMostInput () {
      return isTopMostOfType(this, 'input', 'form-field')
    },
    realDisabled () {
      return this.disabled || get(this, 'formField.realDisabled')
    },
    realReadOnly () {
      return this.readonly || get(this, 'formField.realDisabled')
    },
    ...computedFormField
  },
  created () {
    if (this.formField && this.isTopMostInput) {
      this.formField.inputs.push(this)
      this.formField.bindInteractiveRules([this])
      this.formField.form && this.formField.form.bindInteractiveValidators({ input: this })
    }
    this.initialData = clone.exec(this[getModelProp(this)])
  },
  beforeDestroy () {
    if (this.formField && this.isTopMostInput) {
      this.formField.inputs.splice(this.formField.inputs.indexOf(this), 1)
    }
  }
}
