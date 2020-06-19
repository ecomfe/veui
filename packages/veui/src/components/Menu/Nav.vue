<template>
<div
  :class="$c('nav')"
  :ui="realUi"
>
  <ul
    ref="body"
    v-resize.debounce.leading.200="renderAllThenUpdateLayout"
    :class="$c('nav-body')"
  >
    <li
      v-for="item in realItems"
      :key="item.name"
      :ref="item.name"
      :class="{
        [$c('nav-more-hidden')]: isMoreBtn(item) && !restItems.length
      }"
    >
      <slot
        v-if="isMoreBtn(item)"
        name="more"
      >
        <div
          ref="more"
          :class="{
            [$c('nav-more')]: true,
            [$c('nav-item')]: !!restItems.length,
            [$c('nav-item-open')]: isOpen('more'),
            ...itemClass(item)
          }"
          :tabindex="item.tabIndex"
          @mouseenter="handleItemHover(item)"
          @keydown="handleKeydown($event, item)"
        >
          <slot name="more-icon">
            <veui-icon :name="icons.more"/>
          </slot>
        </div>
      </slot>
      <slot
        v-else
        name="item"
        v-bind="item"
      >
        <veui-link
          :ref="`link-${item.name}`"
          :class="{
            [$c('nav-item')]: true,
            [$c('nav-item-open')]: isOpen(item.name),
            [$c('nav-expandable')]: hasChildren(item),
            ...itemClass(item)
          }"
          :tabindex="item.tabIndex"
          v-bind="pickLinkProps(item)"
          @mouseenter.native="handleItemHover(item)"
          @click="handleItemClick(item)"
          @keydown.native="handleKeydown($event, item)"
        >
          <slot
            name="item-label"
            v-bind="item"
          >
            {{ item.label }}
          </slot>
          <slot
            v-if="hasChildren(item)"
            name="item-icon"
            v-bind="item"
          >
            <veui-icon
              :class="$c('nav-expand-icon')"
              :name="icons.expand"
            />
          </slot>
        </veui-link>
      </slot>
      <veui-overlay
        v-if="!!item.children"
        :overlay-class="$c('nav-overlay')"
        :open="isOpen(item.name)"
        :target="item.name"
        position="bottom-center"
        autofocus
      >
        <div
          :ref="`dropdown-${item.name}`"
          v-outside="{
            refs: outsideRefs,
            delay: 100,
            trigger: 'hover',
            handler: close
          }"
          :class="$c('nav-dropdown')"
          @keydown="handleKeydown($event, null, item)"
        >
          <ul
            v-if="item.position === 'card'"
            :class="{
              [$c('nav-card')]: true
            }"
          >
            <li
              v-for="cardItem in item.children"
              :key="cardItem.name"
              :class="$c('nav-card-item')"
              @click="handleItemClick(cardItem)"
            >
              <slot
                name="item"
                v-bind="cardItem"
              >
                <veui-link
                  :class="{
                    [$c('nav-item')]: true,
                    [$c('nav-item-title')]: true,
                    [$c('nav-item-has-icon')]: cardItem.icon,
                    ...itemClass(cardItem)
                  }"
                  :tabindex="!cardItem.disabled && cardItem.to ? 0 : null"
                  v-bind="pickLinkProps(cardItem)"
                >
                  <slot
                    v-if="
                      cardItem.icon ||
                        $slots['title-icon'] ||
                        $scopedSlots['title-icon']
                    "
                    name="title-icon"
                  >
                    <veui-icon
                      :class="$c('nav-title-icon')"
                      :name="cardItem.icon"
                    />
                  </slot>
                  <slot
                    name="item-label"
                    v-bind="cardItem"
                  >
                    {{ cardItem.label }}
                  </slot>
                </veui-link>
              </slot>
              <ul
                v-if="hasChildren(cardItem)"
                role="group"
              >
                <li
                  v-for="subCardItem in cardItem.children"
                  :key="subCardItem.name"
                  @click="handleItemClick(subCardItem)"
                >
                  <slot
                    name="item"
                    v-bind="subCardItem"
                  >
                    <veui-link
                      :class="{
                        [$c('nav-item')]: true,
                        ...itemClass(subCardItem)
                      }"
                      :tabindex="subCardItem.disabled ? null : 0"
                      v-bind="pickLinkProps(subCardItem)"
                    >
                      <slot
                        name="item-label"
                        v-bind="subCardItem"
                      >
                        {{ subCardItem.label }}
                      </slot>
                    </veui-link>
                  </slot>
                </li>
              </ul>
            </li>
          </ul>
          <veui-option-group
            v-else
            :overlay-class="$c('nav-overlay')"
            :options="item.children"
            position="popup"
            trigger="hover"
            option-tag="div"
            label-tag="div"
          >
            <template
              slot="option"
              slot-scope="option"
            >
              <slot
                name="item"
                v-bind="option"
              >
                <veui-link
                  :class="{
                    [$c('nav-item')]: true,
                    ...itemClass(option)
                  }"
                  :tabindex="option.disabled ? null : 0"
                  v-bind="pickLinkProps(option)"
                  @click="handleItemClick(option)"
                >
                  <slot
                    name="item-label"
                    v-bind="option"
                  >
                    {{ option.label }}
                  </slot>
                </veui-link>
              </slot>
            </template>
            <template
              slot="option-group-label"
              slot-scope="group"
            >
              <slot
                name="item"
                v-bind="group"
              >
                <veui-link
                  :class="{
                    [$c('nav-item')]: true,
                    ...itemClass(group.option)
                  }"
                  :tabindex="group.option.disabled ? null : 0"
                  v-bind="pickLinkProps(group.option, true)"
                  @click="
                    handleGroupLabelClick(group.option, group.closeMenu)
                  "
                >
                  <slot
                    name="item-label"
                    v-bind="group"
                  >
                    <span :class="$c('nav-item-label-wrapper')">{{
                      group.label
                    }}</span>
                  </slot>
                </veui-link>
              </slot>
            </template>
          </veui-option-group>
        </div>
      </veui-overlay>
    </li>
  </ul>
