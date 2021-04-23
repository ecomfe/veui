import { mount } from '@vue/test-utils'
import Checkbox from '@/components/Checkbox'

describe('components/Checkbox', () => {
  it('should handle checked prop with `null` value.', done => {
    let wrapper = mount(Checkbox, {
      propsData: {
        checked: null
      },
      sync: false
    })

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

    let { vm } = wrapper
    await vm.$nextTick()

    let boxes = wrapper.findAll('input')
    expect(boxes.at(0).element.checked).to.equal(true)
    expect(boxes.at(2).element.checked).to.equal(false)

    boxes.at(0).element.checked = false
    boxes.at(0).trigger('change')

    await vm.$nextTick()
    boxes.at(2).element.checked = true
    boxes.at(2).trigger('change')

    await vm.$nextTick()
    expect(vm.group).to.deep.equal(['C'])

    vm.group = ['B']

    await vm.$nextTick()
    expect(boxes.at(0).element.checked).to.equal(false)
    expect(boxes.at(1).element.checked).to.equal(true)
    expect(boxes.at(2).element.checked).to.equal(false)

    wrapper.destroy()
  })

  it('should support checked + change usage', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-checkbox': Checkbox
        },
        data () {
          return {
            checked: false,
            indeterminate: false
          }
        },
        methods: {
          handleChange (checked) {
            this.checked = checked
          }
        },
        template:
          '<veui-checkbox :checked="checked" :indeterminate="indeterminate" @change="handleChange"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let box = wrapper.find('input')

    vm.indeterminate = true
    vm.checked = true

    await vm.$nextTick()
    expect(vm.indeterminate).to.equal(true)
    expect(vm.checked).to.equal(true)

    box.element.checked = false
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(false)
    expect(box.element.indeterminate).to.equal(true)

    box.element.checked = true
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(true)

    vm.checked = false
    vm.indeterminate = false

    await vm.$nextTick()
    expect(box.element.checked).to.equal(false)
    expect(box.element.indeterminate).to.equal(false)

    wrapper.destroy()
  })

  it('should support checked.sync usage', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-checkbox': Checkbox
        },
        data () {
          return {
            checked: false,
            indeterminate: false
          }
        },
        template:
          '<veui-checkbox :checked.sync="checked" :indeterminate="indeterminate"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let box = wrapper.find('input')

    vm.indeterminate = true
    vm.checked = true

    await vm.$nextTick()
    expect(vm.indeterminate).to.equal(true)
    expect(vm.checked).to.equal(true)

    box.element.checked = false
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(false)
    expect(box.element.indeterminate).to.equal(true)

    box.element.checked = true
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(true)

    vm.checked = false
    vm.indeterminate = false

    await vm.$nextTick()
    expect(box.element.checked).to.equal(false)
    expect(box.element.indeterminate).to.equal(false)

    wrapper.destroy()
  })

  it('should only emit change event upon user interaction', async () => {
    let changes = 0
    let wrapper = mount(
      {
        components: {
          'veui-checkbox': Checkbox
        },
        data () {
          return {
            checked: false
          }
        },
        methods: {
          handleChange (checked) {
            changes++
          }
        },
        template: '<veui-checkbox :checked="checked" @change="handleChange"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper

    vm.checked = true
    vm.checked = false

    await vm.$nextTick()
    vm.checked = true

    await vm.$nextTick()
    vm.checked = false

    await vm.$nextTick()
    expect(changes).to.equal(0)

    let box = wrapper.find('input')
    box.element.checked = true
    box.trigger('change')

    box.element.checked = false
    box.trigger('change')

    await vm.$nextTick()
    box.element.checked = true
    box.trigger('change')

    await vm.$nextTick()
    box.element.checked = false
    box.trigger('change')

    await vm.$nextTick()
    expect(changes).to.equal(4)

    wrapper.destroy()
  })

  it('should handle correctly when activated', () => {
    let wrapper = mount(Checkbox, {
      propsData: {
        checked: false
      },
      sync: false
    })

    wrapper.vm.$on('change', val => {
      expect(val).to.equal(true)
    })

    wrapper.vm.activate()
  })

  it('should only trigger click once', async () => {
    let count = 0

    let wrapper = mount(
      {
        components: {
          'veui-checkbox': Checkbox
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
        template: '<veui-checkbox :checked="checked" @click="handleClick"/>'
      },
      {
        sync: false
      }
    )

    wrapper.trigger('click')

    await wrapper.vm.$nextTick()

    expect(count).to.equal(1)
  })
})
