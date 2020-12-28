import Vue from 'vue'
import {
  find,
  pick,
  assign,
  isEqual,
  isUndefined,
  includes,
  zip,
  camelCase,
  kebabCase
} from 'lodash'
import { prefixify } from '../../mixins/prefix'
import BaseHandler from './BaseHandler'

// TODO: default config。2p 是多少？
const hotRectExtra = {
  x: [10, 0],
  y: [0, 5]
}

const defaultDragSortInsertAlign = 'middle'
const preventDragOverDefault = evt => evt.preventDefault()

const datasetDragSortKey = camelCase(prefixify('drag-sort'))
const datasetDraggingKey = datasetDragSortKey + 'Dragging'
const datasetDragGhostKey = datasetDraggingKey + 'Ghost'

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
    this.options = assign(
      this.options,
      pick(options, [
        'name',
        'containment',
        'axis',
        'callback',
        'debug',
        'align'
      ])
    )
  }

  start (...args) {
    super.start(...args)
    let [
      {
        event: { currentTarget, offsetX, offsetY }
      }
    ] = args
    let { offsetWidth, offsetHeight } = currentTarget
    // 算光标到元素中心的偏移量
    this.fixMouseoffset = [
      offsetWidth / 2 - offsetX,
      offsetHeight / 2 - offsetY
    ]

    // 找出被拖动元素的所在容器。优先用传入的 containment
    this.container = this.options.containment
      ? getHtmlElement(this.options.containment)
      : getHtmlElement(this.context)

    // 找出被拖动元素的索引
    this.dragElementIndex = [...this.getElements()].indexOf(currentTarget)
    if (this.dragElementIndex < 0) {
      throw new Error('missing dragging element in elements')
    }

    // 避免拖动完成后的原生动画
    document.addEventListener('dragover', preventDragOverDefault)

    // 加上拖动中标记，用于匹配css
    currentTarget.dataset[datasetDraggingKey] = ''
    // document.body.dataset[datasetDraggingKey] = ''
    document.body.classList.add(kebabCase(datasetDraggingKey))

    // 拖动完成后，如果拖动回调还没完成就不用再等了
    this.cancelSource = getCancelSource(this)
    this.isWaitingCallbackConfirm = undefined

    // 计算热区
    this.updateHotRects()

    // 下一帧再加上 ghost 样式，避免拖动的 snapshot 也是 ghost 样式
    requestAnimationFrame(function () {
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
      hotRectExtra[this.options.axis],
      this.options.axis
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

  async drag ({ event: { pageX, pageY } }) {
    // 有transition的话需要等动画完成后才认为完成拖动
    // 前一次拖动回调完成后才能进去下一次
    if (this.isWaitingCallbackConfirm) {
      return
    }

    // 鼠标相对视口的坐标
    let point = calculatePotins(
      [
        [pageX, pageY],
        [window.scrollX, window.scrollY],
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
    if (!includes([fromIndex, fromIndex + 1], toIndex)) {
      // 标记一下开始回调
      this.isWaitingCallbackConfirm = true
      let callbackPromise = Promise.race([
        this.options.callback(toIndex, fromIndex),
        this.cancelSource.promise
      ])
        .catch(() => false)
        .finally(() => {
          this.isWaitingCallbackConfirm = undefined
        })
      // 如果回调 false 表示这次拖动不生效
      if ((await callbackPromise) !== false) {
        // 拖动成功后，更新下当前拖动元素索引
        this.dragElementIndex = toIndex > fromIndex ? toIndex - 1 : toIndex
        // 元素列表变了，热区也要更新下（需要等DOM更新了
        Vue.nextTick(() => this.updateHotRects())
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
    if (this.cancelSource) {
      this.cancelSource.cancel()
    }
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

function getHotRects (elements, container, hotExtra, axis) {
  // TODO: rtl
  const [top, bottom, leading, trailing] = exchangeAxisValues(
    ['top', 'bottom', 'left', 'right'],
    axis
  )
  const hotExtraValues = zip(
    hotExtra.map(val => val * -1),
    hotExtra
  ).reduce((ret, values) => ret.concat(values))
  const containerBoundary = container.getBoundingClientRect()

  const elementRects = [...elements].map(function (el) {
    return el.getBoundingClientRect()
  })

  // 找出换行的 index，切成行，按行处理热区
  const breakIndices = elementRects
    .reduce(
      function (indices, current, i) {
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
    .reduce(function (rows, breakIndex, i) {
      rows.push(elementRects.slice(breakIndices[i], breakIndex))
      return rows
    }, [])
    .map(function (rects) {
      let rowCount = rects.length
      let first = rects[0]
      let last = rects[rects.length - 1]
      rects.unshift({
        [top]: first[top],
        [bottom]: first[bottom],
        [trailing]: containerBoundary[leading] // 前一个的右边是后一个的左边
      })
      rects.push({
        [top]: last[top],
        [bottom]: last[bottom],
        [leading]: containerBoundary[trailing]
      })

      rects = rects.slice(1).map(function (current, i) {
        let prev = rects[i]
        return exchangeAxisValues(
          [
            prev[trailing],
            current[leading],
            Math.min(prev[top], current[top]),
            Math.max(prev[bottom], current[bottom])
          ],
          axis
        )
          .map((val, i) => val + hotExtraValues[i])
          .concat(count + i)
      })
      count += rowCount
      return rects
    })
    .reduce(function (rects, row) {
      return rects.concat(row)
    }, [])

  return hotRects
}

function findInsertIndexByMousePointFromHotRect ([x, y], hotRects) {
  let rect = find(hotRects, function ([x1, x2, y1, y2]) {
    return x >= x1 && x <= x2 && y >= y1 && y <= y2
  })
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

  hotRects.forEach(function ([x1, x2, y1, y2, i]) {
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

function calculatePotins (points, calc) {
  return zip(...points).map(values => calc(...values))
}

function getCancelSource (context) {
  return new (class {
    constructor () {
      let promise = new Promise((resolve, reject) => {
        this._reject = reject
      })
      this.promise = promise.catch(err => {
        // 只有在等待回调时才抛错，用于取消等待
        // 其它时候抛错会在 console 里输出 Uncaught promise error
        if (context.isWaitingCallbackConfirm) {
          throw err
        }
      })
    }

    cancel (...args) {
      this._reject(...args)
    }
  })()
}
