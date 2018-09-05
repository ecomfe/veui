<template>
<div
  class="veui-grid-column"
  :style="style"
><slot/></div>
</template>

<script>
export default {
  name: 'veui-grid-column',
  props: {
    span: {
      type: Number
    },
    offset: {
      type: Number,
      default: 0
    },
    pull: {
      type: Number,
      default: 0
    },
    push: {
      type: Number,
      default: 0
    }
  },
  inject: ['columns', 'gutter', 'flex'],
  provide () {
    let { flex, gutter, realSpan } = this
    return {
      flex,
      gutter,
      columns: realSpan
    }
  },
  computed: {
    realSpan () {
      return this.span || this.columns
    },
    width () {
      let { columns, realSpan } = this
      return formatPercentage(realSpan / columns)
    },
    style () {
      let { width, gutter, columns, offset, pull, push } = this
      return {
        width,
        'padding-right': `${gutter / 2}px`,
        'padding-left': `${gutter / 2}px`,
        'margin-left': offset ? formatPercentage(offset / columns) : null,
        'right': pull ? formatPercentage(pull / columns) : null,
        'left': push ? formatPercentage(push / columns) : null
      }
    }
  }
}

function formatPercentage (val) {
  return `${Number((val * 100).toFixed(3))}%`
}
</script>
