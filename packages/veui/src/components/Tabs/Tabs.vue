<template>
<div
  v-resize.debounce="listResizeHandler"
  class="veui-tabs"
  :class="{
    'veui-tabs-overflow': menuOverflow,
    'veui-tabs-addable': addable,
    'veui-tabs-list-empty': items.length === 0,
    'veui-tabs-left-limited': leftLimited,
    'veui-tabs-right-limited': rightLimited
  }"
  :ui="realUi"
>
  <div
    ref="menu"
    :class="{
      'veui-tabs-menu': true,
      'veui-tabs-menu-moving': menuMoving
    }"
    role="tablist"
  >
    <div class="veui-tabs-list">
      <transition-group
        ref="listContainer"
        tag="div"
        :class="{
          'veui-tabs-list-wrapper': true,
          'veui-tabs-list-wrapper-moving': conMoving
        }"
        name="veui-tab"
        @before-leave="beforeLeave"
        @leave="leave"
        @after-leave="afterLeave"
      >
        <div
          v-for="(tab, i) in items"
          :key="tab.name"
          :ref="`tab-${tab.name}`"
          :data-index="i"
          :class="{
            'veui-tabs-item': true,
            'veui-tabs-item-disabled': tab.disabled,
            'veui-tabs-item-removable': tab.removable,
            'veui-tabs-item-active': i === localIndex,
            'veui-tabs-item-moving': itemMoving
          }"
          @click="$event => {
            if ($event.target === $refs[`tab-${tab.name}`][0] && !tab.disabled) {
              setActive({ i })
            }
          }"
        >
          <slot
            name="tab-item"
            v-bind="tab"
            :index="i"
          >
            <veui-link
              v-if="tab.to"
              class="veui-tabs-item-label"
              v-bind="ariaAttrs[i]"
              :to="tab.to"
              :native="tab.native"
              @click="!tab.disabled && setActive({ index: i })"
            >
              {{ tab.label }}
            </veui-link>
            <button
              v-else
              class="veui-tabs-item-label"
              v-bind="ariaAttrs[i]"
              type="button"
              @click="!tab.disabled && setActive({ index: i })"
            >
              {{ tab.label }}
            </button>
            <slot
              name="tab-item-status"
              v-bind="tab"
              :index="i"
            >
              <span
                v-if="tab.status"
                class="veui-tabs-item-status"
                @click="!tab.disabled && setActive({ index: i })"
              >
                <veui-icon
                  :class="`veui-tabs-item-status-${tab.status}`"
                  :name="icons[tab.status]"
                />
              </span>
            </slot>
            <slot
              name="tab-item-extra"
              v-bind="tab"
              :index="i"
            >
              <button
                v-if="tab.removable"
                type="button"
                class="veui-tabs-item-remove"
                :aria-label="t('remove')"
                :disabled="removing"
                @click="$emit('remove', tab)"
              >
                <veui-icon :name="icons.remove"/>
              </button>
            </slot>
          </slot>
        </div>
      </transition-group>
    </div>
    <slot name="tabs-extra">
      <div
        ref="extra"
        class="veui-tabs-extra"
      >
        <button
          v-if="addable"
          type="button"
          class="veui-tabs-operator"
          :aria-label="t('add')"
          :disabled="max != null && items.length >= max || removing"
          @click="$emit('add')"
        >
          <veui-icon :name="icons.add"/>
          <slot name="tabs-extra-label">
            <span class="veui-tabs-extra-label">
              {{ t('addTab') }}
            </span>
          </slot>
        </button>
        <slot name="tabs-extra-tip">
          <span
            v-if="tip"
            class="veui-tabs-extra-tip"
          >
            {{ tip }}
          </span>
        </slot>
        <div
          v-if="menuOverflow"
          ref="scroller"
          class="veui-tabs-scroller"
          aria-hidden="true"
        >
          <button
            type="button"
            class="veui-tabs-scroller-left"
            :disabled="leftLimited"
            @click="scroll({ direction: 'left' })"
          >
            <veui-icon :name="icons.prev"/>
          </button>
          <button
            type="button"
            class="veui-tabs-scroller-right"
            :disabled="rightLimited"
            @click="scroll({ direction: 'right' })"
          >
            <veui-icon :name="icons.next"/>
          </button>
        </div>
      </div>
    </slot>
  </div>
  <slot class="veui-tabs-panel"/>
