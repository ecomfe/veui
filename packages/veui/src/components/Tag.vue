<script>
import Button from './Button'
import Icon from './Icon'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import focusable from '../mixins/focusable'
import warn from '../utils/warn'

export default {
  name: 'veui-tag',
  components: {
    'veui-icon': Icon,
    'veui-button': Button
  },
  mixins: [prefix, ui, focusable],
  props: {
    type: {
      type: String,
      default: 'default'
    },
    closable: Boolean,
    selectable: Boolean,
    selected: Boolean,
    disabled: Boolean
  },
  data () {
    return {
      localOpen: true,
      localSelected: this.selected
    }
  },
  computed: {
    tabIndex () {
      return !this.disabled && this.selectable ? 0 : null
    }
  },
  watch: {
    selected (val) {
      this.localSelected = val
    },
    localSelected (val) {
      if (this.selected !== val) {
        this.$emit('update:selected', this.localSelected)
      }
    }
  },
  created () {
    if (this.closable && this.selectable) {
      warn('[veui-tag] `closable` and `selectable` cannot be both true.')
    }
  },
  methods: {
    focus () {
      this.$el.focus()
    },
    handleClick (e) {
      if (this.selectable && !this.disabled) {
        this.localSelected = !this.localSelected
      }
    },
    close (e) {
      if (this.disabled) {
        return
      }

      e.stopPropagation()
      e.preventDefault()
      this.localOpen = false
      this.$emit('close')
    }
  },
  render () {
    let TagName = this.selectable ? 'button' : 'div'
    return this.localOpen ? (
      <TagName
        tabindex={this.tabIndex}
        ui={this.realUi}
        class={{
          [this.$c('tag')]: true,
          [this.$c(`tag-${this.type}`)]: true,
          [this.$c('tag-selected')]: this.localSelected,
          [this.$c('disabled')]: this.disabled,
          [this.$c('tag-selectable')]: this.selectable
        }}
        disabled={this.selectable ? this.disabled : null}
        onClick={this.handleClick}
      >
        {this.$slots.default}
        {this.closable ? (
          <veui-button
            ui={this.uiParts.close}
            class={this.$c('tag-close')}
            disabled={this.disabled}
            onClick={this.close}
          >
            <veui-icon name={this.icons.close} />
          </veui-button>
        ) : null}
      </TagName>
    ) : null
  }
}
</script>
