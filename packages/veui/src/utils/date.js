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
  let srcData = toDateData(src)
  let targetData = toDateData(target)
  return (
    srcData.date === targetData.date &&
    srcData.month === targetData.month &&
    srcData.year === targetData.year
  )
}

export function isInRange (day, range) {
  return includes(range.map(toDate), toDate(day))
}

function prepareRanges (range) {
  if (!Array.isArray(range[0])) {
    range = [range]
  }

  return range.map(r => r.map(toDate).sort((d1, d2) => d1 - d2))
}

export function mergeRange (r1, r2, mode = 'xor') {
  return merge(prepareRanges(r1), prepareRanges(r2), { inc: addDays, mode })
}

const ONE_DAY = 24 * 60 * 60 * 1000

function addDays (date, days) {
  return new Date(date - 0 + days * ONE_DAY)
}
