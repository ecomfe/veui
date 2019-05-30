import { mount } from '@vue/test-utils'
import Label from '@/components/Label'
import Form from '@/components/Form'
import Field from '@/components/Field'
import Checkbox from '@/components/Checkbox'

describe('components/Label', () => {
  it('should focused input when click label', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-form': Form,
          'veui-field': Field,
          'veui-label': Label,
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

    expect(vm.formData.protocol).to.be.equal(true)

    wrapper.destroy()
  })
})
