<template>
<div :class="$c('grid-container')" :style="style">
  <slot/>
</div>
</template>

<script>
import config from '../../managers/config'
import useConfig from '../../mixins/config'
import ui from '../../mixins/ui'
import '../../common/global'

config.defaults(
  {
    columns: 12,
    gutter: 30,
    margin: 0
  },
  'gridcontainer'
)

export default {
  name: 'veui-grid-container',
  uiTypes: ['transparent'],
  mixins: [ui, useConfig('config', 'gridcontainer')],
  props: {
    width: {
      type: Number
    },
    columns: {
      type: Number,
      validator (val) {
        return val > 0
      }
    },
    gutter: {
      type: Number,
      validator (val) {
        return val >= 0
      }
    },
    margin: {
      type: Number,
      validator (val) {
        return val >= 0
      }
    }
  },
  computed: {
    realColumns () {
      return this.columns == null
        ? this.config['gridcontainer.columns']
        : this.columns
    },
    realGutter () {
      return this.gutter == null
        ? this.config['gridcontainer.gutter']
        : this.gutter
    },
    realMargin () {
      return this.margin == null
        ? this.config['gridcontainer.margin']
        : this.margin
    },
    style () {
      let { realMargin } = this
      return {
        ...(realMargin
          ? {
            'padding-right': `${realMargin}px`,
            'padding-left': `${realMargin}px`
          }
          : {})
      }
    }
  },
  provide () {
    return {
      columns: this.realColumns,
      gutter: this.gutter
    }
  }
}
</script>
