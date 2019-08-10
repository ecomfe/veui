import { mount } from '@vue/test-utils'
import Accordion from '@/components/Accordion'
import Collapse from '@/components/Collapse'

const COLLAPSE_CLASS = '.veui-collapse'
const HEADER_CLASS = '.veui-collapse-header'
const BODY_CLASS = '.veui-collapse-body'

describe('components/Accordion', () => {
  it('should expand/collapse correctly with local state', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-accordion': Accordion,
          'veui-collapse': Collapse
        },
        template: `
          <veui-accordion>
            <veui-collapse label="标题一">
              Content
            </veui-collapse>
            <veui-collapse label="标题二">
              Content
            </veui-collapse>
            <veui-collapse
              label="标题三"
              disabled
            >
              Content
            </veui-collapse>
          </veui-accordion>`
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let c = wrapper.findAll(COLLAPSE_CLASS)
    let c0 = c.at(0)
    let c1 = c.at(1)
    let c2 = c.at(2)
    let h0 = c0.find(HEADER_CLASS)
    let h1 = c1.find(HEADER_CLASS)
    let h2 = c2.find(HEADER_CLASS)

    expect(c0.find(BODY_CLASS).exists()).to.equal(false)
    h0.trigger('click')

    await vm.$nextTick()
    expect(c0.find(BODY_CLASS).exists()).to.equal(true)
    h1.trigger('click')

    await vm.$nextTick()
    expect(c0.find(BODY_CLASS).exists()).to.equal(false)
    expect(c1.find(BODY_CLASS).exists()).to.equal(true)
    h2.trigger('click')
    await vm.$nextTick()
    expect(c1.find(BODY_CLASS).exists()).to.equal(true)
    expect(c2.find(BODY_CLASS).exists()).to.equal(false)

    wrapper.destroy()
  })

  it('should expand/collapse correctly with .sync', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-accordion': Accordion,
          'veui-collapse': Collapse
        },
        template: `
          <veui-accordion :expanded.sync="expanded">
            <veui-collapse label="标题一" name="0">
              Content
            </veui-collapse>
            <veui-collapse label="标题二" name="1">
              Content
            </veui-collapse>
            <veui-collapse label="标题三" name="2" disabled>
              Content
            </veui-collapse>
          </veui-accordion>`,
        data () {
          return {
            expanded: '0'
          }
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let c0 = wrapper.findAll(COLLAPSE_CLASS).at(0)
    let c1 = wrapper.findAll(COLLAPSE_CLASS).at(1)
    let c2 = wrapper.findAll(COLLAPSE_CLASS).at(2)
    let h0 = c0.find(HEADER_CLASS)
    let h1 = c1.find(HEADER_CLASS)
    let h2 = c2.find(HEADER_CLASS)

    expect(c0.find(BODY_CLASS).exists()).to.equal(true)
    h0.trigger('click')

    await vm.$nextTick()
    expect(vm.expanded).to.equal(null)
    h1.trigger('click')

    await vm.$nextTick()
    expect(vm.expanded).to.equal('1')
    expect(c1.find(BODY_CLASS).exists()).to.equal(true)
    h2.trigger('click')

    await vm.$nextTick()
    expect(vm.expanded).to.equal('1')
    expect(c2.find(BODY_CLASS).exists()).to.equal(false)

    wrapper.destroy()
  })

  it('should expand/collapse correctly with controlled mode and multiple', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-accordion': Accordion,
          'veui-collapse': Collapse
        },
        template: `
          <veui-accordion multiple :expanded="expanded" @toggle="toggle">
            <veui-collapse label="标题一" name="0">
              Content
            </veui-collapse>
            <veui-collapse label="标题二" name="1">
              Content
            </veui-collapse>
            <veui-collapse label="标题三" name="2">
              Content
            </veui-collapse>
          </veui-accordion>`,
        data () {
          return {
            expanded: ['0']
          }
        },
        methods: {
          toggle (val, name, expanded) {
            if (val) {
              this.expanded = expanded
            }
          }
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let c0 = wrapper.findAll(COLLAPSE_CLASS).at(0)
    let c1 = wrapper.findAll(COLLAPSE_CLASS).at(1)
    let c2 = wrapper.findAll(COLLAPSE_CLASS).at(2)
    let h0 = c0.find(HEADER_CLASS)
    let h1 = c1.find(HEADER_CLASS)
    let h2 = c2.find(HEADER_CLASS)

    expect(c0.find(BODY_CLASS).exists()).to.equal(true)
    h0.trigger('click')

    await vm.$nextTick()
    expect(vm.expanded).to.deep.equal(['0'])
    h1.trigger('click')

    await vm.$nextTick()
    expect(vm.expanded).to.deep.equal(['0', '1'])
    expect(c1.find(BODY_CLASS).exists()).to.equal(true)
    h1.trigger('click')
    h2.trigger('click')

    await vm.$nextTick()
    expect(vm.expanded).to.deep.equal(['0', '1', '2'])
    expect(c0.find(BODY_CLASS).exists()).to.equal(true)
    expect(c2.find(BODY_CLASS).exists()).to.equal(true)

    wrapper.destroy()
  })

  it('should handle disabled state correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-accordion': Accordion,
          'veui-collapse': Collapse
        },
        template: `
          <veui-accordion disabled>
            <veui-collapse label="标题一">
              Content
            </veui-collapse>
            <veui-collapse label="标题二">
              Content
            </veui-collapse>
            <veui-collapse label="标题三">
              Content
            </veui-collapse>
          </veui-accordion>`
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let c0 = wrapper.findAll(COLLAPSE_CLASS).at(0)
    let c1 = wrapper.findAll(COLLAPSE_CLASS).at(1)
    let h0 = c0.find(HEADER_CLASS)
    let h1 = c1.find(HEADER_CLASS)

    expect(c0.find(BODY_CLASS).exists()).to.equal(false)
    h0.trigger('click')

    await vm.$nextTick()
    expect(c0.find(BODY_CLASS).exists()).to.equal(false)
    h1.trigger('click')

    await vm.$nextTick()
    expect(c1.find(BODY_CLASS).exists()).to.equal(false)

    wrapper.destroy()
  })
})
