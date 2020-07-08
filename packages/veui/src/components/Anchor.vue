<template>
<div
  :class="$c('anchor')"
  :ui="realUi"
>
  <div
    ref="placeholder"
    :class="$c('anchor-placeholder')"
  />
  <div
    :is="tagName"
    ref="append"
    :class="$c('anchor-wrapper')"
    :ui="realUi"
  >
    <veui-tree
      :class="$c('anchor-tree')"
      :datasource="items"
      :expanded="allAnchors"
    >
      <template
        slot="item"
        slot-scope="props"
      >
        <slot
          name="item"
          v-bind="props"
        >
          <veui-link
            :class="{
              [$c('tree-item-label')]: true,
              [$c('anchor-item')]: true,
              [$c('anchor-current')]: props.value === localActive
            }"
            :disabled="!!props.disabled"
            :to="props.value"
            :ui="getFinalUi(props.value)"
            @click.stop="handleClick(props)"
          >
            <slot
              name="item-label"
              v-bind="props"
            >
              {{ props.label }}
            </slot>
          </veui-link>
        </slot>
      </template>
    </veui-tree>
  </div>
</div>
</template>

<script>
import Tree from './Tree'
import Link from './Link'
import ui from '../mixins/ui'
import prefix from '../mixins/prefix'
import {
  debounce,
  reduce,
  startsWith,
  includes,
  get,
  isString,
  isObject
} from 'lodash'
import {
  scrollToAlign,
  getVisibleRect,
  calcClip,
  raf,
  getWindowRect
} from '../utils/dom'
import { resolveOffset, ignoreElements, createPortal } from '../utils/helper'
import { getNodes } from '../utils/context'

const VEUI_OVERLAY_ELEMENT_NAME = 'veui-x-overlay'

ignoreElements(VEUI_OVERLAY_ELEMENT_NAME)

const extractValue = data => {
  return reduce(
    data,
    (result, { value, children }) => {
      result.push(value)
      if (children) {
        result.push(...extractValue(children))
      }
      return result
    },
    []
  )
}

const globalScrollHandler = event => {
  globalScrollHandler.fns.forEach(fn => {
    // 保证每个 handler 都调用
    try {
      fn(event)
    } catch (e) {
      console.error(e)
    }
  })
}
globalScrollHandler.fns = []

const getScrollTop = el =>
  el === window ? document.documentElement.scrollTop : el.scrollTop

const getOffset = (container, top, offset) => {
  let { clientTop, clientHeight } =
    container === window
      ? { clientTop: 0, clientHeight: container.innerHeight }
      : container
  return Math.round(top + clientTop + resolveOffset(offset, clientHeight))
}

const offsetValidator = val => !isNaN(resolveOffset(val))

// TODO: sticky anchor 和 placeholder 大小的同步

