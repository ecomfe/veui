import Vue from 'vue'
import Dialog from '@/components/Dialog'

describe('components/Dialog', () => {
  it('should support `sync` modifier for prop `open`', done => {
    new Vue({
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
          .dispatchEvent(new Event('click'))

        await wait(0)
        expect(this.open).toBe(false)
        this.open = true

        await wait(0)
        dialog.$refs.content
          .querySelector('.veui-dialog-content-foot button:last-child')
          .dispatchEvent(new Event('click'))

        await wait(0)
        expect(this.open).toBe(false)

        this.open = true

        await wait(0)
        dialog.$refs.content
          .querySelector('.veui-dialog-content-head-close')
          .dispatchEvent(new Event('click'))

        await wait(0)
        expect(this.open).toBe(false)
        done()
      },
      template: '<veui-dialog ref="dialog" closable :open.sync="open"/>'
    }).$mount()
  })

  it('should support async `beforeClose` function prop', done => {
    new Vue({
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
          .dispatchEvent(new Event('click'))

        await wait(0)
        expect(this.open).toBe(false)
        this.open = true

        await wait(0)
        dialog.$refs.content
          .querySelector('.veui-dialog-content-foot button:first-child')
          .dispatchEvent(new Event('click'))

        await wait(100)
        expect(this.open).toBe(true)

        await wait(500)
        expect(this.open).toBe(false)
        done()
      },
      template: '<veui-dialog ref="dialog" :open.sync="open" :before-close="confirm"/>'
    }).$mount()
  })
})

async function wait (timeout = 0) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), timeout)
  })
}
