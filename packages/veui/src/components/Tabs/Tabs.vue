<template>
<div class="veui-tabs" :ui="ui">
  <div class="veui-tabs-menu" ref="menu" role="tablist">
    <div class="veui-tabs-list" :class="{'veui-tabs-list-empty': items.length === 0}" ref="resizeContainer" v-resize="(e) => resizeHandler(e)">
      <div class="veui-tabs-list-resizer">
        <template v-for="(tab, index) in items">
          <div
            :key="tab.name"
            :ref="`tab-${tab.name}`"
            :class="{
              'veui-tabs-item': true,
              'veui-tabs-item-disabled': tab.disabled,
              'veui-tabs-item-active': index === localIndex
            }"
            role="tab"
            :aria-selected="String(index === localIndex)"
            :aria-setsize="items.length"
            :aria-posinset="index + 1">
            <slot name="tab-item" v-bind="tab" :index="index">
              <veui-link v-if="tab.to" class="veui-tabs-item-label" :to="tab.to" :native="tab.native">{{ tab.label }}</veui-link>
              <button v-else class="veui-tabs-item-label" type="button" @click="!tab.disabled && setActive({index})">{{ tab.label }}</button>
              <button type="button" class="veui-tabs-item-remove"
                @click="$emit('remove', tab)">
                <slot name="tab-item-extra" v-bind="tab">
                  <icon :name="icons.remove"
                  v-if="tab.removable"></icon>
                </slot>
              </button>
            </slot>
          </div>
        </template>
      </div>
    </div>
    <slot name="tabs-extra" >
      <div v-if="!$slots.tabsExtra"
        class="veui-tabs-extra" ref="extra"
        :class="{'veui-tabs-extra-overflow': menuOverflow}">
        <button type="button" v-if="addable"
          class="veui-tabs-operator"
          @click="$emit('add')">
          <icon :name="icons.add"></icon><slot name="tabs-extra-text"><span>添加TAB</span></slot>
        </button>
        <div class="veui-tabs-scroller" v-if="menuOverflow" ref="scroller">
          <button type="button" class="veui-tabs-scroller-left" @click="scroll('left')"><icon :name="icons.prev"></icon></button>
          <button type="button" class="veui-tabs-scroller-right" @click="scroll('right')"><icon :name="icons.next"></icon></button>
        </div>
      </div>
    </slot>
  </div>
  <slot class="veui-tabs-panel"></slot>
</div>
</template>

<script>
import warn from '../../utils/warn'
import Link from '../Link'
import Icon from '../Icon'
import resize from '../../directives/resize'
import icons from '../../mixins/icons'

export default {
  name: 'veui-tabs',
  uiTypes: ['tabs'],
  mixins: [icons],
  components: {
    'veui-link': Link,
    Icon
  },
  directives: {
    resize
  },
  props: {
    ui: {
      type: String,
      default: 'default'
    },
    active: {
      type: String
    },
    index: {
      type: Number,
      default: 0
    },
    addable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      items: [],
      localIndex: null,
      localActive: null,
      activeId: null,
      menuOverflow: false
    }
  },
  computed: {
    tabUids () {
      return this.items.map(({ id }) => id)
    },
    tabNames () {
      return this.items.map(({ name }) => name)
    }
  },
  methods: {
    add (tab) {
      let tabIndex = this.items.length
      let domBaseIndex = tab.index

      if (this.tabNames.indexOf(tab.name) !== -1) {
        warn('Duplicate tab name.')
      }

      // 如果还没有找到选中的 tab，优先查看配置的 name
      // 因为 index 有默认值，而 tab.name 会 fallback 到 id 上边，所以 active 不指定不会误判断
      if (
        !this.activeId &&
        tab.name === this.active ||
        (tabIndex === this.index && !this.active)
      ) {
        this.localIndex = tabIndex
        this.localActive = tab.name
        this.activeId = tab.id
      }

      if (domBaseIndex >= tabIndex) {
        this.items.push(tab)
      } else {
        this.items.splice(domBaseIndex, 0, tab)

        // 这种情况要更新一下 index
        this.localIndex = this.tabUids.indexOf(this.activeId)
      }
    },

    removeById (id) {
      this.remove(this.tabUids.indexOf(id))
    },

    remove (index) {
      let items = this.items
      items.splice(index, 1)

      if (items.length) {
        if (!(index === 0 && index === this.localIndex) && index <= this.localIndex) {
          this.localIndex = this.localIndex - 1
        }
        this.localActive = this.items[this.localIndex].name
        this.activeId = this.items[this.localIndex].id
      } else {
        this.localIndex = null
        this.localActive = null
        this.activeId = null
      }
    },

    setActive ({active, index}) {
      let values = this.tabNames

      this.localIndex = index !== undefined ? index : values.indexOf(active)
      this.localActive = active !== undefined ? active : values[index]
      this.activeId = this.items[this.localIndex].id

      if (this.menuOverflow) {
        let {menu, extra} = this.$refs
        let offset = this.$refs[`tab-${this.localActive}`][0].getBoundingClientRect()
        let extraLeft = extra.getBoundingClientRect().left

        if (offset.left > extraLeft) {
          menu.scrollLeft += offset.right - extraLeft
        }
      }
    },

    resizeHandler (el) {
      let {menu, extra, scroller} = this.$refs
      let menuWidth = menu.offsetWidth
      let containerWidth = el.offsetWidth
      let stickyWidth = extra.offsetWidth

      let factor = this.menuOverflow
        ? -(scroller.offsetWidth + parseInt(getComputedStyle(scroller).marginLeft, 10))
        : stickyWidth
      this.menuOverflow = menuWidth < (containerWidth + factor)
      // 需要 menuOverflow 对 dom 进行更新
      this.$nextTick(() => {
        if (!this.menuOverflow) {
          // 本来用 padding 就完事了，ie9 不让 -  -
          menu.style.marginRight = 0
        } else {
          menu.style.marginRight = extra.offsetWidth + 'px'
        }
      })
    },

    scroll (direction) {
      this.$refs.menu.scrollLeft += direction === 'right' ? 100 : -100
    },

    adaptToSetActive (activation) {
      // 可能有 add/remove 操作
      this.$nextTick(() => {
        // 需要检查是否超长
        this.resizeHandler(this.$refs.resizeContainer)
        this.$nextTick(() => {
          this.setActive(activation)
        })
      })
    }
  },
  watch: {
    active (val) {
      if (val === this.localActive) {
        return
      }
      this.adaptToSetActive({
        active: val
      })
    },
    index (val) {
      if (val === this.localIndex) {
        return
      }
      this.adaptToSetActive({
        index: val
      })
    },
    localIndex (val) {
      this.$emit('update:index', val)
    },
    localActive (val) {
      this.$emit('update:active', val)
    }
  }
}
</script>
