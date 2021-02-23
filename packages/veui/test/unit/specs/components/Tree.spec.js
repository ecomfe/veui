import { mount } from '@vue/test-utils'
import Tree from '@/components/Tree'
import Checkbox from '@/components/Checkbox'

let datasource = [
  {
    label: 'Infused',
    value: 'infused',
    children: [
      {
        label: 'Brewed',
        value: 'brewed',
        children: [
          {
            label: 'Drip brewed',
            value: 'drip-brewed'
          },
          {
            label: 'Filtered',
            value: 'filtered'
          },
          {
            label: 'Pour-over',
            value: 'pour-over'
          },
          {
            label: 'Immersion brewed',
            value: 'immersion-brewed'
          }
        ]
      },
      {
        label: 'French press',
        value: 'french-press'
      },
      {
        label: 'Cold brew',
        value: 'cold-brew'
      }
    ]
  },
  {
    label: 'Boiled',
    value: 'boiled',
    children: [
      {
        label: 'Percolated',
        value: 'percolated'
      },
      {
        label: 'Turkish',
        value: 'turkish'
      },
      {
        label: 'Moka',
        value: 'moka'
      }
    ]
  },
  {
    label: 'Espresso',
    value: 'espresso',
    children: [
      {
        label: 'Caffè Americano',
        value: 'caffe-americano'
      },
      {
        label: 'Cafe Lungo',
        value: 'cafe-lungo'
      },
      {
        label: 'Café Cubano',
        value: 'cafe-cubano'
      },
      {
        label: 'Caffè crema',
        value: 'caffe-crema'
      },
      {
        label: 'Cafe Zorro',
        value: 'cafe-zorro'
      },
      {
        label: 'Doppio',
        value: 'doppio'
      },
      {
        label: 'Espresso Romano',
        value: 'espresso-romano'
      },
      {
        label: 'Guillermo',
        value: 'guillermo'
      },
      {
        label: 'Ristretto',
        value: 'ristretto'
      }
    ]
  },
  {
    label: 'Milk coffee',
    value: 'milk-coffee',
    children: [
      {
        label: 'Flat white',
        value: 'flat-white'
      },
      {
        label: 'Latte',
        value: 'latte'
      },
      {
        label: 'Macchiato',
        value: 'macchiato'
      },
      {
        label: 'Cappuccino',
        value: 'cappuccino'
      },
      {
        label: 'White coffee',
        value: 'white-coffee'
      },
      {
        label: 'Flat white',
        value: 'flat-white'
      },
      {
        label: 'Flat white',
        value: 'flat-white'
      }
    ]
  }
]

let dsForStrategy = [
  {
    label: 'Infused',
    value: 'infused',
    children: [
      {
        label: 'Brewed',
        value: 'brewed',
        children: [
          {
            label: 'Drip brewed',
            value: 'drip-brewed'
          },
          {
            label: 'Immersion brewed',
            value: 'immersion-brewed'
          }
        ]
      },
      {
        label: 'French press',
        value: 'french-press'
      }
    ]
  }
]

let dsWithoutGroupValue = omitGroupValue(dsForStrategy, ['infused'])

