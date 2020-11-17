import { createLocalVue } from '@vue/test-utils'
import toastPlugin from '@/plugins/toast'

const localVue = createLocalVue()

localVue.use(toastPlugin)

describe('plugins/toast', () => {
  it('should add `toast` methods to Vue prototype', () => {
    expect(localVue.prototype.$toast.success).to.be.a('function')
    expect(localVue.prototype.$toast.info).to.be.a('function')
    expect(localVue.prototype.$toast.warn).to.be.a('function')
    expect(localVue.prototype.$toast.error).to.be.a('function')
  })
})
