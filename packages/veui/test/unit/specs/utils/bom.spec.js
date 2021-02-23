import {pick} from 'lodash'
import {
  isFirefox,
  isSafari
} from '@/utils/bom'

const firefoxNavigatorMock = {
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:84.0) Gecko/20100101 Firefox/84.0',
  vendor: ''
}

const safariNavigatorMock = {
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15',
  vendor: 'Apple Computer, Inc.'
}

const emptyNavigatorMock = {}

describe('utils/bom', () => {
  it('should detect browsers correctly', () => {
    // suppose cases are running on chrome by default
    expect(isFirefox()).to.be.equal(false)
    expect(isSafari()).to.be.equal(false)

    // `with(statement) {}` is not allowed in 'strict mode'
    // use defineProperties to mock userAgent of navigator
    let redo = overrideNavigator(firefoxNavigatorMock)
    expect(isFirefox()).to.be.equal(true)
    expect(isSafari()).to.be.equal(false)
    redo()

    redo = overrideNavigator(safariNavigatorMock)
    expect(isFirefox()).to.be.equal(false)
    expect(isSafari()).to.be.equal(true)
    redo()

    redo = overrideNavigator(emptyNavigatorMock)
    expect(isFirefox()).to.be.equal(false)
    expect(isSafari()).to.be.equal(false)
    redo()
  })
})

function overrideNavigator (obj) {
  let origin = pick(navigator, Object.keys(obj))
  Object.defineProperties(navigator, Object.entries(obj).reduce(function (ret, [key, val]) {
    ret[key] = {
      configurable: true,
      writable: true,
      value: val
    }
    return ret
  }, {}))

  return function redo () {
    Object.defineProperties(navigator, Object.entries(origin).reduce(function (ret, [key, val]) {
      ret[key] = {
        writable: false,
        value: val
      }
      return ret
    }, {}))
  }
}
