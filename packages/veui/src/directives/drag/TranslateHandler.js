import { find, pick, assign, isEqual } from 'lodash'
import BaseHandler from './BaseHandler'
import { getNodes } from '../../utils/context'
import config from '../../managers/config'

let style =
  process.env.VUE_ENV === 'server'
    ? function () {}
    : document.documentElement.style

const TRANSFORM_ACCESSOR = find(
  ['transform', 'msTransform', 'MozTransform', 'webkitTransform'],
  accessor => accessor in style
)

function getComputedTransform (elm) {
  return getComputedStyle(elm)[TRANSFORM_ACCESSOR]
}

function combineTransform (oldTransform, [x, y]) {
  let transforms = []
  if (oldTransform && oldTransform !== 'none') {
    transforms.push(oldTransform)
  }
  if (x !== 0 || y !== 0) {
    transforms.push(`translate(${x}px,${y}px)`)
  }
  return transforms.join(' ')
}

export default class TranslateHandler extends BaseHandler {
  elms = [];

  originalStyles = [];

  initialStyles = [];

  initialTransforms = [];

  initialPositions = [];

  totalDistanceX = 0;

  totalDistanceY = 0;

  // 是否被拖动过。
  // 只有被拖动过，才记录总的拖动距离
  isDragged = false;

  tempStyle =
    'user-select:none;-ms-user-select:none;-webkit-user-select:none;-moz-user-select:none;' +
    'transition:none;animation:none;-ms-animation:none;-webkit-animation:none;-moz-animation:none';

  setOptions (options) {
    if (isEqual(this.options, options)) {
      return
    }

    super.setOptions(options)
    this.options = assign(
      this.options,
      pick(options, ['targets', 'containment', 'axis'])
    )
    this.elms = []
  }

  start () {
    super.start()

    if (!this.elms || !this.elms.length) {
      this.elms = this.options.targets.reduce((prev, cur) => {
        prev.push(...getNodes(cur, this.context))
        return prev
      }, [])
    }

    if (!this.originalStyles || !this.originalStyles.length) {
      this.originalStyles = this.elms.reduce((prev, cur) => {
        prev.push(cur.getAttribute('style'))
        return prev
      }, [])
    }

    this.elms.forEach((elm, index) => {
      let initialTransform = getComputedTransform(elm)
      this.initialTransforms[index] =
        initialTransform === 'none' ? '' : initialTransform

      let elmStyle = elm.getAttribute('style') || ''
      this.initialStyles[index] = elmStyle
      elm.setAttribute('style', elmStyle + ';' + this.tempStyle)

      let rect = elm.getBoundingClientRect()
      this.initialPositions[index] = rect
    })
  }

  drag ({ distanceX, distanceY }) {
    this.move(
      distanceX,
      distanceY,
      (elm, index, realDistanceX, realDistanceY) => {
        let initialTransform = this.initialTransforms[index] || ''
        elm.style[TRANSFORM_ACCESSOR] = combineTransform(initialTransform, [
          realDistanceX,
          realDistanceY
        ])
      }
    )

    this.isDragged = true
  }

  end ({ distanceX, distanceY }) {
    super.end()

    this.move(
      distanceX,
      distanceY,
      (elm, index, realDistanceX, realDistanceY) => {
        let initialStyle = this.initialStyles[index] || ''
        let initialTransform = this.initialTransforms[index] || ''
        elm.setAttribute('style', initialStyle)
        elm.style[TRANSFORM_ACCESSOR] = combineTransform(initialTransform, [
          realDistanceX,
          realDistanceY
        ])

        if (this.isDragged) {
          this.totalDistanceX += realDistanceX
          this.totalDistanceY += realDistanceY
        }
      }
    )

    this.initialTransforms = []
    this.initialStyles = []
    this.isDragged = false
  }

  move (distanceX, distanceY, render) {
    // 统一转换成 { left: ..., top: ..., width: ..., height: ... } 形式的 rect
    let options = this.options
    let constraint = null
    if (options.containment && options.containment.nodeType) {
      constraint = pick(options.containment.getBoundingClientRect(), [
        'top',
        'left',
        'right',
        'bottom'
      ])
      constraint.width = constraint.right - constraint.left
      constraint.height = constraint.bottom - constraint.top
    } else if (options.containment === `${config.get('drag.prefix')}window`) {
      constraint = {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      }
    } else {
      constraint = options.containment
    }

    this.elms.forEach((elm, index) => {
      let initialPosition = this.initialPositions[index]

      let realDistanceX = distanceX
      let realDistanceY = distanceY
      let offsetWidth = elm.offsetWidth
      let offsetHeight = elm.offsetHeight
      if (constraint) {
        if (!options.axis || options.axis === 'y') {
          // 从上面超出范围了
          if (initialPosition.top + realDistanceY <= constraint.top) {
            realDistanceY = constraint.top - initialPosition.top
          }
          // 从下面超出范围了
          if (
            initialPosition.top + offsetHeight + realDistanceY >
            constraint.top + constraint.height
          ) {
            realDistanceY =
              constraint.top +
              constraint.height -
              (initialPosition.top + offsetHeight)
          }
        } else {
          realDistanceY = 0
        }

        if (!options.axis || options.axis === 'x') {
          // 从左边超出范围了
          if (initialPosition.left + realDistanceX < constraint.left) {
            realDistanceX = constraint.left - initialPosition.left
          }
          // 从右边超出范围了
          if (
            initialPosition.left + offsetWidth + realDistanceX >
            constraint.left + constraint.width
          ) {
            realDistanceX =
              constraint.left +
              constraint.width -
              (initialPosition.left + offsetWidth)
          }
        } else {
          realDistanceX = 0
        }
      } else {
        if (options.axis === 'y') {
          realDistanceX = 0
        } else if (options.axis === 'x') {
          realDistanceY = 0
        }
      }

      render(elm, index, realDistanceX, realDistanceY)
    })
  }

  reset () {
    // 恢复最初的样式
    this.elms.forEach((elm, i) => {
      let style = this.originalStyles[i]
      if (style != null) {
        elm.setAttribute('style', style)
      } else {
        elm.removeAttribute('style')
      }
    })

    this.totalDistanceX = 0
    this.totalDistanceY = 0
  }

  destroy () {}
}
