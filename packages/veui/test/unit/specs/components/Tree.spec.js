import { mount, createLocalVue } from '@vue/test-utils'
import Tree from '@/components/Tree'
import Vue from 'vue';

const datasource = [
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
];

describe('components/Tree', () => {

  it('should render item slot', () => {
    expect(
      mount(
        Tree,
        {
          localVue: createLocalVue(),
          propsData: {
            datasource,
            expanded: ['Infused']
          },
          scopedSlots: {
            item: '<div class="test-item-slot" slot-scope="props">{{props.item.label}}</div>'
          }
        }
      ).find('.test-item-slot').exists())
    .toBe(true)
  })

  it('should render item-label slot', () => {
    expect(
      mount(
        Tree,
        {
          localVue: createLocalVue(),
          propsData: {
            datasource,
            expanded: ['Infused']
          },
          scopedSlots: {
            'item-label': '<div class="test-item-label-slot" slot-scope="props">{{props.item.label}}</div>'
          }
        }
      ).find('.test-item-label-slot').exists())
    .toBe(true)
  })

  it('should sync expanded status when click the item', done => {
    const localVue = createLocalVue()
    const WrapperTree = {
      components: {
        'veui-tree': Tree,
      },
      data() {
        return {
          expanded: ['Infused'],
          datasource
        }
      },
      template: '<veui-tree :datasource="datasource" :expanded.sync="expanded" />'
    }
    const wrapper = mount(WrapperTree, {localVue})
    expect(wrapper.findAll('.veui-tree-item').at(0).classes('veui-tree-item-expanded')).toBe(true)
    wrapper.findAll('.veui-tree-item').at(2).find('.veui-tree-item-expand-switcher').trigger('click')
    localVue.nextTick(() => {
      expect(wrapper.vm.expanded.indexOf('Boiled') > -1).toBe(true)
      expect(wrapper.findAll('.veui-tree-item').at(2).classes('veui-tree-item-expanded')).toBe(true)
      done()
    })
  })

})
