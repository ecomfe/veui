import { mount } from '@vue/test-utils'
import DatePicker from '@/components/DatePicker'

describe('components/DatePicker', () => {
  it('should handle selected prop with `null` value.', done => {
    let wrapper = mount(DatePicker, {
      propsData: {
        selected: null
      }
    })

    wrapper.vm.$on('select', val => {
      expect(val instanceof Date).to.equal(true)

      wrapper.destroy()
      done()
    })

    wrapper.find('.veui-date-picker-trigger').trigger('click')
    wrapper.find('.veui-calendar-day button').trigger('click')
  })

  it('should select year correctly.', done => {
    let wrapper = mount(DatePicker, {
      propsData: {
        type: 'year'
      }
    })

    wrapper.vm.$on('select', val => {
      expect(val instanceof Date).to.equal(true)

      wrapper.destroy()
      done()
    })

    wrapper.find('.veui-date-picker-trigger').trigger('click')
    wrapper.find('.veui-calendar-year button').trigger('click')
  })

  it('should select month correctly.', done => {
    let wrapper = mount(DatePicker, {
      propsData: {
        type: 'month'
      }
    })

    wrapper.vm.$on('select', val => {
      expect(val instanceof Date).to.equal(true)

      wrapper.destroy()
      done()
    })

    wrapper.find('.veui-date-picker-trigger').trigger('click')
    wrapper.find('.veui-calendar-month button').trigger('click')
  })

  it('should select date range correctly.', async () => {
    let wrapper = mount({
      data () {
        return {
          selected: []
        }
      },
      components: {
        'veui-date-picker': DatePicker
      },
      template: `<veui-date-picker v-model="selected" range/>`
    })

    wrapper.find('.veui-date-picker-trigger').trigger('click')
    let days = wrapper.findAll('.veui-calendar-day button')
    let { vm } = wrapper

    days.at(0).trigger('click')
    days.at(7).trigger('click')

    await vm.$nextTick()

    expect(vm.selected[0]).to.be.an.instanceof(Date)
    expect(vm.selected[1]).to.be.an.instanceof(Date)
    expect(vm.selected[1] - vm.selected[0]).to.equal(7 * 1000 * 60 * 60 * 24)

    wrapper.destroy()
  })

  it('should support customized today property correctly.', () => {
    let wrapper = mount(DatePicker, {
      propsData: {
        today: new Date(2019, 10, 1)
      }
    })

    expect(wrapper.vm.$refs.cal.today - new Date(2019, 10, 1)).to.equal(0)
    expect(wrapper.find('.veui-calendar-today').text()).to.equal('1')

    wrapper.destroy()
  })

  it('should support customized week-start correctly.', () => {
    let wrapper = mount(DatePicker, {
      propsData: {
        weekStart: 6
      }
    })

    expect(wrapper.vm.$refs.cal.weekStart).to.equal(6)

    wrapper.destroy()
  })

  it('should support customized fill-month correctly.', () => {
    let wrapper = mount(DatePicker, {
      propsData: {
        fillMonth: false
      }
    })

    expect(wrapper.vm.$refs.cal.fillMonth).to.equal(false)
    expect(wrapper.findAll('.veui-calendar'))

    wrapper.destroy()
  })

  it('should support customized date-class correctly.', () => {
    let wrapper = mount(DatePicker, {
      propsData: {
        dateClass: 'date-class'
      }
    })

    let cells = wrapper.findAll('tbody td')
    let rand = Math.floor(Math.random() * cells.length)

    expect(cells.at(rand).classes('date-class')).to.equal(true)

    wrapper.destroy()
  })

  it('should support disabled correctly.', () => {
    let wrapper = mount(DatePicker, {
      propsData: {
        disabled: true
      }
    })

    let trigger = wrapper.find('.veui-date-picker-trigger')

    expect(trigger.classes()).to.include('veui-disabled')
    expect(trigger.find('input').attributes('disabled')).to.equal('disabled')

    wrapper.destroy()
  })

  it('should support disabled-date correctly.', () => {
    let wrapper = mount(DatePicker, {
      propsData: {
        disabledDate: date => {
          return date.getDay() === 6
        }
      }
    })

    let button = wrapper
      .findAll('tbody tr')
      .at(2)
      .findAll('td button')
      .at(5)

    expect(button.attributes('disabled')).to.equal('disabled')

    wrapper.destroy()
  })

  it('should support readonly correctly.', () => {
    let wrapper = mount(DatePicker, {
      propsData: {
        disabled: true
      }
    })

    let button = wrapper.find('.veui-date-picker-trigger')

    expect(button.classes()).to.include('veui-disabled')

    wrapper.destroy()
  })

  it('should clear selected date correctly.', async () => {
    let wrapper = mount({
      data () {
        return {
          selected: null
        }
      },
      components: {
        'veui-date-picker': DatePicker
      },
      template: `<veui-date-picker v-model="selected" clearable/>`
    })

    let { vm } = wrapper
    wrapper.find('.veui-date-picker-trigger').trigger('click')
    wrapper.find('.veui-calendar-day button').trigger('click')

    await vm.$nextTick()

    wrapper.find('.veui-date-picker-clear').trigger('click')

    await vm.$nextTick()
    expect(vm.selected).to.equal(null)

    wrapper.destroy()
  })

  it('should support placeholder correctly.', () => {
    let wrapper = mount(DatePicker, {
      propsData: {
        placeholder: 'Select a date'
      }
    })

    expect(wrapper.find('.veui-date-picker-label').text()).to.equal(
      'Select a date'
    )

    wrapper.destroy()
  })

  it('should format date correctly.', async () => {
    let wrapper = mount({
      data () {
        return {
          selected: null,
          format: 'MM/DD/YYYY'
        }
      },
      components: {
        'veui-date-picker': DatePicker
      },
      template: `<veui-date-picker v-model="selected" :format="format"/>`
    })

    let { vm } = wrapper
    wrapper.find('.veui-date-picker-trigger').trigger('click')
    wrapper.find('.veui-calendar-day button').trigger('click')

    await vm.$nextTick()

    let reg = /^(\d{2})\/(\d{2})\/(\d{4})$/
    expect(reg.test(wrapper.find('input').element.value)).to.equal(true)

    wrapper.destroy()
  })

  it('should support shortcuts correctly.', async () => {
    let wrapper = mount({
      data () {
        return {
          selected: [],
          shortcuts: [
            {
              label: '上个月',
              from: {
                startOf: 'month',
                month: -1
              },
              to: {
                startOf: 'month',
                days: -1
              }
            },
            {
              label: '最近7天',
              from: -6,
              to: 0
            },
            {
              label: '今年',
              from: {
                startOf: 'year'
              }
            }
          ]
        }
      },
      components: {
        'veui-date-picker': DatePicker
      },
      template: `<veui-date-picker v-model="selected" range :shortcuts="shortcuts"/>`
    })

    let { vm } = wrapper

    let shortcuts = wrapper.findAll('.veui-date-picker-shortcuts button')
    shortcuts.at(1).trigger('click')

    await vm.$nextTick()
    expect(vm.selected[1] - vm.selected[0]).to.equal(6 * 1000 * 60 * 60 * 24)

    wrapper.destroy()
  })

  it('should support date slot correctly.', () => {
    let wrapper = mount(DatePicker, {
      scopedSlots: {
        date: `<template slot-scope="props">{{ props.year }}</template>`
      }
    })

    let year = new Date().getFullYear()

    expect(wrapper.find('.veui-calendar-day button').text()).to.equal('' + year)

    wrapper.destroy()
  })
})
