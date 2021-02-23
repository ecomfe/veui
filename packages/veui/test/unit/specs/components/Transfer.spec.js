import { mount } from '@vue/test-utils'
import Transfer from '@/components/Transfer'
import Tree from '@/components/Tree'
import Checkbox from '@/components/Checkbox'
import { wait } from '../../../utils'

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
    const { vm } = wrapper
    wrapper.find('.veui-transfer-select-all').trigger('click')
    unorderedEqual(vm.selected, [
      'aa',
      'aa0',
      'aa1',
      'aa10',
      'aa11',
      'aa12',
      'aa2',
      'bb',
      'cc',
      'cc1',
      'cc10',
      'cc11',
      'cc2'
    ])

    wrapper.find('.veui-transfer-remove-all').trigger('click')
    expect(vm.selected).to.deep.equal([])

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
    unorderedEqual(vm.selected, ['bb', 'cc11'])

    let selectedItems = wrapper
      .findAll(Tree)
      .at(1)
      .findAll('.veui-tree-item')
    selectedItems
      .at(0)
      .find('.veui-tree-item-remove')
      .trigger('click')
    await vm.$nextTick()
    unorderedEqual(vm.selected, ['cc11'])

    wrapper.destroy()
  })

  it('should make `selected` prop fully controlled.', async () => {
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
          '<veui-transfer ref="transfer" :datasource="datasource" :selected="selected" />'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper

    let selectors = wrapper.find(Tree).findAll(Checkbox)
    selectors
      .at(0)
      .find('input[type="checkbox"]')
      .trigger('change')
    await vm.$nextTick()
    unorderedEqual(vm.selected, ['aa10', 'aa11', 'bb', 'cc11'])
    unorderedEqual(vm.$refs.transfer.$refs.candidatePanel.selected, [
      'aa10',
      'aa11',
      'bb',
      'cc11'
    ])
    wrapper.destroy()
  })

  it('should select and remove group correctly.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-transfer': Transfer
        },
        data () {
          return {
            datasource: [
              {
                value: 'aa',
                label: 'AA',
                children: [
                  {
                    value: 'aa1',
                    label: 'AA1',
                    disabled: true,
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
                  },
                  {
                    value: 'aa2',
                    label: 'AA2'
                  }
                ]
              },
              {
                value: 'bb',
                label: 'BB',
                children: [
                  {
                    value: 'bb1',
                    label: 'bb1'
                  }
                ]
              }
            ],
            selected: null
          }
        },
        template:
          '<veui-transfer ref="transfer" :datasource="datasource" v-model="selected" />'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper

    let selectors = wrapper.find(Tree).findAll(Checkbox)
    selectors
      .at(0)
      .find('input[type="checkbox"]')
      .trigger('change')
    await vm.$nextTick()
    unorderedEqual(vm.selected, ['aa2'])
    unorderedEqual(vm.$refs.transfer.$refs.candidatePanel.selected, ['aa2'])

    vm.selected = null
    await vm.$nextTick()

    selectors
      .at(1)
      .find('input[type="checkbox"]')
      .trigger('change')
    await vm.$nextTick()
    unorderedEqual(vm.selected, ['bb1', 'bb'])

    let selectedItems = wrapper
      .findAll(Tree)
      .at(1)
      .findAll('.veui-tree-item')
    selectedItems
      .at(0)
      .find('.veui-tree-item-remove')
      .trigger('click')
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal([])

    wrapper.destroy()
  })

  it('should select all after searching correctly.', async () => {
    let datasourceWithRenaming = datasource.map(i => ({ ...i }))
    datasourceWithRenaming[0].label = 'AAGroup'
    let children = datasourceWithRenaming[2].children
    datasourceWithRenaming[2].children = [
      {
        ...children[0],
        label: 'CC1Group'
      },
      ...children.slice(1)
    ]
    let wrapper = mount(
      {
        components: {
          'veui-transfer': Transfer
        },
        data () {
          return {
            datasourceWithRenaming,
            selected: null
          }
        },
        template:
          '<veui-transfer :datasource="datasourceWithRenaming" v-model="selected" />'
      },
      {
        sync: false
      }
    )
    const { vm } = wrapper

    // 搜索AA会把AA以及下面所有后代（每个后代label都有AA）都搜索出来
    await search(wrapper, 'AA')
    selectAll(wrapper)
    await vm.$nextTick()
    unorderedEqual(vm.selected, [
      'aa',
      'aa0',
      'aa1',
      'aa10',
      'aa11',
      'aa12',
      'aa2'
    ])
    clearAll(wrapper)
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal([])

    // 唯一的 AAGroup 只会搜索出一个组，选中也是整个组都选中
    await search(wrapper, 'AAGroup')
    selectAll(wrapper)
    await vm.$nextTick()
    unorderedEqual(vm.selected, [
      'aa',
      'aa0',
      'aa1',
      'aa10',
      'aa11',
      'aa12',
      'aa2'
    ])
    vm.selected = null
    await search(wrapper, 'CC1Group')
    selectAll(wrapper)
    await vm.$nextTick()
    unorderedEqual(vm.selected, ['cc1', 'cc10', 'cc11'])
    wrapper.destroy()
  })

  it('should select all and remove all correctly(excluding disabled).', async () => {
    let datasourceFirstItemDisabled = datasource.map((item, idx) => ({
      ...item,
      disabled: !idx // 第一个禁用
    }))

    let wrapper = mount(
      {
        components: {
          'veui-transfer': Transfer
        },
        data () {
          return {
            datasourceFirstItemDisabled,
            selected: ['aa10', 'aa11', 'bb', 'cc11']
          }
        },
        template:
          '<veui-transfer :datasource="datasourceFirstItemDisabled" v-model="selected" />'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    const { vm } = wrapper
    // 全选不能把之前选中的 disabled 删掉
    selectAll(wrapper)
    unorderedEqual(vm.selected, [
      'aa10',
      'aa11',
      'bb',
      'cc',
      'cc1',
      'cc10',
      'cc11',
      'cc2'
    ])

    // 取消全选不能把之前选中的 disabled 删掉
    clearAll(wrapper)
    expect(vm.selected).to.deep.equal(['aa10', 'aa11'])

    // 从空的情况下全选也不能包括disabled
    vm.selected = null
    await vm.$nextTick()
    selectAll(wrapper)
    await vm.$nextTick()
    unorderedEqual(vm.selected, ['bb', 'cc', 'cc1', 'cc10', 'cc11', 'cc2'])

    clearAll(wrapper)
    expect(vm.selected).to.deep.equal([])

    // 搜索出禁用也不能选
    await search(wrapper, 'AA')
    selectAll(wrapper)
    unorderedEqual(vm.selected, [])

    wrapper.destroy()
  })

  it('should select all and remove all correctly in various merge-checked.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-transfer': Transfer
        },
        data () {
          return {
            datasource: [
              {
                label: 'A',
                value: 'a',
                children: [
                  {
                    label: 'A1',
                    value: 'a1'
                  },
                  {
                    label: 'A2',
                    value: 'a2',
                    disabled: true
                  },
                  {
                    label: 'A3',
                    value: 'a3'
                  }
                ]
              }
            ],
            selected: ['a2'],
            includeIndeterminate: false,
            mergeChecked: 'upwards'
          }
        },
        template:
          '<veui-transfer :datasource="datasource" v-model="selected" :include-indeterminate="includeIndeterminate" :merge-checked="mergeChecked" />'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    const { vm } = wrapper
    // upwards
    // 全选不能把之前选中的 disabled 删掉
    selectAll(wrapper)
    unorderedEqual(vm.selected, ['a'])
    await vm.$nextTick()

    // 取消全选不能把之前选中的 disabled 删掉
    clearAll(wrapper)
    expect(vm.selected).to.deep.equal(['a2'])

    // 从空的情况下全选也不能包括disabled
    vm.selected = null
    await vm.$nextTick()
    selectAll(wrapper)
    unorderedEqual(vm.selected, ['a1', 'a3'])
    await vm.$nextTick()

    clearAll(wrapper)
    expect(vm.selected, vm.mergeChecked).to.deep.equal([])

    // downwards mergeChecked
    vm.mergeChecked = 'downwards'
    vm.selected = ['a2']
    await vm.$nextTick()
    selectAll(wrapper)
    unorderedEqual(vm.selected, ['a1', 'a2', 'a3'])
    await vm.$nextTick()
    clearAll(wrapper)
    expect(vm.selected).to.deep.equal(['a2'])

    // 从空的情况下全选也不能包括disabled
    vm.selected = null
    await vm.$nextTick()
    selectAll(wrapper)
    unorderedEqual(vm.selected, ['a1', 'a3'])

    await vm.$nextTick()
    clearAll(wrapper)

    expect(vm.selected).to.deep.equal([])

    // includeIndeterminate mergeChecked
    vm.mergeChecked = 'keep-all'
    vm.includeIndeterminate = true
    vm.selected = ['a2']
    await vm.$nextTick()
    clearAll(wrapper)
    // 无法删除，且同时会 normalize 数据满足 includeIndeterminate
    unorderedEqual(vm.selected, ['a', 'a2'])
    selectAll(wrapper)
    unorderedEqual(vm.selected, ['a', 'a1', 'a2', 'a3'])

    await vm.$nextTick()
    clearAll(wrapper)
    unorderedEqual(vm.selected, ['a', 'a2'])

    wrapper.destroy()
  })
})

function unorderedEqual (a, b) {
  expect(a)
    .to.have.members(b)
    .and.to.have.lengthOf(b.length)
}

async function search (wrapper, val) {
  let input = wrapper.find('.veui-search-box input')
  input.element.value = val
  input.trigger('input')
  // debounce search
  await wait(250)
}

function selectAll (wrapper) {
  wrapper.find('.veui-transfer-select-all').trigger('click')
}

function clearAll (wrapper) {
  wrapper.find('.veui-transfer-remove-all').trigger('click')
}
