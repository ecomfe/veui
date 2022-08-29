import { mount } from '@vue/test-utils'
import LoadingBar from '@/components/LoadingBar'
import { wait } from '../../../utils'

describe('components/LoadingBar', function () {
  this.timeout(10000)

  it('should render loading component according to the `loading` prop', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-loading-bar': LoadingBar
        },
        data () {
          return {
            loading: false
          }
        },
        template: '<veui-loading-bar ui="s" :loading="loading"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    expect(wrapper.find('.veui-loading-bar').exists()).to.equal(false)

    wrapper.vm.loading = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.veui-loading-bar').exists()).to.equal(true)

    // wait for transtion after leave
    await wait(500)
    wrapper.destroy()
  })
})
