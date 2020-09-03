import { mount } from '@vue/test-utils'
import CheckboxGroup from '@/components/CheckboxGroup'

describe('components/CheckboxGroup', () => {
  it('should handle items prop correctly', () => {
    const wrapper = mount(
      CheckboxGroup,
      {
        propsData: {
          items: [
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
            { label: 'C', value: 'c', disabled: true }
          ],
          value: ['a']
        }
      },
      {
        sync: false
      }
    )

    let boxes = wrapper.findAll('input[type="checkbox"]')
    expect(boxes.length).to.equal(3)
    expect(boxes.at(0).element.checked).to.equal(true)
    expect(boxes.at(1).element.checked).to.equal(false)

    expect(boxes.at(2).element.checked).to.equal(false)
    expect(boxes.at(2).element.disabled).to.equal(true)

    wrapper.destroy()
  })

  it('should handle checked prop with `null` value.', done => {
    const wrapper = mount(
      {
        components: {
          'veui-checkbox-group': CheckboxGroup
        },
        data () {
          return {
            items: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }],
            checked: null
          }
        },
        methods: {
          handleChange (val) {
            expect(val).to.deep.equal(['A'])
            expect(this.checked).to.deep.equal(['A'])

            done()
          }
        },
        template:
          '<veui-checkbox-group v-model="checked" :items="items" @change="handleChange"/>'
      },
      {
        sync: false
      }
    )

    wrapper
      .findAll('input[type="checkbox"]')
      .at(0)
      .trigger('change')
  })

  it('should make prop `value` fully controlled.', async () => {
    const wrapper = mount(
      {
        components: {
          'veui-checkbox-group': CheckboxGroup
        },
        data () {
          return {
            items: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }],
            checked: null
          }
        },
        template:
          '<veui-checkbox-group :value="checked" :items="items"/>'
      },
      {
        sync: false
      }
    )

    let boxes = wrapper.findAll('input[type="checkbox"]')
    boxes.at(0).element.checked = true
    boxes.at(0).trigger('change')
    await wrapper.vm.$nextTick()
    expect(boxes.at(0).element.checked).to.equal(false)

    boxes.at(1).element.checked = true
    boxes.at(1).trigger('change')
    await wrapper.vm.$nextTick()
    expect(boxes.at(1).element.checked).to.equal(false)

    wrapper.destroy()
  })

  it('should handle exclusive items correctly.', async () => {
    const wrapper = mount(
      {
        components: {
          'veui-checkbox-group': CheckboxGroup
        },
        data () {
          return {
            items: [
              { label: 'A', value: 'a', exclusive: true },
              { label: 'B', value: 'b' },
              { label: 'C', value: 'c' },
              { label: 'D', value: 'd', exclusive: true }
            ],
            selected: ['a']
          }
        },
        template:
          '<veui-checkbox-group v-model="selected" :items="items"/>'
      },
      {
        sync: false
      }
    )

    let boxes = wrapper.findAll('input[type="checkbox"],input[type="radio"]')

    function setAt (idx, value) {
      boxes.at(idx).element.checked = value
      boxes.at(idx).trigger('change')
    }
    let { vm } = wrapper

    expect(boxes.at(0).element.checked).to.equal(true)

    setAt(1, true)
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal(['b'])

    setAt(2, true)
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal(['b', 'c'])

    setAt(0, true)
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal(['a'])

    vm.selected = ['a', 'b'] // error prop
    await vm.$nextTick()
    setAt(2, true)
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal(['b', 'c'])

    vm.selected = ['a', 'd'] // error prop
    await vm.$nextTick()
    setAt(1, true)
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal(['b'])

    vm.selected = ['a', 'd', 'b'] // error prop
    await vm.$nextTick()
    setAt(1, false)
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal(['a'])

    wrapper.destroy()
  })

  it('should handle empty value correctly.', async () => {
    const wrapper = mount(
      {
        components: {
          'veui-checkbox-group': CheckboxGroup
        },
        data () {
          return {
            items: [
              { label: 'A', value: 'a', exclusive: true },
              { label: 'B', value: 'b' },
              { label: 'C', value: 'c' },
              { label: 'D', value: 'd', exclusive: true }
            ],
            selected: ['b'],
            emptyValue: 'a'
          }
        },
        template:
          '<veui-checkbox-group  :empty-value="emptyValue" v-model="selected" :items="items"/>'
      },
      {
        sync: false
      }
    )

    let boxes = wrapper.findAll('input[type="checkbox"],input[type="radio"]')

    function setAt (idx, value) {
      boxes.at(idx).element.checked = value
      boxes.at(idx).trigger('change')
    }
    let { vm } = wrapper

    setAt(1, false)
    await vm.$nextTick()
    expect(boxes.at(1).element.checked).to.equal(false)
    expect(boxes.at(0).element.checked).to.equal(true)
    expect(vm.selected).to.deep.equal(['a'])

    vm.emptyValue = undefined
    vm.selected = ['b']
    await vm.$nextTick()
    setAt(1, false)
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal([])

    wrapper.destroy()
  })
})
