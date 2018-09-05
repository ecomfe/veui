<template>
<div
  class="veui-grid-container"
  :style="{
    'padding-right': `${gutter / 2 + margin}px`,
    'padding-left': `${gutter / 2 + margin}px`
  }"
><slot/></div>
</template>

<script>
import config from '../../managers/config'

const DEFAULT_OPTIONS = {
  columns: 12,
  gutter: 30,
  margin: 0,
  flex: false
}

export default {
  name: 'veui-grid-container',
  props: {
    width: {
      type: Number
    },
    columns: {
      type: Number,
      default: config.get('gridcontainer.columns') || DEFAULT_OPTIONS.columns,
      validator (val) {
        return val > 0
      }
    },
    gutter: {
      type: Number,
      default () {
        let gutter = config.get('gridcontainer.gutter')
        return gutter == null ? DEFAULT_OPTIONS.gutter : gutter
      },
      validator (val) {
        return val >= 0
      }
    },
    margin: {
      type: Number,
      default () {
        let margin = config.get('gridcontainer.margin')
        return margin == null ? DEFAULT_OPTIONS.margin : margin
      },
      validator (val) {
        return val >= 0
      }
    },
    flex: {
      type: Boolean,
      default: config.get('gridcontainer.flex')
    }
  },
  provide () {
    let { columns, gutter, width, flex } = this

    return {
      columns,
      gutter,
      width,
      flex
    }
  }
}
</script>
