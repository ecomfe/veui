import { createLocalVue } from '@vue/test-utils'
import alertPlugin from '@/plugins/alert'

const localVue = createLocalVue()

localVue.use(alertPlugin)

describe('plugins/alert', () => {
  it('should add `alert` methods to Vue prototype', () => {
    expect(localVue.prototype.$alert).to.be.a('function')
    expect(localVue.prototype.$alert.success).to.be.a('function')
    expect(localVue.prototype.$alert.info).to.be.a('function')
    expect(localVue.prototype.$alert.warn).to.be.a('function')
    expect(localVue.prototype.$alert.error).to.be.a('function')
  })
})
