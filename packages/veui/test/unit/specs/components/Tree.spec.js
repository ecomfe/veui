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
    expect(data.checked).to.deep.equal([
      'drip-brewed',
      'filtered',
      'pour-over',
      'immersion-brewed',
      'brewed'
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
    expect(data.checked).to.deep.equal([
      'drip-brewed',
      'filtered',
      'pour-over',
      'immersion-brewed',
      'brewed',
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

    let checkboxes = wrapper.findAll(Checkbox)

    // select 'drip-brewed'
    select(2)
    await wrapper.vm.$nextTick()
    // select 'immersion-brewed'
    select(5)
    await wrapper.vm.$nextTick()

    let data = wrapper.vm.$data
    expect(data.checked).to.deep.equal([
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
    await wrapper.vm.$nextTick()

    expect(data.checked).to.deep.equal(['filtered', 'cold-brew'])
    expect(checkboxes.at(0).props('indeterminate')).to.equal(true)
    expect(checkboxes.at(0).props('checked')).to.equal(false)
    expect(checkboxes.at(1).props('indeterminate')).to.equal(true)
    expect(checkboxes.at(1).props('checked')).to.equal(false)

    wrapper.destroy()

    function select (index) {
      checkboxes
        .at(index)
        .find('input[type="checkbox"]')
        .trigger('change')
    }
  })
})
