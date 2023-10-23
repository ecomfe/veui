import { mount } from '@vue/test-utils'
import Rating from '@/components/Rating'

describe('components/Rating', function () {
  this.timeout(10000)

  it('should handle controlled value correctly', async () => {
    let sync = true
    let wrapper = mount({
      components: {
        'veui-rating': Rating
      },
      data () {
        return {
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
      template: '<veui-rating :value="value" @change="handleChange"/>'
    })

    let { vm } = wrapper
    let radios = wrapper.findAll('input')
    trigger(radios, 0)
    await vm.$nextTick()
    expect(vm.value).to.equal(1)

    trigger(radios, 1)
    await vm.$nextTick()
    expect(vm.value).to.equal(2)

    sync = false
    trigger(radios, 0)
    await vm.$nextTick()
    expect(vm.value).to.equal(2)
    expect(radios.at(0).element.checked).to.equal(false)
    wrapper.destroy()
  })

  it('should handle v-model correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-rating': Rating
      },
      data () {
        return {
          value: null
        }
      },
      template: '<veui-rating v-model="value"/>'
    })

    let { vm } = wrapper
    let radios = wrapper.findAll('input')
    trigger(radios, 0)
    await vm.$nextTick()
    expect(vm.value).to.equal(1)

    trigger(radios, 1)
    await vm.$nextTick()
    expect(vm.value).to.equal(2)
    wrapper.destroy()
  })

  it('should handle uncontrolled value correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-rating': Rating
      },
      template: '<veui-rating/>'
    })

    let { vm } = wrapper
    let radios = wrapper.findAll('input')
    trigger(radios, 0)
    await vm.$nextTick()
    expect(radios.at(0).element.checked).to.equal(true)
    expect(radios.at(1).element.checked).to.equal(false)
    expect(radios.at(2).element.checked).to.equal(false)

    trigger(radios, 1)
    await vm.$nextTick()
    expect(radios.at(0).element.checked).to.equal(false)
    expect(radios.at(1).element.checked).to.equal(true)
    expect(radios.at(2).element.checked).to.equal(false)
    wrapper.destroy()
  })

  it('should respect `max` prop', () => {
    let wrapper = mount({
      components: {
        'veui-rating': Rating
      },
      template: '<veui-rating :max="6"/>'
    })

    let radios = wrapper.findAll('input')
    expect(radios.length).to.equal(6)
    wrapper.destroy()
  })

  it('should respect `readonly` prop', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-rating': Rating
        },
        template: '<veui-rating :value="3" readonly/>'
      },
      {
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    let radios = wrapper.findAll('input')
    click(radios, 0)
    await vm.$nextTick()
    expect(radios.at(0).element.checked).to.equal(false)
    expect(radios.at(2).element.checked).to.equal(true)
    wrapper.destroy()
  })

  it('should respect `clearable` prop', async () => {
    let wrapper = mount({
      components: {
        'veui-rating': Rating
      },
      template: '<veui-rating clearable/>'
    })

    let { vm } = wrapper
    let radios = wrapper.findAll('input')
    trigger(radios, 0)
    await vm.$nextTick()
    expect(radios.at(0).element.checked).to.equal(true)

    click(radios, 0)
    expect(radios.at(2).element.checked).to.equal(false)
    wrapper.destroy()
  })

  it('should respect `allow-half` prop', async () => {
    let wrapper = mount({
      components: {
        'veui-rating': Rating
      },
      template: '<veui-rating v-model="value" allow-half/>',
      data () {
        return {
          value: null
        }
      }
    })

    let { vm } = wrapper
    let radios = wrapper.findAll('input')

    expect(radios.length).to.equal(10)

    trigger(radios, 2)
    await vm.$nextTick()
    expect(vm.value).to.equal(1.5)

    trigger(radios, 3)
    await vm.$nextTick()
    expect(vm.value).to.equal(2)

    wrapper.destroy()
  })

  it('should show selected symbols correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-rating': Rating
      },
      template: '<veui-rating v-model="value" allow-half/>',
      data () {
        return {
          value: null
        }
      }
    })

    let { vm } = wrapper
    let parts = wrapper.findAll('.veui-rating-symbol-part')

    parts.at(0).trigger('mouseenter')
    await vm.$nextTick()
    expect(parts.at(0).classes('veui-rating-symbol-part-selected')).to.equal(
      true
    )
    expect(parts.at(1).classes('veui-rating-symbol-part-selected')).to.equal(
      false
    )

    parts.at(4).trigger('mouseenter')
    await vm.$nextTick()
    expect(parts.at(0).classes('veui-rating-symbol-part-selected')).to.equal(
      true
    )
    expect(parts.at(1).classes('veui-rating-symbol-part-selected')).to.equal(
      true
    )
    expect(parts.at(2).classes('veui-rating-symbol-part-selected')).to.equal(
      true
    )
    expect(parts.at(3).classes('veui-rating-symbol-part-selected')).to.equal(
      true
    )
    expect(parts.at(4).classes('veui-rating-symbol-part-selected')).to.equal(
      true
    )
    expect(parts.at(5).classes('veui-rating-symbol-part-selected')).to.equal(
      false
    )

    wrapper.find('.veui-rating-symbols').trigger('mouseleave')
    await vm.$nextTick()
    expect(wrapper.find('.veui-rating-symbol-part-selected').exists()).to.equal(
      false
    )

    wrapper.destroy()
  })

  it('should render label correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-rating': Rating
      },
      template: '<veui-rating v-model="value" :labels="labels" :max="3"/>',
      data () {
        return {
          value: null,
          labels: {
            1: 'bad',
            2: 'normal',
            3: 'good'
          }
        }
      }
    })

    let { vm } = wrapper
    expect(wrapper.find('.veui-rating-label').exists()).to.equal(false)

    vm.value = 1
    await vm.$nextTick()
    expect(wrapper.find('.veui-rating-label').text()).to.equal('bad')

    vm.value = 2
    await vm.$nextTick()
    expect(wrapper.find('.veui-rating-label').text()).to.equal('normal')

    vm.labels = (val) => {
      return val + ' stars'
    }
    await vm.$nextTick()
    expect(wrapper.find('.veui-rating-label').text()).to.equal('2 stars')

    vm.value = 3
    await vm.$nextTick()
    expect(wrapper.find('.veui-rating-label').text()).to.equal('3 stars')

    let parts = wrapper.findAll('.veui-rating-symbol-part')
    parts.at(0).trigger('mouseenter')

    await vm.$nextTick()
    expect(wrapper.find('.veui-rating-label').text()).to.equal('1 stars')

    wrapper.find('.veui-rating-symbols').trigger('mouseleave')
    await vm.$nextTick()
    expect(wrapper.find('.veui-rating-label').text()).to.equal('3 stars')

    wrapper.destroy()
  })

  it('should render `symbol` slot correctly', () => {
    let wrapper = mount({
      components: {
        'veui-rating': Rating
      },
      template: `<veui-rating v-model="value" :max="3">
        <template #symbol>
          <span class="custom-symbol">❖</span>
        </template>
      </veui-rating>`,
      data () {
        return {
          value: null
        }
      }
    })

    expect(wrapper.findAll('.custom-symbol').length).to.equal(3)

    wrapper.destroy()
  })

  it('should render `label` slot correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-rating': Rating
      },
      template: `<veui-rating v-model="value" :max="3" allow-half>
        <template #label="{ value }">
          <span class="custom-label" v-if="value">{{ value }} / 3</span>
        </template>
      </veui-rating>`,
      data () {
        return {
          value: null
        }
      }
    })

    let { vm } = wrapper
    expect(wrapper.find('.custom-label').exists()).to.equal(false)

    vm.value = 1.5
    await vm.$nextTick()
    expect(wrapper.find('.custom-label').text()).to.equal('1.5 / 3')

    wrapper.findAll('.veui-rating-symbol-part').at(5).trigger('mouseenter')
    await vm.$nextTick()
    expect(wrapper.find('.custom-label').text()).to.equal('3 / 3')

    wrapper.destroy()
  })
})

function trigger (radios, index) {
  radios.at(index).element.checked = true
  radios.at(index).trigger('change')
}

function click (radios, index) {
  radios.at(index).trigger('click')
}
