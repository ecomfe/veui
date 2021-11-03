<script>
import Icon from './Icon'
import Loading from './Loading'
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
  computed: {
    activatable () {
      return !this.disabled && !this.loading
    },
    attrs () {
      let { loading, disabled, type, ...props } = this.$props

      return {
        tabindex: this.activatable ? null : '0',
        role: this.activatable ? null : 'button',
        ...props,
        // 渲染成 div 的时候，type="button" 会导致在 Safari 上样式出现问题
        type: this.activatable ? type : null,
        'aria-disabled': this.disabled ? 'true' : null,
        ui: this.realUi
      }
    },
    listeners () {
      if (this.activatable) {
        return this.$listeners
      }

      let { click, ...listeners } = this.$listeners
      return listeners
    }
  },
  methods: {
    focus () {
      this.$el.focus()
    }
  },
  render () {
    let Tag = this.activatable ? 'button' : 'div'
    return (
      <Tag
        class={{
          [this.$c('button')]: true,
          [this.$c('button-loading')]: this.loading,
          [this.$c('disabled')]: this.disabled
        }}
        {...{
          attrs: this.attrs,
          on: this.listeners
        }}
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
        ).map(vnode =>
          !vnode.tag && (vnode.text || '').trim() ? <span>{vnode}</span> : vnode
        )}
      </Tag>
    )
  }
}
</script>
