import Vue from 'vue'
import {
  find,
  pick,
  assign,
  isEqual,
  isUndefined,
  zip,
  camelCase,
  kebabCase
} from 'lodash'
import { prefixify } from '../../mixins/prefix'
import {
  isInsideTransformedContainer,
  cloneElementWithComputedStyle
} from '../../utils/dom'
import { isSafari as checkIsSafari } from '../../utils/bom'
import BaseHandler from './BaseHandler'
import warn from '../../utils/warn'

const isSafari = checkIsSafari()

const defaultDragSortInsertAlign = 'middle'
const preventDragOverDefault = evt => evt.preventDefault()

const datasetDragSortKey = camelCase(prefixify('drag-sort'))
const datasetDraggingKey = datasetDragSortKey + 'Dragging'
const datasetDragGhostKey = datasetDraggingKey + 'Ghost'

// TODO: remove this after 2.0.0.
let callbackDeprecationWarned = false

export default class SortHandler extends BaseHandler {
  constructor (options, context, vnode) {
    super(options, context)
    this.vnode = vnode

    // 加上标记，开始拖动时需要通过这个找到同组元素
    vnode.elm.dataset[datasetDragSortKey] = this.options.name
    vnode.elm.draggable = true
  }

  setOptions (options) {
    if (isEqual(this.options, options)) {
      return
    }
    if (isUndefined(options.align)) {
      options = { ...options, align: defaultDragSortInsertAlign }
    }
    super.setOptions(options)

    if ('callback' in options && !callbackDeprecationWarned) {
      warn(
        '[v-drag.sort] The `callback` option is deprecated and will be removed in v2.0.0. Please use `sort` instead.'
      )
      callbackDeprecationWarned = true
    }

    this.options = assign(
      this.options,
      pick(options, [
        'name',
        'containment',
        'axis',
        'sort',
        'callback', // deprecated
        'debug',
        'align'
      ])
    )
  }

  start (...args) {
    super.start(...args)
    let { event } = args[0]
    let { currentTarget, offsetX, offsetY } = event
    this.currentTarget = currentTarget
    let { offsetWidth, offsetHeight } = currentTarget
    // 算光标到元素中心的偏移量
    this.fixMouseoffset = [
      offsetWidth / 2 - offsetX,
      offsetHeight / 2 - offsetY
    ]

    // 找出被拖动元素的所在容器。优先用传入的 containment
    this.container = this.options.containment
      ? getHtmlElement(this.options.containment)
      : currentTarget.parentElement

    // 找出被拖动元素的索引
    this.dragElementIndex = [...this.getElements()].indexOf(currentTarget)
    if (this.dragElementIndex < 0) {
      throw new Error('[v-drag] Missing dragging element in elements.')
    }

    // 避免拖动完成后的原生动画
    document.addEventListener('dragover', preventDragOverDefault)

    // 加上拖动中标记，用于匹配css
    currentTarget.dataset[datasetDraggingKey] = ''
    document.body.classList.add(kebabCase(datasetDraggingKey))

    // 计算热区
    this.updateHotRects()

    // 处于 tranformed 容器内的元素被拖动时：
    // * firefox: 被拖动元素snapshot在开始拖动时位置偏移，并从偏移位置动画移动到鼠标位置（猜测实现上没有考虑 transform 产生的偏移）
    // * safari: 不显示被拖动元素snapshot（猜测实现上存在与firefox类似的问题）
    // 对比了 react-dnd, sortable.js 等其它使用原生 DnD 接口的拖动库，都存在上述问题。
    // 经过实验发现，通过主动设置 drag image (setDragImage) 可以在 firefox 上解决偏移问题
    // 再额外增加 safari 且被拖动元素处于 transformed 容器内的兼容处理————克隆被拖动元素且保证在视口内使得safari可以正常生成 snapshot
    setDragSnapshotImage(currentTarget, event)

    // 下一帧再加上 ghost 样式，避免拖动的 snapshot 也是 ghost 样式
    requestAnimationFrame(() => {
      currentTarget.dataset[datasetDragGhostKey] = ''
    })
  }

  getElements () {
    return this.container.querySelectorAll(
      `[data-${kebabCase(datasetDragSortKey)}="${this.options.name}"]`
    )
  }

  updateHotRects () {
    const hotRects = getHotRects(
      this.getElements(),
      this.container,
      this.options.axis,
      this.currentTarget,
      this.dragElementIndex
    )

    if (process.env.NODE_ENV === 'development' && this.options.debug) {
      let id = `${datasetDragSortKey}debug-layer`
      let layer = document.getElementById(id)
      if (layer) {
        layer.parentNode.removeChild(layer)
      }
      layer = getHotRectsDebugLayer(
        hotRects,
        this.container.getBoundingClientRect()
      )
      layer.id = id
      document.body.appendChild(layer)
    }

    this.hotRects = hotRects
  }