</div>
</template>

<script>
import { assign, inRange } from 'lodash'
import warn from '../../utils/warn'
import Link from '../Link'
import Icon from '../Icon'
import resize from '../../directives/resize'
import ui from '../../mixins/ui'
import i18n from '../../mixins/i18n'
import config from '../../managers/config'
import '../../common/uiTypes'
import { setTransform, getTransform } from '../../utils/dom'

config.defaults(
  {
    matches (current, to) {
      return current.fullPath === to.fullPath
    }
  },
  'tabs'
)

export default {
  name: 'veui-tabs',
  uiTypes: ['tabs'],
  components: {
    'veui-link': Link,
    'veui-icon': Icon
  },
  directives: {
    resize
  },
  mixins: [ui, i18n],
  props: {
    active: {
      type: String
    },
    index: {
      type: Number,
      default: 0
    },
    matches: {
      default () {
        return config.get('tabs.matches')
      },
      validator (value) {
        return typeof value === 'function'
      }
    },
    addable: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: null
    },
    tip: {
      type: String
    }
  },
  data () {
    return {
      items: [],
      localIndex: null,
      localActive: null,
      activeId: null,
      menuOverflow: false,
      menuLeft: null,
      menuRight: null,
      menuRightStable: null,
      menuClientWidth: null,
      tabConClientWidth: null,
      extraWidth: null,
      currentTranslate: 0,
      inited: false,
      switching: false,
      menuMoving: false,
      conMoving: false,
      itemMoving: false,
      removing: false,
      transitionSupported: null,
      fixedTranslate: null,
      fixedTabs: null,
      needResize: false
    }
  },
  computed: {
    tabUids () {
      return this.items.map(({ id }) => id)
    },
    tabNames () {
      return this.items.map(({ name }) => name)
    },
    leftLimited () {
      return !this.currentTranslate
    },
    rightLimited () {
      // offsetWidth/clientWidth 的值会取四舍五入，两个数比较误差不超过 2
      return (
        this.currentTranslate !== 0 &&
        (this.currentTranslate < this.maxTranslate ||
          inRange(
            this.currentTranslate,
            this.maxTranslate + 2,
            this.maxTranslate - 2
          ))
      )
    },
    maxTranslate () {
      return this.menuClientWidth - this.tabConClientWidth
    },
    needTransition () {
      return (
        this.inited &&
        this.transitionSupported &&
        this.uiProps.style === 'block'
      )
    },
    ariaAttrs () {
      return this.items.map((tab, index) => {
        return {
          role: 'tab',
          'aria-selected': String(index === this.localIndex),
          'aria-setsize': this.items.length,
          'aria-posinset': index + 1
        }
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
  },
  mounted () {
    this.transitionSupported = 'transition' in document.documentElement.style

    // 让子组件渲染完毕
    this.$nextTick(() => {
      let { menu, extra } = this.$refs
      this.listResizeHandler()
      this.inited = true
      if (this.menuOverflow) {
        menu.style.marginRight = extra.getBoundingClientRect().width
      }
    })
  },
  methods: {
    add (tab, isMatched) {
      let tabIndex = this.items.length
      let domBaseIndex = tab.index

      if (this.tabNames.indexOf(tab.name) !== -1) {
        warn('[veui-tabs] Duplicate tab name.', this)
      }

      // 如果还没有找到选中的 tab，优先查看配置的 name
      // 因为 index 有默认值，而 tab.name 会 fallback 到 id 上边，所以 active 不指定不会误判断
      if (
        (!this.activeId && tab.name === this.active) ||
        (tabIndex === this.index && !this.active) ||
        isMatched
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

      this.$nextTick(() => {
        this.storeBoundingSize()
        if (!this.transitionSupported) {
          return
        }

        let tabItem = this.getTab(tab.name)
        let end = $event => {
          $event.stopPropagation()
        }
        let label = tabItem.querySelector('.veui-tabs-item-label')
        let remove = tabItem.querySelector('.veui-tabs-item-remove')
        if (label) {
          label.addEventListener('transitionend', end)
        }
        if (tab.removable && remove) {
          remove.addEventListener('transitionend', end)
        }
      })
    },

    removeById (id) {
      let index = this.tabUids.indexOf(id)

      if (index < 0) {
        return
      }

      // 外部控制有可能会多次进入，把任务往后推
      if (this.removing) {
        setTimeout(() => this.removeById(id), 100)
        return
      }
      this.removing = true

      let items = this.items
      let item = items[index]
      let tab = this.getTab(item.name)

      // 视图已经销毁
      if (!tab) {
        return
      }

      let needFixed = false
      if (items.length > 1) {
        needFixed =
          (index === this.localIndex && index === 0) || index < this.localIndex
        if (index === this.localIndex) {
          let item = items[this.localIndex - 1] || items[this.localIndex + 1]
          this.localIndex = items.indexOf(item)
          this.localActive = item.name
          this.activeId = item.id
        }
      } else {
        this.localIndex = null
        this.localActive = null
        this.activeId = null
      }

      this.$nextTick(() => {
        items.splice(index, 1)
        if (needFixed) {
          this.localIndex -= 1
        }
      })
    },

    setActive ({ active, index }) {
      if (this.localActive === active || this.localIndex === index) {
        return
      }

      if (this.removing) {
        return
      }

      let values = this.tabNames

      this.localIndex = index !== undefined ? index : values.indexOf(active)
      this.localActive = active !== undefined ? active : values[index]
      this.activeId =
        this.localActive != null ? this.items[this.localIndex].id : null

      if (this.menuOverflow && this.localActive) {
        this.scroll({ itemName: this.localActive })
      }
    },

    storeBoundingSize (menuRightStable) {
      // 记录 resize 后的一些边界
      let { menu, listContainer, extra } = this.$refs
      if (!menu || !listContainer || !listContainer.$el || !extra) {
        return
      }
      let tabConClientWidth = listContainer.$el.clientWidth
      let menuClientWidth = menu.clientWidth
      let extraWidth = extra.getBoundingClientRect().width
      if (
        this.tabConClientWidth !== tabConClientWidth ||
        this.menuClientWidth !== menuClientWidth ||
        this.extraWidth !== extraWidth
      ) {
        let { left, right } = menu.getBoundingClientRect()
        assign(this, {
          extraWidth,
          tabConClientWidth,
          menuClientWidth,
          menuLeft: left,
          menuRight: right,
          menuRightStable: menuRightStable || right
        })
      }
    },

    fixResizeOverflow () {
      if (this.menuOverflow) {
        let listContainer = this.$refs.listContainer.$el
        let { right } = listContainer.getBoundingClientRect()
        if (this.menuRight > right) {
          this.currentTranslate = this.maxTranslate
          this.conMoving = true
          this.bindTransition(listContainer, () => {
            this.conMoving = false
          })
          this.$nextTick(() => {
            setTransform(listContainer, `translate(${this.maxTranslate}px)`)
          })
        }
      }
    },

    listResizeHandler () {
      let { menu, extra, scroller, listContainer } = this.$refs
      if (!listContainer || this.switching) {
        // 销毁阶段
        return
      }

      let menuWidth = menu.offsetWidth
      let tabConWidth = listContainer.$el.offsetWidth
      let stickyWidth = extra.getBoundingClientRect().width

      let factor = this.menuOverflow
        ? -(
          scroller.offsetWidth +
            parseFloat(getComputedStyle(scroller).marginLeft)
        )
        : stickyWidth
      let menuOverflow = menuWidth < tabConWidth + factor

      if (this.menuOverflow !== menuOverflow) {
        this.switching = true
      }
      this.menuOverflow = menuOverflow

      return new Promise(resolve => {
        if (this.inited) {
          this.menuMoving = true
          this.conMoving = true
        }

        // 需要 menuOverflow 对 dom 进行更新
        this.$nextTick(() => {
          let menuRightStable
          if (this.switching || this.extraWidth !== stickyWidth) {
            this.bindTransition(menu, e => {
              this.menuMoving = false
              this.conMoving = false
              this.storeBoundingSize()
              this.fixResizeOverflow()
              resolve()
              this.switching = false
            })

            let extraWidth = extra.getBoundingClientRect().width
            if (!this.menuOverflow) {
              this.currentTranslate = 0
              setTransform(listContainer.$el, 'translate(0)')
              // 本来用 padding 就完事了，ie9 不让 -  -
              menu.style.marginRight = 0
            } else if (this.menuOverflow) {
              // 这个值是为了溢出时横向滚动的同步动画计算记录的，不记录一个稳定位置无法准确滚到位
              menuRightStable = this.menuRight
                ? this.menuRight +
                  parseFloat(getComputedStyle(menu).marginRight) -
                  extraWidth
                : null
              menu.style.marginRight = extraWidth + 'px'
            }
          } else {
            this.menuMoving = false
            this.conMoving = false
            this.storeBoundingSize(menuRightStable)
            this.fixResizeOverflow()
            resolve()
            this.switching = false
          }
        })
      })
    },

    /**
     * 处理滚动至 tab 或者整体横向滚动
     *
     * 逻辑是如果视窗内最后一个 tab 有 1/3 以上的内容残缺，那就以它为基准，否则以它下一个为基准
     * 例如往右滚动，视窗最后一个 tab 只有一点点内容看得到，那滚动完后，这个 tab 应该在第一个
     * 如果能看到 2/3 以上的内容，那就是它的下一个 tab 在第一个，除非它是最后一个
     *
     * @param  {string} direction left 或者 right，整体横向滚动方向
     * @param  {string} itemName  滚动至 tab 的 name，优先级比 direction 高
     */
    scroll ({ direction, itemName }) {
      let listContainer = this.$refs.listContainer.$el
      this.conMoving = true
      this.bindTransition(listContainer, () => {
        this.conMoving = false
      })

      // 极限值
      let limited = {
        left: 0,
        right: this.maxTranslate
      }
      // 标志 tab 的边界值
      let flag = { left: null, right: null }
      // 本次滚动偏移值，带方向
      let localTranslate
      // 本次最大滚动偏移值，带方向，防止边框连续排列的美观性，统一向上取整，让边框隐藏在视区外
      let localMaxTranslate
      // 制定的滚动逻辑是否已经越界
      let overflow = false

      // TODO: 这里还可以再优化一下，通过计算中心位置的偏移量来判断是正向还是反向查询
      if (!direction && !itemName) {
        return
      } else if (itemName) {
        let { left, right } = this.getTab(itemName).getBoundingClientRect()

        if (left < this.menuLeft) {
          localTranslate = this.menuLeft - left
          direction = 'left'
        } else if (right > this.menuRightStable) {
          localTranslate = this.menuRightStable - right
          direction = 'right'
        } else {
          return
        }
      } else if (direction === 'left') {
        let former = null
        this.items.slice().some((item, index) => {
          let tab = this.getTab(item.name)
          let { marginLeft, marginRight } = getComputedStyle(tab)
          let { left, right } = tab.getBoundingClientRect()

          // 记录向左滚动极限距离
          if (index === 0) {
            localMaxTranslate = Math.ceil(this.menuLeft - left)
          }

          // 检查是否是一整个 tab 占满视窗的特殊情况，如果是，滚到上一个就是了
          if (
            Math.floor(left) <= this.menuLeft &&
            Math.ceil(right) >= this.menuRight
          ) {
            former = index - 1
            return true
          }

          // 减少 tab 留白和滚动误差带来的影响，三分之二宽度在视窗内才不会被保留在下个视窗中
          if (
            left >
            this.menuLeft -
              (tab.offsetWidth +
                parseFloat(marginLeft) +
                parseFloat(marginRight)) /
                3
          ) {
            if (index === 0) {
              // 第一个就满足条件，说明边界离第一个很近，往左只能在第一个的内部滚了
              former = -1
            }
            return true
          }

          assign(flag, { left, right })
          return false
        })

        if (former != null) {
          // 视窗太窄或者只需要滚动一点点
          if (former === -1) {
            // 视窗在第一个或者只需要滚动一点点
            localTranslate = localMaxTranslate
          } else {
            // 视窗在中间
            let tab = this.getTab(this.items[former].name)
            localTranslate =
              this.menuRightStable - tab.getBoundingClientRect().right
          }
        } else {
          localTranslate = this.menuRightStable - flag.right
        }

        // 逻辑滚动距离超出极限状态，向左滚动是正值，溢出使用小于号
        overflow = localMaxTranslate <= localTranslate
      } else if (direction === 'right') {
        let former = null
        this.items
          .slice()
          .reverse()
          .some((item, index) => {
            let tab = this.getTab(item.name)
            let { marginLeft, marginRight } = getComputedStyle(tab)
            let { left, right } = tab.getBoundingClientRect()

            // 记录向右滚动极限距离
            if (index === 0) {
              localMaxTranslate = Math.ceil(this.menuRightStable - right)
            }

            // 检查是否是一整个 tab 占满视窗的特殊情况，如果是，滚到上一个就是了
            if (
              Math.floor(left) <= this.menuLeft &&
              Math.ceil(right) >= this.menuRight
            ) {
              former = this.items.length - index
              return true
            }

            // 同向左滚动
            if (
              right <
              this.menuRightStable +
                (tab.offsetWidth +
                  parseFloat(marginLeft) +
                  parseFloat(marginRight)) /
                  3
            ) {
              if (index === 0) {
                // 最后一个就满足条件，说明边界离最后一个很近，往右只能在最后一个的内部滚了
                former = this.items.length
              }
              return true
            }

            assign(flag, { left, right })
            return false
          })

        if (former != null) {
          // 视窗太窄或者只需要滚动一点点
          if (former === this.items.length) {
            // 视窗在最后一个或者只需要滚动一点点
            localTranslate = localMaxTranslate
          } else {
            // 视窗在中间
            let tab = this.getTab(this.items[former].name)
            localTranslate = this.menuLeft - tab.getBoundingClientRect().left
          }
        } else {
          localTranslate = this.menuLeft - flag.left
        }

        // 逻辑滚动距离超出极限状态，向右滚动是负值，溢出使用大于号
        overflow = localMaxTranslate >= localTranslate
      }

      if (overflow) {
        this.currentTranslate = limited[direction]
        this.$nextTick(() => {
          setTransform(listContainer, `translate(${limited[direction]}px)`)
        })
        return
      }

      let matrix = getTransform(listContainer)
        .slice(7)
        .split(',')
        .map(v => +v.trim())
      let currentTranslate = matrix[4] + localTranslate
      currentTranslate = inRange(
        currentTranslate,
        limited[direction] - 2,
        limited[direction] + 2
      )
        ? limited[direction]
        : currentTranslate
      this.currentTranslate = currentTranslate
      this.$nextTick(() => {
        setTransform(listContainer, `translate(${currentTranslate}px)`)
      })
    },

    adaptToSetActive (activation) {
      // 由于 watcher 是同步的
      // 为了支持外部 add/remove 修改完 tab 源数据（slot 中用于循环的数组）就可以同步操作 active/index
      // 这里要让数据层的异步操作完成
      this.$nextTick(() => {
        // add 的逻辑是异步的，因此 add 之后的 resize 会在这个逻辑之后，这里直接同步调用一次让 resize 完成
        let resizeUpdated = this.listResizeHandler()
        // 需要判断是不是有返回，因为锁存在的情况下是直接 return 的
        resizeUpdated && resizeUpdated.then(() => this.setActive(activation))
      })
    },

    getTab (name) {
      return this.$refs[`tab-${name}`][0]
    },

    bindTransition (el, cb) {
      if (!this.transitionSupported) {
        setTimeout(() => {
          cb()
        }, 0)
        return
      }

      let end = $event => {
        $event.stopPropagation()
        cb($event)
        el.removeEventListener('transitionend', end)
      }
      el.addEventListener('transitionend', end)
    },

    translateTabs (tabs, distance) {
      tabs.forEach(tab => setTransform(tab, `translate(${distance}px)`))
    },

    beforeLeave (el) {
      if (!this.needTransition) {
        return
      }

      this.menuMoving = true
      this.conMoving = true
      this.itemMoving = true
    },

    leave (el) {
      if (!this.needTransition) {
        return
      }

      // 若产生子元素局部动画，要把局部的状态收敛到父元素上
      this.fixedTranslate = null
      this.fixedTabs = null
      this.needResize = false

      this.$nextTick(() => {
        el.style.paddingRight = 0
      })

      let transitionWidth = 0
      el.style.width = el.offsetWidth + 'px'

      if (this.menuOverflow) {
        let { menu, listContainer } = this.$refs
        let conRight = listContainer.$el.getBoundingClientRect().right
        let elWidth = el.getBoundingClientRect().width
        let overflowWidth = conRight - this.menuRight
        let currentTranslate = Math.abs(this.currentTranslate)
        let distance
        switch (true) {
          // 右侧溢出部分足够填充移除元素
          case overflowWidth > elWidth:
            transitionWidth = 0
            break
          // 左侧溢出部分足够填充移除元素
          case overflowWidth < elWidth && currentTranslate > elWidth:
            transitionWidth = null
            distance = elWidth
            this.fixedTabs = this.items
              .filter((item, index) => index < el.dataset.index)
              .map(({ name }) => this.getTab(name))
            this.fixedTranslate = elWidth - currentTranslate
            break
          // 左右都不足以单独填充移除元素
          case overflowWidth < elWidth && currentTranslate < elWidth:
            transitionWidth = 0
            distance = currentTranslate
            this.fixedTabs = this.items.map(({ name }) => this.getTab(name))
            this.fixedTranslate = 0
            // 左右合并之后如果足以填充移除元素，可以暂时不关注溢出状态
            // 但是不足就要先移动右侧来填补中间的空白，然后再主动 resize
            if (overflowWidth + currentTranslate < elWidth) {
              this.needResize = true
              this.$nextTick(() => {
                // 右侧动画
                menu.style.marginRight =
                  parseFloat(menu.style.marginRight) +
                  elWidth -
                  currentTranslate -
                  overflowWidth +
                  'px'
              })
            }
            break
          default:
            break
        }

        // 左侧的动画
        if (distance != null) {
          this.$nextTick(() => {
            this.translateTabs([...this.fixedTabs, el], distance)
          })
        }
      }

      // 删除元素本身的动画
      if (transitionWidth != null) {
        this.$nextTick(() => {
          el.style.width = transitionWidth
        })
      }
    },

    afterLeave () {
      if (!this.needTransition) {
        this.$nextTick(() => {
          this.removing = false
          this.listResizeHandler()
        })
        return
      }

      // 动画结束后收敛 transform
      this.removing = false
      this.menuMoving = false
      this.itemMoving = false
      this.conMoving = false
      this.$nextTick(() => {
        if (this.fixedTranslate != null) {
          this.translateTabs(this.fixedTabs, 0)
          this.currentTranslate = this.fixedTranslate
          setTransform(
            this.$refs.listContainer.$el,
            `translate(${this.fixedTranslate}px)`
          )
        }
        let extraWidth = this.$refs.extra.getBoundingClientRect().width
        if (extraWidth !== this.extraWidth && this.menuOverflow) {
          // extra 里头可能有 tip 会影响宽度，需要检查
          this.listResizeHandler()
        } else {
          this.storeBoundingSize()
          if (this.needResize) {
            this.listResizeHandler()
          }
        }
      })
    }
  }
}
</script>
