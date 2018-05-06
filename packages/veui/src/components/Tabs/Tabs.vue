<template>
<div class="veui-tabs"
  :class="{
    'veui-tabs-overflow': menuOverflow,
    'veui-tabs-addable': addable,
    'veui-tabs-list-empty': items.length === 0,
    'veui-tabs-left-limited': leftLimited,
    'veui-tabs-right-limited': rightLimited
  }"
  :ui="ui"
  v-resize="listResizeHandler"
>
  <div :class="{
      'veui-tabs-menu': true,
      'veui-tabs-menu-moving': menuMoving
    }"
    ref="menu"
    role="tablist"
  >
    <div class="veui-tabs-list">
      <transition-group
        tag="div"
        :class="{
          'veui-tabs-list-resizer': true,
          'veui-tabs-list-resizer-moving': conMoving
        }"
        ref="listContainer"
        name="tab-list"
        v-on:leave="leave"
      >
        <div
          v-bind:data-index="index"
          v-for="(tab, index) in items"
          :key="tab.name"
          :ref="`tab-${tab.name}`"
          :class="{
            'veui-tabs-item': true,
            'veui-tabs-item-disabled': tab.disabled,
            'veui-tabs-item-removable': tab.removable,
            'veui-tabs-item-active': index === localIndex,
            'veui-tabs-item-moving': itemMoving
          }"
          @click="$event => {
            if ($event.target === $refs[`tab-${tab.name}`][0] && !tab.disabled) {
              setActive({index})
            }
          }"
        >
          <slot name="tab-item" v-bind="tab" :index="index">
            <veui-link
              v-if="tab.to"
              class="veui-tabs-item-label"
              v-bind="ariaAttrs[index]"
              :to="tab.to"
              :native="tab.native">
              {{ tab.label }}
            </veui-link>
            <button
              v-else
              class="veui-tabs-item-label"
              v-bind="ariaAttrs[index]"
              type="button"
              @click="!tab.disabled && setActive({index})"
            >{{ tab.label }}</button>
            <slot name="tab-item-status" v-bind="tab" :index="index">
              <span
                class="veui-tabs-item-status"
                @click="!tab.disabled && setActive({index})"
              >
                <veui-icon
                  v-if="tab.status"
                  :class="`veui-tabs-item-status-${tab.status}`"
                  :name="icons[tab.status]"
                />
              </span>
            </slot>
            <slot name="tab-item-extra" v-bind="tab" :index="index">
              <button v-if="tab.removable" type="button" class="veui-tabs-item-remove"
                aria-label="删除"
                :disabled="removing"
                @click="$emit('remove', tab)">
                  <veui-icon :name="icons.remove"/>
              </button>
            </slot>
          </slot>
        </div>
      </transition-group>
    </div>
    <slot name="tabs-extra" >
      <div class="veui-tabs-extra" ref="extra">
        <button type="button" v-if="addable"
          class="veui-tabs-operator"
          aria-label="添加"
          :disabled="max != null && items.length >= max || removing"
          @click="$emit('add')">
          <veui-icon :name="icons.add"/>
          <slot name="tabs-extra-label">
            <span class="veui-tabs-extra-label">添加 Tab</span>
          </slot>
        </button>
        <slot name="tabs-extra-tip">
          <span class="veui-tabs-extra-tip">{{ tip }}</span>
        </slot>
        <div class="veui-tabs-scroller" v-if="menuOverflow" ref="scroller" aria-hidden="true">
          <button
            type="button"
            class="veui-tabs-scroller-left"
            @click="scroll({direction: 'left'})"
            :disabled="leftLimited">
            <veui-icon :name="icons.prev"/>
          </button>
          <button
            type="button"
            class="veui-tabs-scroller-right"
            @click="scroll({direction: 'right'})"
            :disabled="rightLimited">
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
import {assign, inRange, includes} from 'lodash'
import warn from '../../utils/warn'
import Link from '../Link'
import Icon from '../Icon'
import resize from '../../directives/resize'
import ui from '../../mixins/ui'
import '../../common/uiTypes'

