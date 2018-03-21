import Vue from 'vue'
import { uniq } from 'lodash'

Vue.config.optionMergeStrategies.uiTypes = function (toVal = [], fromVal = []) {
  return uniq([...toVal, ...fromVal])
}
