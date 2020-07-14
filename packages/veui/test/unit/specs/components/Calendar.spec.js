import { mount } from '@vue/test-utils'
import Calendar from '@/components/Calendar'

describe('components/Calendar', () => {
  it('should handle selected prop with `null` value.', done => {
    const wrapper = mount(Calendar, {
      propsData: {
        selected: null
      }
    })

    wrapper.vm.$on('select', val => {
      expect(val).to.be.an.instanceof(Date)

      wrapper.destroy()
      done()
    })

    wrapper.find('.veui-calendar-day button').trigger('click')
  })

  it('should select year correctly.', done => {
    const wrapper = mount(Calendar, {
      propsData: {
        type: 'year'
      }
    })

    wrapper.vm.$on('select', val => {
      expect(val).to.be.an.instanceof(Date)

      wrapper.destroy()
      done()
    })

    wrapper.find('.veui-calendar-year button').trigger('click')
  })

  it('should select month correctly.', done => {
    const wrapper = mount(Calendar, {
      propsData: {
        type: 'month'
      }
    })

    wrapper.vm.$on('select', val => {
      expect(val).to.be.an.instanceof(Date)

      wrapper.destroy()
      done()
    })

    wrapper.find('.veui-calendar-month button').trigger('click')
  })

  it('should select date multiple correctly.', async () => {
    const wrapper = mount({
      components: {
        'veui-calendar': Calendar
      },
      data () {
        return {
          selected: null
        }
      },
      template: '<veui-calendar v-model="selected" multiple />'
    })

    const days = wrapper.findAll('.veui-calendar-day button')
    days.at(0).trigger('click')
    days.at(2).trigger('click')
    days.at(7).trigger('click')

    const { vm } = wrapper

    await vm.$nextTick()
    expect(vm.selected[0]).to.be.an.instanceof(Date)
    expect(vm.selected[1]).to.be.an.instanceof(Date)
    expect(vm.selected[2]).to.be.an.instanceof(Date)

    wrapper.destroy()
  })

  it('should select date range correctly.', async () => {
    const wrapper = mount({
      components: {
        'veui-calendar': Calendar
      },
      data () {
        return {
          selected: null
        }
      },
      template: '<veui-calendar v-model="selected" range />'
    })

    const days = wrapper.findAll('.veui-calendar-day button')
    days.at(0).trigger('click')
    days.at(7).trigger('click')

    const { vm } = wrapper

    await vm.$nextTick()
    expect(vm.selected[0]).to.be.an.instanceof(Date)
    expect(vm.selected[1]).to.be.an.instanceof(Date)
    expect(vm.selected[1] - vm.selected[0]).to.equal(7 * 1000 * 60 * 60 * 24)
    expect(wrapper.findAll('.veui-calendar-in-range').length).to.equal(8)

    wrapper.destroy()
  })

  it('should support customized panel count correctly.', () => {
    const wrapper = mount(Calendar, {
      propsData: {
        panel: 3
      }
    })

    const panels = wrapper.findAll('.veui-calendar-panel')
    expect(panels.length).to.equal(3)

    wrapper.destroy()
  })

  it('should support customized today property correctly.', () => {
    const wrapper = mount(Calendar, {
      propsData: {
        today: new Date(2019, 10, 1)
      }
    })

    expect(wrapper.vm.getDefaultDate() - new Date(2019, 10, 1)).to.equal(0)
    expect(wrapper.vm.panelData[0].date.year).to.equal(2019)
    expect(wrapper.vm.panelData[0].date.month).to.equal(10)
    expect(wrapper.find('.veui-calendar-today').text()).to.equal('1')

    wrapper.destroy()
  })

  it('should support customized week-start correctly.', () => {
    const wrapper = mount(Calendar, {
      propsData: {
        weekStart: 6
      }
    })

    expect(wrapper.vm.getDayNames()[0] === wrapper.vm.daysShort[5]).to.equal(
      true
    )

    wrapper.destroy()
  })

  it('should support customized fill-month correctly.', () => {
    const wrapper = mount(Calendar, {
      propsData: {
        fillMonth: false
      }
    })

    expect(wrapper.find('.veui-calendar-aux button').exists()).to.equal(false)
  })

  it('should support customized date-class correctly.', () => {
    const wrapper = mount(Calendar, {
      propsData: {
        dateClass: 'date-class'
      }
    })

    const cells = wrapper.findAll('tbody td')
    const rand = Math.floor(Math.random() * cells.length)

    expect(cells.at(rand).classes('date-class')).to.equal(true)

    wrapper.destroy()
  })

  it('should support disabled-date correctly.', () => {
    const wrapper = mount(Calendar, {
      propsData: {
        disabledDate: date => {
          return date.getDay() === 6
        }
      }
    })

    const index = Math.floor(Math.random() * 2) + 1
    const button = wrapper
      .findAll('tbody tr')
      .at(index)
      .findAll('td button')
      .at(5)
    expect(button.attributes('disabled')).to.equal('disabled')

    wrapper.destroy()
  })

  it('should support disabled state', () => {
    const wrapper = mount(Calendar, {
      propsData: {
        disabled: true
      }
    })

    expect(wrapper.attributes('aria-disabled')).to.equal('true')
    expect(
      wrapper.find('.veui-calendar-day button').attributes('disabled')
    ).to.equal('disabled')
    expect(wrapper.find('.veui-calendar-prev').attributes('disabled')).to.equal(
      'disabled'
    )
    expect(
      wrapper.find('.veui-calendar-select').attributes('disabled')
    ).to.equal('disabled')

    wrapper.destroy()
  })

  it('should support readonly correctly.', () => {
    let wrapper = mount(Calendar, {
      propsData: {
        readonly: true
      }
    })

    expect(wrapper.attributes('aria-readonly')).to.equal('true')
    expect(
      wrapper.find('.veui-calendar-day button').attributes('disabled')
    ).to.equal('disabled')
    expect(wrapper.find('.veui-calendar-prev').attributes('disabled')).to.equal(
      'disabled'
    )
    expect(
      wrapper.find('.veui-calendar-select').attributes('disabled')
    ).to.equal('disabled')

    wrapper.destroy()
  })

  it('should set selected date correctly.', async () => {
    const wrapper = mount(Calendar, {
      propsData: {
        selected: new Date(1987, 6, 11)
      }
    })

    const { vm } = wrapper
    expect(vm.panelData[0].date.year).to.equal(1987)
    expect(vm.panelData[0].date.month).to.equal(6)
    expect(wrapper.find('.veui-calendar-selected button').text()).to.equal('11')

    wrapper.destroy()
  })

  it('should support before solt correctly.', () => {
    const wrapper = mount(Calendar, {
      slots: {
        before: '<div class="calendar-before">Before</div>'
      }
    })

    expect(wrapper.find('.calendar-before').exists()).to.equal(true)
  })

  it('should support after solt correctly.', () => {
    const wrapper = mount(Calendar, {
      slots: {
        after: '<div class="calendar-after">After</div>'
      }
    })

    expect(wrapper.find('.calendar-after').exists()).to.equal(true)
  })

  it('should support date slot correctly.', () => {
    const wrapper = mount(Calendar, {
      scopedSlots: {
        date:
          '<template slot-scope="{year, month,date}">{{ year }}-{{ month + 1 }}-{{ date }}</template>'
      }
    })

    const date = new Date()
    const target = `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}`
    expect(
      wrapper
        .find('.veui-calendar-today button')
        .text()
        .trim()
    ).to.equal(target)
  })

  it('should handle select.', async () => {
    const wrapper = mount({
      components: {
        'veui-calendar': Calendar
      },
      data () {
        return {
          selected: null
        }
      },
      template: '<veui-calendar @select="handleSelect" />',
      methods: {
        handleSelect (selected) {
          this.selected = selected
        }
      }
    })

    wrapper.find('.veui-calendar-day button').trigger('click')
    const { vm } = wrapper
    await vm.$nextTick()
    expect(vm.selected).to.be.an.instanceof(Date)
  })

  it('should handle select correctly when set range.', async () => {
    const wrapper = mount({
      components: {
        'veui-calendar': Calendar
      },
      data () {
        return {
          selected: null,
          times: 0
        }
      },
      template: '<veui-calendar range @select="handleSelect" />',
      methods: {
        handleSelect (selected) {
          this.selected = selected
          this.times += 1
        }
      }
    })

    const days = wrapper.findAll('.veui-calendar-day button')

    days.at(0).trigger('click')
    days.at(7).trigger('click')
    const { vm } = wrapper
    await vm.$nextTick()
    expect(vm.selected.length).to.equal(2)
    expect(vm.selected[0]).to.be.an.instanceof(Date)
    expect(vm.selected[1]).to.be.an.instanceof(Date)
    expect(vm.times).to.equal(1)

    wrapper.destroy()
  })

  it('should handle select correctly when set multiple.', async () => {
    const wrapper = mount({
      components: {
        'veui-calendar': Calendar
      },
      data () {
        return {
          selected: null,
          times: 0
        }
      },
      template:
        '<veui-calendar v-model="selected" multiple @select="handleSelect" />',
      methods: {
        handleSelect (selected) {
          this.selected = selected
          this.times += 1
        }
      }
    })

    const days = wrapper.findAll('.veui-calendar-day button')

    days.at(0).trigger('click')
    days.at(1).trigger('click')
    days.at(2).trigger('click')
    const { vm } = wrapper
    await vm.$nextTick()
    expect(vm.selected.length).to.equal(3)
    expect(vm.selected[0]).to.be.an.instanceof(Date)
    expect(vm.selected[1]).to.be.an.instanceof(Date)
    expect(vm.selected[2]).to.be.an.instanceof(Date)
    expect(vm.times).to.equal(3)

    wrapper.destroy()
  })

  it('should handle selectstart.', async () => {
    const wrapper = mount({
      components: {
        'veui-calendar': Calendar
      },
      data () {
        return {
          start: null,
          times: 0
        }
      },
      template: '<veui-calendar range @selectstart="handleSelectStart" />',
      methods: {
        handleSelectStart (start) {
          this.start = start
          this.times += 1
        }
      }
    })

    const days = wrapper.findAll('.veui-calendar-day button')
    days.at(0).trigger('click')
    days.at(7).trigger('click')
    const { vm } = wrapper
    await vm.$nextTick()
    expect(vm.start).to.be.an.instanceof(Date)
    expect(vm.times).to.equal(1)

    wrapper.destroy()
  })

  it('should handle selectprogress when multiple is false.', async () => {
    const wrapper = mount({
      components: {
        'veui-calendar': Calendar
      },
      data () {
        return {
          selectProgress: null
        }
      },
      template:
        '<veui-calendar range @selectprogress="handleSelectProgress" />',
      methods: {
        handleSelectProgress (selectProgress) {
          this.selectProgress = selectProgress
        }
      }
    })

    const days = wrapper.findAll('.veui-calendar-day button')
    days.at(0).trigger('click')
    days.at(7).trigger('hover')
    const { vm } = wrapper
    await vm.$nextTick()
    expect(vm.selectProgress.length).to.equal(2)

    expect(vm.selectProgress[0]).to.be.an.instanceof(Date)
    expect(vm.selectProgress[1]).to.be.an.instanceof(Date)

    wrapper.destroy()
  })

  it('should handle selectprogress when multiple is true.', async () => {
    const wrapper = mount({
      components: {
        'veui-calendar': Calendar
      },
      data () {
        return {
          selected: null,
          selectProgress: null
        }
      },
      template:
        '<veui-calendar multiple range v-model="selected" @selectprogress="handleSelectProgress" />',
      methods: {
        handleSelectProgress (selectProgress) {
          this.selectProgress = selectProgress
        }
      }
    })

    const days = wrapper.findAll('.veui-calendar-day button')
    days.at(0).trigger('click')
    days.at(1).trigger('click')

    days.at(3).trigger('click')
    days.at(4).trigger('hover')
    const { vm } = wrapper
    await vm.$nextTick()
    expect(vm.selectProgress.length).to.equal(2)
    expect(vm.selectProgress[0].length).to.equal(2)
    expect(vm.selectProgress[1].length).to.equal(2)

    expect(vm.selectProgress[0][0]).to.be.an.instanceof(Date)
    expect(vm.selectProgress[0][1]).to.be.an.instanceof(Date)
    expect(vm.selectProgress[1][0]).to.be.an.instanceof(Date)
    expect(vm.selectProgress[1][1]).to.be.an.instanceof(Date)

    wrapper.destroy()
  })

  it('should handle viewchange.', async () => {
    const wrapper = mount({
      components: {
        'veui-calendar': Calendar
      },
      data () {
        return {
          year: null,
          month: null
        }
      },
      template: '<veui-calendar @viewchange="handleViewChange" />',
      methods: {
        handleViewChange ({ year, month }) {
          this.year = year
          this.month = month
        }
      }
    })

    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() - 1
    if (month < 0) {
      month = 11
      year -= 1
    }

    wrapper.find('.veui-calendar-prev').trigger('click')
    const { vm } = wrapper
    await vm.$nextTick()

    expect(vm.year).to.equal(year)
    expect(vm.month).to.equal(month)

    wrapper.destroy()
  })

  it('should has range classes and navigate correctly.', async () => {
    const wrapper = mount(Calendar, {
      propsData: {
        panel: 2,
        range: true,
        fillMonth: false,
        selected: [new Date(2019, 9, 1), new Date(2019, 11, 31)]
      }
    })
    const { vm } = wrapper
    let [p1, p2] = vm.panelData

    expect(p1.date).to.deep.equal({ year: 2019, month: 9 })
    expect(p2.date).to.deep.equal({ year: 2019, month: 11 })
    let days = wrapper.findAll('.veui-calendar-day')
    expect(days.at(0).classes()).to.include('veui-calendar-in-range')
    expect(days.at(0).classes()).to.include('veui-calendar-range-start')
    expect(days.at(days.length - 1).classes()).to.include(
      'veui-calendar-in-range'
    )
    expect(days.at(days.length - 1).classes()).to.include(
      'veui-calendar-range-end'
    )

    vm.navigate([new Date(2018, 1, 1), new Date(2018, 3, 1)], false)

    expect(p1.date).to.deep.equal({ year: 2018, month: 1 })
    expect(p2.date).to.deep.equal({ year: 2018, month: 3 })
    wrapper.destroy()
  })

  it('should handle selected prop correctly on using as a uncontrolled component.', async () => {
    const wrapper = mount(Calendar)
    const { vm } = wrapper
    const today = wrapper.find('.veui-calendar-today button')
    today.trigger('click')
    await vm.$nextTick()
    expect(vm.realSelected.getDate()).to.equal(
      +today.element.textContent.trim()
    )
    wrapper.destroy()
  })

  it('should handle selection correctly for year calendar.', async () => {
    const wrapper = mount(Calendar, {
      propsData: {
        type: 'year'
      }
    })
    const { vm } = wrapper
    function isVisible (container, target) {
      let { top, bottom } = target.getBoundingClientRect()
      let { top: cTop, bottom: cBottom } = container.getBoundingClientRect()
      expect(top < cTop && bottom < cTop).to.equal(false)
      expect(top > cBottom && bottom > cBottom).to.equal(false)
    }

    // 一开始得滚动到视图中
    let container = wrapper.find('.veui-calendar-year-table-wrap').element
    isVisible(container, wrapper.find('.veui-calendar-today').element)

    container.scrollTop = 10
    let target = wrapper.find('[data-index="3"] button')
    target.trigger('click')
    await vm.$nextTick()

    isVisible(container, target.element)

    expect(vm.realSelected.getFullYear()).to.equal(
      +target.element.textContent.trim()
    )
    wrapper.destroy()
  })

  it('should update panel date correctly on selecting next month.', async () => {
    const wrapper = mount({
      components: {
        'veui-calendar': Calendar
      },
      data () {
        return {
          selected: [new Date(2020, 6, 15)]
        }
      },
      template: '<veui-calendar ref="calendar" multiple v-model="selected"/>'
    })
    const { vm } = wrapper
    let next = wrapper.find('.veui-calendar-day + .veui-calendar-aux button')
    next.trigger('click')
    await vm.$nextTick()
    let [panelData] = vm.$refs.calendar.panelData
    expect(panelData.date).to.deep.equal({
      year: 2020,
      month: 7
    })
    wrapper.destroy()
  })
})
