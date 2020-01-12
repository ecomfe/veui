import { mount } from '@vue/test-utils'
import Textarea from '@/components/Textarea'
import { wait } from '../../../utils'

describe('components/Textarea', () => {
  it('should handle value prop with `null` value.', done => {
    let wrapper = mount(
      Textarea,
      {
        propsData: {
          value: null
        }
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    wrapper.vm.$on('input', val => {
      expect(val).to.equal('')

      wrapper.destroy()
      done()
    })

    wrapper.find('textarea').trigger('input')
  })

  it('should transparently pass-through attrs to the <textarea> element.', () => {
    let wrapper = mount(
      Textarea,
      {
        attrs: {
          autofocus: ''
        }
      },
      {
        sync: false
      }
    )

    expect(wrapper.find('textarea').element.autofocus).to.equal(true)
    wrapper.destroy()
  })

  it('should handle `resizable` correctly', () => {
    let wrapper = mount(
      {
        components: {
          'veui-textarea': Textarea
        },
        template: '<veui-textarea resizable/>'
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    let { element } = wrapper.find('textarea')
    expect(getComputedStyle(element).resize).to.equal('vertical')
    wrapper.destroy()
  })

  it('should render maxlength limit correctly', () => {
    let wrapper = mount({
      components: {
        'veui-textarea': Textarea
      },
      template: `
      <veui-textarea value="foo" maxlength="5"/>
    `
    })

    expect(wrapper.find('textarea').attributes('maxlength')).to.equal(undefined)
    expect(wrapper.find('.veui-textarea-count').text()).to.equal('3/5')
  })

  it('should render maxlength limit with strict prop correctly', () => {
    let wrapper = mount({
      components: {
        'veui-textarea': Textarea
      },
      template: `
      <veui-textarea value="foo" maxlength="5" strict/>
    `
    })

    expect(wrapper.find('textarea').attributes('maxlength')).to.equal('5')
    expect(wrapper.find('.veui-textarea-count').text()).to.equal('3/5')
  })

  it('should prevent content overlapping with counter', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-textarea': Textarea
        },
        data () {
          return {
            val: '\nWWWWWWWWWWWWWWW'
          }
        },
        template: `
      <veui-textarea :value="val" line-number rows="2" maxlength="5"/>
    `
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    expect(wrapper.find('.veui-textarea-count-overlap').exists()).to.equal(
      false
    )

    wrapper.vm.val += 'W'
    await wait(0)

    expect(wrapper.find('.veui-textarea-count-overlap').exists()).to.equal(true)

    wrapper.destroy()
  })
})
