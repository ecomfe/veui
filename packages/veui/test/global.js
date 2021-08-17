import 'focus-visible'
import 'veui-theme-dls/common.less'

// Safely ignore ResizeObserver loop limit exceeded
// https://github.com/WICG/resize-observer/issues/38
let onerror

before(() => {
  onerror = window.onerror

  window.onerror = (...args) => {
    const [e] = args
    if (e === 'ResizeObserver loop limit exceeded') {
      console.warn(`[test] ${e}`)
      return false
    } else if (onerror) {
      return onerror(...args)
    }
  }
})

after(() => {
  window.onerror = onerror
})
