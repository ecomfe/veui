import {
  padStart,
  map,
  includes,
  findIndex,
  findLastIndex,
  intersection,
  union
} from 'lodash'

const isArray = Array.isArray

/**
 * @enum {number}
 */
const MergeOp = {
  NONE: 0,
  INTERSECTION: 1,
  UNION: 2
}

const { NONE, INTERSECTION, UNION } = MergeOp

export default class TimePickerUtil {
  datasource = null // [ [1, 2, 3], [1, 2, 3] ]
  min = null
  max = null

  available = null // [ [1, 2, 3], [1, 2, 3] ]

  /**
   * @typedef TimePickerUtilOptions
   * @type {Object}
   * @property {!Array<Array<number>>} datasource 时间选项的二维数组
   * @property {Array<number>=} min 最小值
   * @property {Array<number>=} max 最大值
   */

  constructor (options) {
    if (options) {
      this.setOptions(options)
    }
  }

  /**
   * 修改 util 的配置
   * @param {TimePickerUtilOptions} options 配置
   * @return {TimePickerUtil} this
   */
  setOptions ({ datasource, min, max }) {
    if (
      !isArray(datasource) ||
      !datasource.length ||
      datasource.some(i => !isArray(i))
    ) {
      throw new Error('datasource array required')
    }

    this.datasource = map(datasource, i => i.sort((a, b) => (a > b ? 1 : -1)))
    this.min = min || datasource.map(i => -Infinity)
    this.max = max || datasource.map(i => Infinity)
    // null 表示尚未计算
    this.available = null
    return this
  }

  /**
   * 这个可以和 getMaxTime 合并到一起，但是感觉可读性下降很多
   * 计算最小的时间, 这个时间有可能是超过的最大值：
   *  对于 datasource ： [ [1, 2, 3], [4, 5, 6], [7, 8, 9] ], min：[2, 3, 8]
   *  1：第一位选取 2，等于对应的最值 2 ，prevEdge 是 true
   *  2：因为 prevEdge 是 true， 所以选择大于 3 的值即 4, prevEdge是 false
   *  3：因为 prevEdge 是 false，直接选取 0 处值，即 7
   *  得到结果：[2, 4, 7]
   * @param {number} index 内部递归的位置
   * @param {boolean} prevEdge 内部递归的状态，表示之前选取是贴着最小值的
   * @return {?Array<number>} 没有值返回 null
   */
  getMinTime (index = 0, prevEdge) {
    if (!index) {
      prevEdge = true
    }
    let source = this.datasource[index]
    // 根据上层选取的情况来决定决定本次选取的位置
    let start = prevEdge ? findIndex(source, i => i >= this.min[index]) : 0
    if (start > -1) {
      let val = source[start]
      // 上层贴着，本层值和最值相等，那么本层才是贴着最值得
      let selfEdge = prevEdge && val === this.min[index]
      if (index + 1 < this.datasource.length) {
        // 还有下层，递归下，下层返回 null 表示下层选取失败了
        let childResult = this.getMinTime(index + 1, selfEdge)
        if (childResult) {
          return [source[start], ...childResult]
        }

        // 本层是贴着最小值，但下层没有找到，那么本层：
        //   1. 试着不贴，因为不贴了，下层会直接选取0处值，所以肯定会成功的
        //   2. 本层贴着已经是可选值中最大的了，那么返回 undefined，让上层来处理
        if (selfEdge && start + 1 < source.length) {
          return [source[start + 1], ...this.getMinTime(index + 1, false)]
        }
      } else {
        // 本层已经是最后一层了，直接返回本层的结果
        return [source[start]]
      }
    }
    // 本次没有可选值，直接返回 null，让上层来处理
    return null
  }

  getMaxTime (index = 0, prevEdge = false) {
    if (!index) {
      prevEdge = true
    }
    let source = this.datasource[index]
    let start = prevEdge
      ? findLastIndex(source, i => i <= this.max[index])
      : source.length - 1
    if (start > -1) {
      let val = source[start]
      let selfEdge = prevEdge && val === this.max[index]
      if (index + 1 < this.datasource.length) {
        let childResult = this.getMaxTime(index + 1, selfEdge)
        if (childResult) {
          return [source[start], ...childResult]
        }

        if (selfEdge && start - 1 >= 0) {
          return [source[start - 1], ...this.getMaxTime(index + 1, false)]
        }
      } else {
        return [source[start]]
      }
    }
    return null
  }

  updateAvailable () {
    let min = (this.aMin = this.getMinTime())
    if (!min || !this.isAvailable(min)) {
      this.available = []
    } else {
      // 最小值选取成功了，那么最大值也一定能取到
      let max = this.getMaxTime()
      this.available = this.calcAvailable(min, max, NONE)
    }
    return this.available
  }

