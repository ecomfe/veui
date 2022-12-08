import { mount } from '@vue/test-utils'
import Tabs from '@/components/Tabs'
import Tab from '@/components/Tab'
import { findIndex } from 'lodash'
import config from '@/managers/config'
import tooltipManager from '@/managers/tooltip'
import {
  expectTooltip,
  expectDisabled,
  wait,
  performDrag
} from '../../../utils'

describe('components/Tabs', function () {
  this.timeout(10000)

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

    tabs.at(2).find('button').trigger('click')

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

    tabs.at(0).find('button').trigger('click')

    await vm.$nextTick()

    expect(tabs.at(1).classes()).to.include('veui-tabs-item-active')
    expect(tabs.at(0).classes()).to.not.include('veui-tabs-item-active')

    panel = wrapper.find('.veui-tabs-panel')
    expect(panel.text()).to.equal('TWO')

    tabs.at(2).find('button').trigger('click')

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

    tabs.at(0).find('button').trigger('click')

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

    tabs.at(2).find('button').trigger('click')

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
              findIndex(this.tabs, (tab) => tab.name === name),
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
    expect(vm.active).to.eql(vm.tabs[0].name)

    btns.at(2).trigger('click')
    await vm.$nextTick()
    tabs = wrapper.findAll('.veui-tabs-item')
    expect(tabs.at(0).classes()).to.include('veui-tabs-item-active')
    expect(vm.active).to.eql(vm.tabs[0].name)
    expect(tabs.at(2).text()).to.equal('#5')

    vm.active = '5'
    await vm.$nextTick()
    tabs = wrapper.findAll('.veui-tabs-item')
    btns = wrapper.findAll('.veui-tabs-item-remove')
    expect(tabs.at(2).classes()).to.include('veui-tabs-item-active')
    expect(vm.active).to.eql(vm.tabs[2].name)

    btns.at(2).trigger('click')
    await vm.$nextTick()
    tabs = wrapper.findAll('.veui-tabs-item')
    expect(tabs.at(1).classes()).to.include('veui-tabs-item-active')
    expect(vm.active).to.eql(vm.tabs[1].name)

    // 删完
    btns = wrapper.findAll('.veui-tabs-item-remove')
    btns.at(0).trigger('click')
    await vm.$nextTick()
    btns = wrapper.findAll('.veui-tabs-item-remove')
    btns.at(0).trigger('click')
    await vm.$nextTick()
    expect(vm.active).to.eql(null)

    let add = wrapper.find('.veui-tabs-add')
    add.trigger('click')
    await vm.$nextTick()
    tabs = wrapper.findAll('.veui-tabs-item')
    expect(tabs.at(0).text()).to.equal('#6')

    add = wrapper.find('.veui-tabs-add')
    add.trigger('click')
    await vm.$nextTick()
    tabs = wrapper.findAll('.veui-tabs-item')
    expect(tabs.at(1).text()).to.equal('#7')

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

    expectDisabled(add, false)
    add.trigger('click')

    await vm.$nextTick()
    expectDisabled(add)

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
    expect(tabs.at(0).find('.foo-label').exists()).to.equal(false)
    expect(tabs.at(1).find('.bar-btn').exists()).to.equal(true)
    expect(tabs.at(2).find('.foo-btn').exists()).to.equal(true)

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
                <em class="foo-label">{{ tab.label }} / {{ tab.active }}</em>
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
    expect(tabs.at(0).find('.foo-label').exists()).to.equal(true)
    expect(tabs.at(0).find('.foo-label').text()).to.equal('#1 / true')
    expect(tabs.at(1).find('.bar-label').exists()).to.equal(true)
    expect(tabs.at(2).find('.bar-label').exists()).to.equal(true)

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
    tabs.at(1).find('button').trigger('click')

    await vm.$nextTick()
    expect(wrapper.find('.veui-tabs-panel').text()).to.equal('PANEL CONTENT')

    tabs.at(2).find('button').trigger('click')

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
    expect(tabs.at(0).find('.veui-tabs-item-status-error').exists()).to.equal(
      true
    )
    expect(tabs.at(2).find('.veui-tabs-item-status-success').exists()).to.equal(
      true
    )

    wrapper.destroy()
  })

  it('should handle scroll and resize correctly', async () => {
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
            <template #tab-label="tab">
              <button
                type="button"
                class="foo-btn"

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
    expectDisabled(prev)
    expectDisabled(next, false)

    next.trigger('click')

    await wait(400)
    let btns = wrapper.findAll('.foo-btn')
    expect(
      btns.at(1).element.getBoundingClientRect().left,
      '左侧对齐'
    ).to.equal(list.getBoundingClientRect().left)
    expectDisabled(prev, false)
    expectDisabled(next, false)

    const expectScrollLeft = list.scrollLeft + 60 - list.clientWidth
    prev.trigger('click')
    await wait(400)
    expect(list.scrollLeft, '左侧滚动clientWidth').to.equal(expectScrollLeft)
    expectDisabled(prev, expectScrollLeft === 0)
    expectDisabled(next, false)

    btns.at(2).trigger('click')
    await wait(400)

    const btn2 = wrapper.findAll('.veui-tabs-item').at(2).element
    expect(btn2.offsetLeft + btn2.clientWidth, '右侧对齐').to.equal(
      list.scrollLeft + list.clientWidth
    )
    expectDisabled(prev, false)
    expectDisabled(
      next,
      list.scrollLeft + list.clientWidth === list.scrollWidth
    )

    btns.at(0).trigger('click')
    await wait(400)
    expect(list.scrollLeft).to.equal(0)
    expectDisabled(prev)
    expectDisabled(next, false)

    wrapper.find('.veui-tabs').element.style.width = '400px'
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

  it('should render correctly on adjusting the order of tabs', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
        <veui-tabs>
          <template v-if="!reorder">
            <veui-tab
              key="answers"
              label="回答问题"
              name="answers"
            />
            <veui-tab
              key="articles"
              label="文章评论"
              name="articles"
            />
          </template>
          <template v-else>
            <veui-tab
              key="articles"
              label="文章评论"
              name="articles"
            />
            <veui-tab
              key="answers"
              label="回答问题"
              name="answers"
            />
          </template>
          <veui-tab
            label="分享朋友圈"
            name="shares"
          />
        </veui-tabs>`,
        data () {
          return {
            reorder: false
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    await wait(0)

    let tabs = wrapper.findAll('.veui-tabs-item-label-content')
    expect(tabs.at(0).text()).to.equal('回答问题')
    expect(tabs.at(1).text()).to.equal('文章评论')
    expect(tabs.at(2).text()).to.equal('分享朋友圈')

    vm.reorder = true
    await wait(0)

    tabs = wrapper.findAll('.veui-tabs-item-label-content')
    expect(tabs.at(0).text()).to.equal('文章评论')
    expect(tabs.at(1).text()).to.equal('回答问题')
    expect(tabs.at(2).text()).to.equal('分享朋友圈')

    wrapper.destroy()
  })

  it('should render correctly on swicthing tab dynamically', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        template: `
        <veui-tabs :active.sync="active">
          <veui-tab
            v-if="!switched || active === 'answers'"
            key="answers"
            label="回答问题"
            name="answers"
          />
          <veui-tab
            v-if="!switched || active === 'articles'"
            key="articles"
            label="文章评论"
            name="articles"
          />
          <veui-tab
            v-if="!switched || active === 'shares'"
            key="shares"
            label="分享朋友圈"
            name="shares"
          />
          <veui-tab
            v-if="switched"
            label="rest"
            name="shares"
          />
        </veui-tabs>`,
        data () {
          return {
            switched: false,
            active: 'answers'
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    await wait(0)

    let tabs = wrapper.findAll('.veui-tabs-item-label-content')
    expect(tabs.at(0).text()).to.equal('回答问题')
    expect(tabs.at(1).text()).to.equal('文章评论')
    expect(tabs.at(2).text()).to.equal('分享朋友圈')

    vm.active = 'articles'
    vm.switched = true
    await wait(0)
    tabs = wrapper.findAll('.veui-tabs-item-label-content')
    expect(tabs.at(0).text()).to.equal('文章评论')
    expect(tabs.at(1).text(), '#1').to.equal('rest')

    vm.switched = false
    await wait(0)

    vm.active = 'shares'
    vm.switched = true
    await wait(0)
    tabs = wrapper.findAll('.veui-tabs-item-label-content')
    expect(tabs.at(0).text()).to.equal('分享朋友圈')
    expect(tabs.at(1).text()).to.equal('rest')
    wrapper.destroy()
  })

  it('should handle wheel scroll correctly', async () => {
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

    let list = wrapper.find('.veui-tabs-list')

    // 先让 activeTab 滚动完成再开始测试
    await wait(200)
    list.element.scrollLeft = 0

    wheel(list, 10, -20)
    await wait(0)
    expect(list.element.scrollLeft).to.equal(0)

    wheel(list, 10, 20)
    await wait(0)
    expect(list.element.scrollLeft).to.equal(20)

    wheel(list, 30, 10)
    await wait(0)
    expect(list.element.scrollLeft).to.equal(50)

    await wait(400)
    list.element.scrollLeft = 2000

    const maxScrollLeft = list.element.scrollLeft

    wheel(list, 20, -10)
    expect(list.element.scrollLeft).to.equal(maxScrollLeft)

    wheel(list, -20, 10)
    await wait(0)
    expect(list.element.scrollLeft).to.equal(maxScrollLeft - 20)

    await wait(400)
    wrapper.destroy()
  })

  it('should support tooltip prop on Tab', async () => {
    const loremIpsum =
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed dolores culpa ipsa alias pariatur cumque libero in earum vel vitae officia ullam, eum consequuntur perferendis! Optio maxime error qui veritatis!'

    const wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs,
          'veui-tab': Tab
        },
        data () {
          return {
            loremIpsum
          }
        },
        template: `
          <veui-tabs>
            <veui-tab tooltip :label="loremIpsum"/>
            <veui-tab :tooltip="({ label }) => label + '~'" :label="loremIpsum"/>
            <veui-tab label="foo"/>
          </veui-tabs>
        `
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    await wait(0)

    let [long1, long2, short] = wrapper.findAll(
      '.veui-tabs-item-label-ellipsis'
    ).wrappers

    long1.trigger('mouseenter')
    let warmup = config.get('tooltip.warmup')

    await wait(warmup + 100)
    expectTooltip(loremIpsum)

    long1.trigger('mouseleave')
    long2.trigger('mouseenter')
    await wait(100)
    expectTooltip(loremIpsum + '~')

    long2.trigger('mouseleave')
    short.trigger('mouseenter')
    await wait(warmup + 100)
    expectTooltip(null)

    tooltipManager.destroy()
    wrapper.destroy()
  })

  it('should support items prop on Tabs', async () => {
    const wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs
        },
        data () {
          return {
            items: [
              { label: '默认1', name: '默认1', removable: true },
              {
                label: '默认2',
                name: '默认2',
                status: 'success',
                removable: true
              },
              { label: '默认3', name: '默认3', removable: true }
            ]
          }
        },
        template: `
          <veui-tabs :items="items">
            <template
              #panel="{ activeTab }"
            ><p>{{ activeTab.label }}</p></template>
          </veui-tabs>
        `
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    await wait(0)
    let tabs = wrapper.findAll('.veui-tabs-item')
    expect(tabs.at(0).text()).to.equal('默认1')
    expect(tabs.at(1).text()).to.equal('默认2')
    expect(tabs.at(2).text()).to.equal('默认3')
    expect(tabs.at(0).classes()).to.include('veui-tabs-item-active')

    let panel = wrapper.find('.veui-tabs-panel')
    expect(panel.text()).to.equal('默认1')

    tabs.at(2).find('button').trigger('click')

    await wrapper.vm.$nextTick()

    expect(tabs.at(0).classes()).to.not.include('veui-tabs-item-active')
    expect(tabs.at(2).classes()).to.include('veui-tabs-item-active')

    panel = wrapper.find('.veui-tabs-panel')
    expect(panel.text()).to.equal('默认3')

    expect(wrapper.find('.veui-tabs-item-status-success').exists()).to.equal(
      true
    )
    wrapper.destroy()
  })

  it('should support sortable prop on Tabs', async () => {
    const wrapper = mount(
      {
        components: {
          'veui-tabs': Tabs
        },
        data () {
          return {
            items: [
              { label: '默认1', name: '默认1' },
              { label: '默认2', name: '默认2' },
              { label: '默认3', name: '默认3' }
            ]
          }
        },
        methods: {
          handleSort (fromIndex, toIndex) {
            const item = this.items[fromIndex]
            this.items.splice(fromIndex, 1)
            this.items.splice(toIndex, 0, item)
          }
        },
        template: `
          <veui-tabs :items="items" @sort="handleSort" sortable style="position:fixed;left:100px;top:100px;width:300px">
            <template #tab-item="{ label }"><span style="width:60px;display:inline-block;">{{label}}</span></template>
            <template
              #panel="{ activeTab }"
            ><p>{{ activeTab.label }}</p></template>
          </veui-tabs>
        `
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    await wait(0)
    let third = wrapper.find('.veui-tabs-item:nth-child(3)')
    await performDrag(
      third,
      [
        [300, 125],
        [270, 125],
        [240, 125],
        [220, 125],
        [200, 125]
      ],
      third
    )
    await wait(0)
    expect(wrapper.vm.items.map(({ name }) => name)).to.deep.equal([
      '默认1',
      '默认3',
      '默认2'
    ])
    wrapper.destroy()
  })
})

function wheel (wrapper, x, y) {
  wrapper.trigger('wheel', {
    deltaX: x,
    deltaY: y
  })
}
