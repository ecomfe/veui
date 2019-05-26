import { mount, createLocalVue } from '@vue/test-utils'
import Tree from '@/components/Tree'

let datasource = [
  {
    label: 'Infused',
    value: 'Infused',
    children: [
      {
        label: 'Filtered',
        value: 'Filtered'
      }
    ]
  },
  {
    label: 'Boiled',
    value: 'Boiled',
    children: [
      {
        label: 'Brewed',
        value: 'Brewed'
      }
    ]
  }
]

describe('components/Tree', () => {
  it('should render item slot', () => {
    let wrapper = mount(Tree, {
      localVue: createLocalVue(),
      propsData: {
        datasource,
        expanded: ['Infused']
      },
      scopedSlots: {
        item:
          '<div class="test-item-slot" slot-scope="props">{{props.item.label}}</div>'
      }
    })

    expect(wrapper.find('.test-item-slot').exists()).to.be.equal(true)

    wrapper.destroy()
  })

  it('should render item-label slot', () => {
    let wrapper = mount(Tree, {
      localVue: createLocalVue(),
      propsData: {
        datasource,
        expanded: ['Infused']
      },
      scopedSlots: {
        'item-label':
          '<div class="test-item-label-slot" slot-scope="props">{{props.item.label}}</div>'
      }
    })

    expect(wrapper.find('.test-item-label-slot').exists()).to.be.equal(true)

    wrapper.destroy()
  })

  it('should sync expanded status when click the item', async () => {
    let localVue = createLocalVue()
    let WrapperTree = {
      components: {
        'veui-tree': Tree
      },
      data () {
        return {
          expanded: ['Infused'],
          datasource
        }
      },
      template:
        '<veui-tree :datasource="datasource" :expanded.sync="expanded" />'
    }

    let wrapper = mount(WrapperTree, { localVue })
    expect(
      wrapper
        .findAll('.veui-tree-item')
        .at(0)
        .classes('veui-tree-item-expanded')
    ).to.be.equal(true)

    wrapper
      .findAll('.veui-tree-item')
      .at(2)
      .find('.veui-tree-item-expand-switcher')
      .trigger('click')

    await localVue.nextTick()

    expect(wrapper.vm.expanded.indexOf('Boiled') > -1).to.be.equal(true)
    expect(
      wrapper
        .findAll('.veui-tree-item')
        .at(2)
        .classes('veui-tree-item-expanded')
    ).to.be.equal(true)

    wrapper.destroy()
  })
})
