/* eslint-disable no-labels */
import {
  getDaysInMonth,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  addDays,
  addWeeks,
  addMonths,
  addQuarters,
  addYears
} from 'date-fns'
import { includes, merge } from './range'

export function getMonthDays (year, month) {
  return getDaysInMonth(new Date(year, month))
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

  return range.map((r) => r.map(toDate).sort((d1, d2) => d1 - d2))
}

export function mergeRange (r1, r2, type = 'date', mode = 'xor') {
  let inc = {
    date: addDays,
    month: addMonths,
    year: addYears
  }[type]
  return merge(prepareRanges(r1), prepareRanges(r2), { inc, mode })
}

function subtract (a, b) {
  a = a instanceof Date ? a : new Date(a.year, a.month || 0, a.date || 1)
  b = b instanceof Date ? b : new Date(b.year, b.month || 0, b.date || 1)
  return a - b
}

export function gt (a, b) {
  return a && b ? subtract(a, b) > 0 : false
}

export function lt (a, b) {
  return a && b ? subtract(a, b) < 0 : false
}

const START_OF_FN_MAP = {
  day: startOfDay,
  week: startOfWeek,
  month: startOfMonth,
  quarter: startOfQuarter,
  year: startOfYear
}

export function startOf (base, startOf, { weekStartsOn } = {}) {
  const impl = START_OF_FN_MAP[startOf]

  if (!impl) {
    throw new Error(`[veui] Invalid unit for \`startOf\`: ${startOf}`)
  }

  if (startOf === 'week') {
    return impl(base, { weekStartsOn })
  }

  return impl(base)
}

const ADD_FN_MAP = {
  days: addDays,
  weeks: addWeeks,
  months: addMonths,
  quarters: addQuarters,
  years: addYears
}

export function add (base, offset) {
  return Object.keys(offset).reduce((acc, key) => {
    const impl = ADD_FN_MAP[key] || ADD_FN_MAP[`${key}s`]

    if (!impl) {
      throw new Error(`[veui] Invalid unit for \`add\`: ${key}`)
    }

    if (offset[key] !== 0) {
      return impl(acc, offset[key])
    }

    return acc
  }, base)
}
