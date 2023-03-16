import { mount } from '@vue/test-utils'
import Button from '@/components/Button'
import Empty from '@/components/Empty'

describe('components/Empty', function () {
  this.timeout(10000)

  it('should render correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-empty': Empty,
          'veui-button': Button
        },
        data () {
          return {
            hasTitle: false,
            hasDesc: false,
            hasImage: false,
            hasActions: false,
            desc: undefined,
            image: undefined
          }
        },
        template: `
          <veui-empty :desc="desc" :image="image">
            <template v-if="hasTitle" slot="title">title</template>
            <template v-if="hasDesc" #desc>desc</template>
            <template v-if="hasImage" #default><img></template>
            <template v-if="hasActions" #actions>
              <veui-button ui="primary">确定</veui-button>
            </template>
          </veui-empty>
        `
      },
      {
        sync: false
      }
    )
    const { vm } = wrapper
    expect(wrapper.find('.veui-empty-title').exists()).to.equal(false)
    expect(wrapper.find('.veui-empty-desc').exists()).to.equal(true)
    expect(wrapper.find('.veui-empty-image').exists()).to.equal(true)
    expect(wrapper.find('.veui-empty-actions').exists()).to.equal(false)

    vm.desc = false
    vm.image = false
    await vm.$nextTick()
    expect(wrapper.find('.veui-empty-title').exists()).to.equal(false)
    expect(wrapper.find('.veui-empty-desc').exists()).to.equal(false)
    expect(wrapper.find('.veui-empty-image').exists()).to.equal(false)
    expect(wrapper.find('.veui-empty-actions').exists()).to.equal(false)

    vm.hasTitle = true
    vm.hasDesc = true
    vm.hasImage = true
    vm.hasActions = true
    await vm.$nextTick()
    expect(wrapper.find('.veui-empty-title').exists()).to.equal(true)
    expect(wrapper.find('.veui-empty-desc').exists()).to.equal(true)
    expect(wrapper.find('.veui-empty-image').exists()).to.equal(true)
    expect(wrapper.find('.veui-empty-actions').exists()).to.equal(true)

    wrapper.destroy()
  })
})
