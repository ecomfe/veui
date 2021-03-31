import Cascader from 'veui/components/Cascader/Cascader'
import { mount } from '@vue/test-utils'
import { wait } from '../../../../utils'

const OPTION = '.veui-cascader-pane-option'
const MENU = '.veui-cascader-pane-menu'

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

describe('components/Cascader/Cascader', () => {
  it('should render options/inline options correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            value: null,
            options: null
          }
        },
        template: '<veui-cascader :options="options"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let options = wrapper.findAll(OPTION)
    expect(options.length).to.equal(0)

    vm.options = casOptions
    await vm.$nextTick()
    options = wrapper.findAll(OPTION)
    expect(options.length).to.equal(4)

    vm.options = casOptions.map(i => ({ ...i, position: 'inline' }))
    await vm.$nextTick()
    options = wrapper.findAll(OPTION)
    expect(options.length).to.equal(9)
    let disableOptions = wrapper.findAll(
      '.veui-cascader-pane-option-wrap-disabled'
    )
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
          '<veui-cascader :expanded.sync="expanded" :options="options"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let menuPanel = wrapper.findAll(MENU)
    expect(menuPanel.length).to.equal(2)
    const optionsOfsecondMenu = `${MENU}:nth-child(2) ${OPTION}`
    let secOptions = wrapper.findAll(optionsOfsecondMenu)
    expect(secOptions.length).to.equal(2)

    // 点击江苏
    let options = wrapper.findAll(OPTION)
    options.at(1).trigger('click')
    await vm.$nextTick()
    let optionsOfJiangsu = wrapper.findAll(optionsOfsecondMenu)
    expect(optionsOfJiangsu.length).to.equal(3)
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
    console.log(pane.element.getBoundingClientRect().width)

    vm.expanded = '江苏'
    await vm.$nextTick()
    let menu = wrapper.find('.veui-cascader-pane-menu')
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
            options: casOptions
          }
        },
        template: '<veui-cascader v-model="value" :options="options"/>'
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
            options: casOptions
          }
        },
        template: '<veui-cascader v-model="value" multiple :options="options"/>'
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

  it('should support hasSelectAll prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            multiple: true,
            options: casOptions
          }
        },
        template:
          '<veui-cascader :multiple="multiple" has-select-all :options="options"/>'
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
            value: null,
            options: casOptions
          }
        },
        template:
          '<veui-cascader v-model="value" searchable :multiple="multiple" has-select-all :options="options"/>'
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
    wrapper.destroy()
  })

  it('should support selectLeaves prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            value: null,
            selectLeaves: false,
            expanded: null,
            options: casOptions
          }
        },
        template:
          '<veui-cascader v-model="value" :expanded.sync="expanded" :select-leaves="selectLeaves" :options="options"/>'
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
    expect(vm.expanded).to.equal('江苏')
    expect(vm.value).to.equal('江苏')

    const optionsOfsecondMenu = `${MENU}:nth-child(2) ${OPTION}`
    let secOptions = wrapper.findAll(optionsOfsecondMenu)
    // 选中徐州，不是 only-select-leaves，不要关闭
    secOptions.at(2).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded).to.equal('江苏')
    expect(vm.value).to.equal('徐州')

    vm.value = null
    vm.selectLeaves = true
    vm.expanded = null
    await vm.$nextTick()
    options.at(1).trigger('click')
    await vm.$nextTick()
    // 只能打开
    expect(vm.expanded).to.equal('江苏')
    expect(vm.value).to.equal(null)

    secOptions = wrapper.findAll(optionsOfsecondMenu)
    // 选中徐州，是 only-select-leaves，要关闭
    secOptions.at(2).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded).to.equal(false)
    expect(vm.value).to.equal('徐州')
    wrapper.destroy()
  })

  it('should handle backfillOnExpand correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            expanded: null,
            value: null,
            options: casOptions
          }
        },
        template: `<veui-cascader
            ref="cas"
            v-model="value"
            :expanded.sync="expanded"
            expand-trigger="click"
            backfill-on-expand
            verbose-backfill
            :options="options"
          />`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let { vm } = wrapper
    let buttons = wrapper.findAll('.veui-button')
    // 展开江苏
    buttons.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded).to.equal('江苏')
    expect(vm.value).to.equal(null)
    expect(vm.$refs.cas.$refs.trigger.selected.label).to.equal('江苏')
    document.body.click()
    await vm.$nextTick()
    expect(vm.expanded).to.equal(false)
    expect(vm.$refs.cas.$refs.trigger.selected == null).to.equal(true)
    // 选中上海再打开江苏，input切换到江苏，失焦点之后恢复到上海
    vm.expanded = true
    wrapper
      .findAll(OPTION)
      .at(2)
      .trigger('click')
    await vm.$nextTick()
    expect(vm.$refs.cas.$refs.trigger.selected.label).to.equal('上海')
    buttons.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded).to.equal('江苏')
    expect(vm.$refs.cas.$refs.trigger.selected.label).to.equal('江苏')
    document.body.click()
    await vm.$nextTick()
    expect(vm.expanded).to.equal(false)
    expect(vm.$refs.cas.$refs.trigger.selected.label).to.equal('上海')
    wrapper.destroy()
  })

  it('should support hover expandTrigger prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-cascader': Cascader
        },
        data () {
          return {
            expandTrigger: 'hover',
            expanded: null,
            options: casOptions
          }
        },
        template:
          '<veui-cascader :expanded.sync="expanded" :expand-trigger="expandTrigger" :options="options"/>'
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
    let subOptions = wrapper.findAll(`${MENU}:nth-child(2) ${OPTION}`)
    subOptions.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded).to.equal('江苏')
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

    subOptions = wrapper.findAll(`${MENU}:nth-child(2) ${OPTION}`)
    subOptions.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.expanded).to.equal('江苏')
    expect(vm.value).to.deep.equal(['苏州'])
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
