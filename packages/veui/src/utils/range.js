import { flatten, cloneDeep } from 'lodash'

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

const DEFAULT_INC = function (val, increment = 1) {
  return val + increment
}

const MERGE_FNS = {
  xor: xorRanges,
  union: unionRanges,
  substract: substractRanges
}

export function merge (r1, r2, { compare = DEFAULT_COMPARE, inc = DEFAULT_INC, mode = 'xor' } = {}) {
  if (!Array.isArray(r1[0])) {
    r1 = r1[0] != null ? [r1] : []
  }
  if (!Array.isArray(r2[0])) {
    r2 = r2[0] != null ? [r2] : []
  }
  return MERGE_FNS[mode](cloneDeep(r1), cloneDeep(r2), { compare, inc })
}

function xorRanges (
  r1,
  r2,
  { compare, inc }
) {
  r1 = flatten(r1).sort(compare)
  r2 = flatten(r2).sort(compare)

  let range = [...r1, ...r2].sort(compare).map((value, i) => {
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
      range[i * 2] - inc(range[i * 2 - 1], 1) === 0
    ) {
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

function unionRanges (
  r1,
  r2,
  { compare, inc }
) {
  let ranges = [...r1, ...r2].sort((ra, rb) => compare(ra[0], rb[0]))

  return ranges.reduce((union, range) => {
    let head = union[union.length - 1]

    if (!head) {
      union.push(range)
      return union
    }

    let isAdjacent = inc(head[1], 1) - range[0] === 0

    // not overlapping
    if (head[1] - range[0] < 0 && !isAdjacent) {
      union.push(range)
      return union
    }

    // overlapping or adjacent
    if (range[1] - head[1] > 0 || isAdjacent) {
      head[1] = range[1]
    }
    return union
  }, [])
}

function substractRanges (
  r1,
  r2,
  { compare, inc }
) {
  if (r1.length === 0) {
    return []
  }
  r1 = sortRanges(r1, compare)
  r2 = sortRanges(r2, compare)

  let i1 = 0
  let i2 = 0
  let result = []
  while (i1 < r1.length || i2 < r2.length) {
    let c1 = r1[i1]
    let c2 = r2[i2]
    if (c1 && c2) {
      let c1 = r1[i1]
      let c2 = r2[i2]
      if (c1[0] - c2[0] === 0) {
        c1[0] = c2[0] = inc((c1[1] - c2[1] > 0 ? c2[1] : c1[1]), 1)
        if (c1[1] - c1[0] < 0) {
          i1++
        } else {
          i2++
        }
      } else if (c1[0] - c2[0] < 0) {
        if (c1[1] - c2[0] < 0) {
          result.push(c1)
          i1++
        } else {
          result.push([c1[0], inc(c2[0], -1)])
          c1[0] = c2[0]
        }
      } else {
        if (c2[1] - c1[0] < 0) {
          i2++
        } else {
          c2[0] = c1[0]
        }
      }
    } else {
      if (c1 && !c2) {
        result = [...result, ...r1.slice(i1)]
      }
      break
    }
  }

  return result
}

function sortRanges (ranges, compare) {
  return [...ranges].sort((ra, rb) => compare(ra[0], rb[0]))
}
