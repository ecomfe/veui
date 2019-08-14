import {
  padStart,
  map,
  includes,
  last,
  first,
  findIndex,
  findLastIndex
} from 'lodash'

const isArray = Array.isArray

const timeToNumber = time => {
  return includes([-Infinity, Infinity], time[0])
    ? time[0]
    : parseInt(time.map(i => padStart(i, 2, '0')).join(''), 10)
}

const matchEdge = (prev, edge) => {
  // prev 是空数组，那么可以返回true，即 idx === 0
  return prev.every((i, index) => i === edge[index])
}

export default class TimePickerUtil {
  datasource = null; // [ [1, 2, 3], [1, 2, 3] ]
  min = null;
  max = null;

  available = null; // [ [1, 2, 3], [1, 2, 3] ]

  constructor (options) {
    if (options) {
      this.setOptions(options)
    }
  }

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
    this.available = null
    return this
  }

  getIndexOnPrevMatch (bottom, prevAvailable, idx) {
    let ds = this.datasource
    const prevPicker = bottom ? first : last
    const curPicker = prevPicker
    const afterPicker = bottom ? last : first
    const curEdge = bottom ? this.min : this.max
    const afterEdge = bottom ? this.max : this.min
    const fastIdx = bottom ? 0 : ds[idx].length - 1

    let curMatch = false
    let edgeTime = ds.reduce((result, i, index) => {
      if (!result) {
        return result
      }
      let cur
      if (index < idx) {
        cur = prevPicker(prevAvailable[index])
      } else if (index === idx) {
        curMatch = matchEdge(result, curEdge)
        cur = curPicker(
          curMatch
            ? i.filter(item =>
              bottom ? item >= curEdge[index] : item <= curEdge[index]
            )
            : i
        )
      } else {
        cur = afterPicker(
          matchEdge(result, afterEdge)
            ? i.filter(item =>
              bottom ? item <= afterEdge[index] : item >= afterEdge[index]
            )
            : i
        )
      }
      // idx === 0 上面两种情况可能会filter不到，因为0是假定前面的虚拟位满足三位一体
      if (cur == null) {
        return null
      }
      result.push(cur)
      return result
    }, [])
    // 只有idx = 0 才会找不到，因为其他都是前面找到的情况下，前面存在，这里肯定能找到
    if (!edgeTime) {
      return -1
    }
    if (!curMatch) {
      return fastIdx
    }
    let inRange = this.isAvailable(edgeTime)
    return bottom
      ? findIndex(ds[idx], i =>
        inRange ? i >= curEdge[idx] : i > curEdge[idx]
      )
      : findLastIndex(ds[idx], i =>
        inRange ? i <= curEdge[idx] : i < curEdge[idx]
      )
  }

  getIndexOnPrevMatchBottom (prevAvailable, idx) {
    return this.getIndexOnPrevMatch(true, prevAvailable, idx)
  }

  getIndexOnPrevMatchTop (prevAvailable, idx) {
    return this.getIndexOnPrevMatch(false, prevAvailable, idx)
  }

  getAvailableDatasourceIdx (prevAvailable, idx) {
    // 前面都没有找到，后面都不可用
    let ds = this.datasource
    let available = (minIdx, maxIdx) => ds[idx].slice(minIdx, maxIdx + 1)

    if (idx) {
      let prev = prevAvailable[idx - 1]
      if (!prev.length) {
        return []
      }
      let mul = prevAvailable.reduce((result, i) => result * i.length, 1)
      let allLess2 = prevAvailable.every(i => i <= 2)
      if (!allLess2 && mul >= 3) {
        return ds[idx]
      }
      // 4维不支持
      if (idx >= 3) {
        throw new Error('not support')
      }
      if (mul >= 2) {
        available = (minIdx, maxIdx) => {
          if (minIdx <= maxIdx) {
            return ds[idx]
          }
          let result = ds[idx].slice()
          result.splice(maxIdx + 1, minIdx - maxIdx - 1)
          return result
        }
      }
      if (mul === 4) {
        let minInRange = this.isAvailable([
          ...prevAvailable.map(i => first(i)),
          last(ds[idx])
        ])
        let maxInRange = this.isAvailable([
          ...prevAvailable.map(i => last(i)),
          first(ds[idx])
        ])
        if (!minInRange && !maxInRange) {
          return available(
            this.getIndexOnPrevMatchBottom(
              [first(prevAvailable[0]), last(prevAvailable[1])],
              idx
            ),
            this.getIndexOnPrevMatchTop(
              [last(prevAvailable[0]), first(prevAvailable[1])],
              idx
            )
          )
        }
        return ds[idx]
      }
    }
    let minIdx = this.getIndexOnPrevMatchBottom(prevAvailable, idx)
    let maxIdx = this.getIndexOnPrevMatchTop(prevAvailable, idx)
    return minIdx === -1 || maxIdx === -1 ? [] : available(minIdx, maxIdx)
  }

  getAvailableDatasource () {
    let ds = this.datasource
    this.available = ds.reduce((result, i, idx) => {
      result.push(this.getAvailableDatasourceIdx(result, idx))
      return result
    }, [])
    return this.available
  }

  isAvailable (time, checkInDatasource) {
    let valid = true
    if (checkInDatasource) {
      valid = time.every((i, idx) => includes(this.available[idx], i))
    }
    if (valid) {
      let timeNum = timeToNumber(time)
      valid =
        timeNum >= timeToNumber(this.min) && timeNum <= timeToNumber(this.max)
    }
    return valid
  }

  getMinimumTimeOfIndex (index, val) {
    if (!this.available) {
      this.available = this.getAvailableDatasource()
    }
    if (!includes(this.available[index], val)) {
      return null
    }
    if (!index && val !== this.min[index]) {
      return this.available.map((i, idx) => (idx ? i[0] : val))
    }
    return this.getMinimum(index, val)
  }

  getMinimum (index, val, prev = []) {
    let avail = this.available
    let end = avail.length - prev.length === 1
    if (prev.length === index) {
      return end ? [...prev, val] : this.getMinimum(index, val, [...prev, val])
    } else {
      let curIdx = prev.length
      let prevFirst = [...prev, first(avail[curIdx])]
      prevFirst = end ? prevFirst : this.getMinimum(index, val, prevFirst)
      let prevLast = [...prev, last(avail[curIdx])]
      prevLast = end ? prevLast : this.getMinimum(index, val, prevLast)

      let minInRange = prevFirst && this.isAvailable(prevFirst)
      let maxInRange = prevLast && this.isAvailable(prevLast)
      if (!minInRange && !maxInRange) {
        return null
      }
      let result = null
      avail[curIdx].some(i => {
        let cur = [...prev, i]
        cur = end ? cur : this.getMinimum(index, val, cur)
        let match = cur && this.isAvailable(cur)
        if (match) {
          result = cur
        }
        return match
      })
      return result
    }
  }
}
