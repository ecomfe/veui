<template>
  <veui-dialog overlay-class="veui-alert-box"
    :open.sync="localOpen"
    :ui="localUi"
    :closable="false"
    :priority="priority">

    <veui-icon v-if="!!typeIconName"
      class="veui-alert-box-icon"
      :name="typeIconName">
    </veui-icon>

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
import { pick, find, includes } from 'lodash'
import Dialog from './Dialog'
import Button from './Button'
import Icon from './Icon'
import '../icons'
import config from '../managers/config'

config.defaults({
  'alertbox.priority': 100
})

export default {
  name: 'veui-alert-box',
  props: pick(Dialog.props, ['open', 'title', 'ui']),
  components: {
    'veui-dialog': Dialog,
    'veui-button': Button,
    'veui-icon': Icon
  },
  data () {
    return {
      localOpen: this.open,
      priority: config.get('alertbox.priority')
    }
  },
  computed: {
    uis () {
      return [...(this.ui || '').split(/\s+/), 'reverse']
    },
    localUi () {
      return this.uis.join(' ')
    },
    type () {
      return find(this.uis, ui => includes(['success', 'error', 'info'], ui))
    },
    typeIconName () {
      return {
        success: 'check-circle',
        info: 'info-circle',
        error: 'cross-circle'
      }[this.type]
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
@import "../styles/theme-default/lib.less";

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

  .veui-dialog-content-foot {
    padding: 30px 20px;
  }

  .veui-dialog-content-body {
    padding-top: 0;
  }

  &-icon {
    width: 34px;
    height: 34px;
  }

  &[ui~="success"] .veui-alert-box-icon {
    color: @veui-success-color-primary;
  }

  &[ui~="info"] .veui-alert-box-icon {
    color: @veui-theme-color-primary;
  }

  &[ui~="error"] .veui-alert-box-icon {
    color: @veui-alert-color-primary;
  }
}
</style>
