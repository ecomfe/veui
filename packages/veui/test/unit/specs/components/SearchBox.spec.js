import { mount } from '@vue/test-utils'
import SearchBox from '@/components/SearchBox'

let datasource = [
  {
    value: 11,
    label: 'cherry'
  },
  {
    value: 22,
    label: 'banana'
  },
  {
    value: 33,
    label: 'apple'
  },
  'pineapple'
]

let cars = [
  {
    label: 'toyota',
    options: [
      {
        label: '凯美瑞',
        value: 'camry'
      },
      {
        label: '卡罗拉',
        value: 'carolla'
      }
    ]
  }
]

describe('components/SearchBox', () => {
  it('should handle selected prop with `null` value.', done => {
    let wrapper = mount({
      methods: {
        handleInput (val) {
          expect(val).to.equal('')

          wrapper.destroy()
          done()
        }
      },
      render () {
        return <SearchBox value={null} onInput={val => this.handleInput(val)} />
      }
    })

    wrapper.find('.veui-input-input').trigger('input')
  })

  it('should support input event correctly.', done => {
    let wrapper = mount(
      {
        components: {
          'veui-search-box': SearchBox
        },
        methods: {
          inputHandler (val) {
            expect(val).to.equal('box')

            wrapper.destroy()
            done()
          }
        },
        template: `<veui-search-box @input="inputHandler"/>`
      },
      {
        sync: false
      }
    )

    let input = wrapper.find('input')
    input.element.value = 'box'
    input.trigger('input')
  })

  it('should support customized trigger correctly.', async () => {
    let wrapper = mount(
      {
        data () {
          return {
            suggestions: datasource,
            suggestTrigger: 'input'
          }
        },
        components: {
          'veui-search-box': SearchBox
        },
        template: `<veui-search-box overlayClass="test-overlay-class" :suggestions="suggestions" :suggestTrigger="suggestTrigger"/>`
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let input = wrapper.find('input')
    input.element.value = 'box'
    input.trigger('input')
    await vm.$nextTick()

    let suggestWrapper = wrapper.find('.test-overlay-class')
    expect(suggestWrapper.isVisible()).to.equal(true)

    await vm.$nextTick()

    vm.suggestTrigger = 'focus'
    await vm.$nextTick()
    wrapper.find('input').trigger('focus')
    await vm.$nextTick()
    expect(suggestWrapper.isVisible()).to.equal(true)

    vm.suggestTrigger = 'submit'
    await vm.$nextTick()
    wrapper.find('.veui-search-box-action').trigger('click')
    await vm.$nextTick()
    expect(suggestWrapper.isVisible()).to.equal(true)

    vm.suggestTrigger = ['input', 'focus']
    await vm.$nextTick()
    wrapper.find('input').trigger('focus')
    await vm.$nextTick()
    expect(suggestWrapper.isVisible()).to.equal(true)

    document.dispatchEvent(new MouseEvent('click'))
    await vm.$nextTick()
    expect(suggestWrapper.isVisible()).to.equal(false)

    wrapper.destroy()
  })

  it('should render correctly on `disable` or `readonly` state', async () => {
    let wrapper = mount(
      {
        data () {
          return {
            suggestions: datasource,
            suggestTrigger: ['input', 'focus'],
            readonly: false,
            disabled: true
          }
        },
        components: {
          'veui-search-box': SearchBox
        },
        template: `<veui-search-box
          overlayClass="test-overlay-class"
          :suggestions="suggestions"
          :suggestTrigger="suggestTrigger"
          :readonly="readonly"
          :disabled="disabled"
        />`
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let input = wrapper.find('input')
    let suggestWrapper = wrapper.find('.test-overlay-class')
    input.element.value = 'box'

    input.trigger('input')
    await vm.$nextTick()
    expect(suggestWrapper.isVisible()).to.equal(false)

    input.trigger('focus')
    await vm.$nextTick()
    expect(suggestWrapper.isVisible()).to.equal(false)

    vm.readonly = true
    vm.disabled = false
    await vm.$nextTick()

    input.trigger('input')
    await vm.$nextTick()
    expect(suggestWrapper.isVisible()).to.equal(false)

    input.trigger('focus')
    await vm.$nextTick()
    expect(suggestWrapper.isVisible()).to.equal(false)
    wrapper.destroy()
  })

  it('should support other props correctly.', async () => {
    let wrapper = mount(
      {
        data () {
          return {
            suggestions: datasource,
            suggestTrigger: ['input', 'focus'],
            readonly: false,
            disabled: false,
            value: 'initial'
          }
        },
        components: {
          'veui-search-box': SearchBox
        },
        template: `<veui-search-box
          v-model="value"
          :suggestions="suggestions"
          placeholder="content"
          ui="primary"
          clearable
          autofocus
          replaceOnSelect
          disabled
        />`
      },
      {
        sync: false
      }
    )

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.veui-input-placeholder').text()).to.equal('content')
    expect(wrapper.find('input').element.value).to.equal('initial')
    expect(wrapper.attributes('autofocus')).to.equal('autofocus')
    expect(wrapper.attributes('ui')).to.include('primary')

    wrapper.find('button.veui-input-clear').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('input').element.value).to.equal('')

    wrapper.setProps({ disabled: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.classes('veui-disabled')).to.equal(true)

    wrapper.destroy()
  })

  it('should support suggest event correctly.', done => {
    let wrapper = mount(
      {
        data () {
          return {
            suggestions: []
          }
        },
        components: {
          'veui-search-box': SearchBox
        },
        methods: {
          suggestHandler (val) {
            expect(val).to.equal('box')

            this.suggestions = datasource

            let suggestWrapper = wrapper.find('.test-overlay-class')
            expect(suggestWrapper.attributes('style').display).to.not.equal(
              'none'
            )

            wrapper.destroy()
            done()
          }
        },
        template: `<veui-search-box overlayClass="test-overlay-class" :suggestions="suggestions" @suggest="suggestHandler"/>`
      },
      {
        sync: false
      }
    )

    let input = wrapper.find('input')
    input.element.value = 'box'
    input.trigger('input')
  })

  it('should support select event correctly.', async () => {
    let wrapper = mount(
      {
        data () {
          return {
            suggestions: datasource,
            value: ''
          }
        },
        components: {
          'veui-search-box': SearchBox
        },
        methods: {
          selectHandler (item) {
            expect(item.value).to.equal(11)
            expect(item.label).to.equal('cherry')
          }
        },
        template: `<veui-search-box v-model="value" replaceOnSelect overlayClass="test-overlay-class" :suggestions="suggestions" @select="selectHandler"/>`
      },
      {
        sync: false
      }
    )

    let input = wrapper.find('input')
    input.element.value = 'box'
    input.trigger('input')

    wrapper.find('.test-overlay-class .veui-option').trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.find('input').element.value).to.equal('11')
    expect(wrapper.vm.value).to.equal(11)

    wrapper.destroy()
  })

  it('should support search event correctly.', async () => {
    let params = []

    let wrapper = mount(
      {
        components: {
          'veui-search-box': SearchBox
        },
        data () {
          return {
            suggestions: [{ label: '1', value: '1' }]
          }
        },
        methods: {
          searchHandler (val) {
            params.push(val)
          }
        },
        template:
          '<veui-search-box :suggestions="suggestions" @search="searchHandler"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let input = wrapper.find('input')

    input.trigger('keydown', { key: 'Enter' })

    input.setValue('box')
    input.trigger('input')
    await wrapper.vm.$nextTick()
    input.trigger('keydown', { key: 'Enter' })

    wrapper.find('.veui-search-box-action').trigger('click')

    expect(params).to.eql(['', 'box', 'box'])
    wrapper.destroy()
  })

  it('should render customized suggestions & suggestions-before & suggestions-after slot correctly.', async () => {
    let wrapper = mount(
      {
        data () {
          return {
            suggestions: datasource
          }
        },
        components: {
          'veui-search-box': SearchBox
        },
        template: `
          <veui-search-box
            :suggestions="suggestions"
            suggestTrigger="submit"
            overlayClass="test-overlay-class"
          >
            <template slot="suggestions-before">
              <h3>header</h3>
            </template>
            <template slot="suggestions" slot-scope="props">
              <div>
                <template v-for="(suggestion, index) in props.suggestions">
                  <div
                    :key="index"
                    class="veui-search-box-suggestion-item"
                    @click="props.select(suggestion)"
                  >
                    <span>{{ suggestion.value }}</span>
                  </div>
                </template>
              </div>
            </template>
            <template slot="suggestions-after">
              <h3>ender</h3>
            </template>
          </veui-search-box>
        `
      },
      {
        sync: false
      }
    )

    wrapper.find('.veui-search-box-action').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.test-overlay-class h3').text()).to.equal('header')
    expect(
      wrapper
        .findAll('.test-overlay-class h3')
        .at(1)
        .text()
    ).to.equal('ender')

    let items = wrapper.findAll('.veui-search-box-suggestion-item')
    expect(items.length).to.equal(4)
    expect(items.at(1).text()).to.equal('22')

    wrapper.destroy()
  })

  it('should render customized suggestion slot correctly.', async () => {
    let wrapper = mount(
      {
        data () {
          return {
            suggestions: datasource
          }
        },
        components: {
          'veui-search-box': SearchBox
        },
        template: `
          <veui-search-box
            :suggestions="suggestions"
            suggestTrigger="focus"
            overlayClass="test-overlay-class"
          >
            <template slot="suggestion" slot-scope="suggestion">
              <span>{{ suggestion.value }}</span>
            </template>
          </veui-search-box>
        `
      },
      {
        sync: false
      }
    )

    wrapper.find('input').trigger('focus')
    await wrapper.vm.$nextTick()

    let items = wrapper.findAll('.veui-option')
    expect(items.length).to.equal(4)
    expect(items.at(1).text()).to.equal('22')

    wrapper.destroy()
  })

  it('should render group-label slot and option-label slot correctly', () => {
    let wrapper = mount(
      {
        data () {
          return {
            suggestions: cars
          }
        },
        components: {
          'veui-search-box': SearchBox
        },
        template: `
          <veui-search-box
            :suggestions="suggestions"
            suggestTrigger="focus"
            overlayClass="test-overlay-class"
          >
            <template slot="group-label" slot-scope="suggestion">
              <span class="custom-group-label-slot">{{ suggestion.label }}</span>
            </template>
            <template slot="option-label" slot-scope="suggestion">
              <span class="custom-option-label-slot">{{ suggestion.value }}</span>
            </template>
          </veui-search-box>
        `
      },
      {
        sync: false
      }
    )
    expect(wrapper.find('.custom-group-label-slot').text()).to.equal('toyota')
    expect(wrapper.findAll('.custom-option-label-slot').length).to.equal(2)

    wrapper.destroy()
  })

  it('should respond to keyboard event correctly', async () => {
    let wrapper = mount(
      {
        data () {
          return {
            counter: 0,
            suggestions: cars
          }
        },
        components: {
          'veui-search-box': SearchBox
        },
        methods: {
          handleSearch (val) {
            this.counter++
          }
        },
        template: `
          <veui-search-box
            :suggestions="suggestions"
            suggestTrigger="focus"
            replace-on-select
            overlayClass="test-overlay-class"
            @search="handleSearch"
          >
            <template slot="group-label" slot-scope="suggestion">
              <span class="custom-group-label-slot">{{ suggestion.label }}</span>
            </template>
            <template slot="option-label" slot-scope="suggestion">
              <span class="custom-option-label-slot">{{ suggestion.label }}</span>
            </template>
          </veui-search-box>
        `
      },
      {
        sync: false
      }
    )
    await wrapper.vm.$nextTick()
    let inputWrapper = wrapper.find('.veui-input-input')
    inputWrapper.element.focus()
    expect(wrapper.findAll('[data-focus-visible-added]').length).to.equal(0)
    inputWrapper.trigger('keydown', { key: 'Down' })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('[data-focus-visible-added]').length).to.equal(1)
    expect(wrapper.find('[data-focus-visible-added]').text()).to.equal('凯美瑞')
    inputWrapper.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-focus-visible-added]').text()).to.equal('卡罗拉')
    inputWrapper.trigger('keydown', { key: 'Up' })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-focus-visible-added]').text()).to.equal('凯美瑞')
    inputWrapper.trigger('keydown', { key: 'ArrowUp' })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-focus-visible-added]').text()).to.equal('卡罗拉')
    inputWrapper.trigger('keydown', { key: 'Tab' })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.test-overlay-class').isVisible()).to.equal(false)
    inputWrapper.element.focus()
    inputWrapper.trigger('keydown', { key: 'Enter' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.counter).to.equal(1)
    inputWrapper.trigger('keydown', { key: 'Down' })
    await wrapper.vm.$nextTick()
    inputWrapper.trigger('keydown', { key: 'Enter' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.counter).to.equal(1)
    expect(wrapper.find('.test-overlay-class').isVisible()).to.equal(false)
    wrapper.destroy()
  })

  it('should make prop `value` fully controlled', async () => {
    let wrapper = mount(SearchBox, {
      sync: false,
      propsData: {
        value: 'ok',
        clearable: true
      }
    })

    wrapper.find('button.veui-input-clear').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').element.value).to.equal('ok')

    let input = wrapper.find('input')
    input.element.value = 'notok'
    input.trigger('input')
    await wrapper.vm.$nextTick()
    expect(input.element.value).to.equal('ok')
    wrapper.destroy()
  })
})
