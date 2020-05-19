import { mount } from '@vue/test-utils'
import Span from '@/components/Span'

describe('components/Span', () => {
  it('should support customized ui correctly.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-span': Span
        },
        template: '<veui-span :ui="ui">Foo</veui-span>',
        data () {
          return {
            ui: 'l'
          }
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let span = wrapper.find(Span)

    expect(span.attributes('ui')).to.equal('l')

    vm.ui = 'xs'

    await vm.$nextTick()
    expect(span.attributes('ui')).to.equal('xs')

    wrapper.destroy()
  })

  it('should render default slot correctly.', () => {
    let wrapper = mount(
      {
        components: {
          'veui-span': Span
        },
        template:
          '<veui-span :ui="ui"><a class="link" href="#">Link</a></veui-span>',
        data () {
          return {
            ui: 'l'
          }
        }
      },
      {
        sync: false
      }
    )

    expect(wrapper.find(Span).contains('a.link')).to.equal(true)
    wrapper.destroy()
  })
})
