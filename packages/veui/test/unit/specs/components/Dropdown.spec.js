import { mount } from '@vue/test-utils'
import Dropdown from '@/components/Dropdown'
import Button from '@/components/Button'

let datasource = [
  {
    label: '男',
    value: 'male',
    disabled: false
  },
  {
    label: '女',
    value: 'female',
    disabled: true
  }
]

describe('components/Dropdown', () => {
  it('should handle `trigger` prop correctly', () => {
    let wrapper = mount(Dropdown, {
      propsData: {
        trigger: 'hover',
        options: datasource,
        label: '测试Dropdown',
        overlayClass: 'test-overlay-class'
      },
      sync: false,
      attachToDocument: true
    })

    let button = wrapper.find('.veui-dropdown-button')
    let menuWrapper = wrapper.find('.test-overlay-class')

    button.element.onmouseenter = () => {
      expect(menuWrapper.isVisible()).to.not.equal(true)
      wrapper.destroy()
    }
    button.trigger('mouseenter')
  })

  it('should handle other props correctly', () => {
    let wrapper = mount(Dropdown, {
      propsData: {
        split: true,
        disabled: true,
        trigger: 'hover',
        options: datasource,
        label: '测试Dropdown',
        overlayClass: 'test-overlay-class'
      },
      sync: false,
      attachToDocument: true
    })

    let label = wrapper.find('.veui-dropdown-label')
    let button = wrapper.find('.veui-dropdown-button')
    let menuWrapper = wrapper.find('.test-overlay-class')
    let commandButton = wrapper.find('.veui-dropdown-command')
    let attributes = button.attributes()

    // disabled
    expect(button.element.disabled).to.equal(true)
    expect(attributes.class).to.include('veui-disabled')
    expect(attributes['aria-disabled']).to.equal('true')
    // label
    expect(label.text()).to.equal('测试Dropdown')
    // split
    expect(commandButton.exists()).to.equal(true)
    // overlayClass
    expect(menuWrapper.exists()).to.equal(true)
    // options
    expect(menuWrapper.find('.veui-option-group').exists()).to.equal(true)
    wrapper.destroy()
  })

  it('should render option slot correctly', () => {
    let wrapper = mount(Dropdown, {
      propsData: {
        trigger: 'hover',
        options: datasource,
        overlayClass: 'test-overlay-class'
      },
      scopedSlots: {
        option:
          '<div class="test-veui-option" slot-scope="props">{{props.label}}</div>'
      },
      sync: false,
      attachToDocument: true
    })

    wrapper.vm.focus()
    expect(document.activeElement).to.satisfy(
      item => item === document.querySelector('.veui-dropdown-button')
    )

    let menuWrapper = wrapper.find('.test-overlay-class')
    let option = menuWrapper.find('.test-veui-option')

    expect(option.exists()).to.equal(true)
    expect(option.text()).to.equal('男')
    wrapper.destroy()
  })

  it('should render trigger slot correctly', async () => {
    let wrapper = mount(
      {
        template: `
        <veui-dropdown
          ref="dropdown"
          :options="datasource"
          :expanded.sync="expanded"
        >
          <template #trigger="{ handlers, attrs }">
            <veui-button
              v-bind="attrs"
              v-on="handlers"
            >操作</veui-button>
          </template>
        </veui-dropdown>`,
        components: {
          'veui-dropdown': Dropdown,
          'veui-button': Button
        },
        data () {
          return {
            datasource,
            expanded: false
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    let trigger = wrapper.find('.veui-button')
    expect(trigger.attributes('aria-haspopup')).to.equal('menu')

    trigger.trigger('click')
    await vm.$nextTick()

    expect(vm.expanded).to.equal(true)

    wrapper.destroy()
  })

  it('should render default slot correctly', async () => {
    let wrapper = mount(
      {
        template: `
        <veui-dropdown ref="dropdown">
          <template #default="{ close }">
            <div class="content" @click="close"/>
          </template>
        </veui-dropdown>`,
        components: {
          'veui-dropdown': Dropdown,
          'veui-button': Button
        },
        data () {
          return {
            datasource
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    wrapper.find('.veui-button').trigger('click')

    await vm.$nextTick()
    expect(wrapper.classes()).to.contain('veui-dropdown-expanded')
    wrapper.find('.content').trigger('click')

    await vm.$nextTick()
    expect(wrapper.classes()).to.not.contain('veui-dropdown-expanded')

    wrapper.destroy()
  })

  it('should trigger click event with a value', () => {
    let wrapper = mount(Dropdown, {
      propsData: {
        split: true,
        options: datasource,
        overlayClass: 'test-overlay-class'
      },
      sync: false,
      attachToDocument: true
    })

    wrapper.vm.$on('click', val => {
      expect(val).to.equal('male')
      wrapper.destroy()
    })

    let menuWrapper = wrapper.find('.test-overlay-class')

    menuWrapper.find('.veui-option').trigger('click')
  })

  it('should trigger click event without a value', () => {
    let wrapper = mount(Dropdown, {
      propsData: {
        split: true,
        options: datasource
      },
      sync: false,
      attachToDocument: true
    })

    wrapper.vm.$on('click', val => {
      expect(val).to.equal(undefined)
      wrapper.destroy()
    })

    wrapper.find('.veui-dropdown-command').trigger('click')
  })

  it('should close the dropdown menu if `esc` is pressed', async () => {
    let wrapper = mount(Dropdown, {
      propsData: {
        split: true,
        trigger: 'click',
        options: datasource,
        overlayClass: 'test-overlay-class'
      },
      sync: false,
      attachToDocument: true
    })
    // for coverage
    wrapper.vm.focus()
    expect(document.activeElement).to.satisfy(
      item => item === document.querySelector('.veui-dropdown-command')
    )

    const { $nextTick } = wrapper.vm
    wrapper.find('.veui-dropdown-button').trigger('click')

    await $nextTick()
    let menuWrapper = wrapper.find('.test-overlay-class')
    menuWrapper
      .find('.veui-dropdown-options')
      .trigger('keydown.esc', { key: 'Escape' })
    await $nextTick()
    expect(menuWrapper.isVisible()).to.equal(false)
    wrapper.destroy()
  })

  it('should toggle the dropdown menu if space/enter/up/down when are pressed', async () => {
    let wrapper = mount(
      {
        template: `
          <veui-dropdown
            split
            :options="datasource"
            :expanded.sync="expanded"
          />
        `,
        components: {
          'veui-dropdown': Dropdown
        },
        data () {
          return {
            datasource,
            expanded: false
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    const { vm } = wrapper
    wrapper
      .find('.veui-dropdown-button')
      .trigger('keydown.enter', { key: 'Enter' })

    await vm.$nextTick()
    expect(vm.expanded).to.equal(true)

    vm.expanded = false
    await vm.$nextTick()
    wrapper.find('.veui-dropdown-button').trigger('keydown.space', { key: ' ' })

    await vm.$nextTick()
    expect(vm.expanded).to.equal(true)
    vm.expanded = false
    await vm.$nextTick()
    wrapper.find('.veui-dropdown-button').trigger('keydown.up', { key: 'Up' })

    await vm.$nextTick()
    expect(vm.expanded).to.equal(true)
    vm.expanded = false
    await vm.$nextTick()
    wrapper
      .find('.veui-dropdown-button')
      .trigger('keydown.down', { key: 'Down' })

    await vm.$nextTick()
    expect(vm.expanded).to.equal(true)
    vm.expanded = false
    await vm.$nextTick()
    wrapper
      .find('.veui-dropdown-button')
      .trigger('keydown.left', { key: 'Left' })

    await vm.$nextTick()
    expect(vm.expanded).to.equal(false)

    wrapper.destroy()
  })

  it('should handle controlled `expanded` prop correctly', async () => {
    let count = 0
    let wrapper = mount(
      {
        template: `
          <veui-dropdown
            :options="datasource"
            :expanded="expanded"
            @toggle="handleToggle"
          />
        `,
        components: {
          'veui-dropdown': Dropdown
        },
        data () {
          return {
            datasource,
            expanded: false
          }
        },
        methods: {
          handleToggle (val) {
            this.expanded = count === 0 ? false : val
            count++
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    const { vm } = wrapper
    wrapper.find('.veui-dropdown-button').trigger('click')

    await vm.$nextTick()
    expect(wrapper.find('.veui-dropdown-expanded').exists()).to.equal(false)
    wrapper.find('.veui-dropdown-button').trigger('click')

    await vm.$nextTick()
    expect(wrapper.find('.veui-dropdown-expanded').exists()).to.equal(true)

    wrapper.destroy()
  })

  it('should close the searchable dropdown menu if `tab` is pressed', async () => {
    let wrapper = mount(
      {
        template: `
        <veui-dropdown
          ref="dropdown"
          :options="datasource"
          :searchable="searchable"
          overlayClass="test-overlay-class"
        />`,
        components: {
          'veui-dropdown': Dropdown
        },
        data () {
          return {
            datasource,
            searchable: true
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    const { vm } = wrapper
    wrapper.find('.veui-dropdown-button').trigger('click')

    await vm.$nextTick()
    wrapper
      .find('.test-overlay-class')
      .find('.veui-dropdown-options')
      .trigger('keydown.tab', { key: 'Tab' })

    await vm.$nextTick()
    expect(wrapper.classes()).to.not.contain('veui-dropdown-expanded')
    vm.searchable = false

    await vm.$nextTick()
    wrapper.find('.veui-dropdown-button').trigger('click')
    wrapper
      .find('.test-overlay-class')
      .find('.veui-dropdown-options')
      .trigger('keydown.tab', { key: 'Tab' })

    await vm.$nextTick()
    expect(wrapper.classes()).to.contain('veui-dropdown-expanded')

    wrapper.destroy()
  })

  it('should trigger click on current focused element when enter is pressed on searchable dropdown', async () => {
    let wrapper = mount(
      {
        template: `
        <veui-dropdown
          ref="dropdown"
          :options="datasource"
          :searchable="searchable"
          overlayClass="test-overlay-class"
          @click="handleClick"
        />`,
        components: {
          'veui-dropdown': Dropdown
        },
        data () {
          return {
            val: null,
            datasource,
            searchable: true
          }
        },
        methods: {
          handleClick (val) {
            this.val = val
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    const { vm } = wrapper
    wrapper.find('.veui-dropdown-button').trigger('click')

    await vm.$nextTick()
    let options = wrapper
      .find('.test-overlay-class')
      .find('.veui-dropdown-options')
    options.trigger('keydown.down', { key: 'Down' })
    options.trigger('keydown.enter', { key: 'Enter' })

    await vm.$nextTick()
    expect(vm.val).to.equal('male')

    vm.searchable = false
    await vm.$nextTick()
    options = wrapper.find('.test-overlay-class').find('.veui-dropdown-options')
    options.trigger('keydown.down', { key: 'Down' })
    options.trigger('keydown.enter', { key: 'Enter' })

    await vm.$nextTick()
    expect(vm.val).to.equal('male')

    wrapper.destroy()
  })
})
