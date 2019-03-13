import Vue from 'vue'
import Transfer from '@/components/Transfer'

describe('components/Transfer', () => {
  it('should handle datasource change correctly.', done => {
    let wrapper = document.createElement('div')
    document.body.appendChild(wrapper)
    new Vue({
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
      async mounted () {
        expect(this.$el.querySelectorAll('.veui-transfer-candidate-item').length).toBe(3)
        this.items = [
          { label: '1', value: '1' },
          { label: '2', value: '2' }
        ]
        await this.$nextTick()
        expect(this.$el.querySelectorAll('.veui-transfer-candidate-item').length).toBe(2)
        done()
      },
      template: '<veui-transfer :datasource="items"/>'
    }).$mount(wrapper)
  })
})

describe('components/Transfer', () => {
  it('should handle selected change correctly.', done => {
    let wrapper = document.createElement('div')
    document.body.appendChild(wrapper)
    new Vue({
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
      async mounted () {
        expect(this.$el.querySelectorAll('.veui-transfer-selected-item').length).toBe(2)
        this.selected = []
        await this.$nextTick()
        expect(this.$el.querySelectorAll('.veui-transfer-selected-item').length).toBe(0)
        done()
      },
      template: '<veui-transfer :datasource="items" v-model="selected" />'
    }).$mount(wrapper)
  })
})