describe('components/Tree', () => {
  it('should render datasource correctly when `expanded` was not set', () => {
    let wrapper = mount(Tree, {
      propsData: {
        datasource
      },
      sync: false
    })

    expect(wrapper.findAll('.veui-tree-item').length).to.equal(4)
    expect(wrapper.find('.veui-tree-item-group').exists()).to.equal(false)

    wrapper.destroy()
  })

  it('should render datasource correctly when `expanded` was set', () => {
    let wrapper = mount(Tree, {
      propsData: {
        datasource,
        expanded: ['infused', 'brewed']
      },
      sync: false,
      attachToDocument: true
    })

    expect(wrapper.findAll('.veui-tree-item').length).to.equal(11)
    expect(wrapper.findAll('.veui-tree-item-expanded').length).to.equal(2)
    expect(wrapper.findAll('.veui-tree-item-group').length).to.equal(2)
    expect(
      wrapper.find('.veui-tree-item').classes('veui-tree-item-expanded')
    ).to.equal(true)
    expect(
      wrapper
        .find('.veui-tree-item')
        .find('.veui-tree-item')
        .classes('veui-tree-item-expanded')
    ).to.equal(true)

    wrapper.destroy()
  })

  it('should handle select/check/expand priority correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tree': Tree
        },
        data () {
          return {
            datasource,
            selected: [],
            selectable: true,
            checked: [],
            checkable: true,
            expanded: []
          }
        },
        template: `<veui-tree
          :datasource="datasource"
          v-model="checked"
          :expanded.sync="expanded"
          :selected.sync="selected"
          :checkable="checkable"
          :selectable="selectable"
        />
        `
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let { vm } = wrapper

    expect(wrapper.findAll('.veui-tree-item').length).to.equal(4)

    let item = wrapper.find('.veui-tree-item')
    item.find('.veui-tree-item-label').trigger('click')
    await vm.$nextTick()

    expect(wrapper.findAll('.veui-tree-item').length).to.equal(4)
    expect(vm.selected).to.equal('infused')

    vm.selectable = false
    await vm.$nextTick()
    item.find('.veui-tree-item-label').trigger('click')
    await vm.$nextTick()
    expect(vm.checked.length).to.deep.equal(8)

    vm.checkable = false
    await vm.$nextTick()
    item.find('.veui-tree-item-label').trigger('click')
    await vm.$nextTick()
    expect(wrapper.findAll('.veui-tree-item').length).to.equal(7)
    expect(item.classes('veui-tree-item-expanded')).to.equal(true)
    wrapper.destroy()
  })

  it('nodes can be toggled by clicking any part of them by default', async () => {
    let wrapper = mount(Tree, {
      propsData: {
        datasource
      },
      sync: false
    })
    let { vm } = wrapper

    expect(wrapper.findAll('.veui-tree-item').length).to.equal(4)

    let item = wrapper.find('.veui-tree-item')
    item.find('.veui-tree-item-label').trigger('click')
    await vm.$nextTick()

    expect(wrapper.findAll('.veui-tree-item').length).to.equal(7)
    expect(item.classes('veui-tree-item-expanded')).to.equal(true)

    item.find('.veui-tree-item-expand-switcher').trigger('click')
    await vm.$nextTick()

    expect(wrapper.findAll('.veui-tree-item').length).to.equal(4)
    expect(item.classes('veui-tree-item-expanded')).to.equal(false)
    wrapper.destroy()
  })

  it('should render item scoped-slot correctly', () => {
    let wrapper = mount(Tree, {
      propsData: {
        datasource
      },
      scopedSlots: {
        item:
          '<div class="test-item-slot" slot-scope="props">{{props.item.label}} item slot</div>'
      },
      sync: false
    })

    expect(wrapper.find('.test-item-slot').exists()).to.equal(true)
    expect(wrapper.find('.test-item-slot').text()).to.equal('Infused item slot')

    wrapper.destroy()
  })

  it('should render item-label scoped-slot correctly', async () => {
    let wrapper = mount(Tree, {
      scopedSlots: {
        'item-label':
          '<div class="test-item-label-slot" slot-scope="props">{{props.item.label}} item-label slot</div>'
      },
      sync: false
    })
    wrapper.setProps({ datasource })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.test-item-label-slot').exists()).to.equal(true)
    expect(wrapper.find('.test-item-label-slot').text()).to.equal(
      'Infused item-label slot'
    )

    wrapper.destroy()
  })

  it('should sync expanded status correctly when toggling a node', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tree': Tree
        },
        data () {
          return {
            expanded: ['infused'],
            datasource
          }
        },
        template:
          '<veui-tree :datasource="datasource" :expanded.sync="expanded" />'
      },
      {
        sync: false
      }
    )
    let { vm } = wrapper

    expect(
      wrapper.find('.veui-tree-item').classes('veui-tree-item-expanded')
    ).to.equal(true)

    wrapper
      .findAll('.veui-tree-item')
      .at(4)
      .find('.veui-tree-item-expand-switcher')
      .trigger('click')
    await vm.$nextTick()

    expect(vm.expanded.indexOf('boiled') > -1).to.equal(true)
    expect(
      wrapper
        .findAll('.veui-tree-item')
        .at(4)
        .classes('veui-tree-item-expanded')
    ).to.equal(true)

    wrapper
      .findAll('.veui-tree-item')
      .at(1)
      .find('.veui-tree-item-expand-switcher')
      .trigger('click')
    await vm.$nextTick()

    expect(vm.expanded.indexOf('brewed') > -1).to.equal(true)
    expect(
      wrapper
        .findAll('.veui-tree-item')
        .at(1)
        .classes('veui-tree-item-expanded')
    ).to.equal(true)

    wrapper
      .findAll('.veui-tree-item')
      .at(1)
      .find('.veui-tree-item-expand-switcher')
      .trigger('click')
    await vm.$nextTick()

    expect(vm.expanded.indexOf('brewed') > -1).to.equal(false)
    expect(
      wrapper
        .findAll('.veui-tree-item')
        .at(1)
        .classes('veui-tree-item-expanded')
    ).to.equal(false)

    wrapper
      .findAll('.veui-tree-item')
      .at(4)
      .find('.veui-tree-item-expand-switcher')
      .trigger('click')
    await vm.$nextTick()

    expect(vm.expanded.indexOf('boiled') > -1).to.equal(false)
    expect(
      wrapper
        .findAll('.veui-tree-item')
        .at(4)
        .classes('veui-tree-item-expanded')
    ).to.equal(false)

    wrapper.destroy()
  })

  it('should handle click event correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tree': Tree
        },
        data () {
          return {
            datasource
          }
        },
        methods: {
          handleClick (item, parents, index, depth) {
            expect(item.value).to.equal('infused')
            expect(parents).to.deep.equal([])
            expect(index).to.equal(0)
            expect(depth).to.equal(1)
          }
        },
        template:
          '<veui-tree :datasource="datasource" @click="handleClick" item-click="toggle" />'
      },
      {
        sync: false
      }
    )
    let { vm } = wrapper

    await vm.$nextTick()
    wrapper.find('.veui-tree-item').trigger('click')

    wrapper.destroy()
  })

  it('should handle keyboard event correctly', async () => {
    let wrapper = mount(Tree, {
      propsData: {
        datasource
      },
      attachToDocument: true,
      sync: false
    })
    let { vm } = wrapper

    wrapper.find('.veui-tree-item').trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()

    expect(
      wrapper.find('.veui-tree-item').classes('veui-tree-item-expanded')
    ).to.equal(true)

    wrapper.find('.veui-tree-item').trigger('keydown', { key: 'Left' })
    await vm.$nextTick()

    expect(
      wrapper.find('.veui-tree-item').classes('veui-tree-item-expanded')
    ).to.equal(false)

    let first = wrapper.find('.veui-tree > li:first-child .veui-tree-item')
    let last = wrapper.find('.veui-tree > li:last-child .veui-tree-item')

    last.trigger('keydown', { key: 'Home' })
    await vm.$nextTick()
    expect(first.attributes().tabindex).to.include('0')

    first.trigger('keydown', { key: 'End' })
    await vm.$nextTick()
    expect(last.attributes().tabindex).to.include('0')

    wrapper.find('.veui-tree-item').trigger('keydown', { key: 'Right' })
    await vm.$nextTick()

    expect(
      wrapper.find('.veui-tree-item').classes('veui-tree-item-expanded')
    ).to.equal(true)

    wrapper.find('.veui-tree-item').trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()

    expect(
      wrapper.find('.veui-tree-item').classes('veui-tree-item-expanded')
    ).to.equal(false)

    wrapper.destroy()
  })

  it('should parse checked and handle check correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tree': Tree
        },
        data () {
          return {
            datasource,
            checked: ['filtered'],
            expanded: ['infused', 'brewed', 'boiled']
          }
        },
        template:
          '<veui-tree :datasource="datasource" v-model="checked" :expanded.sync="expanded" checkable/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let checkboxes = wrapper.findAll(Checkbox)
    expect(checkboxes.at(0).props('indeterminate')).to.equal(true)
    expect(checkboxes.at(1).props('indeterminate')).to.equal(true)
    expect(checkboxes.at(2).props('checked')).to.equal(false)
    expect(checkboxes.at(3).props('checked')).to.equal(true)

    // select leaf
    select(2)
    await wrapper.vm.$nextTick()

    let data = wrapper.vm.$data
    expect(data.checked).to.deep.equal(['drip-brewed', 'filtered'])
    expect(checkboxes.at(2).props('checked')).to.equal(true)

    // remove all leaves
    // 现在每次 select 好像都要等下
    select(2)
    await wrapper.vm.$nextTick()
    select(3)
    await wrapper.vm.$nextTick()
    expect(data.checked).to.deep.equal([])
    expect(checkboxes.at(0).props('indeterminate')).to.equal(false)
    expect(checkboxes.at(1).props('indeterminate')).to.equal(false)
    expect(checkboxes.at(2).props('checked')).to.equal(false)
    expect(checkboxes.at(3).props('checked')).to.equal(false)

    // select middle node 'brewed'
    select(1)
    await wrapper.vm.$nextTick()
    unorderedEqual(data.checked, [
      'brewed',
      'drip-brewed',
      'filtered',
      'pour-over',
      'immersion-brewed'
    ])
    expect(checkboxes.at(0).props('indeterminate')).to.equal(true)
    expect(checkboxes.at(1).props('checked')).to.equal(true)
    expect(checkboxes.at(2).props('checked')).to.equal(true)
    expect(checkboxes.at(3).props('checked')).to.equal(true)
    expect(checkboxes.at(4).props('checked')).to.equal(true)
    expect(checkboxes.at(5).props('checked')).to.equal(true)

    // select leaf 'turkish' under another middle node 'boiled'
    select(10)
    await wrapper.vm.$nextTick()
    unorderedEqual(data.checked, [
      'brewed',
      'drip-brewed',
      'filtered',
      'pour-over',
      'immersion-brewed',
      'turkish'
    ])

    // remove middle node 'brewed'
    checkboxes
      .at(1)
      .find('input[type="checkbox"]')
      .trigger('change')
    await wrapper.vm.$nextTick()
    expect(data.checked).to.deep.equal(['turkish'])

    wrapper.destroy()

    function select (index) {
      checkboxes
        .at(index)
        .find('input[type="checkbox"]')
        .trigger('change')
    }
  })

  it('should handle disabled items correctly.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tree': Tree
        },
        data () {
          return {
            datasource: [
              {
                label: 'Infused',
                value: 'infused',
                children: [
                  {
                    label: 'Brewed',
                    value: 'brewed',
                    children: [
                      {
                        label: 'Drip brewed',
                        value: 'drip-brewed'
                      },
                      {
                        label: 'Filtered',
                        value: 'filtered',
                        disabled: true
                      },
                      {
                        label: 'Pour-over',
                        value: 'pour-over',
                        disabled: true
                      },
                      {
                        label: 'Immersion brewed',
                        value: 'immersion-brewed'
                      }
                    ]
                  },
                  {
                    label: 'French press',
                    value: 'french-press'
                  },
                  {
                    label: 'Cold brew',
                    value: 'cold-brew'
                  },
                  {
                    label: 'Cold Group',
                    value: 'cold-group',
                    disabled: true,
                    children: [
                      {
                        label: 'Cold1',
                        value: 'cold1'
                      }
                    ]
                  }
                ]
              }
            ],
            checked: ['filtered', 'cold-brew'],
            expanded: ['infused', 'brewed']
          }
        },
        template:
          '<veui-tree :datasource="datasource" v-model="checked" :expanded.sync="expanded" checkable/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    let checkboxes = wrapper.findAll(Checkbox)

    // select 'drip-brewed'
    select(2)
    await vm.$nextTick()
    // select 'immersion-brewed'
    select(5)
    await vm.$nextTick()

    unorderedEqual(vm.checked, [
      'drip-brewed',
      'filtered',
      'immersion-brewed',
      'cold-brew'
    ])
    expect(checkboxes.at(0).props('indeterminate')).to.equal(true)
    expect(checkboxes.at(0).props('checked')).to.equal(false)
    expect(checkboxes.at(1).props('indeterminate')).to.equal(true)
    // 修改：以前除了disabled是禁用的之外都是选中的则，group 认为是 checked？
    expect(checkboxes.at(1).props('checked')).to.equal(false)

    // remove children of brewed
    select(1)
    await vm.$nextTick()

    expect(vm.checked).to.deep.equal(['filtered', 'cold-brew'])
    expect(checkboxes.at(0).props('indeterminate')).to.equal(true)
    expect(checkboxes.at(0).props('checked')).to.equal(false)
    expect(checkboxes.at(1).props('indeterminate')).to.equal(true)
    expect(checkboxes.at(1).props('checked')).to.equal(false)

    // can't select leafs of disabled parent
    select(checkboxes.length - 1)
    await vm.$nextTick()
    expect(vm.checked).to.deep.equal(['filtered', 'cold-brew'])

    // 全选不能选中 disabled 的
    vm.checked = null
    await vm.$nextTick()
    select(0)
    await vm.$nextTick()
    unorderedEqual(vm.checked, [
      'drip-brewed',
      'immersion-brewed',
      'french-press',
      'cold-brew'
    ])

    wrapper.destroy()

    function select (index) {
      checkboxes
        .at(index)
        .find('input[type="checkbox"]')
        .trigger('change')
    }
  })

  it('should handle downwards mergeChecked correctly.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tree': Tree
        },
        data () {
          return {
            datasource: dsForStrategy,
            checked: [],
            expanded: ['infused', 'brewed']
          }
        },
        template:
          '<veui-tree :datasource="datasource" v-model="checked" merge-checked="downwards" :expanded.sync="expanded" checkable/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let checkboxes = wrapper.findAll(Checkbox)
    let { vm } = wrapper
    // 全选
    select(0)
    await vm.$nextTick()
    expect(vm.checked).to.deep.equal([
      'drip-brewed',
      'immersion-brewed',
      'french-press'
    ])
    // 取消
    select(0)
    await vm.$nextTick()
    expect(vm.checked.length).to.equal(0)

    select(1)
    await vm.$nextTick()
    expect(vm.checked).to.deep.equal(['drip-brewed', 'immersion-brewed'])

    select(2)
    await vm.$nextTick()
    expect(vm.checked).to.deep.equal(['immersion-brewed'])

    select(1)
    await vm.$nextTick()
    expect(vm.checked.length).to.equal(0)

    // 全选
    select(0)
    await vm.$nextTick()
    select(1)
    await vm.$nextTick()
    expect(vm.checked).to.deep.equal(['french-press'])
    wrapper.destroy()

    function select (index) {
      checkboxes
        .at(index)
        .find('input[type="checkbox"]')
        .trigger('change')
    }
  })

  it('should handle upwards mergeChecked correctly.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tree': Tree
        },
        data () {
          return {
            datasource: dsForStrategy,
            checked: [],
            expanded: ['infused', 'brewed']
          }
        },
        template:
          '<veui-tree :datasource="datasource" v-model="checked" merge-checked="upwards" :expanded.sync="expanded" checkable/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let checkboxes = wrapper.findAll(Checkbox)
    let { vm } = wrapper
    // 全选
    select(0)
    await vm.$nextTick()
    expect(vm.checked).to.deep.equal(['infused'])

    // 取消全选
    select(0)
    await vm.$nextTick()
    expect(vm.checked.length).to.equal(0)

    // 选中 brewed 组
    select(1)
    await vm.$nextTick()
    expect(vm.checked).to.deep.equal(['brewed'])

    // 取消 brewed 组下 drip-brewed
    select(2)
    await vm.$nextTick()
    expect(vm.checked).to.deep.equal(['immersion-brewed'])

    // 选中最后剩余项
    select(2)
    await vm.$nextTick()
    expect(vm.checked).to.deep.equal(['brewed'])
    select(4)
    await vm.$nextTick()
    expect(vm.checked).to.deep.equal(['infused'])

    // 取消 brewed 组
    select(1)
    await vm.$nextTick()
    expect(vm.checked).to.deep.equal(['french-press'])

    select(1)
    await vm.$nextTick()
    expect(vm.checked).to.deep.equal(['infused'])
    // 取消 brewed 组下 drip-brewed
    select(2)
    await vm.$nextTick()
    expect(vm.checked).to.deep.equal(['immersion-brewed', 'french-press'])

    select(0)
    await vm.$nextTick()
    expect(vm.checked.length).to.equal(0)

    wrapper.destroy()

    function select (index) {
      checkboxes
        .at(index)
        .find('input[type="checkbox"]')
        .trigger('change')
    }
  })

  it('should handle keep-all mergeChecked correctly.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tree': Tree
        },
        data () {
          return {
            datasource: dsForStrategy,
            checked: [],
            expanded: ['infused', 'brewed']
          }
        },
        template:
          '<veui-tree :datasource="datasource" v-model="checked" merge-checked="keep-all" :expanded.sync="expanded" checkable/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let checkboxes = wrapper.findAll(Checkbox)
    let { vm } = wrapper
    // 全选
    select(0)
    await vm.$nextTick()
    unorderedEqual(vm.checked, [
      'drip-brewed',
      'immersion-brewed',
      'brewed',
      'french-press',
      'infused'
    ])

    // 取消全选
    select(0)
    await vm.$nextTick()
    expect(vm.checked.length).to.equal(0)

    // 选中 brewed 组
    select(1)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['drip-brewed', 'immersion-brewed', 'brewed'])

    // 取消 brewed 组下 drip-brewed
    select(2)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['immersion-brewed'])

    // 取消 brewed 组下 immersion-brewed
    select(3)
    await vm.$nextTick()
    expect(vm.checked.length).to.equal(0)

    // 选中 french-press
    select(4)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['french-press'])

    select(3)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['french-press', 'immersion-brewed'])

    select(2)
    await vm.$nextTick()
    unorderedEqual(vm.checked, [
      'drip-brewed',
      'immersion-brewed',
      'brewed',
      'french-press',
      'infused'
    ])

    select(4)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['drip-brewed', 'immersion-brewed', 'brewed'])

    select(1)
    await vm.$nextTick()
    expect(vm.checked.length).to.equal(0)

    wrapper.destroy()

    function select (index) {
      checkboxes
        .at(index)
        .find('input[type="checkbox"]')
        .trigger('change')
    }
  })

  it('should handle include-indeterminate correctly.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tree': Tree
        },
        data () {
          return {
            datasource: dsForStrategy,
            checked: [],
            expanded: ['infused', 'brewed']
          }
        },
        template:
          '<veui-tree :datasource="datasource" v-model="checked" include-indeterminate :expanded.sync="expanded" checkable/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let checkboxes = wrapper.findAll(Checkbox)
    let { vm } = wrapper
    // 全选
    select(0)
    await vm.$nextTick()
    unorderedEqual(vm.checked, [
      'drip-brewed',
      'immersion-brewed',
      'brewed',
      'french-press',
      'infused'
    ])

    // 取消全选
    select(0)
    await vm.$nextTick()
    expect(vm.checked.length).to.equal(0)

    // 选中 brewed 组
    select(1)
    await vm.$nextTick()
    unorderedEqual(vm.checked, [
      'drip-brewed',
      'immersion-brewed',
      'brewed',
      'infused'
    ])

    // 取消 brewed 组下 drip-brewed
    select(2)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['immersion-brewed', 'brewed', 'infused'])

    // 取消 brewed 组下 immersion-brewed
    select(3)
    await vm.$nextTick()
    expect(vm.checked.length).to.equal(0)

    // 选中 french-press
    select(4)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['french-press', 'infused'])

    select(3)
    await vm.$nextTick()
    unorderedEqual(vm.checked, [
      'french-press',
      'immersion-brewed',
      'brewed',
      'infused'
    ])

    select(2)
    await vm.$nextTick()
    unorderedEqual(vm.checked, [
      'drip-brewed',
      'immersion-brewed',
      'brewed',
      'french-press',
      'infused'
    ])

    select(4)
    await vm.$nextTick()
    unorderedEqual(vm.checked, [
      'drip-brewed',
      'immersion-brewed',
      'brewed',
      'infused'
    ])

    select(1)
    await vm.$nextTick()
    expect(vm.checked.length).to.equal(0)

    wrapper.destroy()

    function select (index) {
      checkboxes
        .at(index)
        .find('input[type="checkbox"]')
        .trigger('change')
    }
  })

  it('should handle groups without value correctly.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tree': Tree
        },
        data () {
          return {
            datasource: dsWithoutGroupValue,
            checked: [],
            expanded: ['infused', 'brewed']
          }
        },
        template:
          '<veui-tree :datasource="datasource" v-model="checked" merge-checked="upwards" :expanded.sync="expanded" checkable/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let checkboxes = wrapper.findAll(Checkbox)
    let { vm } = wrapper
    // 全选
    select(0)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['infused'])

    // 取消全选
    select(0)
    await vm.$nextTick()
    expect(vm.checked.length).to.equal(0)

    // 选中 brewed 组
    select(1)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['drip-brewed', 'immersion-brewed'])

    // 取消 brewed 组下 drip-brewed
    select(2)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['immersion-brewed'])

    // 取消 brewed 组下 immersion-brewed
    select(3)
    await vm.$nextTick()
    expect(vm.checked.length).to.equal(0)

    // 选中 french-press
    select(4)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['french-press'])

    // 全选之后再选中一个叶子，无 value 的 group 的子还要都是选中的
    vm.checked = ['infused']
    await vm.$nextTick()
    select(4)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['drip-brewed', 'immersion-brewed'])
    select(4)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['infused'])
    select(2)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['immersion-brewed', 'french-press'])

    wrapper.destroy()

    function select (index) {
      checkboxes
        .at(index)
        .find('input[type="checkbox"]')
        .trigger('change')
    }
  })

  it('should handle imcomplete data between keep-all, upwards and downwards strategies correctly.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tree': Tree
        },
        data () {
          return {
            datasource: dsForStrategy,
            checked: [],
            expanded: ['infused', 'brewed'],
            mergeChecked: 'upwards'
          }
        },
        template:
          '<veui-tree :datasource="datasource" v-model="checked" :merge-checked="mergeChecked" :expanded.sync="expanded" checkable/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let checkboxes = wrapper.findAll(Checkbox)
    let { vm } = wrapper
    // 全选
    select(0)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['infused'])

    // 在 all 策略下的全选（但此时 value 是 infused）下取消 french-press 也能正确同步
    vm.mergeChecked = 'keep-all'
    await vm.$nextTick()
    select(4)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['brewed', 'drip-brewed', 'immersion-brewed'])

    // 在 leaf 策略下的再选中 french-press 能正确同步
    vm.mergeChecked = 'downwards'
    await vm.$nextTick()
    select(4)
    await vm.$nextTick()
    unorderedEqual(vm.checked, [
      'drip-brewed',
      'immersion-brewed',
      'french-press'
    ])
    vm.checked = ['brewed']
    await vm.$nextTick()
    select(4)
    await vm.$nextTick()
    unorderedEqual(vm.checked, [
      'drip-brewed',
      'immersion-brewed',
      'french-press'
    ])

    vm.mergeChecked = 'upwards'
    await vm.$nextTick()
    select(4)
    await vm.$nextTick()
    unorderedEqual(vm.checked, ['brewed'])
    vm.checked = ['drip-brewed', 'immersion-brewed']
    await vm.$nextTick()
    select(4)
    unorderedEqual(vm.checked, ['infused'])

    wrapper.destroy()

    function select (index) {
      checkboxes
        .at(index)
        .find('input[type="checkbox"]')
        .trigger('change')
    }
  })
})

function unorderedEqual (a, b) {
  expect(a)
    .to.have.members(b)
    .and.to.have.lengthOf(b.length)
}

function omitGroupValue (original, except) {
  except = except || []
  return original.map(i => {
    i = { ...i }
    if (i.children && i.children.length) {
      if (except.indexOf(i.value) === -1) {
        i.name = i.value
        delete i.value
      }
      i.children = omitGroupValue(i.children)
    }
    return i
  })
}
