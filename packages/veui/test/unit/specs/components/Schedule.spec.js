import { mount } from '@vue/test-utils'
import Schedule from '@/components/Schedule'

describe('components/Schedule', () => {
  it('should handle selected prop with `null` value.', done => {
    let wrapper = mount({
      methods: {
        handleSelect (val) {
          expect(val).to.deep.equal([undefined, [[0, 0]]])

          wrapper.destroy()
          done()
        }
      },
      render () {
        return (
          <Schedule selected={null} onSelect={val => this.handleSelect(val)} />
        )
      }
    })

    let button = wrapper.find('.veui-schedule-detail button')
    button.trigger('mousedown')
    button.trigger('mouseup')
  })

  it('should support selected prop correctly.', () => {
    let wrapper = mount(Schedule, {
      sync: false,
      propsData: {
        selected: {
          0: [[0, 23]],
          1: [
            [9, 11],
            [13, 17]
          ],
          3: [[13, 16]],
          5: [
            [9, 9],
            [16, 17]
          ]
        }
      }
    })

    let rows = wrapper.findAll('.veui-schedule-table-interaction tr')
    expect(rows.at(0).findAll('td.veui-schedule-selected').length).to.equal(8)
    expect(rows.at(2).findAll('td.veui-schedule-selected').length).to.equal(4)
    expect(rows.at(4).findAll('td.veui-schedule-selected').length).to.equal(3)
    expect(rows.at(6).findAll('td.veui-schedule-selected').length).to.equal(24)

    wrapper.destroy()
  })

  it('should support other props correctly.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-schedule': Schedule
        },
        data () {
          return {
            selected: {},
            hourClass (day, hour) {
              return {
                night: hour > 19,
                weekend: day === 6 || day === 0
              }
            },
            disabledHour (day, hour) {
              return hour < 3 || hour === 7 || hour === 23
            },
            shortcuts: [
              {
                label: '特选时间',
                selected: {
                  3: [[13, 16]],
                  5: [
                    [9, 9],
                    [16, 17]
                  ]
                }
              },
              {
                label: '周末',
                selected: {
                  0: true,
                  6: true
                }
              }
            ],
            shortcutsDisplay: 'popup',
            statuses: [
              {
                label: '已选',
                value: 'selected'
              },
              {
                label: '可选',
                value: 'available'
              }
            ],
            disabled: false,
            readonly: false
          }
        },
        template: `
          <veui-schedule
            v-model="selected"
            :hourClass="hourClass"
            :disabledHour="disabledHour"
            :shortcuts="shortcuts"
            :shortcuts-display="shortcutsDisplay"
            :statuses="statuses"
            :disabled="disabled"
            :readonly="readonly"
          />
        `
      },
      {
        sync: false
      }
    )

    let rows = wrapper.findAll('.veui-schedule-table-interaction tr')
    let { vm } = wrapper

    // hourClass
    expect(
      rows
        .at(0)
        .findAll('td')
        .at(20)
        .find('button')
        .classes('night')
    ).to.equal(true)
    expect(
      rows
        .at(5)
        .findAll('td')
        .at(20)
        .find('button')
        .classes('night')
    ).to.equal(true)
    expect(
      rows
        .at(5)
        .findAll('td')
        .at(20)
        .find('button')
        .classes('weekend')
    ).to.equal(true)

    // disabledHour
    expect(
      rows
        .at(0)
        .find('td button')
        .attributes('disabled')
    ).to.equal('disabled')

    // head-day-checkbox
    wrapper.find('.veui-schedule-head-day-item input').trigger('change')
    await vm.$nextTick()
    expect(
      rows
        .at(0)
        .find('td button')
        .attributes('disabled')
    ).to.equal('disabled')
    expect(
      rows
        .at(0)
        .findAll('td button')
        .at(5)
        .attributes('disabled')
    ).to.not.equal('disabled')

    // shortcuts
    wrapper.find('.veui-dropdown-button').trigger('click')
    await vm.$nextTick()
    wrapper.find('.veui-dropdown-options .veui-option').trigger('click')
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal({
      3: [[13, 16]],
      5: [
        [9, 9],
        [16, 17]
      ]
    })

    wrapper.find('.veui-dropdown-button').trigger('click')
    await vm.$nextTick()
    wrapper
      .findAll('.veui-dropdown-options .veui-option')
      .at(1)
      .trigger('click')
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal({
      0: [[0, 23]],
      6: [[0, 23]]
    })

    // shortcutsDisplay
    expect(
      wrapper.find('.veui-schedule-shortcuts').contains('.veui-dropdown')
    ).to.equal(true)
    vm.shortcutsDisplay = 'inline'
    await vm.$nextTick()
    expect(
      wrapper.find('.veui-schedule-shortcuts').contains('.veui-dropdown')
    ).to.not.equal(true)
    expect(wrapper.findAll('.veui-schedule-shortcut').length).to.equal(2)

    // statuses
    expect(
      wrapper
        .find('.veui-schedule-legend .veui-schedule-legend-selected')
        .text()
    ).to.equal('已选')
    expect(
      wrapper
        .find('.veui-schedule-legend .veui-schedule-legend-available')
        .text()
    ).to.equal('可选')

    // disabled
    let button = wrapper
      .findAll('.veui-schedule-table-interaction tr')
      .at(4)
      .findAll('td button')
      .at(10)

    expect(button.attributes('disabled')).to.not.equal('disabled')
    vm.disabled = true
    await vm.$nextTick()
    expect(button.attributes('disabled')).to.equal('disabled')
    expect(
      wrapper.find('.veui-schedule-head-day-item input').attributes('disabled')
    ).to.equal('disabled')
    expect(
      wrapper.find('.veui-schedule-shortcut').attributes('disabled')
    ).to.equal('disabled')

    // readonly
    vm.disabled = false
    vm.readonly = true
    await vm.$nextTick()
    expect(button.attributes('disabled')).to.equal('disabled')
    expect(
      wrapper.find('.veui-schedule-head-day-item input').attributes('disabled')
    ).to.equal('disabled')
    expect(
      wrapper.find('.veui-schedule-shortcut').attributes('disabled')
    ).to.equal('disabled')

    wrapper.destroy()
  })

  it('should support select event correctly.', done => {
    let wrapper = mount(
      {
        components: {
          'veui-schedule': Schedule
        },
        data () {
          return {
            selected: {}
          }
        },
        methods: {
          selectHandler (val) {
            expect(val).to.deep.equal({
              0: [[7, 7]]
            })

            wrapper.destroy()
            done()
          }
        },
        template: `<veui-schedule :selected="selected" @select="selectHandler" />`
      },
      {
        sync: false
      }
    )

    let button = wrapper
      .findAll('.veui-schedule-table-interaction tr')
      .at(6)
      .findAll('td button')
      .at(7)
    button.trigger('mousedown')
    button.trigger('mouseup')
  })

  it('should render header slot correctly.', () => {
    let wrapper = mount(Schedule, {
      sync: false,
      slots: {
        header: '<div class="customized-header">schedule header</div>'
      }
    })

    expect(wrapper.find('.customized-header').text()).to.equal(
      'schedule header'
    )
    wrapper.destroy()
  })

  it('should render header-content slot correctly.', () => {
    let wrapper = mount(Schedule, {
      sync: false,
      slots: {
        'header-content': '<h2>Header Content</h2>'
      }
    })

    expect(wrapper.find('.veui-schedule-header h2').text()).to.equal(
      'Header Content'
    )
    wrapper.destroy()
  })

  it('should render slots of shortcuts & legend correctly.', () => {
    let wrapper = mount(Schedule, {
      sync: false,
      propsData: {
        shortcuts: [
          {
            label: '周末',
            selected: {
              0: true,
              6: true
            }
          }
        ]
      },
      slots: {
        shortcuts: '<span class="customized-shortcuts">shortcuts</span>',
        legend: '<span class="customized-legend">legend</span>'
      }
    })

    expect(
      wrapper.find('.veui-schedule-header .customized-shortcuts').text()
    ).to.equal('shortcuts')
    expect(
      wrapper.find('.veui-schedule-header .customized-legend').text()
    ).to.equal('legend')
    wrapper.destroy()
  })

  it('should render slots of legend-label & hour & label & tooltip correctly.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-schedule': Schedule
        },
        data () {
          return {
            statuses: [
              {
                label: '已选',
                value: 'selected'
              },
              {
                label: '可选',
                value: 'available'
              }
            ]
          }
        },
        template: `
          <veui-schedule :statuses="statuses">
            <span slot="legend-label" slot-scope="prop">{{ prop.value }}</span>
            <span slot="hour" slot-scope="prop">{{ prop.day }} {{ prop.hour }}</span>
            <span slot="label" slot-scope="{from, to}">
              {{
                to - from > 0
                  ? from + ':00–' + (to + 1) +':00'
                  : ''
              }}
            </span>
            <span class="tooltip-content" slot="tooltip" slot-scope="{day, hour}">{{ day }} {{ hour }}</span>
          </veui-schedule>
        `
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    expect(wrapper.find('.veui-schedule-legend-item span').text()).to.equal(
      'selected'
    )
    expect(
      wrapper.find('.veui-schedule-table-interaction tr button').text()
    ).to.equal('1 0')

    let button = wrapper.find('.veui-schedule-table-interaction tr button')
    button.trigger('mousedown')
    button.trigger('keydown.right')
    button.trigger('mouseup')

    await wrapper.vm.$nextTick()

    let cells = wrapper
      .find('.veui-schedule-table-interaction tr')
      .findAll('td')
    expect(cells.at(0).classes('veui-schedule-selected')).to.equal(true)
    expect(wrapper.find('.veui-schedule-table-selected td').text()).to.equal(
      '0:00–2:00'
    )
    wrapper.find('.veui-schedule-table-interaction').trigger('mouseenter')
    wrapper
      .find('.veui-schedule-table-interaction button.veui-schedule-selected')
      .trigger('mouseenter')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.tooltip-content').text()).to.equal('1 0')
    wrapper.destroy()
  })
})
