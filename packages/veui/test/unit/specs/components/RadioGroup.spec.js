import { mount } from '@vue/test-utils'
import RadioGroup from '@/components/RadioGroup'

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

describe('components/RadioGroup', function () {
  this.timeout(10000)

  it('should handle controlled value correctly', async () => {
    let sync = true
    let wrapper = mount({
      components: {
        'veui-radio-group': RadioGroup
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
        '<veui-radio-group :items="items" :value="value" @change="handleChange"/>'
    })

    let { vm } = wrapper
    let radios = wrapper.findAll('input')
    trigger(radios, 0)
    await vm.$nextTick()
    expect(vm.value).to.eql(items[0].value)

    trigger(radios, 1)
    await vm.$nextTick()
    expect(vm.value).to.eql(items[1].value)

    sync = false
    trigger(radios, 0)
    await vm.$nextTick()
    expect(vm.value, '保留上次').to.eql(items[1].value)
    expect(radios.at(0).element.checked).to.eql(false)
    wrapper.destroy()
  })

  it('should handle v-model correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-radio-group': RadioGroup
      },
      data () {
        return {
          items,
          value: null
        }
      },
      template: '<veui-radio-group :items="items" v-model="value"/>'
    })

    let { vm } = wrapper
    let radios = wrapper.findAll('input')
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
        'veui-radio-group': RadioGroup
      },
      data () {
        return {
          items
        }
      },
      template: '<veui-radio-group :items="items"/>'
    })

    let { vm } = wrapper
    let radios = wrapper.findAll('input')
    trigger(radios, 0)
    await vm.$nextTick()
    expect(radios.at(0).element.checked).to.eql(true)
    expect(radios.at(1).element.checked).to.eql(false)
    expect(radios.at(2).element.checked).to.eql(false)

    trigger(radios, 1)
    await vm.$nextTick()
    expect(radios.at(0).element.checked).to.eql(false)
    expect(radios.at(1).element.checked).to.eql(true)
    expect(radios.at(2).element.checked).to.eql(false)
    wrapper.destroy()
  })
})

function trigger (radios, index) {
  radios.at(index).element.checked = true
  radios.at(index).trigger('change')
}
