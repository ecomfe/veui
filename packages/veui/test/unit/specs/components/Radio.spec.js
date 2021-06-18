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

  it('should only trigger click once', async () => {
    let count = 0

    let wrapper = mount(
      {
        components: {
          'veui-radio': Radio
        },
        data () {
          return {
            checked: false
          }
        },
        methods: {
          handleClick () {
            count++
          }
        },
        template: '<veui-radio :checked="checked" @click="handleClick"/>'
      },
      {
        sync: false
      }
    )

    wrapper.trigger('click')

    await wrapper.vm.$nextTick()

    expect(count).to.equal(1)
  })

  it('should support named radio group correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-radio': Radio
        },
        data () {
          return {
            c1: false,
            c2: false,
            c5: true
          }
        },
        template: `
          <div>
            <veui-radio name="a" value="0"/>
            <veui-radio :checked.sync="c1" name="a" value="1"/>
            <veui-radio :checked.sync="c2" name="a" value="2"/>
            <form>
              <veui-radio name="a" value="3"/>
              <veui-radio name="a" value="4"/>
              <veui-radio :checked.sync="c5" name="a" value="5"/>
            </form>
          </div>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    function expectData (values) {
      expect([vm.c1, vm.c2, vm.c5]).to.eql(values)
    }
    function expectChecked (values) {
      expect(radios.wrappers.map(wrapper => wrapper.element.checked)).to.eql(
        values
      )
    }

    let { vm } = wrapper
    const radios = wrapper.findAll('input[type="radio"]')
    expectChecked([false, false, false, false, false, true])

    radios.at(1).trigger('click')
    await vm.$nextTick()
    expectChecked([false, true, false, false, false, true])

    radios.at(2).trigger('click')
    await vm.$nextTick()
    expectData([false, true, true])
    expectChecked([false, false, true, false, false, true])

    radios.at(0).trigger('click')
    await vm.$nextTick()
    expectData([false, false, true])
    expectChecked([true, false, false, false, false, true])

    radios.at(3).trigger('click')
    await vm.$nextTick()
    expectData([false, false, false])
    expectChecked([true, false, false, true, false, false])

    radios.at(4).trigger('click')
    await vm.$nextTick()
    expectData([false, false, false])
    expectChecked([true, false, false, false, true, false])

    radios.at(5).trigger('click')
    await vm.$nextTick()
    expectData([false, false, true])
    expectChecked([true, false, false, false, false, true])

    radios.at(3).trigger('click')
    await vm.$nextTick()
    expectData([false, false, false])
    expectChecked([true, false, false, true, false, false])

    vm.c1 = true
    await vm.$nextTick()
    expectData([true, false, false])
    expectChecked([false, true, false, true, false, false])

    vm.c2 = true
    await vm.$nextTick()
    expectData([false, true, false])
    expectChecked([false, false, true, true, false, false])

    vm.c2 = false
    await vm.$nextTick()
    expectData([false, false, false])
    expectChecked([false, false, false, true, false, false])

    vm.c5 = true
    await vm.$nextTick()
    expectData([false, false, true])
    expectChecked([false, false, false, false, false, true])

    vm.c5 = false
    await vm.$nextTick()
    expectData([false, false, false])
    expectChecked([false, false, false, false, false, false])

    wrapper.destroy()
  })
})
