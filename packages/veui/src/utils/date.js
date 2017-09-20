import { flatten } from 'lodash'

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
  return srcData.date === targetData.date &&
    srcData.month === targetData.month &&
    srcData.year === targetData.year
}

export function isInRange (day, range) {
  if (!range || range.length < 2) {
    return false
  }
  let date = toDate(day)
  let dateRange = range.map(toDate)
  for (let i = 0; i < dateRange.length / 2; i++) {
    if (date - dateRange[i * 2] >= 0 && dateRange[i * 2 + 1] - date >= 0) {
      return true
    }
  }
  return false
}

function compareDate (d1, d2) {
  return d1 - d2
}

export function mergeRange (r1, r2) {
  let dates1 = flatten(r1).sort(compareDate)
  let dates2 = flatten(r2).sort(compareDate)
  let dates = [...dates1, ...dates2]
    .sort(compareDate)
    .map((date, i) => {
      if (isInRange(date, dates1) && isInRange(date, dates2)) {
        return addDays(date, i % 2 ? -1 : 1)
      }
      return date
    })

  for (let i = 0; i < dates.length / 2; i++) {
    if (dates[i * 2 + 1] - dates[i * 2] < 0) {
      dates[i * 2 + 1] = dates[i * 2] = null
    }
    if (dates[i * 2] - addDays(dates[i * 2 - 1], 1) === 0) {
      dates[i * 2] = dates[i * 2 - 1] = null
    }
  }
  dates = dates.filter(date => date !== null)
  let result = []
  while (dates.length) {
    result.push(dates.splice(0, 2))
  }
  return result
}

const ONE_DAY = 24 * 60 * 60 * 1000

function addDays (date, days) {
  return new Date(date - 0 + days * ONE_DAY)
}
