import { mount } from '@vue/test-utils'
import Input from '@/components/Input'

describe('components/Input', () => {
  it('should handle value prop with `null` value.', done => {
    let wrapper = mount(
      Input,
      {
        propsData: {
          value: null
        }
      },
      {
        sync: false
      }
    )

    wrapper.vm.$on('input', val => {
      expect(val).to.equal('')

      wrapper.destroy()
      done()
    })

    wrapper.find('input').trigger('input')
  })

  it('should transparently pass-through attrs to the <input> element.', () => {
    let wrapper = mount(Input, {
      attrs: {
        autofocus: ''
      }
    })

    expect(wrapper.find('input').element.autofocus).to.equal(true)

    wrapper.destroy()
  })

  it('should handle focus event correctly', async () => {
    let wrapper = mount(Input)
    wrapper.find('input').trigger('focus')

    let { vm } = wrapper
    await vm.$nextTick()

    expect(wrapper.find('div.veui-input').classes('veui-focus')).to.equal(true)
    expect(vm.focused).to.equal(true)

    wrapper.destroy()
  })

  it('should only emit input event upon user interaction', async () => {
    let changes = 0
    let wrapper = mount(
      {
        components: {
          'veui-input': Input
        },
        data () {
          return {
            value: null
          }
        },
        methods: {
          handleChange (checked) {
            changes++
          }
        },
        template: '<veui-input :value="value" @input="handleChange"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper

    vm.value = 'foo'

    await vm.$nextTick()
    expect(changes).to.equal(0)

    let box = wrapper.find('input')
    box.element.value = 'bar'
    box.trigger('input')

    box.element.value = 'baz'
    box.trigger('input')

    await vm.$nextTick()
    expect(changes).to.equal(2)

    wrapper.destroy()
  })

  it('disabled input should not be focused when activated', async () => {
    let wrapper = mount(Input, {
      propsData: {
        disabled: true
      }
    })

    let { vm } = wrapper
    vm.activate()
    await vm.$nextTick()

    expect(vm.focused).to.equal(false)
    expect(wrapper.find('div.veui-input').classes('veui-focus')).to.equal(false)

    wrapper.destroy()
  })

  it('should clear value when clear button is clicked', done => {
    let wrapper = mount(
      {
        components: {
          'veui-input': Input
        },
        data () {
          return {
            value: 'test'
          }
        },
        methods: {
          handleInput (val) {
            expect(val).to.equal('')
            expect(this.value).to.equal('')
            expect(this.$refs.input.localValue).to.equal('')

            wrapper.destroy()
            done()
          }
        },
        template:
          '<veui-input ref="input" v-model="value" @input="handleInput" clearable/>'
      },
      {
        sync: false
      }
    )

    wrapper.find('button.veui-input-clear').trigger('click')
  })

  it('should render before slot correctly', () => {
    let wrapper = mount({
      components: {
        'veui-input': Input
      },
      data () {
        return {
          userName: null
        }
      },
      template: `
        <veui-input v-model="userName">
          <template slot="before">user</template>
        </veui-input>
      `
    })

    expect(wrapper.find('.veui-input-before').text()).to.equal('user')
  })

  it('should render after slot correctly', () => {
    let wrapper = mount({
      components: {
        'veui-input': Input
      },
      data () {
        return {
          money: null
        }
      },
      template: `
        <veui-input v-model="money">
          <template slot="after">元</template>
        </veui-input>
      `
    })

    expect(wrapper.find('.veui-input-after').text()).to.equal('元')
  })

  it('should render prepend slot correctly', () => {
    let wrapper = mount({
      components: {
        'veui-input': Input
      },
      data () {
        return {
          userName: null
        }
      },
      template: `
        <veui-input v-model="userName">
          <template slot="prepend">user</template>
        </veui-input>
      `
    })

    expect(wrapper.find('.veui-input-prepend').text()).to.equal('user')
  })

  it('should render append slot correctly', () => {
    let wrapper = mount({
      components: {
        'veui-input': Input
      },
      data () {
        return {
          userName: null
        }
      },
      template: `
        <veui-input v-model="userName">
          <template slot="append">user</template>
        </veui-input>
      `
    })

    expect(wrapper.find('.veui-input-append').text()).to.equal('user')
  })
})
