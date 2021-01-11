function getNavigator (key) {
  // 为了支持 ssr，需要判断下有没有 bom
  return typeof navigator === 'undefined' ? undefined : navigator[key]
}

// 目前需求比较简单，简单实现下。如果需要完备实现可以引入 detect-brower
export function isFirefox () {
  let ua = getNavigator('userAgent')
  return ua ? ua.toLowerCase().indexOf('firefox') > -1 : false
}

export function isSafari () {
  return /apple/i.test(getNavigator('vendor'))
}
