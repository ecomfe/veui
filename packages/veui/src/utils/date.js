import { includes, merge } from './range'

export function getDaysInMonth (year, month) {
  let day
  if (year instanceof Date) {
    day = new Date(year)
  } else {
    day = new Date(year, month + 1)
  }
  day.setDate(0)
  return day.getDate()
}

export function toDateData (date) {
  if (typeof date === 'number') {
    date = new Date(date)
  }
  if (date instanceof Date) {
    return {
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear()
    }
  }
  return date
}

export function toDate (date) {
  if (typeof date === 'number') {
    return new Date(date)
  } else if ('date' in date && 'month' in date && 'year' in date) {
    return fromDateData(date)
  }
  return date
}

export function fromDateData ({ year, month, date }) {
  return new Date(year, month, date)
}

export function isSameDay (src, target) {
  if (!src || !target) {
    return false
  }
  if (typeof src === 'number' && typeof target === 'number') {
    return src === target
  }
  if (src instanceof Date && target instanceof Date) {
    return src.getTime() === target.getTime()
  }
  let srcData = toDateData(src)
  let targetData = toDateData(target)
  return (
    srcData.date === targetData.date &&
    srcData.month === targetData.month &&
    srcData.year === targetData.year
  )
}

export function isSameMonth (src, target) {
  if (!src || !target) {
    return false
  }
  let srcData = toDateData(src)
  let targetData = toDateData(target)
  return srcData.year === targetData.year && srcData.month === targetData.month
}

export function isSameYear (src, target) {
  if (!src || !target) {
    return false
  }
  let srcData = toDateData(src)
  let targetData = toDateData(target)
  return srcData.year === targetData.year
}

export function isInRange (day, range) {
  return includes(range.map(toDate), toDate(day))
}

function prepareRanges (range) {
  if (!Array.isArray(range[0])) {
    range = range[0] ? [range] : []
  }

  return range.map(r => r.map(toDate).sort((d1, d2) => d1 - d2))
}

export function mergeRange (r1, r2, type = 'date', mode = 'xor') {
  let inc = {
    date: addDays,
    month: addMonths,
    year: addYears
  }[type]
  return merge(prepareRanges(r1), prepareRanges(r2), { inc, mode })
}

const ONE_DAY = 24 * 60 * 60 * 1000

function addDays (date, days) {
  return new Date(date - 0 + days * ONE_DAY)
}

function addMonths (date, months) {
  let d = new Date(date - 0)
  d.setMonth(d.getMonth() + months)
  return d
}

function addYears (date, years) {
  let d = new Date(date - 0)
  d.setFullYear(d.getFullYear() + years)
  return d
}

const dateReStr = ['(\\d{4})', '(0?[1-9]|1[0-2])', '(0?[1-9]|[12]\\d|3[01])']

function createDateRe (type, sep, strict) {
  let reStr =
    type === 'date'
      ? dateReStr.join(sep)
      : type === 'month'
        ? dateReStr.slice(0, 2).join(sep)
        : dateReStr[0]
  return new RegExp(`^${reStr}${strict ? '$' : '(?:$|' + sep + ')'}`)
}

const components = ['year', 'month', 'date']

function fromArrayToDateData (arr) {
  return arr.reduce((res, part, index) => {
    res[components[index]] = index === 1 ? part - 1 : part
    return res
  }, {})
}

function getDateData (dataStr, re, type) {
  let matches = dataStr.match(re)
  let result = null
  if (matches) {
    matches = matches.slice(1).map(i => +i)
    let [year, month, date] = matches
    if (type === 'date') {
      let d = new Date(year, month - 1, date)
      let valid =
        d.getFullYear() === year &&
        d.getMonth() === month - 1 &&
        d.getDate() === date
      if (valid) {
        result = matches
      }
    } else if (year) {
      result = matches
    }
  }
  return result ? fromArrayToDateData(result) : null
}

export function getExactDateData (dataStr, type, sep) {
  return getDateData(dataStr, createDateRe(type, sep, true), type)
}

export function getLooseDateData (dataStr, type, sep) {
  let types = ['date', 'month', 'year']
  let result = null
  types.some(i => {
    let data = getDateData(dataStr, createDateRe(i, sep, i === type), i)
    if (data) {
      result = data
    }
    return !!data
  })
  return result
}

function dateSubstract (a, b) {
  if (a && b) {
    a = a instanceof Date ? a : new Date(a.year, a.month || 0, a.date || 1)
    b = b instanceof Date ? b : new Date(b.year, b.month || 0, b.date || 1)
    return a - b
  }
  return NaN
}

export function dateGt (a, b) {
  return dateSubstract(a, b) > 0
}

export function dateLt (a, b) {
  return dateSubstract(a, b) < 0
}
