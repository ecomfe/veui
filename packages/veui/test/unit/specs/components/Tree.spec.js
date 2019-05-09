import { mount } from '@vue/test-utils'
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
  it('should render item slot', done => {
    new Vue({
      el: document.createElement('div'),
      components: {
        'veui-tree': Tree
      },
      data() {
        return {datasource, expanded: ['Infused']}
      },
      mounted() {
        expect(this.$el.querySelector('.test-item-slot')).not.toBe(null)
        done()
      },
      template: `
        <veui-tree :datasource="datasource" :expanded.sync="expanded">
          <div
            slot="item"
            slot-scope="props"
            class="test-item-slot">
            {{ props.item.label }}
          </div>
        </veui-tree>
      `
    })
  })

  it('should render item-label slot', done => {
    new Vue({
      el: document.createElement('div'),
      components: {
        'veui-tree': Tree
      },
      data() {
        return {datasource, expanded: ['Infused']}
      },
      mounted() {
        expect(this.$el.querySelector('.test-item-label-slot')).not.toBe(null)
        done()
      },
      template: `
        <veui-tree :datasource="datasource" :expanded.sync="expanded">
          <div
            slot="item-label"
            slot-scope="props"
            class="test-item-label-slot">
            {{ props.item.label }}
          </div>
        </veui-tree>
      `
    })
  })

  it('should sync expanded status when click the item', done => {
    new Vue({
      el: document.createElement('div'),
      components: {
        'veui-tree': Tree
      },
      data() {
        return {datasource, expanded: ['Infused']}
      },
      mounted() {
        let $items = this.$el.querySelectorAll('.veui-tree-item')
        expect($items[0].classList.contains('veui-tree-item-expanded')).toBe(true)
        $items[2].querySelector('.veui-tree-item-expand-switcher')
          .dispatchEvent(new Event('click'))
        setTimeout(() => {
          expect(this.expanded.indexOf('Boiled') > -1).toBe(true)
          done()
        })
      },
      template: `
        <veui-tree :datasource="datasource" :expanded.sync="expanded">
          <div
            slot="item-label"
            slot-scope="props">
            {{ props.item.label }}
          </div>
        </veui-tree>
      `
    })
  })
})