</div>
</template>

<script>
import mixin from './_mixin'
import resize from '../../directives/resize'
import { getFocusable } from '../../utils/dom'
import { findIndex, last } from 'lodash'

export default {
  name: 'veui-nav',
  directives: {
    resize
  },
  mixins: [mixin],
  data () {
    return {
      hoverItem: null,
      moreBtnPosition: (this.items || []).length,
      outsideRefs: []
    }
  },
  computed: {
    // more 按钮下拉的 menu items
    restItems () {
      return this.normalizedItems.slice(this.moreBtnPosition)
    },
    // 直接渲染的 menu items
    realItems () {
      let items = this.normalizedItems
      if (this.moreBtnPosition !== items.length) {
        items = items.slice(0, this.moreBtnPosition)
      }
      items = [
        ...items,
        {
          name: 'more',
          tabIndex: items.some(i => i.tabIndex === 0) ? -1 : 0,
          children: this.restItems
        }
      ]

      return items
    }
  },
  created () {
    // items 和 active 任一变化，重新计算再渲染下
    this.$watch(
      () => [this.items, this.realActive],
      this.renderAllThenUpdateLayout
    )
  },
  mounted () {
    this.updateLayout()
  },
  methods: {
    hasChildren (item) {
      return !!item && Array.isArray(item.children) && !!item.children.length
    },
    isMoreBtn (item) {
      return item === last(this.realItems)
    },
    isOpen (name) {
      // hover dropdown 时，icon 也要处于 hover 状态
      return !!this.hoverItem && this.hoverItem.name === name
    },
    itemClass (item) {
      if (this.isMoreBtn(item)) {
        return {
          [this.$c('nav-item-active')]: this.activeItems.some(i =>
            this.restItems.some(({ name }) => i.name === name)
          )
        }
      }
      let { name, disabled } = item
      return {
        [this.$c('disabled')]: disabled,
        [this.$c('nav-item-exact-active')]: this.exactActiveItem
          ? this.exactActiveItem.name === name
          : false,
        [this.$c('nav-item-active')]: this.activeItems.some(
          i => i.name === name
        )
      }
    },
    // 将所有 menu item 都渲染出来，然后重新计算 more 按钮所在位置，再渲染一次
    renderAllThenUpdateLayout () {
      this.moreBtnPosition = this.normalizedItems.length
      this.$nextTick(this.updateLayout)
    },
    // 获取何处放置 more 按钮
    getMoreBtnPosition () {
      let moreWidth = this.$refs.more[0].offsetWidth
      let { clientWidth } = this.$refs.body
      let len = this.normalizedItems.length
      while (len--) {
        let i = this.normalizedItems[len]
        let off = this.$refs[i.name][0].offsetLeft
        if (off + moreWidth < clientWidth) {
          break
        }
      }
      if (len < 1) {
        // 第一个 menuitem 都放不下
        console.warn('[veui-menu] label of first menu item is too long.')
        return 1
      }
      return len
    },
    close () {
      this.hoverItem = null
    },
    updateLayout () {
      let { clientWidth, scrollWidth } = this.$refs.body
      if (clientWidth < scrollWidth) {
        this.moreBtnPosition = this.getMoreBtnPosition()
      }
    },
    postNormalize (item) {
      if (item.children && item.position !== 'card') {
        item.position = 'popup'
        item.options = item.children
      }
      return item
    },
    handleItemHover (item) {
      this.hoverItem = item
      this.hover = true
      this.$set(this.outsideRefs, 0, item.name)
    },
    handleItemClick (item) {
      let { disabled } = item
      if (disabled) return

      // 1. top level menu items: activate + close dropdown
      // 2. card items: activate + close dropdown
      // 3. options: activate + close dropdown
      this.activateItem(item, true)
      this.$emit('click', item)
    },
    getFocusSelector () {
      return `.${this.$c('nav-body')} .${this.$c('nav-item')}:not(.${this.$c(
        'disabled'
      )})`
    },
    handleKeydown (e, item, root) {
      let passive = false
      let items
      switch (e.key) {
        case 'Enter':
          passive = true
          if (!root) {
            this.activateItem(item, true)
          }
          break
        case 'Esc':
        case 'Escape':
          if (root || this.hoverItem) {
            this.close()
          }
          break
        case 'Left':
        case 'ArrowLeft':
          if (!root) {
            if (this.hoverItem) {
              this.close()
            } else {
              items = this.$el.querySelectorAll(this.getFocusSelector())
              this.navigate(e.target, items, false, true)
            }
          }
          break
        case 'Right':
        case 'ArrowRight':
          if (!root) {
            if (this.hoverItem) {
              this.close()
            } else {
              items = this.$el.querySelectorAll(this.getFocusSelector())
              this.navigate(e.target, items, true, true)
            }
          }
          break
        case 'Up':
        case 'ArrowUp':
          if (root) {
            items = getFocusable(this.$refs[`dropdown-${root.name}`][0])
            this.navigate(e.target, items, false, false)
          }
          break
        case 'Down':
        case 'ArrowDown':
          if (!root) {
            this.hoverItem = item
          } else {
            items = getFocusable(this.$refs[`dropdown-${root.name}`][0])
            this.navigate(e.target, items, true, false)
          }
          break
        case 'Home':
          if (!root) {
            items = this.$el.querySelectorAll(this.getFocusSelector())
            this.navigate(e.target, items, false, true, true)
          }
          break
        case 'End':
          if (!root) {
            items = this.$el.querySelectorAll(this.getFocusSelector())
            this.navigate(e.target, items, true, true, true)
          }
          break
        default:
          passive = true
          break
      }
      if (!passive) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    handleKeyLeftOrRight (item, forward) {
      let step = forward ? 1 : -1
      let isMoreHidden = !this.restItems.length
      let items = isMoreHidden ? this.realItems.slice(0, -1) : this.realItems
      items = items.filter(i => !i.disabled)
      let index = findIndex(items, i => i.name === item.name)
      if (index >= 0) {
        let len = items.length
        index = (index + step + len) % len
        let nextItem = items[index]
        if (this.isMoreBtn(nextItem)) {
          this.$refs.more[0].focus()
        } else {
          let el = this.$refs[`link-${nextItem.name}`]
          if (el && el[0]) {
            el[0].$el.focus()
          }
        }
      }
    }
  }
}
</script>
