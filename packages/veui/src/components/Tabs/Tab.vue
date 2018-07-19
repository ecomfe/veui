<template>
<div class="veui-tab" v-show="isActive" role="tabpanel" :aria-hidden="String(!isActive)">
  <slot v-if="isInited || isActive">
    <router-view v-if="to && $route && realTo === $route.fullPath"/>
  </slot>
</div>
</template>

<script>
import { pick, find, uniqueId, includes } from 'lodash'
import { getTypedAncestorTracker } from '../../utils/helper'
import { getIndexOfType } from '../../utils/context'
import warn from '../../utils/warn'
import '../../common/uiTypes'

const STATUS_LIST = ['success', 'warning', 'info', 'error']

export default {
  name: 'veui-tab',
  uiTypes: ['tab'],
  mixins: [getTypedAncestorTracker('tabs')],
  props: {
    label: {
      type: String,
      required: true
    },
    name: String,
    disabled: {
      type: Boolean,
      default: false
    },
    to: {
      type: [String, Object],
      default: ''
    },
    native: Boolean,
    removable: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: null,
      validator (val) {
        return includes(STATUS_LIST, val)
      }
    }
  },
  data () {
    return {
      id: uniqueId('veui-tab-'),
      isInited: false
    }
  },
  computed: {
    isActive () {
      return this.id === this.tabs.activeId
    },
    realTo () {
      if (!this.to) {
        return null
      }

      return this.$router ? this.$router.resolve(this.to).route.fullPath : this.to
    }
  },
  created () {
    let index = getIndexOfType(this, 'tab')

    const props = ['label', 'disabled', 'to', 'native', 'removable', 'status']

    if (this.to && this.name) {
      warn('[veui-tab] prop `name` will be ignored when prop `to` is set.')
    }

    this.tabs.add({
      ...pick(this, ...props, 'id'),
      name: this.realTo || this.name || this.id,
      index
    })

    props.forEach(prop => {
      this.$watch(prop, val => {
        find(this.tabs.items, item => item.id === this.id)[prop] = val
      })
    })

    if (!this.isActive) {
      let unWatchIsActive = this.$watch('isActive', () => {
        this.isInited = true
        unWatchIsActive()
      })
    } else {
      this.isInited = true
    }
  },
  destroyed () {
    this.tabs.removeById(this.id)
  }
}
</script>
