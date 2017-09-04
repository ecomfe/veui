import { find, pick, assign, isEqual } from 'lodash'
import BaseHandler from './BaseHandler'
import { getNodes } from '../../utils/context'
import config from '../../managers/config'

let computedStyle = getComputedStyle(document.body)
const TRANSFORM_ACCESSOR = find(
  ['transform', '-ms-transform', '-moz-transform', '-webkit-transform'],
  accessor => (accessor in computedStyle)
)

const TRANSFORM_REGEXP = new RegExp(`;*${TRANSFORM_ACCESSOR}:.*?;`, 'g')

function getComputedTransform (elm) {
  return getComputedStyle(elm)[TRANSFORM_ACCESSOR]
}

export default class TranslateHandler extends BaseHandler {
  elms = []

  initialStyles = []

  initialTransforms = []

  initialPositions = []

  totalDistanceX = 0

  totalDistanceY = 0

  tempStyle = `
    user-select:none;-ms-user-select:none;-webkit-user-select:none;-moz-user-select:none;
    transition:unset;
    animation:unset;-ms-animation:unset;-webkit-animation:unset;-moz-animation:unset
  `

  setOptions (options) {
    if (isEqual(this.options, options)) {
      return
    }

    super.setOptions(options)
    this.options = assign(this.options, pick(options, ['targets', 'containment', 'axis']))
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

    this.elms.forEach((elm, index) => {
      let initialTransform = getComputedTransform(elm)
      this.initialTransforms[index] = initialTransform === 'none' ? '' : initialTransform

      let elmStyle = elm.getAttribute('style') || ''
      this.initialStyles[index] = elmStyle.replace(TRANSFORM_REGEXP, ';')
      elm.setAttribute('style', elmStyle + ';' + this.tempStyle)

      let rect = elm.getBoundingClientRect()
      this.initialPositions[index] = rect
    })
  }

  drag ({ distanceX, distanceY }) {
    super.drag()

    this.move(distanceX, distanceY, this.tempStyle)
  }

  end ({ distanceX, distanceY }) {
    super.end()

    this.move(distanceX, distanceY)
    this.initialTransforms = []
    this.initialStyles = []
  }

  move (distanceX, distanceY, extraStyle = '') {
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
      let initialStyle = this.initialStyles[index] || ''
      let initialTransform = this.initialTransforms[index] || ''
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
      elm.setAttribute('style', `${initialStyle};${extraStyle};${TRANSFORM_ACCESSOR}:${initialTransform} translate(${realDistanceX}px,${realDistanceY}px);`)

      this.totalDistanceX = realDistanceX
      this.totalDistanceY = realDistanceY
    })
  }

  reset () {
    // 恢复最初的样式
    this.elms.forEach(elm => {
      let initialTransform = getComputedTransform(elm)
      let transformStyle = initialTransform === 'none' ? '' : initialTransform + ` translate(${-this.totalDistanceX}px,${-this.totalDistanceY}px);`
      elm.setAttribute('style', elm.getAttribute('style').replace(TRANSFORM_REGEXP, ';') + `;${TRANSFORM_ACCESSOR}:${transformStyle}`)
    })
  }
}
