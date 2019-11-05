import { mount } from '@vue/test-utils'
import Radio from '@/components/Radio'

describe('components/Radio', () => {
  it('should handle value prop with `null` value.', done => {
    let wrapper = mount(Radio, {
      propsData: {
        value: null
      }
    })

    wrapper.vm.$on('input', val => {
      expect(val).to.equal(null)

      wrapper.destroy()
      done()
    })

    wrapper.find('input').element.checked = true
    wrapper.find('input').trigger('change')
  })

  it('should update checked/model value before change event is fired.', done => {
    let wrapper = mount({
      components: {
        'veui-radio': Radio
      },
      data () {
        return {
          checked: false
        }
      },
      methods: {
        handleChange (checked) {
          expect(checked).to.equal(true)
          expect(this.checked).to.equal(true)

          wrapper.destroy()
          done()
        }
      },
      template: '<veui-radio v-model="checked" @change="handleChange"/>'
    })

    wrapper.find('input').element.checked = true
    wrapper.find('input').trigger('change')
  })

  it('should support v-model binding to multiple radios', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-radio': Radio
        },
        data () {
          return {
            group: 'A'
          }
        },
        template: `<div>
            <veui-radio v-model="group" value="A"> A </veui-radio>
            <veui-radio v-model="group" value="B"> B </veui-radio>
            <veui-radio v-model="group" value="C"> C </veui-radio>
          </div>`
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    await vm.$nextTick()

    let boxes = wrapper.findAll('input')
    expect(boxes.at(0).element.checked).to.equal(true)
    expect(boxes.at(2).element.checked).to.equal(false)

    boxes.at(0).element.checked = false
    boxes.at(1).element.checked = true
    boxes.at(1).trigger('change')

    await vm.$nextTick()
    boxes.at(1).element.checked = false
    boxes.at(2).element.checked = true
    boxes.at(2).trigger('change')

    await vm.$nextTick()
    expect(vm.group).to.equal('C')

    vm.group = 'B'

    await vm.$nextTick()
    expect(boxes.at(0).element.checked).to.equal(false)
    expect(boxes.at(1).element.checked).to.equal(true)
    expect(boxes.at(2).element.checked).to.equal(false)

    wrapper.destroy()
  })
})
