import { mount } from '@vue/test-utils'
import Form from '@/components/Form'
import Field from '@/components/Field'
import Checkbox from '@/components/Checkbox'

describe('components/Label', () => {
  it('should activate component which ui type is input when label is clicked in form field', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-form': Form,
          'veui-field': Field,
          'veui-checkbox': Checkbox
        },
        data () {
          return {
            formData: {
              protocol: ''
            }
          }
        },
        template: `
          <veui-form>
            <veui-field field="protocol" name="protocol" label="协议：">
              <veui-checkbox v-model="formData.protocol" false-value="">
                我已阅读并同意协议
              </veui-checkbox>
            </veui-field>
          </veui-form>
        `
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    wrapper.find('label.veui-label').trigger('click')
    await vm.$nextTick()

    expect(vm.formData.protocol).to.equal(true)

    wrapper.destroy()
  })
})
