import Vue from 'vue'
import { getModelProp } from '../../utils/helper'
export default {
  methods: {
    getInputs (inputs) {
      return new Vue({
        data () {
          return {
            inputs: inputs
          }
        },

        model: {
          prop: 'value'
        },

        computed: {
          value () {
            return this.inputs.map(input => {
              let prop = getModelProp(input)
              return input[prop]
            })
          },
          valueForValidator () {
            return this.inputs.map(input => input.valueForValidator)
          }
        }
      })
    }
  }
}
