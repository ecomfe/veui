import { getTypedAncestorTracker, isTopMostOfType } from '../utils/helper'

const { computed } = getTypedAncestorTracker('field')

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
      isTopMostInput: isTopMostOfType(this, 'input', 'field')
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
    formField: computed.field
  },
  created () {
    if (!this.isTopMostInput || !this.formField || !this.formField.field) {
      return
    }

    this.$emit = this.realEmit.bind(this, this.$emit)
  },
  methods: {
    realEmit (originalEmit, eventName, data, event) {
      originalEmit.apply(this, Array.prototype.slice.call(arguments, 1))
      eventName.indexOf('hook:') !== 0 && this.formField.$emit('interacting', eventName)
    }
  }
}
