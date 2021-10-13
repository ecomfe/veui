import Progress from '@/components/Progress'
import { wait, mount } from '../../../utils'

describe('components/Progress', function () {
  it('should handle value/min/max prop correctly.', async () => {
    let wrapper = mount({
      components: {
        'veui-progress': Progress
      },
      data () {
        return {
          value: 50
        }
      },
      template: `
        <veui-progress :value="value" :min="0" :max="100"/>`
    })

    const { vm } = wrapper
    await wait(0)

    let progress = wrapper.find('.veui-progress')
    expect(progress.classes()).to.not.contains('veui-progress-status-complete')
    let rail = wrapper
      .find('.veui-progress-rail')
      .element.getBoundingClientRect()
    let meter = wrapper
      .find('.veui-progress-meter')
      .element.getBoundingClientRect()
    expect((meter.right - rail.left) * 2).to.equal(rail.width)

    vm.value = 100
    await wait(0)
    progress = wrapper.find('.veui-progress')
    expect(progress.classes()).to.contains('veui-progress-status-complete')
    rail = wrapper.find('.veui-progress-rail').element.getBoundingClientRect()
    meter = wrapper.find('.veui-progress-meter').element.getBoundingClientRect()
    expect(meter.right - rail.left).to.equal(rail.width)

    wrapper.destroy()
  })

  it('should handle desc/decimalPlace prop correctly.', async () => {
    let wrapper = mount({
      components: {
        'veui-progress': Progress
      },
      data () {
        return {
          value: 50,
          desc: false,
          decimalPlace: null
        }
      },
      template: `
        <veui-progress :desc="desc" :decimal-place="decimalPlace" :value="value" :min="0" :max="100"/>`
    })

    const { vm } = wrapper

    await wait(0)
    testDesc(false)

    vm.desc = true
    await wait(0)
    testDesc(true, false)

    vm.decimalPlace = 1
    await wait(0)
    testDesc(true, true)

    function testDesc (exists, decimal) {
      let desc = wrapper.find('.veui-progress-desc')
      expect(desc.exists()).to.equal(exists)
      if (decimal != null) {
        expect(!!desc.text().match(/\./)).to.equal(decimal)
      }
    }
    wrapper.destroy()
  })

  it('should handle status/autosucceed prop correctly.', async () => {
    let wrapper = mount({
      components: {
        'veui-progress': Progress
      },
      data () {
        return {
          value: 100,
          status: null,
          autosucceed: false
        }
      },
      template: `
        <veui-progress :status.sync="status" :autosucceed="autosucceed" :value="value" :min="0" :max="100"/>`
    })

    const { vm } = wrapper

    await wait(0)
    let progress = wrapper.find('.veui-progress')
    expect(progress.classes()).to.contains('veui-progress-status-complete')
    expect(progress.classes()).to.not.contains('veui-progress-status-success')
    expect(vm.status).to.equal(null)

    vm.autosucceed = true
    await wait(0)
    expect(vm.status).to.equal('success')

    vm.value = 99
    await wait(0)
    expect(vm.status).to.equal(null)

    vm.autosucceed = 200
    vm.value = 100
    await wait(100)
    expect(vm.status).to.equal(null)
    await wait(200)
    expect(vm.status).to.equal('success')

    wrapper.destroy()
  })
})
