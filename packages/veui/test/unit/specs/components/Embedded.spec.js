import { mount } from '@vue/test-utils'
import Embedded from '@/components/Embedded'

let componentOptions = {
  components: {
    'veui-embedded': Embedded
  },
  data () {
    return {
      open: true
    }
  }
}
const debugInBrowser = {
  attachToDocument: true,
  sync: false
}

describe('components/Embedded', () => {
  it('should render slot correctly.', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: `
          <veui-embedded :open="open">Content
            <template slot="title" slot-scoped="{close}">Title</template>
            <template slot="foot">Foot</template>
          </veui-embedded>`
      },
      debugInBrowser
    )
    let { vm } = wrapper
    await vm.$nextTick()

    expect(
      wrapper
        .find('.veui-dialog-content-head-title')
        .text()
        .includes('Title')
    ).to.equal(true)
    expect(
      wrapper
        .find('.veui-dialog-content-body')
        .text()
        .includes('Content')
    ).to.equal(true)
    expect(
      wrapper
        .find('.veui-dialog-content-foot')
        .text()
        .includes('Foot')
    ).to.equal(true)
    wrapper.destroy()
  })
})
