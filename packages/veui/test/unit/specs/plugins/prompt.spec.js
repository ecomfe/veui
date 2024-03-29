import { createLocalVue } from '@vue/test-utils'
import promptPlugin from '@/plugins/prompt'

const localVue = createLocalVue()

localVue.use(promptPlugin)

describe('plugins/prompt', function () {
  this.timeout(10000)

  it('should add `prompt` methods to Vue prototype', () => {
    expect(localVue.prototype.$prompt).to.be.a('function')
  })
})
