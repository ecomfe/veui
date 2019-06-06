import { mount } from '@vue/test-utils'
import Tree from '@/components/Tree'

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
      }
    })

    expect(wrapper.findAll('.veui-tree-item').length).to.equal(4)
    expect(wrapper.find('.veui-tree-item-group').exists()).to.equal(false)

    wrapper.destroy()
  })

  it('should render datasource correctly when`expanded` was set', () => {
    let wrapper = mount(Tree, {
      propsData: {
        datasource,
        expanded: ['infused', 'brewed']
      }
    })

    expect(wrapper.findAll('.veui-tree-item').length).to.equal(11)
    expect(wrapper.findAll('.veui-tree-item-expanded').length).to.equal(2)
    expect(wrapper.findAll('.veui-tree-item-group').length).to.equal(2)
    expect(
      wrapper
        .find('.veui-tree-item')
        .classes('veui-tree-item-expanded')
    ).to.equal(true)
    expect(
      wrapper
        .find('.veui-tree-item')
        .find('.veui-tree-item')
        .classes('veui-tree-item-expanded')
    ).to.equal(true)

    wrapper.destroy()
  })

  it('nodes can only be toggled by clicking toggle buttons when `item-click` was not set', async () => {
    let wrapper = mount(Tree, {
      propsData: {
        datasource
      }
    })
    let { vm } = wrapper

    expect(wrapper.findAll('.veui-tree-item').length).to.equal(4)

    let item = wrapper.find('.veui-tree-item')
    item.find('.veui-tree-item-label').trigger('click')
    await vm.$nextTick()

    expect(wrapper.findAll('.veui-tree-item').length).to.equal(4)
    expect(item.classes('veui-tree-item-expanded')).to.equal(false)

    item.find('.veui-tree-item-expand-switcher').trigger('click')
    await vm.$nextTick()

    expect(wrapper.findAll('.veui-tree-item').length).to.equal(7)
    expect(item.classes('veui-tree-item-expanded')).to.equal(true)

    wrapper.destroy()
  })

  it('nodes can be toggled by clicking any part of them when `item-click` was not set', async () => {
    let wrapper = mount(Tree, {
      propsData: {
        datasource,
        itemClick: 'toggle'
      }
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
      }
    })

    expect(wrapper.find('.test-item-slot').exists()).to.equal(true)
    expect(wrapper.find('.test-item-slot').text()).to.equal('Infused item slot')

    wrapper.destroy()
  })

  it('should render item-label scoped-slot correctly', () => {
    let wrapper = mount(Tree, {
      propsData: {
        datasource
      },
      scopedSlots: {
        'item-label':
          '<div class="test-item-label-slot" slot-scope="props">{{props.item.label}} item-label slot</div>'
      }
    })

    expect(wrapper.find('.test-item-label-slot').exists()).to.equal(true)
    expect(wrapper.find('.test-item-label-slot').text()).to.equal('Infused item-label slot')

    wrapper.destroy()
  })

  it('should sync expanded status correctly when toggling a node', async () => {
    let wrapper = mount({
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
    })
    let { vm } = wrapper

    expect(
      wrapper
        .find('.veui-tree-item')
        .classes('veui-tree-item-expanded')
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
    let wrapper = mount({
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
    })
    let { vm } = wrapper

    wrapper.find('.veui-tree-item').trigger('click')
    await vm.$nextTick()

    wrapper.destroy()
  })

  it('should handle keyboard event correctly', async () => {
    let wrapper = mount(Tree, {
      propsData: {
        datasource
      },
      attachToDocument: true
    })
    let { vm } = wrapper

    wrapper.find('.veui-tree-item').trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()

    expect(wrapper.find('.veui-tree-item').classes('focus-visible')).to.equal(true)
    expect(wrapper.find('.veui-tree-item').classes('veui-tree-item-expanded')).to.equal(true)

    wrapper.find('.veui-tree-item').trigger('keydown', { key: 'Left' })
    await vm.$nextTick()

    expect(wrapper.find('.veui-tree-item').classes('veui-tree-item-expanded')).to.equal(false)

    wrapper.find('.veui-tree-item').trigger('keydown', { key: 'Right' })
    await vm.$nextTick()

    expect(wrapper.find('.veui-tree-item').classes('veui-tree-item-expanded')).to.equal(true)

    wrapper.find('.veui-tree-item').trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()

    expect(wrapper.find('.veui-tree-item').classes('veui-tree-item-expanded')).to.equal(false)

    wrapper.find('.veui-tree-item').trigger('blur')
    await vm.$nextTick()

    expect(
      wrapper
        .findAll('.veui-tree-item')
        .at(0)
        .classes('focus-visible')
    ).to.equal(false)

    wrapper.destroy()
  })
})
