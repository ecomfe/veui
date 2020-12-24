import { find, pick, assign, isEqual, includes } from 'lodash'
import BaseHandler from './BaseHandler'

// TODO: default config。2p 是多少？
const hotRectExtra = {
  x: [10, 0],
  y: [0, 10]
}

const classPrefix = `${process.env.VEUI_PREFIX ||
  process.env.VUE_APP_VEUI_PREFIX}drag-sort-`
const draggingClass = `${classPrefix}dragging`
const styleId = `${classPrefix}style`

export default class SortHandler extends BaseHandler {
  constructor (options, context, vnode) {
    super(options, context)

    if (!document.getElementById(styleId)) {
      let style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        [data-drag-sort] {cursor: grab}
        .${draggingClass}, [data-drag-sort-dragging] {cursor: grabbing}
      `
      document.head.appendChild(style)
    }

    // console.log(vnode)
    vnode.elm.dataset.dragSort = this.options.name
    vnode.elm.draggable = true

    this.dragOverHandler = evt => evt.preventDefault()
  }

  setOptions (options) {
    if (isEqual(this.options, options)) {
      return
    }

    super.setOptions(options)
    this.options = assign(
      this.options,
      pick(options, ['name', 'containment', 'axis', 'callback', 'debug'])
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
    this.fixMouseoffset = [
      offsetX - offsetWidth / 2,
      offsetY - offsetHeight / 2
    ]

    // let container = this.options.containment?.$el || this.options.containment || this.context.$el || this.context
    let container =
      (this.options.containment && this.options.containment.$el) ||
      this.options.containment ||
      this.context.$el ||
      this.context
    this.container = container

    document.addEventListener('dragover', this.dragOverHandler)
    document.body.classList.add(draggingClass)
    currentTarget.dataset.dragSortDragging = true

    let elements = container.querySelectorAll(
      `[data-drag-sort="${this.options.name}"]`
    )
    if (!elements.length) {
      throw new Error('no matched elements, cancel drag')
    }
    let dragElementIndex = [...elements].indexOf(currentTarget)
    if (dragElementIndex < 0) {
      throw new Error('no drag element in elements, cancel drag')
    }

    this.dragElementIndex = dragElementIndex
    this.lastElementIndex = elements.length - 1
    this.updateHotRects(elements)

    setTimeout(function () {
      currentTarget.dataset.draggingGhost = true
    }, 0)
  }

  updateHotRects (elements) {
    if (!elements) {
      elements = this.container.querySelectorAll(
        `[data-drag-sort="${this.options.name}"]`
      )
    }
    let hotRects = getHotRects(
      elements,
      this.container,
      hotRectExtra[this.options.axis]
    )
    if (process.env.NODE_ENV === 'development' && this.options.debug) {
      let id = `${draggingClass}debug-layer`
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

  drag ({ event: { pageX, pageY } }) {
    let [x, y] = [pageX - window.pageXOffset, pageY - window.pageYOffset]
    let toIndex = findInsertIndexByMousePointFromHotRect([x, y], this.hotRects)
    // The drag event is fired every few hundred milliseconds as an element or text selection is being dragged by the user.
    // 但是这里如果一直触发回调就比较奇怪，所以判断下，变了才触发
    if (toIndex >= 0 && toIndex !== this.prevInsertIndex) {
      let fromIndex = this.dragElementIndex
      if (!includes([fromIndex, fromIndex + 1], toIndex)) {
        if (this.options.callback(toIndex, fromIndex) !== false) {
          this.dragElementIndex = toIndex > fromIndex ? toIndex - 1 : toIndex
          setTimeout(() => this.updateHotRects(), 0)
        }
      }
      this.prevInsertIndex = toIndex
    }
  }

  end (...args) {
    super.end(...args)
    let [
      {
        event: { currentTarget }
      }
    ] = args
    console.log('dragend')
    delete currentTarget.dataset.draggingGhost
    document.removeEventListener('dragover', this.dragOverHandler)
    document.body.classList.remove(draggingClass)
    delete currentTarget.dataset.dragSortDragging
  }

  reset () {}

  destroy () {}
}

function getHotRects (elements, container, hotExtra) {
  let containerBoundary = container.getBoundingClientRect()

  let elementRects = [...elements].map(function (el) {
    // TODO: 如果要考虑container滚动场景的话，这里就不能用 getBoundingClientRect 了
    return el.getBoundingClientRect()
  })

  // 找出换行的 index，切成行，按行处理热区
  let breakIndices = elementRects
    .reduce(
      function (indices, current, i) {
        if (i === 0) {
          return indices
        }

        // TODO: axis
        let prev = elementRects[i - 1]
        if (current.left > prev.left) {
          return indices
        }

        return indices.concat(i)
      },
      [0]
    )
    .concat(elementRects.length)

  let count = 0
  let hotRects = breakIndices
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
        top: first.top,
        bottom: first.bottom,
        right: containerBoundary.left
      })
      rects.push({
        top: last.top,
        bottom: last.bottom,
        left: containerBoundary.right
      })
      rects = rects.slice(1).map(function (current, i) {
        // TODO: axis
        let prev = rects[i]
        return [
          prev.right - hotExtra[0],
          current.left + hotExtra[0],
          Math.min(prev.top, current.top) - hotExtra[1],
          Math.max(prev.bottom, current.bottom) + hotExtra[1],
          count + i
        ]
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

function getHotRectsDebugLayer (hotRects, containerBoundary) {
  let layer = document.createElement('div')
  layer.style.position = 'fixed'
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
