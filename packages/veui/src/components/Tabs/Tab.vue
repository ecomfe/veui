<template>
<div class="veui-tab" v-show="isActive">
  <slot v-if="isInited || isActive"></slot>
</div>
</template>

<script>
import { pick, find, findIndex, uniqueId, includes } from 'lodash'
import { getTypedAncestorTracker } from '../../utils/helper'
import { getVnodes } from '../../utils/context'

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
    let uid = uniqueId('veui-tab-')
    return {
      id: uid,
      isInited: false
    }
  },
  computed: {
    isActive () {
      return this.id === this.tabs.activeId
    }
  },
  created () {
    let vdom = getVnodes(this)[0]
    // index 只是用于每次渲染时插入到 tabs 的顺序
    let index = findIndex(
      [...this.$parent.$slots.default].filter(vnode => {
        return vnode.componentOptions && includes(vnode.componentOptions.Ctor.options.uiTypes, 'tab')
      }),
      vnode => vnode === vdom
    )

    this.tabs.add({
      ...pick(this, 'id', 'label', 'disabled', 'to', 'native', 'removable'),
      name: this.name || this.to || this.id,
      index
    });

    ['label', 'removable', 'disabled', 'name', 'to'].forEach(prop => {
      this.$watch(prop, val => {
        find(this.tabs.items, item => item.id === this.id)[prop] = val
      })
    })

    if (!this.isInited) {
      let unWatchIsActive = this.$watch('isActive', () => {
        this.isInited = true
        unWatchIsActive()
      })
    }
  },
  destroyed () {
    this.tabs.removeById(this.id)
  }
}
</script>
