import Cascader from 'veui/components/Cascader/Cascader'
import { mount } from '@vue/test-utils'
import { wait } from '../../../../utils'

const OPTION = '.veui-cascader-pane-option-wrap'
const MENU = '.veui-cascader-pane-column-wrap'
const SECOND_MENU = `${MENU}:nth-child(2)`
const DISABLED = '.veui-cascader-pane-option-wrap-disabled'

const casOptions = [
  {
    label: '浙江',
    value: '浙江',
    disabled: true,
    options: [
      {
        label: '杭州',
        value: '杭州'
      },
      {
        label: '宁波',
        value: '宁波'
      }
    ]
  },
  {
    label: '江苏',
    value: '江苏',
    options: [
      {
        label: '南京',
        value: '南京',
        disabled: true
      },
      {
        label: '苏州',
        value: '苏州'
      },
      {
        label: '徐州',
        value: '徐州'
      }
    ]
  },
  {
    label: '上海',
    value: '上海'
  },
  {
    label: '北京',
    value: '北京'
  }
]

const hzChildren = [
  {
    label: '菏',
    value: '菏'
  },
  {
    label: '泽',
    value: '泽'
  }
]

const getSdChildren = (full) => [
  {
    label: '菏泽',
    value: '菏泽',
    lazy: true,
    ...(full ? { options: hzChildren } : null)
  },
  {
    label: '潍坊',
    value: '潍坊',
    options: [
      {
        label: '潍',
        value: '潍'
      },
      {
        label: '坊',
        value: '坊'
      }
    ]
  }
]

