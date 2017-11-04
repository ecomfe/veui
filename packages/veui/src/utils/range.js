import { flatten } from 'lodash'

export function includes (range, value) {
  if (!range || range.length < 2) {
    return false
  }
  for (let i = 0; i < range.length / 2; i++) {
    if (value - range[i * 2] >= 0 && range[i * 2 + 1] - value >= 0) {
      return true
    }
  }
  return false
}

const DEFAULT_COMPARE = function (v1, v2) {
  return v1 - v2
}

const DEFAULT_INC = function (v1, v2) {
  return v1 + v2
}

export function merge (r1, r2, { compare = DEFAULT_COMPARE, inc = DEFAULT_INC } = {}) {
  r1 = flatten(r1).sort(compare)
  r2 = flatten(r2).sort(compare)
  let range = [...r1, ...r2]
    .sort(compare)
    .map((value, i) => {
      if (includes(r1, value) && includes(r2, value)) {
        return inc(value, i % 2 ? -1 : 1)
      }
      return value
    })

  for (let i = 0; i < range.length / 2; i++) {
    if (range[i * 2 + 1] - range[i * 2] < 0) {
      range[i * 2 + 1] = range[i * 2] = null
    } else if (
      range[i * 2 - 1] !== null &&
      range[i * 2] - inc(range[i * 2 - 1], 1) === 0) {
      range[i * 2] = range[i * 2 - 1] = null
    }
  }
  range = range.filter(date => date !== null)
  let result = []
  while (range.length) {
    result.push(range.splice(0, 2))
  }
  return result
}