  drag ({ event: { pageX, pageY }, last }) {
    // Safari上 drag 和 dragend event里的 pageX/Y 不一致
    // 而 drag.js 里在 dragend 时也会再回调一次 drag
    // 所以通过 last 来判断是不是最后一次 drag
    // 这里如果是在 dragend 里触发的 drag 就无视
    if (last) {
      return
    }

    // 鼠标相对视口的坐标
    let docEl = document.documentElement
    let point = calculatePoints(
      [
        [pageX, pageY],
        [window.scrollX || docEl.scrollLeft, window.scrollY || docEl.scrollTop],
        this.options.align === 'middle' ? this.fixMouseoffset : [0, 0]
      ],
      (pagePoint, scrollPoint, fixPoint) => pagePoint - scrollPoint + fixPoint
    )

    const toIndex = findInsertIndexByMousePointFromHotRect(point, this.hotRects)
    // drag 事件会持续触发，如果插入点没变就不用干啥
    if (toIndex < 0 || toIndex === this.prevInsertIndex) {
      return
    }

    const fromIndex = this.dragElementIndex
    // 插入当前拖动元素或后面一个元素的前面，就是当前的位置，不用修改
    if (fromIndex !== toIndex) {
      // TODO: remove the compatibility code after 2.0.
      let { sort, callback } = this.options
      let result = sort
        ? sort(fromIndex, toIndex)
        : callback(toIndex, fromIndex)
      if (result !== false) {
        // 拖动成功后，更新下当前拖动元素索引
        this.dragElementIndex = toIndex
        // 元素列表变了，热区也要更新下（需要等DOM更新了
        Vue.nextTick(() => {
          // 在测试环境中，测完了就销毁了，这里的 nextTick 可能不需要更新
          if (this.currentTarget) {
            this.updateHotRects()
          }
        })
      }
    }

    this.prevInsertIndex = toIndex
  }

  end (...args) {
    super.end(...args)
    let [
      {
        event: { currentTarget }
      }
    ] = args

    // 清理
    delete currentTarget.dataset[datasetDragGhostKey]
    delete currentTarget.dataset[datasetDraggingKey]
    this.clear()
  }

  clear () {
    this.currentTarget = null

    // delete document.body.dataset[datasetDraggingKey]
    document.body.classList.remove(kebabCase(datasetDraggingKey))
    document.removeEventListener('dragover', preventDragOverDefault)
  }

  reset () {}

  destroy () {
    this.clear()
    delete this.vnode.elm.dataset[datasetDragSortKey]
    this.vnode.elm.draggable = false
  }
}

function getHotRects (
  elements,
  container,
  axis,
  currentTarget,
  dragElementIndex
) {
  // TODO: rtl，把 leading, trailing 互换

  // 把水平方向的左右和垂直方向的上下归一为 leading(前)、trailing(后)，下面好统一处理
  const [top, bottom, leading, trailing] = exchangeAxisValues(
    ['top', 'bottom', 'left', 'right'],
    axis
  )

  const containerBoundary = container.getBoundingClientRect()

  const elementRects = [...elements].map(getStableBoundingClientRect)

  let currentRect = getStableBoundingClientRect(currentTarget)

  // 找出换行的 index，切成行，按行处理热区
  const breakIndices = elementRects
    .reduce(
      (indices, current, i) => {
        if (i === 0) {
          return indices
        }

        let prev = elementRects[i - 1]
        let field = axis === 'y' ? 'top' : 'left'
        if (current[field] > prev[field]) {
          return indices
        }
        return indices.concat(i)
      },
      [0]
    )
    .concat(elementRects.length)

  let count = 0
  const hotRects = breakIndices
    .slice(1)
    .reduce((rows, breakIndex, i) => {
      rows.push(elementRects.slice(breakIndices[i], breakIndex))
      return rows
    }, [])
    .map(rects => {
      // 此时 rect 为 元素的边界
      let rowCount = rects.length
      let first = rects[0]
      let last = rects[rects.length - 1]
      let newRects = rects.slice(0)
      // 首尾插入一个相对容器边界的空矩形用于方便下面热区首尾计算
      newRects.unshift({
        [top]: first[top],
        [bottom]: first[bottom],
        [trailing]: containerBoundary[leading] // 前一个的右边是后一个的左边
      })
      newRects.push({
        [top]: last[top],
        [bottom]: last[bottom],
        [leading]: containerBoundary[trailing]
      })

      // 从 元素边界 计算 热区边界
      // 变换后 Rect Tuple 元素：热区矩形的左、右、上、下，热区对应的插入索引

      // * - - - *  // newRects, * 是上面首尾插入，下面 oldIdx 对应这里的索引，prev 和 next 也是取自这里
      //   - - -    // 实际用来生成每个热区，下面 idx 对应这里的索引
      rects = rects.map((current, idx) => {
        let oldIdx = idx + 1
        let prev = newRects[oldIdx - 1]
        let next = newRects[oldIdx + 1]
        let isFirst = idx === 0
        let isLast = idx === rects.length - 1
        let dimension = axis === 'y' ? 'height' : 'width'
        let totalIdx = count + idx // 上面 idx 都是行内，totalIdx 则是总的索引
        let half = currentRect[dimension] / 2

        let afterDragging = totalIdx > dragElementIndex // 当前被计算热区的项目在 draging 项目的后面
        let beforeDragging = totalIdx < dragElementIndex
        let start = afterDragging ? current : prev
        let end = beforeDragging ? current : next
        let startSign = afterDragging ? -1 : 1
        let endSign = beforeDragging ? 1 : -1
        // 几种 case 合到一起好像可读性不太好
        // 有三种情况：计算 A 项目的热区，dragging 是正在被拖的元素
        //  1) A 在 dragging 的前面，热区要加 half
        //  2) A 是 dragging，那么热区前半部分要加 half，后半部分减 half
        //  3) A 在 dragging 的后面，热区要减 half
        return exchangeAxisValues(
          [
            isFirst
              ? prev[trailing]
              : start[trailing] - start[dimension] / 2 + half * startSign,
            isLast
              ? next[leading]
              : end[leading] + end[dimension] / 2 + half * endSign,
            Math.min(start[top], end[top]),
            Math.max(start[bottom], end[bottom])
          ],
          axis
        ).concat(totalIdx)
      })
      count += rowCount
      return rects
    })
    .reduce((rects, row) => rects.concat(row))
  return hotRects
}