  /**
   * 获取可用的数据
   * @public
   * @return {Array} 可用的数据
   */
  getAvailable () {
    if (!this.available) {
      this.updateAvailable()
    }
    return this.available
  }

  /**
   * 通过两个最值来计算每个部分的可选值
   * @protected
   * @param {Array<number>} minTime getMinTime 计算出来的最小值（要保证合法）
   * @param {Array<number>} maxTime getMaxTime 计算出来的最大值（要保证合法）
   * @param {MergeOp} prevOp 上层对下层如何合并的要求
   * @param {number} index 内部递归的位置
   * @return {Array<Array<number>>} available
   */
  calcAvailable (minTime, maxTime, prevOp, index = 0) {
    let min = minTime[index]
    let max = maxTime[index]
    let source = this.datasource[index]
    let op = NONE
    let result = []
    let hasNext = index + 1 < this.datasource.length
    if (!index) {
      result = source.filter(i => i >= min && i <= max)
      // 0处只有一个值，下层要取交集；0处有两个值，下层要取并集，否则下层取 datasource 中所有值
      if (hasNext) {
        // eslint-disable-next-line no-sparse-arrays
        op = [, INTERSECTION, UNION][result.length] || NONE
      }
    } else if (prevOp === NONE) {
      result = source
    } else {
      let rangeFromMin = source.filter(i => i >= min)
      let rangeFromMax = source.filter(i => i <= max)
      if (prevOp === INTERSECTION) {
        result = intersection(rangeFromMin, rangeFromMax).sort((a, b) =>
          a > b ? 1 : -1
        )

        if (hasNext) {
          // 1: *──*
          // 2: * ──*
          //     \──*
          // eslint-disable-next-line no-sparse-arrays
          op = [, INTERSECTION, UNION][result.length] || NONE
        }
      } else {
        result = union(rangeFromMin, rangeFromMax).sort((a, b) =>
          a > b ? 1 : -1
        )
        if (hasNext) {
          if (result.length === 1) {
            // *── *
            // *──/
            op = UNION
          } else if (
            intersection(result, rangeFromMin) === 1 &&
            intersection(result, rangeFromMax) === 1
          ) {
            // *──*
            // *──*
            op = UNION
          }
        }
      }
    }
    if (hasNext) {
      return [result, ...this.calcAvailable(minTime, maxTime, op, index + 1)]
    } else {
      return [result]
    }
  }

  /**
   * 验证时间的合法性：1. 满足最值限制 2. 必须在时间选项中（可选）
   * @public
   * @param {!Array<number>} time 被验证的时间
   * @param {boolean} checkInDatasource 是否要验证在时间选项中
   * @return {boolean} 结果
   */
  isAvailable (time, checkInDatasource) {
    let valid = true
    if (checkInDatasource) {
      if (!this.available) {
        this.updateAvailable()
      }
      valid = time.every((i, idx) => includes(this.available[idx], i))
    }
    if (valid) {
      let timeNum = timeToNumber(time)
      valid =
        timeNum >= timeToNumber(this.min) && timeNum <= timeToNumber(this.max)
    }
    return valid
  }

  /**
   * 获取指定位置值固定的最小值，如在 available 中寻找 [*, 4, *] 1位是 4 的最小合法值
   * @public
   * @param {number} index 指定位置
   * @param {number} val 值
   * @return {?Array<number>} 返回找到的最小值或null
   */
  getMinimumTimeOfIndex (index, val) {
    if (!this.available) {
      this.updateAvailable()
    }

    if (!includes(this.available[index], val)) {
      return null
    }

    let min = [...this.aMin]
    min[index] = val
    if (val !== this.aMin[index]) {
      let idx = index
      while (++idx < this.datasource.length) {
        min[idx] = this.available[idx][0]
      }
    }
    if (val < this.aMin[index]) {
      while (index--) {
        let idx = findIndex(this.available[index], i => i === this.aMin[index])
        if (idx < this.available[index].length - 1) {
          min[index] = this.available[index][idx + 1]
          break
        } else if (index) {
          // 非0处的最后一个了
          min[index] = this.available[index][0]
        } else {
          // 0处的最后一个了,找不到了
          return null
        }
      }
    }

    if (this.isAvailable(min)) {
      return min
    }
    return null
  }
}

function timeToNumber (time) {
  return includes([-Infinity, Infinity], time[0])
    ? time[0]
    : parseInt(time.map(i => padStart(i, 2, '0')).join(''), 10)
}
