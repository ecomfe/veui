import { mount } from '@vue/test-utils'
import Transfer from '@/components/Transfer'
import Tree from '@/components/Tree'
import Checkbox from '@/components/Checkbox'

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

    expect(
      wrapper.find('.veui-transfer-candidate-panel').findAll('.veui-tree-item')
        .length
    ).to.equal(3)

    vm.items = [
      { label: '1', value: '1' },
      { label: '2', value: '2' }
    ]

    await vm.$nextTick()

    expect(
      wrapper.find('.veui-transfer-candidate-panel').findAll('.veui-tree-item')
        .length
    ).to.equal(2)

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

    expect(
      wrapper.find('.veui-transfer-selected-panel').findAll('.veui-tree-item')
        .length
    ).to.equal(2)

    vm.selected = []

    await vm.$nextTick()

    expect(
      wrapper.find('.veui-transfer-selected-panel').findAll('.veui-tree-item')
        .length
    ).to.equal(0)

    wrapper.destroy()
  })

  let datasource = [
    {
      value: 'aa',
      label: 'AA',
      children: [
        {
          value: 'aa0',
          label: 'AA0'
        },
        {
          value: 'aa1',
          label: 'AA1',
          children: [
            {
              value: 'aa10',
              label: 'AA10'
            },
            {
              value: 'aa11',
              label: 'AA11'
            },
            {
              value: 'aa12',
              label: 'AA12'
            }
          ]
        },
        {
          value: 'aa2',
          label: 'AA2'
        }
      ]
    },
    {
      value: 'bb',
      label: 'BB'
    },
    {
      value: 'cc',
      label: 'CC',
      children: [
        {
          value: 'cc1',
          label: 'CC1',
          children: [
            {
              value: 'cc10',
              label: 'CC10'
            },
            {
              value: 'cc11',
              label: 'CC11'
            }
          ]
        },
        {
          value: 'cc2',
          label: 'CC2'
        }
      ]
    }
  ]

  it('should generate selected tree correctly.', () => {
    let wrapper = mount(
      {
        components: {
          'veui-transfer': Transfer
        },
        data () {
          return {
            datasource,
            selected: ['aa10', 'aa11', 'bb', 'cc11']
          }
        },
        template:
          '<veui-transfer :datasource="datasource" v-model="selected" />'
      },
      {
        sync: false
      }
    )

    let selectedTree = wrapper.findAll(Tree).at(1)
    expect(selectedTree.props('datasource')).to.deep.equal([
      {
        value: 'aa',
        label: 'AA',
        children: [
          {
            value: 'aa1',
            label: 'AA1',
            children: [
              {
                value: 'aa10',
                label: 'AA10'
              },
              {
                value: 'aa11',
                label: 'AA11'
              }
            ]
          }
        ]
      },
      {
        value: 'bb',
        label: 'BB'
      },
      {
        value: 'cc',
        label: 'CC',
        children: [
          {
            value: 'cc1',
            label: 'CC1',
            children: [
              {
                value: 'cc11',
                label: 'CC11'
              }
            ]
          }
        ]
      }
    ])

    wrapper.destroy()
  })

  it('should select all and remove all correctly.', () => {
    let wrapper = mount(
      {
        components: {
          'veui-transfer': Transfer
        },
        data () {
          return {
            datasource,
            selected: ['aa10', 'aa11', 'bb', 'cc11']
          }
        },
        template:
          '<veui-transfer :datasource="datasource" v-model="selected" />'
      },
      {
        sync: false
      }
    )

    wrapper.find('.veui-transfer-select-all').trigger('click')
    expect(wrapper.vm.$data.selected).to.deep.equal([
      'aa0',
      'aa10',
      'aa11',
      'aa12',
      'aa2',
      'bb',
      'cc10',
      'cc11',
      'cc2'
    ])

    wrapper.find('.veui-transfer-remove-all').trigger('click')
    expect(wrapper.vm.$data.selected).to.deep.equal([])

    wrapper.destroy()
  })

  it('should handle select and remove correctly.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-transfer': Transfer
        },
        data () {
          return {
            datasource,
            selected: ['aa10', 'aa11', 'bb', 'cc11']
          }
        },
        template:
          '<veui-transfer :datasource="datasource" v-model="selected" />'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    let selectors = wrapper.find(Tree).findAll(Checkbox)
    selectors
      .at(0)
      .find('input[type="checkbox"]')
      .trigger('change')
    // // first.checked = false
    // first.trigger('change')
    await vm.$nextTick()

    // 之前change一下希望全选么？现在行为是优先清空
    expect(vm.$data.selected).to.deep.equal(['bb', 'cc11'])

    let selectedItems = wrapper
      .findAll(Tree)
      .at(1)
      .findAll('.veui-tree-item')
    selectedItems
      .at(0)
      .find('.veui-tree-item-remove')
      .trigger('click')
    await vm.$nextTick()
    expect(vm.$data.selected).to.deep.equal(['cc11'])

    wrapper.destroy()
  })
})
