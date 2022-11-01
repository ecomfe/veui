// 目前需求比较简单，简单实现下。如果需要完备实现可以引入 detect-browser
export function isFirefox () {
  if (process.env.VUE_ENV === 'server') {
    return false
  }
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1
}

export function isSafari () {
  if (process.env.VUE_ENV === 'server') {
    return false
  }
  return /apple/i.test(navigator.vendor)
}
