<script>
import Overlay from './Overlay'
import Toast from './Toast'
import { assign, findIndex, uniqueId } from 'lodash'
import config from '../managers/config'
import useConfig from '../mixins/config'
import prefix from '../mixins/prefix'
import overlay from '../mixins/overlay'
import '../common/global'

config.defaults(
  {
    priority: 101
  },
  'toast'
)

export default {
  name: 'veui-toast-list',
  uiTypes: ['transparent'],
  mixins: [prefix, overlay, useConfig('config', 'toast')],
  data () {
    return {
      messages: []
    }
  },
  computed: {
    priority () {
      return this.config['toast.priority']
    }
  },
  methods: {
    add (message) {
      message = assign({ height: 0, top: 0 }, message, {
        __message_id__: uniqueId('veui-toast-')
      })
      this.messages.unshift(message)
      return message
    },
    remove (message) {
      let index = findIndex(this.messages, (msg) => {
        return msg.__message_id__ === message.__message_id__
      })
      this.messages.splice(index, 1)
      this.updateLayout()
    },
    updateHeight (message, el) {
      message.height =
        el.offsetHeight + parseFloat(getComputedStyle(el).marginBottom)
      this.updateLayout()
    },
    updateLayout () {
      this.messages.forEach((msg, i) => {
        if (i === 0) {
          msg.top = 0
          return
        }

        let prev = this.messages[i - 1]
        msg.top = prev.top + prev.height
      })
    }
  },
  render () {
    return (
      <Overlay
        open
        overlay-class={this.mergeOverlayClass(this.$c('toast-list'))}
        priority={this.priority}
      >
        {this.messages.map((m) => (
          <Toast
            key={m.__message_id__}
            open
            status={m.status || m.type}
            message={typeof m.message === 'string' ? m.message : null}
            closable={m.closable}
            title={m.title}
            ui={m.ui}
            duration={m.duration}
            theme={m.theme}
            style={`top: ${m.top}px`}
            onClose={() => this.remove(m)}
            onReady={(e) => this.updateHeight(m, e)}
            scopedSlots={
              typeof m.message === 'function'
                ? {
                  default: m.message
                }
                : null
            }
          >
            {typeof m.message === 'object' ? m.message : null}
          </Toast>
        ))}
      </Overlay>
    )
  }
}
</script>
