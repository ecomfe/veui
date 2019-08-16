import { mount } from '@vue/test-utils'
import Tag from '@/components/Tag'

describe('components/Tag', () => {
  it('should render slot correctly', () => {
    let wrapper = mount({
      components: {
        'veui-tag': Tag
      },
      data () {
        return {
          content: 'test tag slot'
        }
      },
      template: `<veui-tag>{{ content }}</veui-tag>`
    })
    expect(wrapper.text()).to.equal('test tag slot')
    wrapper.destroy()
  })

  it('should render ui correctly', () => {
    let wrapper = mount({
      components: {
        'veui-tag': Tag
      },
      template: '<veui-tag ui="s">small tag</veui-tag>'
    })
    expect(wrapper.attributes('ui')).to.equal('s')
    wrapper.destroy()
  })

  it('should render `type` prop correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-tag': Tag
      },
      data () {
        return {
          type: 'success'
        }
      },
      template: '<veui-tag :type="type">small tag</veui-tag>'
    })
    let { vm } = wrapper
    expect(wrapper.classes('veui-tag-success')).to.equal(true)

    vm.type = 'error'
    await vm.$nextTick()
    expect(wrapper.classes('veui-tag-success')).to.equal(false)
    expect(wrapper.classes('veui-tag-error')).to.equal(true)
    wrapper.destroy()
  })

  it('should close the tag correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-tag': Tag
      },
      data () {
        return {
          close: false
        }
      },
      methods: {
        handleClose () {
          this.close = true
        }
      },
      template: `
        <veui-tag
          closable
          @close="handleClose"
        >
          closable tag
        </veui-tag>`
    })
    let closeBtn = wrapper.find('.veui-tag-close')
    expect(closeBtn.exists()).to.equal(true)

    closeBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.veui-tag').exists()).to.equal(false)
    expect(wrapper.vm.close).to.equal(true)
    wrapper.destroy()
  })

  it('should handle `selected` prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tag': Tag
        },
        data () {
          return {
            selected: false
          }
        },
        template: `
        <veui-tag
          :selected.sync="selected"
        >
          selected tag
        </veui-tag>`
      },
      {
        sync: false
      }
    )
    expect(wrapper.classes('veui-tag-selected')).to.equal(false)

    wrapper.vm.selected = true
    await wrapper.vm.$nextTick()

    expect(wrapper.classes('veui-tag-selected')).to.equal(true)
    wrapper.destroy()
  })

  it('should handle `selectable` prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tag': Tag
        },
        data () {
          return {
            selected: false
          }
        },
        template: `
        <veui-tag
          :selected.sync="selected"
          selectable
          closable
        >
          selected tag
        </veui-tag>`
      },
      {
        sync: false
      }
    )
    let tag = wrapper.find('.veui-tag')
    expect(tag.classes('veui-tag-selected')).to.equal(false)

    tag.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.classes('veui-tag-selected')).to.equal(true)
    expect(wrapper.vm.selected).to.equal(true)

    let closeBtn = wrapper.find('.veui-tag-close')
    closeBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.veui-tag').exists()).to.equal(false)
    wrapper.destroy()
  })

  it('should handle `disabled` prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tag': Tag
        },
        data () {
          return {
            selected: true,
            disabled: true
          }
        },
        template: `
        <veui-tag
          :selected.sync="selected"
          :disabled="disabled"
          selectable
          closable
        >
          selected tag
        </veui-tag>`
      },
      {
        sync: false
      }
    )
    let tag = wrapper.find('.veui-tag')
    expect(tag.classes('veui-tag-selected')).to.equal(true)
    expect(tag.classes('veui-disabled')).to.equal(true)

    tag.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.classes('veui-tag-selected')).to.equal(true)
    expect(wrapper.vm.selected).to.equal(true)

    let closeBtn = wrapper.find('.veui-tag-close')
    closeBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.veui-tag').exists()).to.equal(true)
    wrapper.destroy()
  })
})
