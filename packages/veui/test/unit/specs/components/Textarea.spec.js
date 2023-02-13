import { mount } from '@vue/test-utils'
import Textarea from '@/components/Textarea'
import Form from '@/components/Form'
import Field from '@/components/Field'
import { wait, expectFieldError } from '../../../utils'

describe('components/Textarea', function () {
  this.timeout(10000)

  it('should handle value prop with `null` value', (done) => {
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

    wrapper.vm.$on('input', (val) => {
      expect(val).to.equal('')

      wrapper.destroy()
      done()
    })

    wrapper.find('textarea').trigger('input')
  })

  it('should transparently pass-through attrs to the <textarea> element', () => {
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

  it('should render `maxlength` limit correctly', () => {
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
            val: '\nWWWWWWWWWWWWWWWWW'
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

  it('should make `value` prop fully controlled', async () => {
    let wrapper = mount(Textarea, {
      propsData: {
        value: 'foo'
      }
    })

    let input = wrapper.find('textarea')
    input.element.value = 'bar'
    input.trigger('input')
    await wrapper.vm.$nextTick()
    expect(input.element.value).to.equal('foo')
  })

  it('should pass event object on input', (done) => {
    let wrapper = mount(Textarea, {
      propsData: {
        value: 'foo'
      }
    })
    wrapper.vm.$on('input', (_, e) => {
      expect(!!e).to.equal(true)
      done()
    })

    let input = wrapper.find('textarea')
    input.element.value = 'bar'
    input.trigger('input')
  })

  it('should handle `getLength` prop correctly', () => {
    let wrapper = mount({
      components: {
        'veui-textarea': Textarea
      },
      methods: {
        getLength () {
          return 4
        }
      },
      template: `
        <veui-textarea value="中文" :get-length="getLength" maxlength="5"/>
      `
    })

    expect(wrapper.find('.veui-textarea-count').text()).to.equal('4/5')
  })

  it('should handle `autoresize` prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-textarea': Textarea
        },
        template: `
        <veui-textarea autoresize v-model="text"/>
      `,
        data () {
          return {
            text: '\n'.repeat(9)
          }
        }
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    let { vm, element } = wrapper

    await wait(0)
    let initialHeight = element.offsetHeight

    async function testRows (rows) {
      vm.text = '\n'.repeat(rows - 1)
      await wait(0)
      expect(Math.ceil(element.offsetHeight / initialHeight)).to.equal(
        rows / 10
      )
    }

    await testRows(100)
    await testRows(50)
    await testRows(120)
    await testRows(80)

    wrapper.destroy()
  })

  it('should be focusable', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-textarea': Textarea
        },
        template: '<veui-textarea/>'
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    let { vm } = wrapper.find(Textarea)
    vm.focus()

    await wait(0)
    expect(document.activeElement).to.equal(wrapper.find('textarea').element)
    expect(wrapper.classes()).to.contain('veui-focus')

    wrapper.destroy()
  })

  it('should apply validations correctly when using input(instance)/blur(native) as triggers', async () => {
    const ruleErr = 'required'
    const valiErr = 'gender出错啦'
    const validators = [
      {
        fields: ['gender'],
        validate: (gender) => {
          return !gender
            ? {
              gender: valiErr
            }
            : true
        },
        triggers: 'blur'
      }
    ]

    let wrapper = mount(
      {
        components: {
          'veui-field': Field,
          'veui-textarea': Textarea,
          'veui-form': Form
        },
        data () {
          return {
            data: {
              gender: null
            },
            rules: [{ name: 'required', message: ruleErr, triggers: 'blur' }],
            validators
          }
        },
        template: `<veui-form ref="form" :data="data" :validators="validators">
          <veui-field name="gender" :rules="rules" field="gender"><veui-textarea v-model="data.gender"/></veui-field>
        </veui-form>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    const { vm } = wrapper
    await vm.$nextTick()
    await blurWithValue(null)
    expectFieldError(wrapper, valiErr)

    await blurWithValue('1')
    expectFieldError(wrapper, false)

    vm.validators = null
    await blurWithValue(null)
    expectFieldError(wrapper, ruleErr)

    await blurWithValue('1')
    expectFieldError(wrapper, false)

    await changeTrigger('input')

    await inputWithValue(null)
    expectFieldError(wrapper, valiErr)

    await inputWithValue('1')
    expectFieldError(wrapper, false)

    vm.validators = null
    await inputWithValue(null)
    expectFieldError(wrapper, ruleErr)

    await inputWithValue('1')
    expectFieldError(wrapper, false)

    wrapper.destroy()

    async function blurWithValue (val) {
      vm.data.gender = val
      await vm.$nextTick()
      let input = wrapper.find('.veui-textarea textarea')
      input.trigger('blur')
      await vm.$nextTick()
    }

    async function inputWithValue (val) {
      await vm.$nextTick()
      let input = wrapper.find('.veui-textarea textarea')
      input.element.value = val
      input.trigger('input')
      await vm.$nextTick()
    }

    async function changeTrigger (triggers) {
      vm.rules = [{ ...vm.rules[0], triggers }]
      vm.validators = [{ ...validators[0], triggers }]
      await vm.$nextTick()
    }
  })
})
