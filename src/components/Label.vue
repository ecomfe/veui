<template>
  <label class="veui-label" :class="{'veui-label-for': !!labelFor}" @click="findInputComponent">{{ label }}：</label>
</template>

<script>
import { getVnodes } from '../utils/context'
import { isFunction, get } from 'lodash'
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
        let target
        // 一直往上找component
        // 如果没有这个 refs，继续往上直到 root
        do {
          context = context.$parent
          target = get(context, `$refs['${labelFor}']`)
        }
        while (context && !target)

        if (target && isFunction(target.$emit)) {
          target.$emit('labelclick')
        }
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