export default {
  name: 'veui-tabs',
  uiTypes: ['tabs'],
  mixins: [ui],
  components: {
    'veui-link': Link,
    'veui-icon': Icon
  },
  directives: {
    resize
  },
  props: {
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
      removing: false
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
      return this.currentTranslate !== 0 &&
        (this.currentTranslate < this.maxTranslate ||
          inRange(this.currentTranslate, this.maxTranslate + 2, this.maxTranslate - 2))
    },
    maxTranslate () {
      // 少滚一点，不至于边框包不住，这里用没用 floor 主要是解决 ff 里边巨烦的小数问题
      return this.menuClientWidth - this.tabConClientWidth
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
  methods: {
    add (tab) {
      let tabIndex = this.items.length
      let domBaseIndex = tab.index

      if (this.tabNames.indexOf(tab.name) !== -1) {
        warn('[veui-tabs] Duplicate tab name.')
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

      this.$nextTick(() => {
        let tabItem = this.getTab(tab.name)
        tabItem.style.width = tabItem.offsetWidth + 'px'
        let end = $event => {
          $event.stopPropagation()
        }
        tabItem.addEventListener('transitionend', end)
        tabItem.querySelector('.veui-tabs-item-label').addEventListener('transitionend', end)
        if (tab.removable) {
          tabItem.querySelector('.veui-tabs-item-remove').addEventListener('transitionend', end)
        }
      })

      if (this.inited) {
        this.$nextTick(() => this.listResizeHandler())
      }
    },

    removeById (id) {
      this.remove(this.tabUids.indexOf(id))
    },

    remove (index) {
      if (index < 0) {
        return
      }

      // 外部控制有可能会多次进入，把任务往后推
      if (this.removing) {
        setTimeout(() => this.remove(index), 500)
        return
      }
      this.removing = true
      this.$emit('removestart')

      let items = this.items
      let item = items[index]
      let tab = this.getTab(item.name)

      // 视图已经销毁
      if (!tab) {
        return
      }

      items.splice(index, 1)

      if (items.length) {
        let temp = this.localIndex
        // 删激活中的第一个要往后找，删当前激活后边的，index 都不需要改
        if (!(index === 0 && index === this.localIndex) && index <= this.localIndex) {
          this.localIndex = this.localIndex - 1
        }
        // 删当前激活的，要更新激活信息
        if (index === temp) {
          this.localActive = this.items[this.localIndex].name
          this.activeId = this.items[this.localIndex].id
        }
      } else {
        this.localIndex = null
        this.localActive = null
        this.activeId = null
      }
    },

    setActive ({active, index}) {
      if (this.localActive === active || this.localIndex === index) {
        return
      }

      if (this.removing) {
        return
      }

      let values = this.tabNames

      this.localIndex = index !== undefined ? index : values.indexOf(active)
      this.localActive = active !== undefined ? active : values[index]
      this.activeId = this.localActive != null ? this.items[this.localIndex].id : null

      if (this.menuOverflow && this.localActive) {
        this.scroll({itemName: this.localActive})
      }
    },

    storeBoundingSize (menuRightStable) {
      // 记录 resize 后的一些边界
      let {menu, listContainer, extra} = this.$refs
      let tabConClientWidth = listContainer.$el.clientWidth
      let menuClientWidth = menu.clientWidth
      let extraWidth = extra.offsetWidth
      if (this.tabConClientWidth !== tabConClientWidth ||
        this.menuClientWidth !== menuClientWidth ||
        this.extraWidth !== extraWidth
      ) {
        let {left, right} = menu.getBoundingClientRect()
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
        let {right} = listContainer.getBoundingClientRect()
        if (this.menuRight > right) {
          this.currentTranslate = this.maxTranslate
          this.conMoving = true
          this.bindTransition(listContainer, () => {
            this.conMoving = false
          })
          this.$nextTick(() => {
            listContainer.style.transform = `translate(${this.maxTranslate}px)`
          })
        }
      }
    },

    listResizeHandler () {
      let {menu, extra, scroller, listContainer} = this.$refs
      if (!listContainer || this.switching) {
        // 销毁阶段
        return
      }

      let menuWidth = menu.offsetWidth
      let tabConWidth = listContainer.$el.offsetWidth
      let stickyWidth = extra.offsetWidth

      let factor = this.menuOverflow
        ? -(scroller.offsetWidth + parseFloat(getComputedStyle(scroller).marginLeft))
        : stickyWidth
      let menuOverflow = menuWidth < (tabConWidth + factor)

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
            this.bindTransition(menu, (e) => {
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
              listContainer.$el.style.transform = 'translate(0)'
              // 本来用 padding 就完事了，ie9 不让 -  -
              menu.style.marginRight = 0
            } else if (this.menuOverflow) {
              // 这个值是为了溢出时横向滚动的同步动画计算记录的，不记录一个稳定位置无法准确滚到位
              menuRightStable = this.menuRight
                ? this.menuRight + parseFloat(getComputedStyle(menu).marginRight) - extraWidth
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
     * @param  {string} direction left 或者 right，整体横向滚动方向
     * @param  {string} itemName  滚动至 tab 的 name，优先级比 direction 高
     */
    scroll ({direction, itemName}) {
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
      let flag = {left: null, right: null}
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
        let {left, right} = this.getTab(itemName).getBoundingClientRect()

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
        this.items.some((item, index) => {
          let tab = this.getTab(item.name)
          let {marginLeft, marginRight} = getComputedStyle(tab)
          let {left, right} = tab.getBoundingClientRect()
          assign(flag, {left, right})

          // 记录向左滚动极限距离
          if (index === 0) {
            localMaxTranslate = Math.ceil(this.menuLeft - flag.left)
          }

          // 减少 tab 留白和滚动误差带来的影响，三分之二宽度在视窗内才不会被保留在下个视窗中
          return flag.left >
            (this.menuLeft - (tab.offsetWidth + parseFloat(marginLeft) + parseFloat(marginRight)) / 3)
        })

        localTranslate = this.menuRightStable - flag.right
        // 逻辑滚动距离超出极限状态，向左滚动是正值，溢出使用小于号
        overflow = localMaxTranslate < localTranslate
      } else if (direction === 'right') {
        this.items.slice().reverse().some((item, index) => {
          let tab = this.getTab(item.name)
          let {marginLeft, marginRight} = getComputedStyle(tab)
          let {left, right} = tab.getBoundingClientRect()
          assign(flag, {left, right})

          // 记录向右滚动极限距离
          if (index === 0) {
            localMaxTranslate = Math.ceil(this.menuRightStable - flag.right)
          }

          // 同向左滚动
          return flag.right <
            (this.menuRightStable + (tab.offsetWidth + parseFloat(marginLeft) + parseFloat(marginRight)) / 3)
        })

        localTranslate = this.menuLeft - flag.left
        // 逻辑滚动距离超出极限状态，向右滚动是负值，溢出使用大于号
        overflow = localMaxTranslate > localTranslate
      }

      if (overflow) {
        this.currentTranslate = limited[direction]
        this.$nextTick(() => {
          listContainer.style.transform = `translate(${limited[direction]}px)`
        })
        return
      }

      let matrix = getComputedStyle(listContainer).transform.slice(7).split(',').map(v => +v.trim())
      let currentTranslate = matrix[4] + localTranslate
      currentTranslate = inRange(
        currentTranslate,
        limited[direction] - 2,
        limited[direction] + 2
      ) ? limited[direction] : currentTranslate
      this.currentTranslate = currentTranslate
      this.$nextTick(() => {
        listContainer.style.transform = `translate(${currentTranslate}px)`
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
      let end = $event => {
        $event.stopPropagation()
        cb($event)
        el.removeEventListener('transitionend', end)
      }
      el.addEventListener('transitionend', end)
    },

    translateTabs (tabs, translateValue) {
      tabs.forEach(tab => {
        tab.style.transform = `translate(${translateValue}px)`
      })
    },

    leave (el, done) {
      if (!this.inited) {
        return
      }

      if (!includes((this.ui || '').split(/\s+/), 'block')) {
        done()
        this.$nextTick(() => {
          this.removing = false
          this.listResizeHandler()
          this.$emit('removeend')
        })
        return
      }

      this.menuMoving = true
      this.conMoving = true
      this.itemMoving = true
      // 若产生子元素局部动画，要把局部的状态收敛到父元素上
      let fixedTranslate
      let fixedTabs
      let needResize = false
      this.bindTransition(el, (e) => {
        // 动画结束后收敛 transform
        this.removing = false
        this.menuMoving = false
        this.itemMoving = false
        this.conMoving = false
        this.$nextTick(() => {
          if (fixedTranslate != null) {
            this.translateTabs(fixedTabs, 0)
            this.currentTranslate = fixedTranslate
            this.$refs.listContainer.$el.style.transform = `translate(${fixedTranslate}px)`
          }

          // 要先调用 done 把 dom 去掉，计算位置的时候才是对的
          done()

          if (this.$refs.extra.offsetWidth !== this.extraWidth && this.menuOverflow) {
            // extra 里头可能有 tip 会影响宽度，需要检查
            this.listResizeHandler()
          } else {
            this.storeBoundingSize()
            if (needResize) {
              this.listResizeHandler()
            }
          }
          this.$emit('removeend')
        })
      })

      this.$nextTick(() => {
        el.style.paddingRight = 0
      })

      let transitionWidth = 0
      if (this.menuOverflow) {
        let {menu, listContainer} = this.$refs
        let conRight = listContainer.$el.getBoundingClientRect().right
        let elWidth = el.getBoundingClientRect().width
        let overflowWidth = conRight - this.menuRight
        let currentTranslate = Math.abs(this.currentTranslate)
        let translateValue
        switch (true) {
          // 右侧溢出部分足够填充移除元素
          case overflowWidth > elWidth:
            transitionWidth = 0
            break
          // 左侧溢出部分足够填充移除元素
          case overflowWidth < elWidth && currentTranslate > elWidth:
            transitionWidth = null
            translateValue = elWidth
            fixedTabs = this.items.filter((item, index) => index < el.dataset.index)
              .map(({name}) => this.getTab(name))
            fixedTranslate = elWidth - currentTranslate
            break
          // 左右都不足以单独填充移除元素
          case overflowWidth < elWidth && currentTranslate < elWidth:
            transitionWidth = 0
            translateValue = currentTranslate
            fixedTabs = this.items.map(({name}) => this.getTab(name))
            fixedTranslate = 0
            // 左右合并之后如果足以填充移除元素，可以暂时不关注溢出状态
            // 但是不足就要先移动右侧来填补中间的空白，然后再主动 resize
            if (overflowWidth + currentTranslate < elWidth) {
              needResize = true
              this.$nextTick(() => {
                // 右侧动画
                menu.style.marginRight =
                  (parseFloat(menu.style.marginRight) + elWidth - currentTranslate - overflowWidth) + 'px'
              })
            }
            break
          default:
            break
        }

        // 左侧的动画
        if (translateValue != null) {
          this.$nextTick(() => {
            this.translateTabs(
              [...fixedTabs, el],
              translateValue
            )
          })
        }
      }

      // 删除元素本身的动画
      if (transitionWidth != null) {
        this.$nextTick(() => {
          el.style.width = transitionWidth
        })
      }
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
    // 让子组件渲染完毕
    this.$nextTick(() => {
      let menu = this.$refs.menu
      this.storeBoundingSize()
      this.listResizeHandler()
      this.inited = true
      if (this.menuOverflow) {
        menu.style.marginRight = this.$refs.extra.offsetWidth
        this.$nextTick(() => {
          this.storeBoundingSize()
        })
      }
    })
  }
}
</script>
