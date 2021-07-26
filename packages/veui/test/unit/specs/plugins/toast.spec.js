import { createLocalVue, shallowMount } from '@vue/test-utils'
import toastPlugin from '@/plugins/toast'
import { wait } from '../../../utils'

const localVue = createLocalVue()

localVue.use(toastPlugin)

describe('plugins/toast', () => {
  it('should add `toast` methods to Vue prototype', () => {
    expect(localVue.prototype.$toast).to.be.a('function')
    expect(localVue.prototype.$toast.success).to.be.a('function')
    expect(localVue.prototype.$toast.info).to.be.a('function')
    expect(localVue.prototype.$toast.warn).to.be.a('function')
    expect(localVue.prototype.$toast.error).to.be.a('function')
  })

  it('should accept an optional `options` param', async () => {
    shallowMount(
      {
        template: '<div></div>',
        mounted () {
          this.$toast.success('🟩', { duration: 200 })
          this.$toast.info('🟦', { duration: 200 })
          this.$toast.warn('🟨', { duration: 200 })
          this.$toast.error('🟥', { duration: 200 })
        }
      },
      { localVue }
    )

    await wait(0)

    expect(document.querySelectorAll('.veui-toast-success').length).to.equal(1)
    expect(document.querySelectorAll('.veui-toast-info').length).to.equal(1)
    expect(document.querySelectorAll('.veui-toast-warning').length).to.equal(1)
    expect(document.querySelectorAll('.veui-toast-error').length).to.equal(1)

    await wait(500)

    expect(document.querySelectorAll('.veui-toast-success').length).to.equal(0)
    expect(document.querySelectorAll('.veui-toast-info').length).to.equal(0)
    expect(document.querySelectorAll('.veui-toast-warning').length).to.equal(0)
    expect(document.querySelectorAll('.veui-toast-error').length).to.equal(0)
  })
})