describe('components/Cascader/Cascader', function () {
  this.timeout(10000)

  it('should render options/inline options correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            value: null,
            options: null,
            expanded: true
          }
        },
        template:
          '<veui-cascader :expanded.sync="expanded" :options="options"/>'
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    let { vm } = wrapper
    let options = wrapper.findAll(OPTION)
    expect(options.length).to.equal(0)

    vm.options = casOptions
    await vm.$nextTick()
    options = wrapper.findAll('.veui-cascader-pane-option-wrap-popout')
    expect(options.length).to.equal(2)
    options = wrapper.findAll(OPTION)
    expect(options.length).to.equal(4)

    options.at(0).find('.veui-button').trigger('click')
    await vm.$nextTick()
    expect(wrapper.findAll(`${SECOND_MENU} ${DISABLED}`).length).to.equal(2)

    vm.options = casOptions.map((i) => ({ ...i, position: 'inline' }))
    await vm.$nextTick()
    options = wrapper.findAll(OPTION)
    expect(options.length).to.equal(9)
    let disableOptions = wrapper.findAll(DISABLED)
    expect(disableOptions.length).to.equal(4)
    wrapper.destroy()
  })

  it('should expand options correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            value: null,
            expanded: '浙江',
            options: casOptions
          }
        },
        template:
          '<veui-cascader v-model="value" :expanded.sync="expanded" :options="options"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let menuPanel = wrapper.findAll(MENU)
    expect(menuPanel.length).to.equal(2)
    const optionsOfsecondMenu = `${SECOND_MENU} ${OPTION}`
    let secOptions = wrapper.findAll(optionsOfsecondMenu)
    expect(secOptions.length).to.equal(2)

    // 点击江苏
    let options = wrapper.findAll(OPTION)
    options.at(1).trigger('click')
    await vm.$nextTick()
    let optionsOfJiangsu = wrapper.findAll(optionsOfsecondMenu)
    expect(optionsOfJiangsu.length).to.equal(3)
    expect(vm.expanded).to.equal('江苏')

    // expand selected after dropdown opening
    vm.expanded = false
    vm.value = '苏州'
    await vm.$nextTick()
    wrapper.find('.veui-trigger').trigger('mouseup')
    await vm.$nextTick()
    expect(vm.expanded).to.equal('江苏')
    wrapper.destroy()
  })

  it('should render inline cascader correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            expanded: true,
            options: casOptions
          }
        },
        template:
          '<veui-cascader inline :expanded="expanded" :options="options"/>'
      },
      {
        sync: false,
        attachToDocument: true // 好像不 attach 会失败
      }
    )
    let { vm } = wrapper
    let pane = wrapper.find('.veui-cascader-pane')
    expect(pane.classes('veui-cascader-pane-inline')).to.equal(true)
    await wait(300)
    let paneWidth = pane.element.clientWidth

    vm.expanded = '江苏'
    await vm.$nextTick()
    let menu = wrapper.find(MENU)
    // inline 一直等分下去
    expect(menu.element.clientWidth * 2).to.equal(paneWidth)
    wrapper.destroy()
  })

  it('should handle single selection correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            value: null,
            options: casOptions,
            expanded: true
          }
        },
        template:
          '<veui-cascader :expanded="expanded" v-model="value" :options="options"/>'
      },
      {
        sync: false
      }
    )
    let { vm } = wrapper
    let options = wrapper.findAll(OPTION)
    // 选择江苏
    options.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.equal('江苏')

    // 选择上海
    options.at(2).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.equal('上海')
    let optionWrappers = wrapper.findAll('.veui-cascader-pane-option-wrap')
    expect(
      optionWrappers.at(2).classes('veui-cascader-pane-option-wrap-selected')
    ).to.equal(true)
    wrapper.destroy()
  })

  it('should handle multiple selections correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            value: null,
            options: casOptions,
            expanded: true
          }
        },
        template:
          '<veui-cascader :expanded.sync="expanded" v-model="value" multiple :options="options"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let { vm } = wrapper
    // 选择江苏
    select(wrapper, 1)
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['苏州', '徐州'])

    select(wrapper, 2)
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['苏州', '徐州', '上海'])
    expect(wrapper.findAll('.veui-tag').length).to.equal(3)
    // 取消选中
    select(wrapper, 1)
    await vm.$nextTick()
    select(wrapper, 2)
    await vm.$nextTick()
    expect(vm.value).to.deep.equal([])
    wrapper.destroy()
  })

  it('should support showSelectAll prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            multiple: true,
            options: casOptions,
            expanded: true
          }
        },
        template:
          '<veui-cascader :multiple="multiple" :expanded.sync="expanded" show-select-all :options="options"/>'
      },
      {
        sync: false
      }
    )
    let { vm } = wrapper
    let labels = wrapper.findAll('.veui-cascader-pane-option-label')
    expect(labels.at(0).text()).to.equal('全选')

    vm.multiple = false
    await vm.$nextTick()
    labels = wrapper.findAll('.veui-cascader-pane-option-label')
    expect(labels.at(0).text()).to.equal('浙江')
    wrapper.destroy()
  })

  it('should support searchable prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            multiple: false,
            expanded: true,
            value: null,
            options: casOptions
          }
        },
        template:
          '<veui-cascader ref="cas" :expanded="expanded" v-model="value" searchable :multiple="multiple" has-select-all :options="options"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let { vm } = wrapper
    search(wrapper, '江苏')
    await vm.$nextTick()
    let options = wrapper.findAll(OPTION)
    expect(options.length).to.equal(4)
    options.at(2).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.equal('苏州')

    vm.value = null
    vm.multiple = true
    search(wrapper, '江苏')
    await vm.$nextTick()
    options = wrapper.findAll(OPTION)
    expect(options.length).to.equal(4)
    select(wrapper, 0)
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['苏州', '徐州'])
    expect(wrapper.findAll('.veui-tag').length).to.equal(2)

    // 关闭下拉（body.click()会关闭但是不会 afterclose，那就手动触发下来测），清除搜索词
    vm.$refs.cas.$refs.overlay.$emit('afterclose')
    expect(vm.$refs.cas.keyword).to.equal('')
    wrapper.destroy()
  })

  it('should support selectMode prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            value: null,
            selectMode: 'any',
            expanded: true,
            options: casOptions
          }
        },
        template:
          '<veui-cascader v-model="value" :expanded.sync="expanded" :select-mode="selectMode" :options="options"/>'
      },
      {
        sync: false
      }
    )
    let { vm } = wrapper
    let options = wrapper.findAll(OPTION)
    // 直接单选江苏
    options.at(1).trigger('click')
    await vm.$nextTick()
    // 打开且选中
    expect(vm.expanded, 'open1').to.equal('江苏')
    expect(vm.value).to.equal('江苏')

    const optionsOfsecondMenu = `${SECOND_MENU} ${OPTION}`
    let secOptions = wrapper.findAll(optionsOfsecondMenu)
    // 选中徐州，是叶子节点，要关闭
    secOptions.at(2).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded, '叶子节点要关闭').to.equal(false)
    expect(vm.value).to.equal('徐州')

    vm.value = null
    vm.selectMode = 'leaf-only'
    vm.expanded = true
    await vm.$nextTick()
    options = wrapper.findAll(OPTION) // dom 重新渲染了，重新获取下
    options.at(1).trigger('click')
    await vm.$nextTick()
    // 只能打开
    expect(vm.expanded, 'open2').to.equal('江苏')
    expect(vm.value).to.equal(null)

    secOptions = wrapper.findAll(optionsOfsecondMenu)
    // 选中徐州，是 only-select-leaves，要关闭
    secOptions.at(2).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded).to.equal(false)
    expect(vm.value).to.equal('徐州')
    wrapper.destroy()
  })

  it('should support hover columnTrigger prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            columnTrigger: 'hover',
            expanded: true,
            options: casOptions
          }
        },
        template:
          '<veui-cascader :expanded.sync="expanded" :column-trigger="columnTrigger" :options="options"/>'
      },
      {
        sync: false
      }
    )
    let { vm } = wrapper
    let options = wrapper.findAll(OPTION)
    options.at(0).trigger('mouseenter')
    await vm.$nextTick()
    expect(vm.expanded).to.equal('浙江')

    // 离开 dropdown 将展开项恢复到 true，下拉展开但是没有展开项
    wrapper.find('.veui-cascader-pane-wrap').trigger('mouseleave')
    await vm.$nextTick()
    expect(vm.expanded).to.equal(true)

    options.at(1).trigger('mouseenter')
    await vm.$nextTick()
    expect(vm.expanded).to.equal('江苏')

    options.at(2).trigger('mouseenter')
    // 移入到不可展开的延时切换到展开上级，所以等一下
    await wait(250)
    expect(vm.expanded).to.equal(true)
    wrapper.destroy()
  })

  it('should handle expand/select priority correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            multiple: false,
            expanded: true,
            value: null,
            options: casOptions
          }
        },
        template:
          '<veui-cascader v-model="value" :expanded.sync="expanded" :multiple="multiple" :options="options"/>'
      },
      {
        sync: false
      }
    )
    let { vm } = wrapper
    let options = wrapper.findAll(OPTION)
    // 单选点击组，即选中又展开
    options.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded).to.equal('江苏')
    expect(vm.value).to.equal('江苏')

    // 单选点击叶子，即选中且不影响展开
    let subOptions = wrapper.findAll(`${SECOND_MENU} ${OPTION}`)
    subOptions.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded, '选中叶子要关闭').to.equal(false)
    expect(vm.value).to.equal('苏州')

    vm.multiple = true
    vm.expanded = true
    vm.value = null
    await vm.$nextTick()
    options = wrapper.findAll(OPTION) // refresh?
    // 多选点击组，即仅仅展开
    options.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded).to.equal('江苏')
    expect(vm.value).to.equal(null)

    subOptions = wrapper.findAll(`${SECOND_MENU} ${OPTION}`)
    subOptions.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded).to.equal('江苏')
    expect(vm.value).to.deep.equal(['苏州'])
    wrapper.destroy()
  })

  it('should handle remove/clear items correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            value: ['苏州', '徐州'],
            options: casOptions
          }
        },
        template:
          '<veui-cascader v-model="value" clearable multiple :options="options"/>'
      },
      {
        sync: false
      }
    )
    let { vm } = wrapper
    // remove
    wrapper.find('.veui-tag .veui-button').trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['徐州'])
    wrapper.find('.veui-tag .veui-button').trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.deep.equal([])

    // 先有值再 clear
    vm.value = '苏州'
    await vm.$nextTick()
    wrapper.find('.veui-trigger-clear').trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.deep.equal([])
    wrapper.destroy()
  })

  it('should handle keyboard navigation correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            value: '苏州',
            expanded: null,
            multiple: false,
            options: casOptions
          }
        },
        template:
          '<veui-cascader v-model="value" :expanded.sync="expanded" searchable clearable :multiple="multiple" :options="options"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    // TODO
    let { vm } = wrapper
    let trigger = wrapper.find('.veui-trigger')
    trigger.trigger('keydown', { key: 'Down' })
    await vm.$nextTick()
    expect(vm.expanded).to.equal('江苏')

    vm.expanded = false
    vm.value = null
    await vm.$nextTick()
    trigger.trigger('keydown', { key: 'Down' })
    await vm.$nextTick()
    trigger.trigger('keydown', { key: 'Up' })
    await vm.$nextTick()
    trigger.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    expect(vm.value).to.equal('北京')

    trigger.trigger('keydown', { key: 'Esc' })
    await vm.$nextTick()
    expect(vm.expanded).to.equal(false)

    vm.multiple = true
    vm.value = ['苏州', '徐州']
    await vm.$nextTick()
    trigger.trigger('keydown', { key: 'Backspace' })
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['苏州'])
    trigger.trigger('keydown', { key: 'Backspace' })
    await vm.$nextTick()
    expect(vm.value).to.deep.equal([])
    wrapper.destroy()
  })

  it('should respect the order of selecting options', async () => {
    let wrapper = mount({
      components: {
        'veui-cascader': Cascader
      },
      data () {
        return {
          value: ['上海', '徐州'],
          options: casOptions.map((i) => ({ ...i, position: 'inline' }))
        }
      },
      template:
        '<veui-cascader :expanded="true" v-model="value" multiple :options="options"/>'
    })
    let { vm } = wrapper
    select(wrapper, 5)
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['上海', '徐州', '苏州'])
    wrapper.destroy()
  })

  it('should handle disabled parents correctly.', async () => {
    let wrapper = mount({
      components: {
        'veui-cascader': Cascader
      },
      data () {
        return {
          value: null,
          expanded: true,
          options: casOptions
        }
      },
      template:
        '<veui-cascader :expanded.sync="expanded" v-model="value" :options="options"/>'
    })

    let { vm } = wrapper
    await vm.$nextTick()
    let expandBtn = wrapper.find('.veui-cascader-pane-expandable')
    expandBtn.trigger('click')
    await vm.$nextTick()
    expect(vm.expanded).to.equal('浙江')
    let hangzhou = wrapper.find(
      '.veui-cascader-pane-column-wrap + .veui-cascader-pane-column-wrap .veui-cascader-pane-option'
    )
    hangzhou.trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.equal(null)
    wrapper.destroy()
  })

  it('should handle loadData prop correctly.', async () => {
    let resolveFn
    let wrapper = mount({
      components: {
        'veui-cascader': Cascader
      },
      data () {
        return {
          value: null,
          expanded: true,
          options: [
            {
              label: '山东',
              value: '山东',
              lazy: true
            }
          ],
          loadData (option, trigger) {
            return new Promise((resolve) => {
              resolveFn = () =>
                resolve(
                  {
                    菏泽: hzChildren,
                    山东: getSdChildren(trigger === 'select')
                  }[option.value]
                )
            })
          }
        }
      },
      template:
        '<veui-cascader :expanded.sync="expanded" :load-data="loadData" :options="options"/>'
    })

    let { vm } = wrapper
    await vm.$nextTick()
    let expandable = wrapper.findAll('.veui-cascader-pane-expandable')
    expect(expandable.length).to.equal(1)
    expandable.at(0).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded).to.equal(true)
    expect(wrapper.findAll('.veui-loading').length).to.equal(1)
    resolveFn()
    resolveFn = null
    await wait(0)
    expect(vm.expanded).to.equal('山东')
    expect(wrapper.findAll('.veui-loading').length).to.equal(0)

    // 干扰下lazy
    expandable = wrapper.findAll('.veui-cascader-pane-expandable')
    // 展开菏泽
    expandable.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded).to.equal('山东')
    expect(wrapper.findAll('.veui-loading').length).to.equal(1)
    // 展开潍坊
    expandable.at(2).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded).to.equal('潍坊')
    // 菏泽仍然加载中
    expect(wrapper.findAll('.veui-loading').length).to.equal(1)
    resolveFn()
    await wait(0)
    // 不会修改 expanded
    expect(vm.expanded).to.equal('潍坊')
    expect(wrapper.findAll('.veui-loading').length).to.equal(0)

    // 菏泽加载过了，可以直接expand
    expandable.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded).to.equal('菏泽')
    expect(wrapper.findAll('.veui-loading').length).to.equal(0)
    wrapper.destroy()
  })
})

function select (wrapper, index) {
  wrapper
    .findAll('.veui-checkbox')
    .at(index)
    .find('input[type="checkbox"]')
    .trigger('change')
}

function search (wrapper, val) {
  let input = wrapper.find('.veui-input-input')
  input.element.value = val
  input.trigger('input')
}
