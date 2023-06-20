<template>
<veui-dialog
  :ui="realUi"
  :overlay-class="
    mergeOverlayClass({
      [$c('alert-box')]: true,
      [$c(`alert-box-${realStatus}`)]: true,
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
  v-on="listeners"
>
  <div :class="$c('alert-box-icon-wrapper')">
    <veui-icon
      v-if="icons[realStatus]"
      :class="$c('alert-box-icon')"
      :name="icons[realStatus]"
    />
  </div>
  <div :class="$c('alert-box-wrapper')">
    <h3 v-if="title || $slots.title" :class="$c('alert-box-title')">
      <slot name="title">{{ title }}</slot>
    </h3>
    <div :class="$c('alert-box-content')">
      <slot/>
    </div>
  </div>
  <template slot="foot" slot-scope="{ close }">
    <veui-button
      :ui="uiParts.ok"
      :loading="loading"
      :disabled="disabled"
      autofocus
      @click="close('ok')"
    >{{ realOkLabel }}</veui-button>
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
import { useRename } from '../mixins/deprecate'
import '../common/global'

config.defaults(
  {
    priority: 100
  },
  'alertbox'
)

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
    useConfig('config', 'alertbox'),
    useRename(
      {
        type: String,
        validator (val) {
          return includes(['success', 'error', 'info', 'warning'], val)
        },
        default: 'success'
      },
      {
        from: 'type',
        to: 'status'
      }
    )
  ],
  props: {
    ...pick(Dialog.props, [
      'open',
      'title',
      'beforeClose',
      'loading',
      'disabled',
      'okLabel'
    ])
  },
  computed: {
    listeners () {
      return pick(this.$listeners, ['ok', 'afteropen', 'afterclose'])
    },
    realOkLabel () {
      return this.okLabel || this.t('ok')
    },
    priority () {
      return this.config['alertbox.priority']
    }
  }
}
</script>
