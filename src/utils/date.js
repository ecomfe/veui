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
  if (date instanceof Date) {
    return {
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear()
    }
  }
  return date
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
