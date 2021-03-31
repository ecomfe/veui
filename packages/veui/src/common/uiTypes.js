import Vue from 'vue'
import { uniq } from 'lodash'

if (!Vue.config.optionMergeStrategies.uiTypes) {
  Vue.config.optionMergeStrategies.uiTypes = function (
    toVal = [],
    fromVal = []
  ) {
    return uniq([...toVal, ...fromVal])
  }
}
