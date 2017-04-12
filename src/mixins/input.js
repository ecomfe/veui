// import zipObject from 'lodash/zipObject'
// import isFunction from 'lodash/isFunction'
// import validator from '../utils/validators'
export default {
  uiTypes: ['input'],
  props: {
    value: null,
    name: String,
    readonly: Boolean,
    disabled: Boolean
  },
  computed: {
    // _validateRules () {
    //   if (!this.rules) {
    //     return {}
    //   } else {
    //     let rules = this.rules.trim().split(/\s+/)
    //     switch (typeof this.rules) {
    //       case 'string':
    //         return zipObject(
    //           rules,
    //           rules.map(rule => {
    //             return {
    //               value: true,
    //               message: ''
    //             }
    //           })
    //         )
    //       case 'object':
    //         return this.rules
    //     }
    //   }
    // }
  },
  methods: {
    // validate () {
    //   let rules = this._validateRules
    //   let res = validator.validate(rules, this.$data._rawValue)
    //   if (res && typeof res === 'object') {
    //     isFunction(this.showErrorMessage) && this.showErrorMessage(res)
    //   }

    //   return res
    // }
  }
}
