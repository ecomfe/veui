import { mount } from '@vue/test-utils'
import Checkbox from '@/components/Checkbox'

describe('components/Checkbox', () => {
  it('should handle checked prop with `null` value.', done => {
    let wrapper = mount(
      Checkbox,
      {
        propsData: {
          checked: null
        }
      },
      {
        sync: false
      }
    )

    wrapper.vm.$on('change', val => {
      expect(val).to.equal(true)

      wrapper.destroy()
      done()
    })

    wrapper.find('input').trigger('change')
  })

  it('should update checked/model value before change event is fired.', done => {
    let wrapper = mount(
      {
        components: {
          'veui-checkbox': Checkbox
        },
        data () {
          return {
            choice: 'YES'
          }
        },
        methods: {
          handleChange (checked) {
            expect(checked).to.equal(false)
            expect(this.choice).to.equal('NO')

            wrapper.destroy()
            done()
          }
        },
        template:
          '<veui-checkbox v-model="choice" true-value="YES" false-value="NO" @change="handleChange"/>'
      },
      {
        sync: false
      }
    )

    wrapper.find('input').trigger('change')
  })

  it('should support v-model array', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-checkbox': Checkbox
        },
        data () {
          return {
            group: ['A']
          }
        },
        template: `<div>
            <veui-checkbox v-model="group" value="A"> A </veui-checkbox>
            <veui-checkbox v-model="group" value="B"> B </veui-checkbox>
            <veui-checkbox v-model="group" value="C"> C </veui-checkbox>
          </div>`
      },
      {
        sync: false
      }
    )

    let boxes = wrapper.findAll('input')
    boxes.at(0).trigger('change')
    boxes.at(2).trigger('change')

    let { vm } = wrapper
    await vm.$nextTick()

    expect(vm.group).to.deep.equal(['A', 'C'])

    wrapper.destroy()
  })

  it('should handle correctly when activated', () => {
    let wrapper = mount(
      Checkbox,
      {
        propsData: {
          checked: false
        }
      },
      {
        sync: false
      }
    )

    wrapper.vm.$on('change', val => {
      expect(val).to.equal(true)
    })

    wrapper.vm.activate()
  })
})
