import { mount } from '@vue/test-utils'
import Dialog from '@/components/Dialog'
import { wait } from '../../../utils'

describe('components/Dialog', () => {
  it('should support `sync` modifier for prop `open`.', done => {
    let wrapper = mount({
      components: {
        'veui-dialog': Dialog
      },
      data () {
        return {
          open: true
        }
      },
      async mounted () {
        let { dialog } = this.$refs
        dialog.$refs.content
          .querySelector('.veui-dialog-content-foot button:first-child')
          .dispatchEvent(new MouseEvent('click'))

        await this.$nextTick()
        expect(this.open).to.be.equal(false)
        this.open = true

        await this.$nextTick()
        dialog.$refs.content
          .querySelector('.veui-dialog-content-foot button:last-child')
          .dispatchEvent(new MouseEvent('click'))

        await this.$nextTick()
        expect(this.open).to.be.equal(false)

        this.open = true

        await this.$nextTick()
        dialog.$refs.content
          .querySelector('.veui-dialog-content-head-close')
          .dispatchEvent(new MouseEvent('click'))

        await this.$nextTick()
        expect(this.open).to.be.equal(false)

        wrapper.destroy()
        done()
      },
      template: '<veui-dialog ref="dialog" closable :open.sync="open"/>'
    })
  })

  it('should support async `beforeClose` function prop.', done => {
    let wrapper = mount({
      components: {
        'veui-dialog': Dialog
      },
      data () {
        return {
          open: true,
          confirm (type) {
            if (type !== 'ok') {
              return
            }
            return new Promise(resolve => {
              setTimeout(() => resolve(), 300)
            })
          }
        }
      },
      async mounted () {
        let { dialog } = this.$refs
        dialog.$refs.content
          .querySelector('.veui-dialog-content-foot button:last-child')
          .dispatchEvent(new MouseEvent('click'))

        await this.$nextTick()
        expect(this.open).to.be.equal(false)
        this.open = true

        await this.$nextTick()
        dialog.$refs.content
          .querySelector('.veui-dialog-content-foot button:first-child')
          .dispatchEvent(new MouseEvent('click'))

        await wait(100)
        expect(this.open).to.be.equal(true)

        await wait(500)
        expect(this.open).to.be.equal(false)

        wrapper.destroy()
        done()
      },
      template:
        '<veui-dialog ref="dialog" :open.sync="open" :before-close="confirm"/>'
    })
  })
})
