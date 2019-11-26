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
    expect(vm.counter).to.equal(2)

    vm.data = cloneDeep(vm.data)

    await vm.$nextTick()
    expect(vm.counter).to.equal(2)

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
            expect(this.isSelectEmitted).to.equal(true)

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

  it('should expand the sub rows correctly.', async () => {
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
                field1: 'apple',
                field2: 11
              },
              {
                field1: 'banana',
                field2: 22,
                children: [
                  {
                    field3: 'red',
                    field4: 222
                  }
                ]
              }
            ]
          }
        },
        template: `
          <veui-table :data="data" expandable>
            <veui-table-column field="field1" title="field1">
              <template slot="sub-row" slot-scope="{ field3 }">{{ field3 }}</template>
            </veui-table-column>
            <veui-table-column field="field2" title="field2">
              <template slot="sub-row" slot-scope="{ field4 }">{{ field4 }}</template>
            </veui-table-column>
          </veui-table>
        `
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let rows = wrapper.findAll('tbody tr')
    expect(rows.length).to.equal(2)

    wrapper.find('td button').trigger('click')

    await vm.$nextTick()

    let totalRows = wrapper.findAll('tbody tr')
    expect(totalRows.length).to.equal(3)

    wrapper.destroy()
  })

  it('should sort by key field properly.', done => {
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
                field1: 'apple',
                field2: 11
              },
              {
                field1: 'pineapple',
                field2: 33
              },
              {
                field1: 'banana',
                field2: 22
              }
            ],
            keyField: 'field1',
            order: 'desc',
            orderBy: 'field1'
          }
        },
        methods: {
          handleSort (orderBy, order) {
            expect(order).to.equal('asc')
            expect(orderBy).to.equal('field1')

            wrapper.destroy()
            done()
          }
        },
        template: `
          <veui-table :data="data" :key-field="keyField" :order="order" :order-by="orderBy" @sort="handleSort">
            <veui-table-column field="field1" title="field1" sortable/>
            <veui-table-column field="field2" title="field2"/>
          </veui-table>
        `
      },
      {
        sync: false
      }
    )

    let active = wrapper.findAll('svg.veui-sorter-active.veui-sorter-icon-desc')
    expect(active.length).to.be.equal(1)

    wrapper.find('svg.veui-sorter').trigger('click')
  })

  it('should filter columns correctly.', async () => {
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
                field1: 'apple',
                field2: 11,
                field3: true
              },
              {
                field1: 'banana',
                field2: 22,
                field3: false
              },
              {
                field1: 'pineapple',
                field2: 33,
                field3: true
              }
            ],
            columns: ['field1']
          }
        },
        template: `
          <veui-table :data="data" :column-filter="columns">
            <veui-table-column field="field1" title="field1"/>
            <veui-table-column field="field2" title="field2"/>
            <veui-table-column field="field3" title="field3"/>
            <template slot="foot">An awesome table foot!</template>
          </veui-table>
        `
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    expect(wrapper.findAll('thead th').length).to.equal(1)

    wrapper.vm.columns.push('field2')

    await vm.$nextTick()
    expect(wrapper.findAll('thead th').length).to.equal(2)

    wrapper.vm.columns.splice(1)

    await vm.$nextTick()
    expect(wrapper.findAll('thead th').length).to.equal(1)

    wrapper.destroy()
  })

  it('should select all and cancel all selection correctly.', async () => {
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
                field1: 'apple',
                field2: 11,
                field3: true
              },
              {
                field1: 'banana',
                field2: 22,
                field3: false
              },
              {
                field1: 'pineapple',
                field2: 33,
                field3: true
              }
            ],
            selected: []
          }
        },
        template: `
          <veui-table :data="data" keys="field2" selectable :selected.sync="selected">
            <veui-table-column field="field1" title="field1"/>
            <veui-table-column field="field2" title="field2" align="left"/>
          </veui-table>
        `
      },
      {
        sync: false
      }
    )

    wrapper.find('th input[type="checkbox"]').trigger('change')

    let { vm } = wrapper
    await vm.$nextTick()

    expect(vm.selected).to.deep.equal(['11', '22', '33'])

    wrapper.find('th input[type="checkbox"]').trigger('change')

    await vm.$nextTick()
    expect(vm.selected).to.have.lengthOf(0)

    wrapper.destroy()
  })

  it('should select rows correctly when the select mode is single.', async () => {
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
                field1: 'apple',
                field2: 11
              },
              {
                field1: 'banana',
                field2: 22
              },
              {
                field1: 'pineapple',
                field2: 33
              }
            ],
            selected: null
          }
        },
        template: `
          <veui-table :data="data" keys="field2" selectable :selected.sync="selected" select-mode="single">
            <veui-table-column field="field1" title="field1"/>
            <veui-table-column field="field2" title="field2" align="left">
              <template slot="foot">总计</template>
            </veui-table-column>
          </veui-table>
        `
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let list = wrapper.findAll('td input[type="radio"]')

    list.at(0).element.checked = true
    list.at(0).trigger('change')

    await vm.$nextTick()

    expect(wrapper.vm.selected).to.equal('11')

    list.at(1).element.checked = true
    list.at(1).trigger('change')

    await vm.$nextTick()

    expect(wrapper.vm.selected).to.equal('22')

    wrapper.destroy()
  })

  it('should present correctly when data is not provided.', () => {
    let wrapper = mount(
      {
        components: {
          'veui-table': Table,
          'veui-table-column': Column
        },
        template: `
          <veui-table>
            <veui-table-column field="field1" title="field1"/>
            <veui-table-column field="field2" title="field2"/>
          </veui-table>
        `
      },
      {
        sync: false
      }
    )

    expect(wrapper.findAll('tbody tr').length).to.equal(1)
    expect(wrapper.findAll('td.veui-table-no-data').length).to.equal(1)

    wrapper.destroy()
  })

  it('should merge cells correctly.', () => {
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
                id: 1,
                type: 'fruits',
                name: 'apple'
              },
              {
                id: 2,
                type: 'fruits',
                name: 'cherry'
              },
              {
                id: 3,
                type: 'veggie',
                name: 'tomato'
              },
              {
                id: 4,
                type: 'veggie',
                name: 'potato'
              }
            ],
            groupSpan (i) {
              return {
                row: i % 2 ? 0 : 2
              }
            }
          }
        },
        template: `
          <veui-table :data="data">
            <veui-table-column field="id" title="id"/>
            <veui-table-column field="type" title="type" :span="groupSpan"/>
            <veui-table-column field="name" title="name"/>
          </veui-table>
        `
      },
      {
        sync: false
      }
    )

    expect(
      wrapper
        .findAll('tbody td')
        .at(1)
        .attributes('rowspan')
    ).to.equal('2')
    wrapper.destroy()
  })

  it('should support wrapping column component', () => {
    let AwesomeColumn = {
      components: {
        'veui-table-column': Column
      },
      props: {
        field: String,
        title: String
      },
      template: `
        <veui-table-column :field="field" :title="title" align="center">
          <template slot-scope="{ name }">
            <b>{{ name }}</b>
          </template>
        </veui-table-column>`
    }
    let wrapper = mount(
      {
        components: {
          'veui-table': Table,
          'veui-table-column': Column,
          AwesomeColumn
        },
        data () {
          return {
            data: [
              {
                id: 1,
                type: 'fruits',
                name: 'apple'
              },
              {
                id: 2,
                type: 'fruits',
                name: 'cherry'
              },
              {
                id: 3,
                type: 'veggie',
                name: 'tomato'
              },
              {
                id: 4,
                type: 'veggie',
                name: 'potato'
              }
            ],
            groupSpan (i) {
              return {
                row: i % 2 ? 0 : 2
              }
            }
          }
        },
        template: `
          <veui-table :data="data">
            <veui-table-column field="id" title="id"/>
            <awesome-column field="type" title="type"/>
            <veui-table-column field="name" title="name"/>
          </veui-table>
        `
      },
      {
        sync: false
      }
    )

    let td = wrapper.findAll('tbody td').at(1)
    expect(td.classes('veui-table-column-center')).to.equal(true)
    expect(td.find('.veui-table-cell').html()).to.include('<b>apple</b>')

    wrapper.destroy()
  })
})
