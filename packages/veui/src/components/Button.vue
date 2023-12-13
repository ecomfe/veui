<script>
import Icon from './Icon'
import Loading from './Loading'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import focusable from '../mixins/focusable'
import '../common/global'

const BUTTON_ATTRS = new Set([
  'form',
  'formaction',
  'formenctype',
  'formmethod',
  'formnovalidate',
  'formtarget',
  'name',
  'value'
])

export default {
  name: 'veui-button',
  components: {
    'veui-icon': Icon
  },
  mixins: [prefix, ui, focusable],
  inheritAttrs: false,
  props: {
    disabled: Boolean,
    type: {
      type: String,
      default: 'button'
    },
    loading: Boolean
  },
  data () {
    return {
      active: false
    }
  },
  computed: {
    activatable () {
      return !this.disabled && !this.loading
    },
    attrs () {
      const button = {}
      const root = {}

      Object.keys(this.$attrs).forEach((key) => {
        if (BUTTON_ATTRS.has(key)) {
          button[key] = this.$attrs[key]
        } else {
          root[key] = this.$attrs[key]
        }
      })

      return {
        button,
        root
      }
    },
    listeners () {
      if (this.activatable) {
        return this.$listeners
      }

      let { click, ...listeners } = this.$listeners
      return listeners
    },
    realListeners () {
      return {
        ...this.listeners,
        keydown: this.handleKeydown,
        keyup: this.handleKeyup,
        keypress: this.handleKeypress,
        blur: this.handleBlur,
        click: this.handleClick
      }
    }
  },
  methods: {
    focus () {
      this.$el.focus()
    },
    handleKeydown (e) {
      this.$emit('keydown', e)
      if (!this.activatable) {
        return
      }

      if (e.key === ' ') {
        this.active = true
      }
    },
    handleKeyup (e) {
      this.$emit('keyup', e)
      if (!this.activatable) {
        return
      }

      if (this.active && e.key === ' ') {
        this.$el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        this.active = false
      }
    },
    handleKeypress (e) {
      this.$emit('keypress', e)
      if (this.activatable && e.key === 'Enter') {
        this.$el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      } else if (e.key === ' ') {
        e.preventDefault() // prevent page scroll
      }
    },
    handleBlur (e) {
      this.$emit('blur', e)
      this.active = false
    },
    handleClick (e) {
      if (!this.activatable) {
        return
      }

      this.$emit('click', e)
      this.$refs.button.dispatchEvent(new MouseEvent('click'))
    }
  },
  render () {
    return (
      <div
        role="button"
        tabindex="0"
        class={{
          [this.$c('button')]: true,
          [this.$c('button-loading')]: this.loading,
          [this.$c('disabled')]: this.disabled,
          [this.$c('active')]: this.active
        }}
        aria-disabled={this.disabled ? 'true' : null}
        ui={this.realUi}
        {...{
          attrs: this.attrs.root,
          on: this.realListeners
        }}
      >
        <button
          ref="button"
          class={this.$c('button-native')}
          tabindex="-1"
          role="presentation"
          disabled={!this.activatable}
          type={this.type}
          {...{ attrs: this.attrs.button }}
        >
          {this.loading ? (
            this.icons.loading ? (
              <Icon
                class={this.$c('button-loading-icon')}
                name={this.icons.loading}
                spin
              />
            ) : (
              <Loading class={this.$c('button-loading-icon')} loading />
            )
          ) : null}
          {(this.$scopedSlots.default
            ? this.$scopedSlots.default()
            : this.$slots.default || []
          ).map((vnode) =>
            !vnode.tag && (vnode.text || '').trim() ? (
              <span>{vnode}</span>
            ) : (
              vnode
            )
          )}
        </button>
      </div>
    )
  }
}
</script>
