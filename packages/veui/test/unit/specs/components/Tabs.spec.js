import { mount } from '@vue/test-utils'
import Tabs from '@/components/Tabs'
import Tab from '@/components/Tab'
import { findIndex } from 'lodash'
import { wait } from '../../../utils'

describe('components/Tabs', () => {
  it('should render default active tab correctly with uncontrolled `active` prop', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs>
            <veui-tab label="#1">ONE</veui-tab>
            <veui-tab label="#2">TWO</veui-tab>
            <veui-tab label="#3">THREE</veui-tab>
          </veui-tabs>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()

    let tabs = wrapper.findAll('.veui-tabs-item')
    expect(tabs.at(0).text()).to.equal('#1')
    expect(tabs.at(1).text()).to.equal('#2')
    expect(tabs.at(2).text()).to.equal('#3')
    expect(tabs.at(0).classes()).to.include('veui-tabs-item-active')

    let panel = wrapper.find('.veui-tabs-panel')
    expect(panel.text()).to.equal('ONE')

    tabs
      .at(2)
      .find('button')
      .trigger('click')

    await vm.$nextTick()

    expect(tabs.at(0).classes()).to.not.include('veui-tabs-item-active')
    expect(tabs.at(2).classes()).to.include('veui-tabs-item-active')

    panel = wrapper.find('.veui-tabs-panel')
    expect(panel.text()).to.equal('THREE')

    wrapper.destroy()
  })

  it('should render active tab correctly with controlled `active` prop and `change` event', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs :active="active" @change="handleChange">
            <veui-tab name="a" label="#1">ONE</veui-tab>
            <veui-tab name="b" label="#2">TWO</veui-tab>
            <veui-tab name="c" label="#3">THREE</veui-tab>
          </veui-tabs>`,
        data () {
          return {
            active: 'c'
          }
        },
        methods: {
          handleChange ({ name }) {
            if (name === 'c') {
              this.active = name
            }
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()
    let tabs = wrapper.findAll('.veui-tabs-item')
    expect(tabs.at(2).classes()).to.include('veui-tabs-item-active')

    let panel = wrapper.find('.veui-tabs-panel')
    expect(panel.text()).to.equal('THREE')

    vm.active = 'b'

    await vm.$nextTick()

    expect(tabs.at(1).classes()).to.include('veui-tabs-item-active')

    panel = wrapper.find('.veui-tabs-panel')
    expect(panel.text()).to.equal('TWO')

    tabs
      .at(0)
      .find('button')
      .trigger('click')

    await vm.$nextTick()

    expect(tabs.at(1).classes()).to.include('veui-tabs-item-active')
    expect(tabs.at(0).classes()).to.not.include('veui-tabs-item-active')

    panel = wrapper.find('.veui-tabs-panel')
    expect(panel.text()).to.equal('TWO')

    tabs
      .at(2)
      .find('button')
      .trigger('click')

    await vm.$nextTick()

    expect(tabs.at(1).classes()).to.not.include('veui-tabs-item-active')
    expect(tabs.at(2).classes()).to.include('veui-tabs-item-active')

    panel = wrapper.find('.veui-tabs-panel')
    expect(panel.text()).to.equal('THREE')

    wrapper.destroy()
  })

  it('should render active tab correctly with controlled `active` prop with `.sync`', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs :active.sync="active">
            <veui-tab name="a" label="#1">ONE</veui-tab>
            <veui-tab name="b" label="#2">TWO</veui-tab>
            <veui-tab name="c" label="#3">THREE</veui-tab>
          </veui-tabs>`,
        data () {
          return {
            active: 'c'
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()
    let tabs = wrapper.findAll('.veui-tabs-item')
    expect(tabs.at(2).classes()).to.include('veui-tabs-item-active')

    let panel = wrapper.find('.veui-tabs-panel')
    expect(panel.text()).to.equal('THREE')

    vm.active = 'b'

    await vm.$nextTick()

    expect(tabs.at(1).classes()).to.include('veui-tabs-item-active')

    panel = wrapper.find('.veui-tabs-panel')
    expect(panel.text()).to.equal('TWO')

    tabs
      .at(0)
      .find('button')
      .trigger('click')

    await vm.$nextTick()

    expect(tabs.at(1).classes()).to.not.include('veui-tabs-item-active')
    expect(tabs.at(0).classes()).to.include('veui-tabs-item-active')

    panel = wrapper.find('.veui-tabs-panel')
    expect(panel.text()).to.equal('ONE')

    expect(vm.active).to.equal('a')

    wrapper.destroy()
  })

  it('should render default active tab correctly with `eager` prop', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs eager>
            <veui-tab label="#1">ONE</veui-tab>
            <veui-tab label="#2">TWO</veui-tab>
            <veui-tab label="#3">THREE</veui-tab>
          </veui-tabs>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()

    let tabs = wrapper.findAll('.veui-tabs-item')
    let panels = wrapper.findAll('.veui-tab-panel')
    expect(panels.length).to.equal(3)
    expect(panels.at(0).isVisible()).to.equal(true)

    tabs
      .at(2)
      .find('button')
      .trigger('click')

    await vm.$nextTick()

    expect(panels.at(0).isVisible()).to.equal(false)
    expect(panels.at(2).isVisible()).to.equal(true)

    wrapper.destroy()
  })

  it('should handle add & remove correctly', async () => {
    let count = 5
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs
            :active.sync="active"
            addable
            @add="handleAdd"
            @remove="handleRemove"
          >
            <veui-tab
              v-for="tab in tabs"
              :key="tab.name"
              :name="tab.name"
              :label="tab.label"
              removable
            >{{ tab.content }}</veui-tab>
          </veui-tabs>`,
        data () {
          return {
            tabs: [
              { label: '#1', content: '=1=', name: '1' },
              { label: '#2', content: '=2=', name: '2' },
              { label: '#3', content: '=3=', name: '3' },
              { label: '#4', content: '=4=', name: '4' },
              { label: '#5', content: '=5=', name: '5' }
            ],
            active: '2'
          }
        },
        methods: {
          handleAdd () {
            count++
            this.tabs.push({
              label: `#${count}`,
              content: `=${count}=`,
              name: String(count)
            })
          },
          handleRemove ({ name }) {
            this.tabs.splice(
              findIndex(this.tabs, tab => tab.name === name),
              1
            )
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()
    let tabs = wrapper.findAll('.veui-tabs-item')
    let btns = wrapper.findAll('.veui-tabs-item-remove')
    expect(tabs.at(1).classes()).to.include('veui-tabs-item-active')
    btns.at(1).trigger('click')

    await vm.$nextTick()
    tabs = wrapper.findAll('.veui-tabs-item')
    btns = wrapper.findAll('.veui-tabs-item-remove')
    expect(tabs.at(0).classes()).to.include('veui-tabs-item-active')
    expect(tabs.at(1).text()).to.equal('#3')
    btns.at(2).trigger('click')

    await vm.$nextTick()
    tabs = wrapper.findAll('.veui-tabs-item')
    expect(tabs.at(0).classes()).to.include('veui-tabs-item-active')
    expect(tabs.at(2).text()).to.equal('#5')
    vm.active = '5'

    await vm.$nextTick()
    tabs = wrapper.findAll('.veui-tabs-item')
    btns = wrapper.findAll('.veui-tabs-item-remove')
    expect(tabs.at(2).classes()).to.include('veui-tabs-item-active')
    btns.at(2).trigger('click')

    await vm.$nextTick()
    tabs = wrapper.findAll('.veui-tabs-item')
    expect(tabs.at(1).classes()).to.include('veui-tabs-item-active')

    let add = wrapper.find('.veui-tabs-add')
    add.trigger('click')

    await vm.$nextTick()
    tabs = wrapper.findAll('.veui-tabs-item')
    expect(tabs.at(2).text()).to.equal('#6')

    add.trigger('click')

    await vm.$nextTick()
    tabs = wrapper.findAll('.veui-tabs-item')
    expect(tabs.at(3).text()).to.equal('#7')

    wrapper.destroy()
  })

  it('should handle `max` prop correctly', async () => {
    let count = 4
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs
            :max="5"
            addable
            @add="handleAdd"
          >
            <veui-tab
              v-for="tab in tabs"
              :key="tab.name"
              :name="tab.name"
              :label="tab.label"
              removable
            >{{ tab.content }}</veui-tab>
          </veui-tabs>`,
        data () {
          return {
            tabs: [
              { label: '#1', content: '=1=', name: '1' },
              { label: '#2', content: '=2=', name: '2' },
              { label: '#3', content: '=3=', name: '3' },
              { label: '#4', content: '=4=', name: '4' }
            ]
          }
        },
        methods: {
          handleAdd () {
            count++
            this.tabs.push({
              label: `#${count}`,
              content: `=${count}=`,
              name: String(count)
            })
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()
    let add = wrapper.find('.veui-tabs-add')

    expect(add.element.disabled).to.equal(false)
    add.trigger('click')

    await vm.$nextTick()
    expect(add.element.disabled).to.equal(true)

    wrapper.destroy()
  })

  it('should render `tip` prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs tip="Watch out!">
            <veui-tab label="#1">ONE</veui-tab>
            <veui-tab label="#2">TWO</veui-tab>
            <veui-tab label="#3">THREE</veui-tab>
          </veui-tabs>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()

    expect(wrapper.find('.veui-tabs-extra').text()).to.equal('Watch out!')

    wrapper.destroy()
  })

  it('should render `tab-item` scoped slot correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs>
            <veui-tab label="#1">ONE</veui-tab>
            <veui-tab label="#2" disabled>TWO</veui-tab>
            <veui-tab label="#3">THREE</veui-tab>
            <template #tab-item="tab">
              <button
                type="button"
                class="foo-btn"
                :disabled="tab.disabled"
                v-bind="tab.attrs"
                @click="tab.activate"
              >
                {{ tab.label }}
              </button>
            </template>
          </veui-tabs>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()

    let tabs = wrapper.findAll('.veui-tabs-item')
    expect(tabs.at(0).classes()).to.include('veui-tabs-item-active')

    let btns = wrapper.findAll('.foo-btn')
    expect(btns.length).to.equal(3)

    btns.at(1).trigger('click')

    await vm.$nextTick()
    expect(tabs.at(0).classes()).to.include('veui-tabs-item-active')
    expect(tabs.at(1).classes()).to.not.include('veui-tabs-item-active')

    btns.at(2).trigger('click')

    await vm.$nextTick()
    expect(tabs.at(0).classes()).to.not.include('veui-tabs-item-active')
    expect(tabs.at(2).classes()).to.include('veui-tabs-item-active')

    wrapper.destroy()
  })

  it("should render Tab's `item` and `label` and Tabs' `tab-item` scoped slot correctly", async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs>
            <veui-tab label="#1">
              ONE
              <template #label="tab">
                <em class="foo-label">{{ tab.label }}</em>
              </template>
            </veui-tab>
            <veui-tab label="#2" disabled>TWO</veui-tab>
            <veui-tab label="#3">
              THREE
              <template #item="tab">
              <button
                type="button"
                class="foo-btn"
                :disabled="tab.disabled"
                v-bind="tab.attrs"
                @click="tab.activate"
              >
                {{ tab.label }}
              </button>
            </template>
            </veui-tab>
            <template #tab-item="tab">
              <button
                type="button"
                class="bar-btn"
                :disabled="tab.disabled"
                v-bind="tab.attrs"
                @click="tab.activate"
              >
                {{ tab.label }}
              </button>
            </template>
          </veui-tabs>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()

    let tabs = wrapper.findAll('.veui-tabs-item')
    expect(tabs.at(0).classes()).to.include('veui-tabs-item-active')
    expect(
      tabs
        .at(0)
        .find('.foo-label')
        .exists()
    ).to.equal(false)
    expect(
      tabs
        .at(1)
        .find('.bar-btn')
        .exists()
    ).to.equal(true)
    expect(
      tabs
        .at(2)
        .find('.foo-btn')
        .exists()
    ).to.equal(true)

    let btns = tabs.at(2).find('.foo-btn')
    expect(btns.exists()).to.equal(true)

    btns.trigger('click')

    await vm.$nextTick()
    expect(tabs.at(2).classes()).to.include('veui-tabs-item-active')
    expect(tabs.at(0).classes()).to.not.include('veui-tabs-item-active')

    wrapper.destroy()
  })

  it("should render Tab's `label` and Tabs' `tab-label` scoped slot correctly", async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs>
            <veui-tab label="#1">
              ONE
              <template #label="tab">
                <em class="foo-label">{{ tab.label }}</em>
              </template>
            </veui-tab>
            <veui-tab label="#2" disabled>TWO</veui-tab>
            <veui-tab label="#3">THREE</veui-tab>
            <template #tab-label="tab">
              <b class="bar-label">{{ tab.label }}</b>
            </template>
          </veui-tabs>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()

    let tabs = wrapper.findAll('.veui-tabs-item')
    expect(
      tabs
        .at(0)
        .find('.foo-label')
        .exists()
    ).to.equal(true)
    expect(
      tabs
        .at(1)
        .find('.bar-label')
        .exists()
    ).to.equal(true)
    expect(
      tabs
        .at(2)
        .find('.bar-label')
        .exists()
    ).to.equal(true)

    wrapper.destroy()
  })

  it('should render `extra` and `panel` slots correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs>
            <veui-tab label="#1"/>
            <veui-tab label="#2"/>
            <veui-tab label="#3">THREE</veui-tab>
            <template #extra>WATCH OUT!</template>
            <template #panel>PANEL CONTENT</template>
          </veui-tabs>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()

    expect(wrapper.find('.veui-tabs-extra').text()).to.equal('WATCH OUT!')
    expect(wrapper.find('.veui-tabs-panel').text()).to.equal('PANEL CONTENT')

    let tabs = wrapper.findAll('.veui-tabs-item')
    tabs
      .at(1)
      .find('button')
      .trigger('click')

    await vm.$nextTick()
    expect(wrapper.find('.veui-tabs-panel').text()).to.equal('PANEL CONTENT')

    tabs
      .at(2)
      .find('button')
      .trigger('click')

    await vm.$nextTick()
    expect(wrapper.find('.veui-tabs-panel').text()).to.equal('THREE')

    wrapper.destroy()
  })

  it("should render Tab's `status` correctly", async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs>
            <veui-tab label="#1" status="error">ONE</veui-tab>
            <veui-tab label="#2">TWO</veui-tab>
            <veui-tab label="#3" status="success">THREE</veui-tab>
          </veui-tabs>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()

    let tabs = wrapper.findAll('.veui-tabs-item')
    expect(
      tabs
        .at(0)
        .find('.veui-tabs-item-status-error')
        .exists()
    ).to.equal(true)
    expect(
      tabs
        .at(2)
        .find('.veui-tabs-item-status-success')
        .exists()
    ).to.equal(true)

    wrapper.destroy()
  })

  it('should handle scroll and resize correctly', async function () {
    this.timeout(3000)

    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs style="width: 220px;">
            <veui-tab label="#1"/>
            <veui-tab label="#2"/>
            <veui-tab label="#3"/>
            <template #tab-item="tab">
              <button
                type="button"
                class="foo-btn"
                :disabled="tab.disabled"
                v-bind="tab.attrs"
                @click="tab.activate"
                style="width: 60px;"
              >
                {{ tab.label }}
              </button>
            </template>
          </veui-tabs>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    await wait(0)
    // need to wait because scroller buttons are rendered in nextTick
    let prev = wrapper.find('.veui-tabs-prev')
    let next = wrapper.find('.veui-tabs-next')
    let list = wrapper.find('.veui-tabs-list').element

    expect(list.scrollLeft).to.equal(0)
    expect(prev.element.disabled).to.equal(true)
    expect(next.element.disabled).to.equal(false)

    next.trigger('click')

    await wait(400)
    expect(list.scrollLeft + list.clientWidth).to.equal(list.scrollWidth)
    expect(prev.element.disabled).to.equal(false)
    expect(next.element.disabled).to.equal(true)

    prev.trigger('click')

    await wait(400)
    expect(list.scrollLeft).to.equal(0)
    expect(prev.element.disabled).to.equal(true)
    expect(next.element.disabled).to.equal(false)

    let btns = wrapper.findAll('.foo-btn')
    btns.at(2).trigger('click')

    await wait(400)
    expect(list.scrollLeft + list.clientWidth).to.equal(list.scrollWidth)
    expect(prev.element.disabled).to.equal(false)
    expect(next.element.disabled).to.equal(true)

    btns.at(0).trigger('click')

    await wait(400)
    expect(list.scrollLeft).to.equal(0)
    expect(prev.element.disabled).to.equal(true)
    expect(next.element.disabled).to.equal(false)

    wrapper.find('.veui-tabs').element.style.width = '300px'

    await wait(400)
    expect(wrapper.find('.veui-tabs-prev').exists()).to.equal(false)
    expect(wrapper.find('.veui-tabs-next').exists()).to.equal(false)

    wrapper.destroy()
  })

  it("should keep Tab's props reactive properly", async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs :active.sync="active">
            <veui-tab
              v-for="tab in tabs"
              :key="tab.name"
              :name="tab.name"
              :label="tab.label"
              removable
            >{{ tab.content }}</veui-tab>
          </veui-tabs>`,
        data () {
          return {
            tabs: [
              { label: '#1', content: '=1=', name: '1' },
              { label: '#2', content: '=2=', name: '2' },
              { label: '#3', content: '=3=', name: '3' },
              { label: '#4', content: '=4=', name: '4' }
            ],
            active: '2'
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()
    let tabs = wrapper.findAll('.veui-tabs-item')
    expect(tabs.at(0).text()).to.equal('#1')

    vm.tabs[0].label = '#1!'
    await vm.$nextTick()
    expect(tabs.at(0).text()).to.equal('#1!')

    wrapper.destroy()
  })

  it('should not emit active changes during destroy', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs
            v-if="show"
            :active.sync="active"
          >
            <veui-tab
              v-for="tab in tabs"
              :key="tab.name"
              :name="tab.name"
              :label="tab.label"
            >{{ tab.content }}</veui-tab>
          </veui-tabs>`,
        data () {
          return {
            show: true,
            tabs: [
              { label: '#1', content: '=1=', name: '1' },
              { label: '#2', content: '=2=', name: '2' },
              { label: '#3', content: '=3=', name: '3' },
              { label: '#4', content: '=4=', name: '4' }
            ],
            active: '2'
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()

    expect(vm.active).to.equal('2')

    vm.show = false

    await vm.$nextTick()

    expect(vm.active).to.equal('2')

    wrapper.destroy()
  })

  it('should update slot from parent correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
          <veui-tabs>
            <veui-tab label="#1">ONE {{ count }}</veui-tab>
          </veui-tabs>`,
        data () {
          return {
            count: 0
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()

    let panel = wrapper.find('.veui-tabs-panel')
    expect(panel.text()).to.equal('ONE 0')

    vm.count++
    await vm.$nextTick()

    expect(panel.text()).to.equal('ONE 1')

    wrapper.destroy()
  })
})
