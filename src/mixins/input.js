import { genParentTracker } from '../utils/helper'
import cloneDeep from '../managers/cloneDeep'

const { computed: computedFormValue } = genParentTracker('formValue')

export default {
  uiTypes: ['input'],
  props: {
    name: String,
    readonly: Boolean,
    disabled: Boolean
  },
  computed: computedFormValue,
  mounted () {
    if (this.formValue) {
      let prop = this.$options.model && this.$options.model.prop || 'value'
      this.formValue.initialData = cloneDeep(this[prop])
    }
  }
}
