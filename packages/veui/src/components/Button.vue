<script>
import { omit } from 'lodash'
import Icon from './Icon'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import focusable from '../mixins/focusable'

export default {
  name: 'veui-button',
  components: {
    'veui-icon': Icon
  },
  mixins: [prefix, ui, focusable],
  props: {
    disabled: Boolean,
    name: String,
    type: {
      type: String,
      default: 'button'
    },
    value: String,
    loading: Boolean
  },
  data () {
    return {
      iconOnly: false
    }
  },
  computed: {
    attrs () {
      let props = omit(this.$props, 'loading')
      props.disabled = this.disabled || this.loading
      props.ui = this.realUi
      return props
    }
  },
  methods: {
    focus () {
      this.$el.focus()
    }
  },
  render () {
    return (
      <button
        class={{
          [this.$c('button')]: true,
          [this.$c('button-loading')]: this.loading,
          [this.$c('disabled')]: this.disabled
        }}
        {...{
          attrs: this.attrs,
          on: this.$listeners
        }}
      >
        {this.loading ? (
          <Icon
            class={this.$c('button-loading-icon')}
            name={this.icons.loading}
            spin
          />
        ) : null}
        {(this.$scopedSlots.default
          ? this.$scopedSlots.default()
          : this.$slots.default
        ).map(vnode =>
          !vnode.tag && vnode.text != null ? <span>{vnode}</span> : vnode
        )}
      </button>
    )
  }
}
</script>
