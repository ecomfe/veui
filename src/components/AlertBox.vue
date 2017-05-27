<template>
  <veui-dialog overlay-class="veui-alert-box"
    :open.sync="localOpen"
    :ui="localUi">

    <i class="veui-alert-box-icon"></i>

    <h3 class="veui-alert-box-title">
      <template v-if="!!title">{{ title }}</template>
      <slot name="title" v-else>title</slot>
    </h3>
    <div class="veui-alert-box-content">
      <slot>content</slot>
    </div>

    <template slot="foot">
      <veui-button @click="ok()">知道了</veui-button>
    </template>
  </veui-dialog>
</template>

<script>
import { pick } from 'lodash'
import Dialog from './Dialog'
import Button from './Button'

export default {
  name: 'veui-alert-box',
  props: Object.assign(
    pick(Dialog.props, ['open', 'title', 'ui'])
  ),
  components: {
    'veui-dialog': Dialog,
    'veui-button': Button
  },
  data () {
    return {
      localOpen: this.open
    }
  },
  computed: {
    localUi () {
      return [...(this.ui || '').split(/\s+/), 'reverse'].join(' ')
    }
  },
  watch: {
    open (v) {
      this.localOpen = v
    },
    localOpen (v) {
      this.$emit('update:open', v)
    }
  },
  methods: {
    ok () {
      this.localOpen = false
      this.$emit('ok')
    }
  }
}
</script>

<style lang="less">
.veui-alert-box {
  text-align: center;

  .veui-dialog-content-head {
    height: 30px;

    &-title {
      display: none;
    }
  }

  &-title {
    font-size: 18px;
    font-weight: 400;
    margin: 20px 0 0 0;
  }

  &-content {
    margin-top: 15px;
  }

  &-icon {
    background: red;
  }

  .veui-dialog-content-foot {
    padding: 30px 20px;
  }

  .veui-dialog-content-body {
    padding-top: 0;
  }

  &[ui~="success"] {
    .veui-alert-box-icon {
      &::before {
        content: 'success'
      }
    }
  }

  &[ui~="info"] {
    .veui-alert-box-icon {
      &::before {
        content: 'info'
      }
    }
  }

  &[ui~="error"] {
    .veui-alert-box-icon {
      &::before {
        content: 'error'
      }
    }
  }
}
</style>
