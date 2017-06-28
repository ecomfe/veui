import { getTypedAncestorTracker, isTopMostOfType } from '../utils/helper'

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
      initialData: undefined,
      isTopMostInput: isTopMostOfType(this, 'input', 'form-field')
    }
  },
  computed: {
    realName () {
      return (this.formField && this.formField.name) || this.name
    },
    realDisabled () {
      return this.disabled || (this.formField && this.formField.realDisabled)
    },
    realReadonly () {
      return this.readonly || (this.formField && this.formField.realReadonly)
    },
    ...computedFormField
  },
  created () {
    if (!this.isTopMostInput) {
      return
    }

    let originEmit = this.$emit
    this.$emit = (...args) => {
      originEmit(...args)

    }
  },
  beforeDestroy () {
    if (this.formField && this.isTopMostInput) {
      this.formField.inputs.splice(this.formField.inputs.indexOf(this), 1)
    }
  }
}
