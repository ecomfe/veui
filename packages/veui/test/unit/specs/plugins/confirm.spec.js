import { createLocalVue } from '@vue/test-utils'
import confirmPlugin from '@/plugins/confirm'

const localVue = createLocalVue()

localVue.use(confirmPlugin)

describe('plugins/confirm', function () {
  this.timeout(10000)

  it('should add `confirm` methods to Vue prototype', () => {
    expect(localVue.prototype.$confirm).to.be.a('function')
  })
})
