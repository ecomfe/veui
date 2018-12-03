<template>
<div
  class="veui-grid-container"
  :style="style"
>
  <slot/>
</div>
</template>

<script>
import config from '../../managers/config'

config.defaults({
  columns: 12,
  gutter: 30,
  margin: 0,
  flex: false
}, 'gridcontainer')

export default {
  name: 'veui-grid-container',
  props: {
    width: {
      type: Number
    },
    columns: {
      type: Number,
      default () {
        return config.get('gridcontainer.columns')
      },
      validator (val) {
        return val > 0
      }
    },
    gutter: {
      type: Number,
      default () {
        return config.get('gridcontainer.gutter')
      },
      validator (val) {
        return val >= 0
      }
    },
    margin: {
      type: Number,
      default () {
        return config.get('gridcontainer.margin')
      },
      validator (val) {
        return val >= 0
      }
    },
    flex: {
      type: Boolean,
      default () {
        return config.get('gridcontainer.flex')
      }
    }
  },
  computed: {
    style () {
      let { margin } = this
      return {
        ...margin
          ? { 'padding-right': `${margin}px`, 'padding-left': `${margin}px` } : {}
      }
    }
  },
  provide () {
    let { columns, gutter, flex } = this

    return {
      columns,
      gutter,
      flex
    }
  }
}
</script>
