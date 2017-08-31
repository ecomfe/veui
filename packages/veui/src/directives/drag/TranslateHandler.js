import { find, pick } from 'lodash'
import BaseHandler from './BaseHandler'
import { getNodes } from '../../utils/context'
import config from '../../managers/config'

let computedStyle = getComputedStyle(document.body)
const TRANSFORM_ACCESSOR = find(
  ['transform', '-ms-transform', '-moz-transform', '-webkit-transform'],
  accessor => (accessor in computedStyle)
)

function getComputedTransform (elm) {
  return getComputedStyle(elm)[TRANSFORM_ACCESSOR]
}

export default class TranslateHandler extends BaseHandler {

  refs = []

  containment = null

  oldStyles = []

  elms = []

  initialStyles = []

  initialTransforms = []

  initialPositions = []

  axis = null

  tempStyle = `
    user-select:none;-ms-user-select:none;-webkit-user-select:none;-moz-user-select:none;
    transition:unset;
    animation:unset;-ms-animation:unset;-webkit-animation:unset;-moz-animation:unset
  `

  start () {
    // oldStyles 仅初始化一次
    if (this.oldStyles.length === 0) {
      this.elms = this.options.targets.reduce((prev, cur) => {
        prev.push(...getNodes(cur, this.context))
        return prev
      }, [])
      this.oldStyles = this.elms.map(elm => elm.getAttribute('style') || '')
    }

    this.elms.forEach((elm, index) => {
      let oldStyle = this.oldStyles[index]
      let initialTransform = getComputedTransform(elm)
      this.initialTransforms[index] = initialTransform === 'none' ? '' : getComputedTransform(elm)
      this.initialStyles[index] = `${oldStyle};${this.tempStyle}`

      let rect = elm.getBoundingClientRect()
      this.initialPositions[index] = rect
    })
  }

  drag ({ distanceX, distanceY }) {
    this.move(distanceX, distanceY, this.initialStyles)
  }

  end ({ distanceX, distanceY }) {
    this.move(distanceX, distanceY, this.oldStyles)
    this.initialTransforms = []
    this.initialStyles = []
  }

  move (distanceX, distanceY, prevStyles) {
    // 统一转换成 { left: ..., top: ..., width: ..., height: ... } 形式的 rect
    let options = this.options
    let constraint = null
    if (options.containment && options.containment.nodeType) {
      constraint = pick(options.containment.getBoundingClientRect(), ['top', 'left', 'right', 'bottom'])
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
      let prevStyle = prevStyles[index]
      let initialTransform = this.initialTransforms[index]
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
          if (initialPosition.top + offsetHeight + realDistanceY > constraint.top + constraint.height) {
            realDistanceY = constraint.top + constraint.height - (initialPosition.top + offsetHeight)
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
          if (initialPosition.left + offsetWidth + realDistanceX > constraint.left + constraint.width) {
            realDistanceX = constraint.left + constraint.width - (initialPosition.left + offsetWidth)
          }
        } else {
          realDistanceX = 0
        }
      }
      elm.setAttribute('style', `${prevStyle};${TRANSFORM_ACCESSOR}:${initialTransform} translate(${realDistanceX}px,${realDistanceY}px)`)
    })
  }

  destroy () {
    // 恢复最初的样式
    this.elms.forEach((elm, index) => {
      let oldStyle = this.oldStyles[index]
      elm.setAttribute('style', oldStyle)
    })
  }
}
