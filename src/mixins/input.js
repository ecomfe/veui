import { getTypedAncestorTracker, isTopMostOfType } from '../utils/helper'
import { partial } from 'lodash'

const { computed: field } = getTypedAncestorTracker('field')

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
      return (this.field && this.field.name) || this.name
    },
    realDisabled () {
      return this.disabled || (this.field && this.field.realDisabled)
    },
    realReadonly () {
      return this.readonly || (this.field && this.field.realReadonly)
    },
    ...field
  },
  created () {
    if (!this.isTopMostInput) {
      return
    }

    this.$emit = partial(this.realEmit, this, this.$emit)
  },
  methods: {
    realEmit (originalEmit, eventName, data, event) {
      originalEmit.apply(this, arguments.slice(1))

      this.field.$emit.apply(this.field, 'interacting', eventName)
    }
  }
}
