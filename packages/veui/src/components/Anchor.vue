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
      :datasource="datasource"
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
import { debounce, reduce, startsWith, includes, get } from 'lodash'
import { scrollToTop, getClipViewport, calcClip, getHash } from '../utils/dom'

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
    try {
      fn(event)
    } catch (e) {}
  })
}
globalScrollHandler.fns = []

const raf = window.requestAnimationFrame
const getRect = el => el.getBoundingClientRect()

// TODO: fiexed anchor 和 placeholder 大小的同步

export default {
  name: 'veui-anchor',
  components: {
    'veui-tree': Tree,
    'veui-link': Link
  },
  mixins: [ui],
  props: {
    datasource: Tree.props.datasource,
    sticky: {
      type: Boolean,
      default: true
    },
    container: {
      type: [HTMLElement, Window],
      default () {
        return window
      }
    }
  },
  data () {
    return {
      localActive: null,
      appendToBody: false
    }
  },
  computed: {
    allAnchors () {
      return extractValue(this.datasource)
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
  created () {
    let hash = getHash()
    if (hash && includes(this.allValues, hash)) {
      this.ensureHashActive = true
      this.updateActive(hash)

      // 当 url 上有 hash，但是不是初始加载页面，浏览器不会滚动的，这里保证下滚动
      this.unwatch = this.$watch(
        'container',
        val => {
          if (val && this.ensureHashActive) {
            // 延时滚动，确保 dom 已存在
            this.$nextTick(() => {
              this.scrollToAnchor(() => {
                this.ensureHashActive = false
              }, 0)
            })
          }
        },
        { immediate: true }
      )
    }

    if (!globalScrollHandler.fns.length) {
      // not bubbles
      window.addEventListener('scroll', globalScrollHandler, true)
    }
    globalScrollHandler.fns.push(this.handleScroll)

    this.debounceActive = debounce(this.activateAnchor, 1000 / 60)
  },
  beforeDestroy () {
    let idx = globalScrollHandler.fns.indexOf(this.handleScroll)
    globalScrollHandler.fns.splice(idx, 1)
    if (!globalScrollHandler.fns.length) {
      window.removeEventListener('scroll', globalScrollHandler, true)
    }
    if (this.appendToBody) {
      this.$el.appendChild(this.$refs.append)
    }
  },
  methods: {
    relocate () {
      this.switchSticky(true)
    },
    updateActive (val) {
      this.localActive = val
      // TODO 兼容下 :target，直接 assign 页面会跳动
      // location.assign(val || '')
    },
    getScrollTopToAffix ({ top }, { top: cTop }) {
      return Math.round(this.container.scrollTop + top - cTop)
    },
    affixAnchor ({ left }, conRect, force) {
      let append = this.$refs.append
      let appendRect = getRect(append)
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
          realTime ? getRect(append) : appendRect,
          getClipViewport(this.container, realTime ? null : conRect)
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
    switchSticky (force) {
      let conRect = getRect(this.container)
      // let appendRect = getRect(this.$refs.append)
      let placeholderRect = getRect(this.$refs.placeholder)
      this.scrollTopToAffix = this.getScrollTopToAffix(
        placeholderRect,
        conRect
      )
      if (this.container.scrollTop >= this.scrollTopToAffix) {
        this.affixAnchor(placeholderRect, conRect, force)
      } else {
        this.unaffixAnchor()
      }
    },
    // 手动滚动到当前激活的 anchor
    scrollToAnchor (cb, duration = 200) {
      let el = document.getElementById(this.localActive.slice(1))
      // 无效的 hash，直接完成
      if (!el) {
        if (cb) cb()
        return
      }
      let conRect = getRect(this.container)
      // let appendRect = getRect(this.$refs.append)
      let placeholderRect = getRect(this.$refs.placeholder)
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
      scrollToTop(this.container, el, duration, beforeScroll, () => {
        // 这里要两个raf， 因为 scroll 用 raf 节流了
        raf(() => {
          raf(() => {
            if (cb) cb()
            this.animating = false
          })
        })
      })
    },
    getCurrentAnchor () {
      let { top: edge } = this.container.getBoundingClientRect()
      let result = null
      let length = this.sharpAnchors.length
      let item = null
      while (length) {
        item = this.sharpAnchors[length - 1]
        if (item.el) {
          if (item.el.getBoundingClientRect().top <= edge) {
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
          let isContainer = event.target === this.container
          let isParent =
            this.container &&
            this.container !== window &&
            this.container.compareDocumentPosition(event.target) &
              Node.DOCUMENT_POSITION_CONTAINS
          if (!isContainer && !isParent) {
            return
          }
          if (this.sticky) {
            this.switchSticky()
          }
          if (isContainer) {
            if (this.animating || this.ensureHashActive) {
              return
            }
            this.debounceActive()
          }
        })
        this.ticking = true
      }
    }
  }
}
</script>
