import { mount } from '@vue/test-utils'
import Searchbox from '@/components/Searchbox'

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

describe('components/Searchbox', () => {
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
        return (
          <Searchbox value={null} onInput={val => this.handleInput(val)} />
        )
      }
    })

    wrapper.find('.veui-input-input').trigger('input')
  })

  it('should support input event correctly.', done => {
    let wrapper = mount(
      {
        components: {
          'veui-searchbox': Searchbox
        },
        methods: {
          inputHandler (val) {
            expect(val).to.equal('box')

            wrapper.destroy()
            done()
          }
        },
        template: `<veui-searchbox @input="inputHandler"/>`
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
          'veui-searchbox': Searchbox
        },
        template: `<veui-searchbox overlayClass="test-overlay-class" :suggestions="suggestions" :suggestTrigger="suggestTrigger"/>`
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
    expect(suggestWrapper.element.style.display).to.not.equal('none')

    await vm.$nextTick()

    vm.suggestTrigger = 'focus'
    await vm.$nextTick()
    wrapper.find('input').trigger('focus')
    await vm.$nextTick()
    expect(suggestWrapper.element.style.display).to.not.equal('none')

    vm.suggestTrigger = 'submit'
    await vm.$nextTick()
    wrapper.find('.veui-searchbox-action').trigger('click')
    await vm.$nextTick()
    expect(suggestWrapper.element.style.display).to.not.equal('none')

    vm.suggestTrigger = ['input', 'focus']
    await vm.$nextTick()
    wrapper.find('input').trigger('focus')
    await vm.$nextTick()
    expect(suggestWrapper.element.style.display).to.not.equal('none')

    document.dispatchEvent(new MouseEvent('click'))
    await vm.$nextTick()
    expect(suggestWrapper.element.style.display).to.equal('none')

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
          'veui-searchbox': Searchbox
        },
        template: `<veui-searchbox
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
    expect(suggestWrapper.element.style.display).to.equal('none')

    input.trigger('focus')
    await vm.$nextTick()
    expect(suggestWrapper.element.style.display).to.equal('none')

    vm.readonly = true
    vm.disabled = false
    await vm.$nextTick()

    input.trigger('input')
    await vm.$nextTick()
    expect(suggestWrapper.element.style.display).to.equal('none')

    input.trigger('focus')
    await vm.$nextTick()
    expect(suggestWrapper.element.style.display).to.equal('none')
  })

  it('should support other props correctly.', async () => {
    let wrapper = mount(Searchbox, {
      sync: false,
      propsData: {
        placeholder: 'content',
        ui: 'primary',
        value: 'initial',
        autofocus: true,
        clearable: true,
        suggestions: datasource,
        replaceOnSelect: true,
        disabled: false
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.veui-input-placeholder').text()).to.equal('content')
    expect(wrapper.find('input').element.value).to.equal('initial')
    expect(wrapper.attributes('autofocus')).to.equal('autofocus')
    expect(wrapper.attributes('ui')).to.equal('primary')

    wrapper.find('button.veui-input-clear').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('input').element.value).to.equal('')

    wrapper.setProps({ disabled: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).to.include('veui-disabled')

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
          'veui-searchbox': Searchbox
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
        template: `<veui-searchbox overlayClass="test-overlay-class" :suggestions="suggestions" @suggest="suggestHandler"/>`
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
          'veui-searchbox': Searchbox
        },
        methods: {
          selectHandler (item) {
            expect(item.value).to.equal(11)
            expect(item.label).to.equal('cherry')
          }
        },
        template: `<veui-searchbox v-model="value" replaceOnSelect overlayClass="test-overlay-class" :suggestions="suggestions" @select="selectHandler"/>`
      },
      {
        sync: false
      }
    )

    let input = wrapper.find('input')
    input.element.value = 'box'
    input.trigger('input')

    wrapper
      .find('.test-overlay-class .veui-searchbox-suggestion-item')
      .trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.find('input').element.value).to.equal('11')
    expect(wrapper.vm.value).to.equal(11)

    wrapper.destroy()
  })

  it('should support search event correctly.', done => {
    let wrapper = mount(
      {
        components: {
          'veui-searchbox': Searchbox
        },
        methods: {
          searchHandler (val) {
            expect(val).to.equal('box')

            wrapper.destroy()
            done()
          }
        },
        template: `<veui-searchbox @search="searchHandler"/>`
      },
      {
        sync: false
      }
    )

    let input = wrapper.find('input')
    input.element.value = 'box'
    input.trigger('input')

    wrapper.find('.veui-searchbox-action').trigger('click')
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
          'veui-searchbox': Searchbox
        },
        template: `
          <veui-searchbox
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
                    class="veui-searchbox-suggestion-item"
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
          </veui-searchbox>
        `
      },
      {
        sync: false
      }
    )

    wrapper.find('.veui-searchbox-action').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.test-overlay-class h3').text()).to.equal('header')
    expect(
      wrapper
        .findAll('.test-overlay-class h3')
        .at(1)
        .text()
    ).to.equal('ender')

    let items = wrapper.findAll('.veui-searchbox-suggestion-item')
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
          'veui-searchbox': Searchbox
        },
        template: `
          <veui-searchbox
            :suggestions="suggestions"
            suggestTrigger="focus"
            overlayClass="test-overlay-class"
          >
            <template slot="suggestion" slot-scope="suggestion">
              <span>{{ suggestion.value }}</span>
            </template>
          </veui-searchbox>
        `
      },
      {
        sync: false
      }
    )

    wrapper.find('input').trigger('focus')
    await wrapper.vm.$nextTick()

    let items = wrapper.findAll('.veui-searchbox-suggestion-item')
    expect(items.length).to.equal(4)
    expect(items.at(1).text()).to.equal('22')

    wrapper.destroy()
  })
})
