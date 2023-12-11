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
import cloneElement from 'clone-element'
import { prefixify } from '../../mixins/ui'
import {
  isInsideTransformedContainer,
  getStableBoundingClientRect,
  appendTemporaryStyle,
  checkDragOffsetDeviation
} from '../../utils/dom'
import { isSafari as checkIsSafari } from '../../utils/bom'
import BaseHandler from './BaseHandler'

const isSafari = checkIsSafari()

const defaultDragSortInsertAlign = 'middle'
const preventDragOverDefault = (evt) => evt.preventDefault()

const datasetDragSortKey = (themeVariant) =>
  camelCase(prefixify('drag-sort', themeVariant))
const datasetDragSortHandleKey = (themeVariant) =>
  camelCase(prefixify('drag-sort-handle', themeVariant))
const datasetDraggingKey = (themeVariant) =>
  datasetDragSortKey(themeVariant) + 'Dragging'
const datasetDragGhostKey = (themeVariant) =>
  datasetDraggingKey(themeVariant) + 'Ghost'
const datasetDragSnapshotKey = (themeVariant) =>
  datasetDragSortKey(themeVariant) + 'Snapshot'
const dragContainerChildrenKey = '__drag_container_children__'
const dragContainerRestoreKey = '__drag_container_restore__'

export default class SortHandler extends BaseHandler {
  setOptions (options) {
    if (isEqual(this.options, options)) {
      return
    }

    const { target, handle, themeVariant } = options
    if (target) {
      delete target.dataset[datasetDragSortKey(themeVariant)]
    }
    if (handle) {
      delete handle.dataset[datasetDragSortHandleKey(themeVariant)]
    }

    // 加上标记，开始拖动时需要通过这个找到同组元素
    options.target.dataset[datasetDragSortKey(options.themeVariant)] =
      options.name
    options.handle.dataset[datasetDragSortHandleKey(options.themeVariant)] = ''

    if (isUndefined(options.align)) {
      options = { ...options, align: defaultDragSortInsertAlign }
    }
    super.setOptions(options)

    this.options = assign(
      this.options,
      pick(options, [
        'name',
        'containment',
        'axis',
        'sort',
        'debug',
        'align',
        'themeVariant'
      ])
    )
  }

  ready () {
    let { target, containment } = this.options

    // 找出被拖动元素的所在容器。优先用传入的 containment
    let container = (this.container = containment
      ? getHtmlElement(containment)
      : target.parentElement)

    if (!container) {
      throw new Error(
        '[v-drag] Sortable element must be inside a container element.'
      )
    }

    let siblings = container[dragContainerChildrenKey]
    if (!siblings) {
      siblings = container[dragContainerChildrenKey] = []
      let restoreContainerStyle = appendTemporaryStyle(
        container,
        'position: relative !important'
      )
      container[dragContainerRestoreKey] = () => {
        restoreContainerStyle()
        delete container[dragContainerChildrenKey]
        delete container[dragContainerRestoreKey]
      }
    }
    siblings.push(target)
  }

  start (...args) {
    super.start(...args)
    let { event } = args[0]
    let { clientX, clientY } = event
    let { target } = this.options
    let { offsetWidth, offsetHeight } = target
    let { top, left } = target.getBoundingClientRect()
    let offsetX = clientX - left
    let offsetY = clientY - top

    // 算光标到元素中心的偏移量
    this.fixMouseoffset = [
      offsetWidth / 2 - offsetX,
      offsetHeight / 2 - offsetY
    ]

    // 找出被拖动元素的索引
    this.dragElementIndex = [...this.getElements()].indexOf(target)
    if (this.dragElementIndex < 0) {
      throw new Error('[v-drag] Missing dragging element in elements.')
    }

    // 避免拖动完成后的原生动画
    document.addEventListener('dragover', preventDragOverDefault)

    const { themeVariant } = this.options

    // 加上拖动中标记，用于匹配css
    target.dataset[datasetDraggingKey(themeVariant)] = ''
    document.body.classList.add(kebabCase(datasetDraggingKey(themeVariant)))
    // 加上 Snapshot 标记，用来调整截图的宽高（隐藏一些元素）有效，但是改颜色无效
    target.dataset[datasetDragSnapshotKey(themeVariant)] = ''
    // 计算热区
    this.updateHotRects()

    // 处于 tranformed 容器内的元素被拖动时：
    // * firefox: 被拖动元素snapshot在开始拖动时位置偏移，并从偏移位置动画移动到鼠标位置（猜测实现上没有考虑 transform 产生的偏移）
    // * safari: 不显示被拖动元素snapshot（猜测实现上存在与firefox类似的问题）
    // 对比了 react-dnd, sortable.js 等其它使用原生 DnD 接口的拖动库，都存在上述问题。
    // 经过实验发现，通过主动设置 drag image (setDragImage) 可以在 firefox 上解决偏移问题
    // 再额外增加 safari 且被拖动元素处于 transformed 容器内的兼容处理————克隆被拖动元素且保证在视口内使得safari可以正常生成 snapshot
    setDragSnapshotImage(target, event, { offsetX, offsetY })

    // 下一帧再加上 ghost 样式，避免拖动的 snapshot 也是 ghost 样式
    requestAnimationFrame(() => {
      delete target.dataset[datasetDragSnapshotKey(themeVariant)]
      target.dataset[datasetDragGhostKey(themeVariant)] = ''
    })
  }

