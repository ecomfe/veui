import { mount } from '@vue/test-utils'
import { cloneDeep } from 'lodash'
import Table from '@/components/Table'
import Column from '@/components/Table/Column'

describe('components/Table', () => {
  it('should select the specified fields.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-table': Table,
          'veui-table-column': Column
        },
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
        template: `
        <veui-table :data="data" keys="field2" selectable :selected.sync="selected">
          <veui-table-column field="field1"></veui-table-column>
        </veui-table>`
      },
      {
        sync: false
      }
    )

    let boxes = wrapper.findAll('td input[type="checkbox"]')
    boxes.at(0).trigger('change')
    boxes.at(1).trigger('change')

    let { vm } = wrapper
    await vm.$nextTick()

    expect(vm.selected).to.deep.equal(['11', '22'])

    wrapper.destroy()
  })

  it('should not fire change event if selected value is not changed.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-table': Table,
          'veui-table-column': Column
        },
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
        methods: {
          handleSelected () {
            this.counter++
          }
        },
        template: `
        <veui-table :data="data" selectable :selected.sync="selected" @update:selected="handleSelected">
          <veui-table-column field="field1"></veui-table-column>
        </veui-table>`
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let boxes = wrapper.findAll('td input[type="checkbox"]')

    await vm.$nextTick()
    boxes.at(0).trigger('change')

    await vm.$nextTick()
    boxes.at(2).trigger('change')

    await vm.$nextTick()
    expect(vm.counter).to.be.equal(2)

    vm.data = cloneDeep(vm.data)

    await vm.$nextTick()
    expect(vm.counter).to.be.equal(2)

    wrapper.destroy()
  })

  it('should emit `select` event before `update:selected` event.', done => {
    let wrapper = mount(
      {
        components: {
          'veui-table': Table,
          'veui-table-column': Column
        },
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
        methods: {
          handleSelect () {
            this.isSelectEmitted = true
          },
          handleUpdateSelected () {
            expect(this.isSelectEmitted).to.be.equal(true)

            wrapper.destroy()
            done()
          }
        },
        template: `
        <veui-table :data="data" selectable @select="handleSelect" @update:selected="handleUpdateSelected">
          <veui-table-column field="field1"></veui-table-column>
        </veui-table>`
      },
      {
        sync: false
      }
    )

    wrapper
      .findAll('td input[type="checkbox"]')
      .at(0)
      .trigger('change')
  })
})
