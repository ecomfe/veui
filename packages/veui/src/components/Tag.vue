<script>
import Button from './Button'
import Icon from './Icon'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import focusable from '../mixins/focusable'
import useControllable from '../mixins/controllable'
import i18n from '../mixins/i18n'
import '../common/global'

export default {
  name: 'veui-tag',
  components: {
    'veui-icon': Icon,
    'veui-button': Button
  },
  mixins: [
    prefix,
    ui,
    i18n,
    focusable,
    useControllable('selected'),
    useControllable('removed')
  ],
  props: {
    type: {
      type: String,
      default: 'default'
    },
    color: {
      type: String,
      validator (val) {
        return ['turquoise', 'violet', 'green'].indexOf(val) !== -1
      }
    },
    selectable: Boolean,
    selected: Boolean,
    removable: Boolean,
    removed: Boolean,
    disabled: Boolean
  },
  computed: {
    tabIndex () {
      return !this.disabled && this.selectable ? 0 : null
    }
  },
  methods: {
    focus () {
      this.$el.focus()
    },
    handleClick (e) {
      if (this.selectable && !this.disabled) {
        this.commit('selected', !this.realSelected)
      }
    },
    remove (e) {
      if (this.disabled) {
        return
      }

      e.stopPropagation()
      e.preventDefault()
      this.commit('removed', true)
      this.$emit('remove')
    }
  },
  render () {
    return this.realRemoved ? null : (
      <div
        {...{ on: this.$listeners }}
        tabindex={this.tabIndex}
        ui={this.realUi}
        class={{
          [this.$c('tag')]: true,
          [this.$c(`tag-${this.color || this.type}`)]: true,
          [this.$c('tag-selected')]: !!this.realSelected,
          [this.$c('disabled')]: this.disabled,
          [this.$c('tag-selectable')]: this.selectable
        }}
        disabled={this.selectable ? this.disabled : null}
        onClick={this.handleClick}
      >
        <div class={this.$c('tag-label')}>{this.$slots.default}</div>
        {this.removable ? (
          <veui-button
            ui={this.uiParts.remove}
            class={this.$c('tag-remove')}
            disabled={this.disabled}
            onClick={this.remove}
            aria-label={this.t('remove')}
            tabindex={this.disabled ? '-1' : '0'}
          >
            <veui-icon name={this.icons.remove} />
          </veui-button>
        ) : null}
      </div>
    )
  }
}
</script>
