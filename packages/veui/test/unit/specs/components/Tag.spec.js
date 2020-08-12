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

  it('should remove the tag correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-tag': Tag
      },
      data () {
        return {
          removed: false
        }
      },
      methods: {
        handleRemove () {
          this.removed = true
        }
      },
      template: `
        <veui-tag
          removable
          @remove="handleRemove"
        >
          removable tag
        </veui-tag>`
    })
    let removeBtn = wrapper.find('.veui-tag-remove')
    expect(removeBtn.exists()).to.equal(true)

    removeBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.veui-tag').exists()).to.equal(false)
    expect(wrapper.vm.removed).to.equal(true)
    wrapper.destroy()
  })

  it('should handle `removed` prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tag': Tag
        },
        data () {
          return {
            removed: false
          }
        },
        template: `
        <veui-tag
          removable
          :removed.sync="removed"
        >
          removable tag
        </veui-tag>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    expect(wrapper.find('.veui-tag').exists()).to.equal(true)
    vm.removed = true

    await vm.$nextTick()
    expect(wrapper.find('.veui-tag').exists()).to.equal(false)
    vm.removed = false

    await vm.$nextTick()
    expect(wrapper.find('.veui-tag').exists()).to.equal(true)
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
            disabled: true,
            selectable: true,
            removable: false
          }
        },
        template: `
        <veui-tag
          :selected.sync="selected"
          :disabled="disabled"
          :selectable="selectable"
          :removable="removable"
        >
          selected tag
        </veui-tag>`
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let tag = wrapper.find('.veui-tag')
    expect(tag.classes('veui-tag-selected')).to.equal(true)
    expect(tag.classes('veui-disabled')).to.equal(true)

    tag.trigger('click')
    await vm.$nextTick()

    expect(wrapper.classes('veui-tag-selected')).to.equal(true)
    expect(vm.selected).to.equal(true)

    vm.selectable = false
    vm.removable = true
    await vm.$nextTick()

    let removeBtn = wrapper.find('.veui-tag-remove')
    removeBtn.trigger('click')
    await vm.$nextTick()

    expect(wrapper.find('.veui-tag').exists()).to.equal(true)
    wrapper.destroy()
  })

  it('should make prop `selected` fully controlled', async () => {
    let wrapper = mount({
      components: {
        'veui-tag': Tag
      },
      data () {
        return {
          selected: true
        }
      },
      template: '<veui-tag selectable :selected="selected">small tag</veui-tag>'
    })
    let { vm } = wrapper
    wrapper.trigger('click')
    await vm.$nextTick()
    expect(wrapper.classes()).to.include('veui-tag-selected')

    vm.selected = false
    await vm.$nextTick()
    wrapper.trigger('click')
    await vm.$nextTick()
    expect(wrapper.classes()).to.not.include('veui-tag-selected')
    wrapper.destroy()
  })
})
