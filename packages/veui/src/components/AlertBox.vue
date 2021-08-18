<template>
<veui-dialog
  :ui="realUi"
  :overlay-class="
    mergeOverlayClass({
      [$c('alert-box')]: true,
      [$c(`alert-box-${type}`)]: true,
      [$c('alert-box-titleless')]: !title && !$slots.title
    })
  "
  :overlay-style="overlayStyle"
  :open.sync="realOpen"
  :closable="false"
  :escapable="false"
  :priority="priority"
  :before-close="beforeClose"
  role="alertdialog"
  @ok="$emit('ok')"
  @afterclose="$emit('afterclose')"
>
  <div :class="$c('alert-box-icon-wrapper')">
    <veui-icon
      v-if="icons[type]"
      :class="$c('alert-box-icon')"
      :name="icons[type]"
    />
  </div>
  <div :class="$c('alert-box-wrapper')">
    <h3
      v-if="title || $slots.title"
      :class="$c('alert-box-title')"
    >
      <slot name="title">{{ title }}</slot>
    </h3>
    <div :class="$c('alert-box-content')">
      <slot/>
    </div>
  </div>
  <template
    slot="foot"
    slot-scope="{ close }"
  >
    <veui-button
      :ui="uiParts.ok"
      :loading="loading"
      :disabled="disabled"
      autofocus
      @click="close('ok')"
    >
      {{ realOkLabel }}
    </veui-button>
  </template>
</veui-dialog>
</template>

<script>
import { pick, includes } from 'lodash'
import Dialog from './Dialog'
import Button from './Button'
import Icon from './Icon'
import useConfig from '../mixins/config'
import config from '../managers/config'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'
import prefix from '../mixins/prefix'
import overlay from '../mixins/overlay'
import useControllable from '../mixins/controllable'

config.defaults({
  'alertbox.priority': 100
})

export default {
  name: 'veui-alert-box',
  components: {
    'veui-dialog': Dialog,
    'veui-button': Button,
    'veui-icon': Icon
  },
  mixins: [
    prefix,
    ui,
    overlay,
    i18n,
    useControllable(['open']),
    useConfig('config', 'alertbox')
  ],
  props: {
    ...pick(Dialog.props, [
      'open',
      'title',
      'beforeClose',
      'loading',
      'disabled',
      'okLabel'
    ]),
    type: {
      type: String,
      validator (val) {
        return includes(['success', 'error', 'info', 'warning'], val)
      },
      default: 'success'
    }
  },
  computed: {
    realOkLabel () {
      return this.okLabel || this.t('ok')
    },
    priority () {
      return this.config['alertbox.priority']
    }
  }
}
</script>