  getElements () {
    const itemsSelector = `[data-${kebabCase(
      datasetDragSortKey(this.options.themeVariant)
    )}="${this.options.name}"]`
    return this.container.querySelectorAll(itemsSelector)
  }

  updateHotRects () {
    const els = this.getElements()

    if (els.length === 0) {
      return
    }

    const hotRects = getHotRects(
      els,
      this.container,
      this.options.axis,
      this.options.target,
      this.dragElementIndex
    )

    const { debug, themeVariant } = this.options

    if (process.env.NODE_ENV === 'development' && debug) {
      let id = `${datasetDragSortKey(themeVariant)}debug-layer`
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
      let { sort } = this.options
      if (sort(fromIndex, toIndex) !== false) {
        // 拖动成功后，更新下当前拖动元素索引
        this.dragElementIndex = toIndex
        // 元素列表变了，热区也要更新下（需要等DOM更新了
        Vue.nextTick(() => {
          // microtasks: vue patch -> tick1 ->（?）-> tick2
          // TODO: 实际需要两次 nextTick ，说明 vue patch 可能会导致额外的 flush 而非复用本次？
          Vue.nextTick(() => {
            this.updateHotRects()
          })
        })
      }
    }

    this.prevInsertIndex = toIndex
  }

  end (...args) {
    super.end(...args)
    let { target, themeVariant } = this.options

    // 清理
    delete target.dataset[datasetDragGhostKey(themeVariant)]
    delete target.dataset[datasetDraggingKey(themeVariant)]
    this.clear()
  }

  clear () {
    document.body.classList.remove(
      kebabCase(datasetDraggingKey(this.options.themeVariant))
    )
    document.removeEventListener('dragover', preventDragOverDefault)
  }

  reset () {}

  destroy () {
    this.clear()

    let { target, handle, themeVariant } = this.options
    target.draggable = false

    delete target.dataset[datasetDragSortKey(themeVariant)]
    delete handle.dataset[datasetDragSortHandleKey(themeVariant)]

    let { container } = this

    let siblings = container[dragContainerChildrenKey]
    siblings.splice(siblings.indexOf(target), 1)
    if (siblings.length === 0) {
      container[dragContainerRestoreKey]()
    }
  }
}

function getHotRects (elements, container, axis, target, dragElementIndex) {
  // TODO: rtl，把 leading, trailing 互换

  // 把水平方向的左右和垂直方向的上下归一为 leading(前)、trailing(后)，下面好统一处理
  const [top, bottom, leading, trailing] = exchangeAxisValues(
    ['top', 'bottom', 'left', 'right'],
    axis
  )

  const containerBoundary = container.getBoundingClientRect()

  // `getStableBoundingClientRect` is used here as it will ignore interpolated
  // values during transition
  const elementRects = [...elements].map((el) =>
    getStableBoundingClientRect(el, container)
  )
  const currentRect = getStableBoundingClientRect(target, container)

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
    .map((rects) => {
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

function gt (a, b) {
  // 减少跳动
  return a - b >= 1
}

function findInsertIndexByMousePointFromHotRect ([x, y], hotRects) {
  let rect = find(
    hotRects,
    ([x1, x2, y1, y2]) => gt(x, x1) && gt(x2, x) && gt(y, y1) && gt(y2, y)
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
  return zip(...points).map((values) => calc(...values))
}

function setDragSnapshotImage (el, event, { offsetX, offsetY }) {
  let newEl
  if (isSafari && isInsideTransformedContainer(el)) {
    newEl = cloneElement(el)
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
    const r = checkDragOffsetDeviation() ? window.devicePixelRatio : 1
    event.dataTransfer.setDragImage(newEl || el, offsetX * r, offsetY * r)
  }
}
