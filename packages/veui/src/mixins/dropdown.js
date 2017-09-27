import { throttle } from 'lodash'
import { outside } from '../directives'

export default {
  directives: { outside },
  data () {
    return {
      expanded: false,
      localOverlayOptions: {
        position: 'bottom left',
        constraints: [
          {
            to: 'scrollParent',
            attachment: 'together'
          },
          {
            to: 'window',
            attachment: 'together'
          }
        ]
      }
    }
  },
  methods: {
    close () {
      this.expanded = false
    },
    activate () {
      this.expanded = true
    }
  },
  updated () {
    let box = this.$refs.box
    if (!box || !(box instanceof HTMLElement)) {
      return
    }

    if (box.scrollHeight > box.offsetHeight) {
      box.classList.add('veui-dropdown-overflow')

      this.__overlay_scroll_handler__ = throttle(() => {
        box.classList.toggle('veui-dropdown-overflow-scroll-end', box.scrollTop + box.offsetHeight >= box.scrollHeight)
      }, 200, { leading: true })

      box.addEventListener('scroll', this.__overlay_scroll_handler__, false)
    }
  },
  destroy () {
    if (this.__overlay_scroll_handler__) {
      this.$refs.box.removeEventListener('scroll', this.__overlay_scroll_handler__, false)
    }
  }
}
