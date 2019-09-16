<template>
<div
  class="veui-anchor"
  :ui="realUi"
>
  <div
    ref="placeholder"
    class="veui-anchor-placeholder"
  />
  <div
    ref="append"
    class="veui-anchor-wrapper"
    :ui="realUi"
  >
    <veui-tree
      class="veui-anchor-tree"
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
              'veui-tree-item-label': true,
              'veui-anchor-item': true,
              'veui-anchor-item-active': props.value === localActive
            }"
            :disabled="!!props.disabled"
            :to="props.value"
            :ui="realUi"
            @click="handleClick(props)"
          >
            {{ props.label }}
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
import { debounce, reduce, startsWith, includes, get, isString } from 'lodash'
import {
  scrollTo,
  getClipViewport,
  calcClip,
  raf,
  getWindowRect
} from '../utils/dom'
import { getNodes } from '../utils/context'
import config from '../managers/config'

config.defaults({
  'anchor.prefix': '@'
})

function isSpecialSyntax (value) {
  return isString(value) && value.indexOf(config.get('anchor.prefix')) === 0
}

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
// TODO: fiexed anchor 和 placeholder 大小的同步

export default {
  name: 'veui-anchor',
  components: {
    'veui-tree': Tree,
    'veui-link': Link
  },
  mixins: [ui],
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
    }
  },
  data () {
    return {
      localActive: null,
      realContainer: null,
      appendToBody: false
    }
  },
  computed: {
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
        if (!val || val === window) {
          this.realContainer = val || null
        } else if (isSpecialSyntax(val)) {
          // 特殊语法先直接返回 window 上的
          this.realContainer = get(window, val.slice(1))
        } else if (isString(val)) {
          // ref, 那么在 nextTick 中才能拿到 dom
          this.$nextTick(() => {
            this.realContainer = get(
              getNodes(val, this.$vnode.context),
              '[0]',
              null
            )
          })
        } else {
          this.realContainer = get(
            getNodes(val, this.$vnode.context),
            '[0]',
            null
          )
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
      this.ensureHashActive = true
      this.updateActive(hash)
      this.$nextTick(() => {
        this.scrollToAnchor(() => {
          this.ensureHashActive = false
        }, 0)
      })
    }
  },
  beforeDestroy () {
    if (this.clipTimer) clearTimeout(this.clipTimer)
    this.removeScrollHandler()
    if (this.appendToBody) {
      this.$el.appendChild(this.$refs.append)
    }
  },
  methods: {
    relocate () {
      this.toggleSticky(true)
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
    getScrollTopToAffix ({ top }, { top: cTop }) {
      let scrollTop = getScrollTop(this.realContainer)
      return Math.round(scrollTop + top - cTop)
    },
    affixAnchor ({ left }, conRect, force) {
      let append = this.$refs.append
      let appendRect = append.getBoundingClientRect()
      let { width, height } = appendRect
      let { top: cTop } = conRect
      if (!this.appendToBody || force) {
        let placeholder = this.$refs.placeholder
        placeholder.style.width = `${width}px`
        placeholder.style.height = `${height}px`
        append.style.position = 'fixed'
        append.style.top = '0'
        append.style.left = '0'
        if (!this.appendToBody) {
          document.body.appendChild(append)
          this.appendToBody = true
        }
      }
      // affix 之后，若发生横向滚动也应该导致 fixed anchor 滚动，即 left 随之变化
      append.style.transform = `translate(${left}px, ${cTop}px)`

      // clip 一下 fixed anchor, 模拟 absolute 定位被滚动的 C.B. overflow 的效果
      let updateClip = realTime => {
        let clip = calcClip(
          realTime ? append.getBoundingClientRect() : appendRect,
          getClipViewport(this.realContainer, realTime ? null : conRect)
        )
        if (clip) {
          let { top, right, bottom, left } = clip
          append.style.clip = `rect(${top}px ${right}px ${bottom}px ${left}px)`
        } else {
          append.style.clip = ''
        }
      }
      updateClip()

      // 测试发现滚动中获取的 rect 不是最新的，补个延时检查，确保最后停止下来 clip 是正确的
      clearTimeout(this.clipTimer)
      this.clipTimer = setTimeout(() => {
        updateClip(true)
      }, 100)
    },
    unaffixAnchor () {
      if (this.appendToBody) {
        let placeholder = this.$refs.placeholder
        let append = this.$refs.append
        // 仅仅清除之前的样式
        placeholder.style.width = ''
        placeholder.style.height = ''
        append.style.position = ''
        append.style.top = ''
        append.style.left = ''
        append.style.transform = ''
        this.$el.appendChild(append)
        this.appendToBody = false
      }
    },
    // 只要滚动了就要处理 sticky 效果
    toggleSticky (force) {
      if (!this.realContainer || !this.$refs.placeholder) {
        return
      }

      let conRect = this.getContainerRect()
      let placeholderRect = this.$refs.placeholder.getBoundingClientRect()
      this.scrollTopToAffix = this.getScrollTopToAffix(
        placeholderRect,
        conRect
      )
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
            !this.appendToBody &&
            curScrollTop >= this.getScrollTopToAffix(placeholderRect, conRect)
          ) {
            this.affixAnchor(placeholderRect, conRect)
          }
        }
      }
      this.animating = true
      scrollTo(0, this.realContainer, el, duration, beforeScroll, () => {
        // 这里要两个raf， 因为 scroll 用 raf 节流了
        raf(() => {
          raf(() => {
            this.animating = false
            if (cb) cb()
          })
        })
      })
    },
    getCurrentAnchor () {
      let { top: edge } = this.getContainerRect()
      edge = Math.round(edge)
      let result = null
      let length = this.sharpAnchors.length
      let item = null
      while (length) {
        item = this.sharpAnchors[length - 1]
        if (item.el) {
          if (Math.round(item.el.getBoundingClientRect().top) <= edge) {
            result = item
            break
          }
        }
        length--
      }
      return result
    },
    activateAnchor () {
      let newActive = get(this.getCurrentAnchor(), 'value', null)
      if (newActive !== this.localActive) {
        this.updateActive(newActive)
      }
    },
    handleClick (item) {
      this.updateActive(item.value)
      this.scrollToAnchor()
    },
    handleScroll (event) {
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
          if (this.sticky) {
            this.toggleSticky()
          }
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
