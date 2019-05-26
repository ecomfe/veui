import { mount } from '@vue/test-utils'
import Transfer from '@/components/Transfer'

describe('components/Transfer', () => {
  it('should handle datasource change correctly.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-transfer': Transfer
        },
        data () {
          return {
            items: [
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
              { label: 'C', value: 'c' }
            ]
          }
        },
        template: '<veui-transfer :datasource="items"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper

    expect(wrapper.findAll('.veui-transfer-candidate-item').length).to.be.equal(
      3
    )

    vm.items = [{ label: '1', value: '1' }, { label: '2', value: '2' }]

    await vm.$nextTick()

    expect(wrapper.findAll('.veui-transfer-candidate-item').length).to.be.equal(
      2
    )

    wrapper.destroy()
  })

  it('should handle selected change correctly.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-transfer': Transfer
        },
        data () {
          return {
            items: [
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
              { label: 'C', value: 'c' }
            ],
            selected: ['a', 'b']
          }
        },
        template: '<veui-transfer :datasource="items" v-model="selected" />'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper

    expect(wrapper.findAll('.veui-transfer-selected-item').length).to.be.equal(
      2
    )

    vm.selected = []

    await vm.$nextTick()

    expect(wrapper.findAll('.veui-transfer-selected-item').length).to.be.equal(
      0
    )

    wrapper.destroy()
  })
})
