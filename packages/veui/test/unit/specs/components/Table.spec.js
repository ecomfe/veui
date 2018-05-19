import Table from 'veui/components/Table'
import Column from 'veui/components/Table/Column'
import Vue from 'vue'
import { cloneDeep } from 'lodash'

function create (options) {
  new Vue({
    el: document.createElement('div'),
    components: {
      'veui-table': Table,
      'veui-table-column': Column
    },
    ...options
  })
}

describe('components/Table', () => {
  it('should select the specified fields.', done => {
    create({
      data () {
        return {
          data: [
            {
              field1: 'haha',
              field2: 11
            },
            {
              field1: 'heihei',
              field2: 22
            },
            {
              field1: 'heihei111',
              field2: 33
            },
            {
              field1: 'heihei1112333',
              field2: 44
            }
          ],
          selected: []
        }
      },
      mounted () {
        const checkboxList = this.$el.querySelectorAll('td input[type="checkbox"]')

        checkboxList[0].dispatchEvent(new MouseEvent('click'))
        expect(this.selected[0]).toBe('11')

        checkboxList[1].dispatchEvent(new MouseEvent('click'))
        expect(this.selected[1]).toBe('22')

        done()
      },
      template: `
        <veui-table :data="data" keys="field2" selectable :selected.sync="selected">
          <veui-table-column field="field1"></veui-table-column>
        </veui-table>`
    })
  })

  it('should not fire change event if selected value is not changed.', done => {
    create({
      data () {
        return {
          data: [
            {
              field1: 'haha',
              field2: 11
            },
            {
              field1: 'heihei',
              field2: 22
            },
            {
              field1: 'heihei111',
              field2: 33
            },
            {
              field1: 'heihei1112333',
              field2: 44
            }
          ],
          selected: [],
          counter: 0
        }
      },
      mounted () {
        const checkboxList = this.$el.querySelectorAll('td input[type="checkbox"]')

        checkboxList[0].dispatchEvent(new MouseEvent('click'))
        setTimeout(() => {
          checkboxList[2].dispatchEvent(new MouseEvent('click'))

          setTimeout(() => {
            expect(this.counter).toBe(2)
            this.data = cloneDeep(this.data)

            setTimeout(() => {
              expect(this.counter).toBe(2)
              done()
            })
          })
        })
      },
      methods: {
        handleSelected () {
          this.counter++
        }
      },
      template: `
        <veui-table :data="data" selectable :selected.sync="selected" @update:selected="handleSelected">
          <veui-table-column field="field1"></veui-table-column>
        </veui-table>`
    })
  })

  it('should emit `select` event before `update:selected` event.', done => {
    create({
      data () {
        return {
          data: [
            {
              field1: 'haha',
              field2: 11
            }
          ],
          isSelectEmitted: false
        }
      },
      mounted () {
        const checkboxList = this.$el.querySelectorAll('td input[type="checkbox"]')
        checkboxList[0].dispatchEvent(new MouseEvent('click'))
      },
      methods: {
        handleSelect () {
          this.isSelectEmitted = true
        },
        handleUpdateSelected () {
          expect(this.isSelectEmitted).toBe(true)
          done()
        }
      },
      template: `
        <veui-table :data="data" selectable @select="handleSelect" @update:selected="handleUpdateSelected">
          <veui-table-column field="field1"></veui-table-column>
        </veui-table>`
    })
  })
})
