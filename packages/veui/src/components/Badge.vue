<template>
<div
  :class="{
    [$c('badge')]: true,
    [$c('badge-standalone')]: !$scopedSlots.default
  }"
>
  <slot/>
  <transition :name="$c('badge')">
    <span
      v-if="!hidden"
      :class="{
        [$c('badge-main')]: true,
        [$c(
          `badge-${content && $scopedSlots.default ? 'label' : 'dot'}`
        )]: true,
        [$c(`badge-${realStatus}`)]: true
      }"
    >{{ $scopedSlots.default ? content : '' }}</span>
  </transition>
  <span
    v-if="!$scopedSlots.default && value"
    :class="$c('badge-standalone-label')"
  >
    {{ value }}
  </span>
</div>
</template>

<script>
import ui from '../mixins/ui'
import { isNumber } from 'lodash'
import config from '../managers/config'
import useConfig from '../mixins/config'
import { useRename } from '../mixins/deprecate'
import '../common/global'

config.defaults(
  {
    max: 999
  },
  'badge'
)

export default {
  name: 'veui-badge',
  mixins: [
    ui,
    useConfig('config', 'badge'),
    useRename(
      {
        type: String,
        default: 'error'
      },
      {
        from: 'type',
        to: 'status'
      }
    )
  ],
  props: {
    value: [Number, String],
    max: {
      type: Number,
      validator (val) {
        return val == null || (Math.floor(val) === val && val > 0)
      }
    },
    hidden: Boolean
  },
  computed: {
    realMax () {
      return this.max || this.config['badge.max']
    },
    content () {
      if (!isNumber(this.value)) {
        return this.value ? this.value : null
      }
      return this.realMax && this.value > this.realMax
        ? `${this.realMax}+`
        : `${this.value}`
    }
  }
}
</script>