function findInsertIndexByMousePointFromHotRect ([x, y], hotRects) {
  let rect = find(
    hotRects,
    ([x1, x2, y1, y2]) => x >= x1 && x <= x2 && y >= y1 && y <= y2
  )
  return rect ? rect[4] : -1
}

function exchangeAxisValues (values, axis) {
  return axis === 'y' ? values.slice(2).concat(values.slice(0, 2)) : values
}

function getHotRectsDebugLayer (hotRects, containerBoundary) {
  // Keep it simple. Will be removed when NODE_ENV is production
  let layer = document.createElement('div')
  layer.style.position = 'fixed'
  layer.style.zIndex = 99999
  layer.style.top = 0
  layer.style.right = 0
  layer.style.bottom = 0
  layer.style.left = 0
  layer.style.pointerEvents = 'none'

  let containerDiv = document.createElement('div')
  containerDiv.style.position = 'absolute'
  containerDiv.style.top = containerBoundary.top + 'px'
  containerDiv.style.left = containerBoundary.left + 'px'
  containerDiv.style.width =
    containerBoundary.right - containerBoundary.left + 'px'
  containerDiv.style.height =
    containerBoundary.bottom - containerBoundary.top + 'px'
  containerDiv.style.background = 'rgba(0, 255, 0, .1)'
  containerDiv.style.border = '1px dotted skyblue'
  containerDiv.style.boxSizing = 'border-box'
  layer.appendChild(containerDiv)

  hotRects.forEach(([x1, x2, y1, y2, i]) => {
    let div = document.createElement('div')
    div.style.width = x2 - x1 + 'px'
    div.style.height = y2 - y1 + 'px'
    div.style.top = y1 + 'px'
    div.style.left = x1 + 'px'
    div.style.position = 'absolute'
    div.style.background = 'rgba(255, 0, 0, .2)'
    div.style.border = '1px solid blue'
    div.style.boxSizing = 'border-box'
    div.innerText = i
    layer.appendChild(div)
  })

  return layer
}

function getHtmlElement (el) {
  return el.$el || el
}

function calculatePoints (points, calc) {
  return zip(...points).map(values => calc(...values))
}

function setDragSnapshotImage (el, event) {
  let { offsetX, offsetY } = event
  let newEl
  if (isSafari && isInsideTransformedContainer(el)) {
    newEl = cloneElementWithComputedStyle(el)
    assign(newEl.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 214748364, // max value of z-index
      margin: 0
    })
    document.body.append(newEl)
    requestAnimationFrame(() => document.body.removeChild(newEl))
  }
  if (event.dataTransfer.setDragImage) {
    event.dataTransfer.setDragImage(newEl || el, offsetX, offsetY)
  }
}

/**
 * To get relatively stable bounding client rect based on the offsetParent
 * @param {HTMLElement} el The target element
 */
function getStableBoundingClientRect (el) {
  let parent = el.offsetParent
  let parentRect = parent ? parent.getBoundingClientRect() : null
  let scroll = getScrollOffset(el, parent)

  let top = parentRect
    ? parentRect.top + el.offsetTop - scroll.top
    : el.offsetTop
  let left = parentRect
    ? parentRect.left + el.offsetLeft - scroll.left
    : el.offsetLeft
  let width = el.offsetWidth
  let height = el.offsetHeight

  return {
    width,
    height,
    top,
    right: left + width,
    bottom: top + height,
    left
  }
}

/**
 * Get accumulated scroll offsets from the starting element to a specified context element
 * @param {HTMLElement} el the starting element
 * @param {HTMLElement} context the context element
 */
function getScrollOffset (el, context) {
  if (!context.contains(el)) {
    throw new Error('The context element must contain the starting element.')
  }
  let current = el
  let top = 0
  let left = 0
  while (current !== context) {
    current = current.parentElement
    top += current.scrollTop
    left += current.scrollLeft
  }

  return {
    top,
    left
  }
}
