<template>
  <label class="veui-label" :class="{'veui-label-for': !!labelFor}" @click="findInputComponent">{{ label }}：</label>
</template>

<script>
import { getVnodes } from '../utils/context'
import { isFunction } from 'lodash'
export default {
  name: 'veui-label',

  props: {
    label: String,
    labelFor: String
  },

  methods: {
    findInputComponent () {
      let labelFor = this.labelFor
      if (this.label && labelFor) {
        let context = getVnodes(this)[0].context
        do {
          context = context.$parent
        }
        while (context && context.$options && context.$options.uiTypes)
        let target = context.$refs[labelFor]
        target && isFunction(target.$emit) && target.$emit('labelclick')
      }
    }
  }
}
</script>

<style lang="less">
.veui-label-for {
  cursor: pointer;
}
</style>
