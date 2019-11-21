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
    month: addMonths,
    date: addDays,
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