export default {
  name: 'veui-anchor',
  components: {
    'veui-tree': Tree,
    'veui-link': Link
  },
  mixins: [prefix, ui],
  props: {
    items: Tree.props.datasource,
    sticky: {
      type: Boolean,
      default: true
    },
    container: {
      type:
        process.env.VUE_ENV === 'server' ? true : [String, HTMLElement, Window],
      default: null
    },
    targetOffset: {
      type: [String, Number],
      validator: offsetValidator,
      default: 0
    },
    stickyOffset: {
      type: [String, Number],
      validator: offsetValidator,
      default: 0
    }
  },
  data () {
    return {
      localActive: null
    }
  },
  computed: {
    tagName () {
      return VEUI_OVERLAY_ELEMENT_NAME
    },
    allAnchors () {
      return extractValue(this.items)
    },
    sharpAnchors () {
      return this.allAnchors.reduce((result, value) => {
        if (startsWith(value, '#')) {
          result.push({
            value,
            el: document.getElementById(value.slice(1))
          })
        }
        return result
      }, [])
    }
  },
  watch: {
    container: {
      handler (val) {
        // isObject 检查：避免 SSR 时访问 window
        if (!val || (isObject(val) && val === window)) {
          this.realContainer = this.anchorMounted ? (val || window) : val
          this.$nextTick(this.updateOnContainerChange)
        } else if (isString(val)) {
          // ref, 那么在 nextTick 中才能拿到 dom
          this.$nextTick(() => {
            this.realContainer = get(
              getNodes(val, this.$vnode.context),
              '[0]',
              null
            )
            this.updateOnContainerChange()
          })
        } else {
          // vue instance...
          this.realContainer = get(
            getNodes(val, this.$vnode.context),
            '[0]',
            null
          )
          this.$nextTick(this.updateOnContainerChange)
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.debounceActivateAnchor = debounce(this.activateAnchor, 1000 / 60)
    this.installScrollHandler()

    let hash = decodeURIComponent(location.hash)
    if (hash && includes(this.allAnchors, hash)) {
      this.updateActive(hash)

      // url 上初始就有 hash，那么最好一开始就滚动到对应的位置
      // 但是浏览器自己可能也会滚动，因为 Anchor 是可以指定容器滚动的，所以浏览器的滚动不一定是我们想要的位置
      // 所以希望可以覆盖掉浏览器的滚动，最终滚动到合适位置
      this.ensureHashActive = true
      const isLoading = document.readyState === 'loading'
      if (isLoading) {
        this.waitForLoaded = true
        window.addEventListener('DOMContentLoaded', () => {
          // 为了尽可能在浏览器滚动后再滚动一次
          setTimeout(() => {
            this.waitForLoaded = false
            // 如果这里没有 container，那么会在 container watch 时候再补上
            if (this.realContainer) {
              this.scrollForHash()
            }
          }, 0)
        })
      }
    } else if (!this.container) {
      this.$nextTick(() => {
        if (!this.realContainer) {
          this.realContainer = window
          this.updateOnContainerChange()
        }
      })
    }
    this.anchorMounted = true
  },
  beforeDestroy () {
    this.removeScrollHandler()
    if (this.removePortal) {
      this.removePortal()
    }
  },
  methods: {
    relocate () {
      if (this.sticky) this.toggleSticky(true)
    },
    getFinalUi (link) {
      return `${this.realUi || ''} ${
        link === this.localActive ? this.uiParts.current : ''
      }`.trim()
    },
    updateOnContainerChange () {
      // dom 加载好了还没有滚动到 url hash 处，说明加载事件中还没有 container，这里补上。
      if (this.realContainer) {
        if (this.ensureHashActive && !this.waitForLoaded) {
          this.scrollForHash()
        } else if (!this.ensureHashActive) {
          if (this.sticky) this.toggleSticky()
          this.activateAnchor()
        }
      }
    },
    scrollForHash () {
      // 立即滚动到 hash 处
      this.scrollToAnchor(() => {
        this.ensureHashActive = false
        // 可能因为浏览器的滚动或保留上次滚动位置，而导致实际不会触发滚动，所以补个 sticky 检测
        if (this.sticky) this.toggleSticky()
      }, 0)
    },
    installScrollHandler () {
      if (!globalScrollHandler.fns.length) {
        // not bubbles
        window.addEventListener('scroll', globalScrollHandler, true)
      }
      globalScrollHandler.fns.push(this.handleScroll)
    },
    removeScrollHandler () {
      let idx = globalScrollHandler.fns.indexOf(this.handleScroll)
      globalScrollHandler.fns.splice(idx, 1)
      if (!globalScrollHandler.fns.length) {
        window.removeEventListener('scroll', globalScrollHandler, true)
      }
    },
    getContainerRect () {
      return this.realContainer === window
        ? getWindowRect()
        : this.realContainer.getBoundingClientRect()
    },
    updateActive (val) {
      this.localActive = val
      // TODO 兼容下 :target，直接 assign 页面会跳动
      // location.assign(val || '')
    },
    getScrollTopToAffix ({ top }, { top: cTop, height: cHeight }) {
      let scrollTop = getScrollTop(this.realContainer)
      return Math.round(
        scrollTop + top - getOffset(this.realContainer, cTop, this.stickyOffset)
      )
    },
    affixAnchor ({ left }, conRect, force) {
      let append = this.$refs.append
      let appendRect = append.getBoundingClientRect()
      let { width, height } = appendRect
      let { top: cTop } = conRect
      if (!this.removePortal || force) {
        let placeholder = this.$refs.placeholder
        placeholder.style.width = `${width}px`
        placeholder.style.height = `${height}px`
        append.style.position = 'fixed'
        append.style.top = '0'
        append.style.left = '0'
        if (!this.removePortal) {
          this.removePortal = createPortal(append, document.body)
        }
      }
      // affix 之后，若发生横向滚动也应该导致 fixed anchor 滚动，即 left 随之变化
      append.style.transform = `translate(${left}px, ${getOffset(
        this.realContainer,
        cTop,
        this.stickyOffset
      )}px)`

      // clip 一下 fixed anchor, 模拟 absolute 定位被滚动的 C.B. overflow 的效果
      let clip = calcClip(
        append.getBoundingClientRect(), // 设置了 append 的样式，重新获取下rect
        getVisibleRect(this.realContainer, conRect)
      )
      if (clip) {
        let { top, right, bottom, left } = clip
        append.style.clip = `rect(${top}px ${right}px ${bottom}px ${left}px)`
      } else {
        append.style.clip = ''
      }
    },
    unaffixAnchor () {
      if (this.removePortal) {
        let placeholder = this.$refs.placeholder
        let append = this.$refs.append
        // 仅仅清除之前的样式
        placeholder.style.width = ''
        placeholder.style.height = ''
        append.style.position = ''
        append.style.top = ''
        append.style.left = ''
        append.style.transform = ''
        this.removePortal()
        this.removePortal = null
      }
    },
    // 只要滚动了就要处理 sticky 效果
    toggleSticky (force) {
      if (!this.realContainer || !this.$refs.placeholder) {
        return
      }

      let conRect = this.getContainerRect()
      let placeholderRect = this.$refs.placeholder.getBoundingClientRect()
      this.scrollTopToAffix = this.getScrollTopToAffix(placeholderRect, conRect)
      if (getScrollTop(this.realContainer) >= this.scrollTopToAffix) {
        this.affixAnchor(placeholderRect, conRect, force)
      } else {
        this.unaffixAnchor()
      }
    },
    // 手动滚动到当前激活的 anchor
    scrollToAnchor (cb, duration = 200) {
      let el = document.getElementById(this.localActive.slice(1))
      // 无效的 hash 或没有 container，直接完成
      if (!el || !this.realContainer) {
        if (cb) cb()
        return
      }
      let conRect = this.getContainerRect()
      let placeholderRect = this.$refs.placeholder.getBoundingClientRect()
      let beforeScroll = null
      if (this.sticky) {
        beforeScroll = curScrollTop => {
          if (
            !this.removePortal &&
            curScrollTop >= this.getScrollTopToAffix(placeholderRect, conRect)
          ) {
            this.affixAnchor(placeholderRect, conRect)
          }
        }
      }
      this.animating = true
      scrollToAlign(this.realContainer, el, {
        targetPosition: 0,
        viewportPosition: this.targetOffset,
        duration,
        beforeScroll,
        afterScroll: () => {
          // 这里要两个raf， 因为 scroll 用 raf 节流了
          raf(() => {
            raf(() => {
              this.animating = false
              if (cb) cb()
            })
          })
        }
      })
    },
    getCurrentAnchor () {
      let { top: cTop } = this.getContainerRect()
      let offset = getOffset(this.realContainer, cTop, this.targetOffset)
      let result = null
      let length = this.sharpAnchors.length
      let item = null
      while (length--) {
        item = this.sharpAnchors[length]
        if (item.el) {
          if (Math.round(item.el.getBoundingClientRect().top) <= offset) {
            result = item
            break
          }
        }
      }
      return result
    },
    activateAnchor () {
      let newActive = get(this.getCurrentAnchor(), 'value', null)
      if (newActive && newActive !== this.localActive) {
        this.updateActive(newActive)
      } else if (this.realContainer && !newActive && this.sharpAnchors.length) {
        this.updateActive(this.sharpAnchors[0].value)
      }
    },
    handleClick (item) {
      this.updateActive(item.value)
      this.scrollToAnchor()
    },
    handleScroll (event) {
      // 滚动到 url hash 之前不处理事件
      if (this.ensureHashActive) {
        return
      }
      if (!this.ticking) {
        raf(() => {
          this.ticking = false
          if (!this.realContainer) {
            return
          }
          let isWindow = this.realContainer === window
          // window 滚动时，target 是 document
          let isContainerScrolling =
            event.target === this.realContainer ||
            (event.target === document && isWindow)
          let isParentScrolling =
            !isContainerScrolling &&
            !isWindow &&
            this.realContainer.compareDocumentPosition(event.target) &
              Node.DOCUMENT_POSITION_CONTAINS
          if (!isContainerScrolling && !isParentScrolling) {
            return
          }
          if (this.sticky) this.toggleSticky()
          if (
            isContainerScrolling &&
            !this.animating &&
            !this.ensureHashActive
          ) {
            this.debounceActivateAnchor()
          }
        })
        this.ticking = true
      }
    }
  }
}
</script>
