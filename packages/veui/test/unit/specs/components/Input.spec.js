import { mount } from '@vue/test-utils'
import Input from '@/components/Input'
import Icon from '@/components/Icon'
import 'vue-awesome/icons/user'

describe('components/Input', () => {
  it('should handle value prop with `null` value.', done => {
    let wrapper = mount(Input, {
      propsData: {
        value: null
      }
    },
    {
      sync: false
    })

    wrapper.vm.$on('input', val => {
      expect(val).to.be.equal('')

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

    expect(wrapper.find('input').element.autofocus).to.be.equal(true)

    wrapper.destroy()
  })

  it('should hanlde focus event correctly', async () => {
    let wrapper = mount(Input)
    wrapper.find('input').trigger('focus')

    let { vm } = wrapper
    await vm.$nextTick()

    expect(wrapper.find('div.veui-input').classes('veui-input-focused')).to.be.equal(true)
    expect(vm.focused).to.be.equal(true)

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

    expect(vm.focused).to.be.equal(false)
    expect(wrapper.find('div.veui-input').classes('veui-input-focused')).to.be.equal(false)

    wrapper.destroy()
  })

  it('should clear value when clear button is clicked', done => {
    let wrapper = mount({
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
          expect(val).to.be.equal('')
          expect(this.value).to.be.equal('')
          expect(this.$refs.input.localValue).to.be.equal('')

          wrapper.destroy()
          done()
        }
      },
      template: '<veui-input ref="input" v-model="value" @input="handleInput" clearable/>'
    },
    {
      sync: false
    })

    wrapper.find('button.veui-input-clear-button').trigger('click')
  })

  it('should render before slot correctly', () => {
    let wrapper = mount({
      components: {
        'veui-input': Input,
        'veui-icon': Icon
      },
      data () {
        return {
          userName: null
        }
      },
      template: `
        <veui-input v-model="userName">
          <template slot="before">
            <veui-icon name="user"/>
          </template>
        </veui-input>
      `
    })

    expect(wrapper.find('.veui-input-before svg').exists()).to.be.equal(true)
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

    expect(wrapper.find('.veui-input-after').text()).to.be.equal('元')
  })
})
