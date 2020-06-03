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
    >
      <slot
        name="item"
        v-bind="item"
      >
        <div
          :class="{
            [$c('nav-item')]: true,
            [$c('nav-item-hover')]: isHover(item),
            [$c('nav-expandable')]: hasChildren(item),
            ...itemClass(item)
          }"
          tabindex="0"
          @mouseenter="handleItemHover(item)"
          @click="handleItemClick(item)"
        >
          <slot
            name="item-label"
            v-bind="item"
          >
            <veui-link
              v-bind="pickLinkProps(item)"
              :class="$c('nav-link')"
            >
              {{ item.label }}
            </veui-link>
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
        </div>
      </slot>
      <veui-overlay
        v-if="!!item.children"
        :overlay-class="$c('nav-overlay')"
        :open="isHover(item)"
        :target="item.name"
        position="bottom-center"
      >
        <div
          v-outside="{
            refs: outsideRefs,
            delay: 100,
            trigger: 'hover',
            handler: close
          }"
          :class="$c('nav-dropdown')"
        >
          <ul
            v-if="item.position === 'card'"
            :class="{
              [$c('nav-card')]: true
            }"
          >
            <li
              v-for="sub in item.children"
              :key="sub.name"
              :class="$c('nav-card-item')"
              @click="handleItemClick(sub)"
            >
              <slot
                name="item"
                v-bind="sub"
              >
                <div
                  :class="{
                    [$c('nav-item')]: true,
                    [$c('nav-item-title')]: true,
                    [$c('nav-item-has-icon')]: sub.icon,
                    ...itemClass(sub)
                  }"
                >
                  <slot
                    v-if="
                      sub.icon ||
                        $slots['title-icon'] ||
                        $scopedSlots['title-icon']
                    "
                    name="title-icon"
                  >
                    <veui-icon
                      :class="$c('nav-title-icon')"
                      :name="sub.icon"
                    />
                  </slot>
                  <slot
                    name="item-label"
                    v-bind="sub"
                  >
                    <veui-link
                      v-bind="pickLinkProps(sub)"
                      :class="{
                        [$c('nav-link')]: true
                      }"
                    >{{ sub.label }}</veui-link>
                  </slot>
                </div>
              </slot>
              <ul
                v-if="hasChildren(sub)"
                role="group"
              >
                <li
                  v-for="leaf in sub.children"
                  :key="leaf.name"
                  @click="handleItemClick(leaf)"
                >
                  <slot
                    name="item"
                    v-bind="leaf"
                  >
                    <div
                      :class="{
                        [$c('nav-item')]: true,
                        ...itemClass(leaf)
                      }"
                    >
                      <slot
                        name="item-label"
                        v-bind="leaf"
                      >
                        <veui-link
                          v-bind="pickLinkProps(leaf)"
                          :class="{
                            [$c('nav-link')]: true
                          }"
                        >
                          {{ leaf.label }}
                        </veui-link>
                      </slot>
                    </div>
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
          >
            <template
              slot="option"
              slot-scope="option"
            >
              <slot
                name="item"
                v-bind="option"
              >
                <div
                  :class="{
                    [$c('nav-item')]: true,
                    ...itemClass(option)
                  }"
                  @click="handleItemClick(option)"
                >
                  <slot
                    name="item-label"
                    v-bind="option"
                  >
                    <veui-link
                      v-bind="pickLinkProps(option)"
                      :class="{
                        [$c('nav-link')]: true
                      }"
                    >
                      {{ option.label }}
                    </veui-link>
                  </slot>
                </div>
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
                <div
                  :class="{
                    [$c('nav-item')]: true,
                    ...itemClass(group.option)
                  }"
                  @click="
                    handleGroupLabelClick(group.option, group.closeMenu)
                  "
                >
                  <slot
                    name="item-label"
                    v-bind="group"
                  >
                    <veui-link
                      v-bind="pickLinkProps(group.option, true)"
                      :class="{
                        [$c('nav-link')]: true
                      }"
                    >
                      {{ group.label }}
                    </veui-link>
                  </slot>
                </div>
              </slot>
            </template>
          </veui-option-group>
        </div>
      </veui-overlay>
    </li>
    <li
      ref="more"
      :class="{
        [$c('nav-more')]: true,
        [$c('nav-more-hidden')]: moreBtnPosition === normalizedItems.length
      }"
      @mouseenter="handleMoreBtnHover"
    >
      ...
    </li>
  </ul>
</div>
</template>

<script>
import mixin from './_mixin'
import resize from '../../directives/resize'

export default {
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
    // 直接渲染的 menu items
    realItems () {
      let items = this.normalizedItems
      if (this.moreBtnPosition !== items.length) {
        return items.slice(0, this.moreBtnPosition)
      }
      return items
    },
    // more 按钮下拉的 menu items
    restItems () {
      return this.normalizedItems.slice(this.moreBtnPosition)
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
    isHover ({ name }) {
      // hover dropdown 时，icon 也要处于 hover 状态
      return !!this.hoverItem && this.hoverItem.name === name
    },
    itemClass (item) {
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
      let moreWidth = this.$refs.more.offsetWidth
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
      this.$set(this.outsideRefs, 0, item.name)
    },
    handleMoreBtnHover () {
      this.hoverItem = {
        name: 'more',
        children: this.restItems
      }
      this.$set(this.outsideRefs, 0, 'more')
    },
    handleItemClick (item) {
      let { disabled } = item
      if (disabled) return

      // 1. top level menu items: activate + close dropdown
      // 2. card items: activate + close dropdown
      // 3. options: activate + close dropdown
      this.activateItem(item, true)
      this.$emit('click', item)
    }
  }
}
</script>
