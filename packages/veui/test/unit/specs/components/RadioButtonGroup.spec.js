import { mount } from '@vue/test-utils'
import RadioButtonGroup from '@/components/RadioButtonGroup'

const items = [
  {
    value: 'Hirasawa Yui',
    label: 'Hirasawa Yui',
    desc: "You don't have enough permissions!"
  },
  {
    value: 'Akiyama Mio',
    label: 'Akiyama Mio',
    desc: 'Something wrong!'
  },
  {
    value: 'Nakano Azusa',
    label: 'Nakano Azusa'
  }
]

const items2 = [
  {
    value: 'Hirasawa Yui',
    label: 'Hirasawa Yui'
  },
  {
    value: 'Akiyama Mio',
    label: 'Akiyama Mio',
    disabled: true
  },
  {
    value: 'Nakano Azusa',
    label: 'Nakano Azusa'
  }
]

describe('components/RadioButtonGroup', function () {
  this.timeout(10000)

  it('should handle controlled value correctly', async () => {
    let sync = true
    let wrapper = mount({
      components: {
        'veui-radio-button-group': RadioButtonGroup
      },
      data () {
        return {
          items,
          value: null
        }
      },
      methods: {
        handleChange (value) {
          if (sync) {
            this.value = value
          }
        }
      },
      template:
        '<veui-radio-button-group :items="items" :value="value" @change="handleChange"/>'
    })

    let { vm } = wrapper
    let radios = wrapper.findAll('.veui-button')
    trigger(radios, 0)
    await vm.$nextTick()
    expect(vm.value).to.equal(items[0].value)

    trigger(radios, 1)
    await vm.$nextTick()
    expect(vm.value).to.equal(items[1].value)

    sync = false
    trigger(radios, 0)
    await vm.$nextTick()
    expect(vm.value, '保留上次').to.equal(items[1].value)
    expect(radios.at(0).classes('veui-button-selected')).to.equal(false)
    wrapper.destroy()
  })

  it('should handle v-model correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-radio-button-group': RadioButtonGroup
      },
      data () {
        return {
          items,
          value: null
        }
      },
      template: '<veui-radio-button-group :items="items" v-model="value"/>'
    })

    let { vm } = wrapper
    let radios = wrapper.findAll('.veui-button')
    trigger(radios, 0)
    await vm.$nextTick()
    expect(vm.value).to.equal(items[0].value)

    trigger(radios, 1)
    await vm.$nextTick()
    expect(vm.value).to.equal(items[1].value)
    wrapper.destroy()
  })

  it('should handle uncontrolled value correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-radio-button-group': RadioButtonGroup
      },
      data () {
        return {
          items
        }
      },
      template: '<veui-radio-button-group :items="items"/>'
    })

    let { vm } = wrapper
    let radios = wrapper.findAll('.veui-button')
    trigger(radios, 0)
    await vm.$nextTick()
    expect(radios.at(0).classes('veui-button-selected')).to.equal(true)
    expect(radios.at(1).classes('veui-button-selected')).to.equal(false)
    expect(radios.at(2).classes('veui-button-selected')).to.equal(false)

    trigger(radios, 1)
    await vm.$nextTick()
    expect(radios.at(0).classes('veui-button-selected')).to.equal(false)
    expect(radios.at(1).classes('veui-button-selected')).to.equal(true)
    expect(radios.at(2).classes('veui-button-selected')).to.equal(false)
    wrapper.destroy()
  })

  it('should handle keyboard events correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-radio-button-group': RadioButtonGroup
      },
      data () {
        return {
          items: items2,
          value: null,
          disabled: false
        }
      },
      template:
        '<veui-radio-button-group :items="items" v-model="value" :disabled="disabled"/>'
    })

    let { vm } = wrapper
    let radios = wrapper.findAll('.veui-button')
    radios.at(0).trigger('keydown.left')

    await vm.$nextTick()
    expect(vm.value).to.equal(items2[0].value)
    radios.at(0).trigger('keydown.left')

    await vm.$nextTick()
    expect(vm.value).to.equal(items2[2].value)
    radios.at(2).trigger('keydown.left')

    await vm.$nextTick()
    expect(vm.value).to.equal(items2[0].value)
    radios.at(0).trigger('keydown.right')

    await vm.$nextTick()
    expect(vm.value).to.equal(items2[2].value)
    radios.at(2).trigger('keydown.right')

    await vm.$nextTick()
    expect(vm.value).to.equal(items2[0].value)

    vm.disabled = true

    await vm.$nextTick()
    radios.at(0).trigger('keydown.left')

    await vm.$nextTick()
    expect(vm.value).to.equal(items2[0].value)
    radios.at(0).trigger('keydown.right')

    await vm.$nextTick()
    expect(vm.value).to.equal(items2[0].value)

    wrapper.destroy()
  })
})

function trigger (radios, index) {
  radios.at(index).element.click()
}
