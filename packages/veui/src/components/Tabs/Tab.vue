<template>
<div class="veui-tab" v-show="isActive" role="tabpanel" :aria-hidden="String(!isActive)">
  <slot v-if="isInited || isActive"></slot>
</div>
</template>

<script>
import { pick, find, uniqueId } from 'lodash'
import { getTypedAncestorTracker } from '../../utils/helper'
import { getIndexOfType } from '../../utils/context'

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
      type: String,
      default: ''
    },
    native: Boolean,
    removable: {
      type: Boolean,
      default: false
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
    }
  },
  created () {
    let index = getIndexOfType(this, 'tab')

    const props = ['label', 'disabled', 'to', 'native', 'removable']

    this.tabs.add({
      ...pick(this, ...props, 'id'),
      name: this.name || this.to || this.id,
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
