// import validator from '../utils/validators'
// import { genParentTracker } from '../utils/mixins'
// import { cloneDeep, zipObject, isFunction, isObject } from 'lodash'

// const { computed: computedRow } = genParentTracker('formRow')
// const { computed: computedValue } = genParentTracker('formValue')

export default {
  uiTypes: ['input'],
  props: {
    name: String,
    // rules: [String, Object],
    readonly: Boolean,
    disabled: Boolean
  }
  // },
  // computed: Object.assign(
  //   {
  //     _validateRules () {
  //       if (!this.rules) {
  //         return {}
  //       } else {
  //         let rules = this.rules.trim().split(/\s+/)
  //         switch (typeof this.rules) {
  //           case 'string':
  //             return zipObject(
  //               rules,
  //               rules.map(rule => {
  //                 return {
  //                   value: true
  //                 }
  //               })
  //             )
  //           case 'object':
  //             return this.rules
  //         }
  //       }
  //     }
  //   },
  //   computedRow,
  //   computedValue
  // ),
  // watch: {
  //   _validateRules (newVal) {

  //   }
  // },
  // methods: {
  //   validate () {
  //     let rules = this._validateRules
  //     let prop = this.$options.model ? this.$options.model.prop : 'value'
  //     let res = validator.validate(rules, this[prop])
  //     if (res && isObject(res)) {
  //       isFunction(this.showErrorMessage) && this.showErrorMessage(res)
  //     }

  //     return res
  //   }
  // },
  // mounted () {
  //   if (this.formRow) {
  //     this.formRow.labelFor = this.name
  //   }
  //   if (this.formValue) {
  //     this.formValue.initialData = cloneDeep(this.value)
  //   }
  // }
}
