<script>
import Icon from './Icon'
import Input from './Input'
import Button from './Button'
import Tag from './Tag'
import prefix from '../mixins/prefix'
import input from '../mixins/input'
import i18n from '../mixins/i18n'
import { uniqueId } from 'lodash'
import { renderSlot } from '../utils/helper'

export default {
  name: 'veui-select-trigger',
  uiTypes: ['transparent'],
  mixins: [prefix, input, i18n],
  props: {
    /* eslint-disable vue/require-prop-types */
    selected: {},
    /* eslint-ensable vue/require-prop-types */
    inputValue: String,
    placeholder: String,
    clearable: Boolean,
    searchable: Boolean,
    multiple: Boolean,
    max: Number,
    expanded: Boolean,
    icons: Object,
    uiParts: Object
  },
  data () {
    return {
      // TODO Context?
      labelId: uniqueId('veui-trigger-label-')
    }
  },
  computed: {
    realSelected () {
      // 保证多选 realValue 一定是数组
      // 保证单选没值一定是 null
      let val = this.selected
      return this.multiple
        ? val != null
          ? [].concat(val)
          : []
        : val != null
          ? val
          : null
    },
    inputPlaceholder () {
      if (this.multiple) {
        if (!this.isEmpty || !this.searchable) {
          return ''
        }
        return this.placeholder
      }
      return this.isEmpty ? this.placeholder : this.searchable ? this.label : ''
    },
    label () {
      return this.realSelected ? this.realSelected.label : ''
    },
    labels () {
      if (!Array.isArray(this.realSelected)) {
        return []
      }
      return this.realSelected.map(({ label, value }) => label || value)
    },
    // float multiple tags
    layoutWrap () {
      return (
        this.multiple &&
        !this.isEmpty &&
        (!this.hasLabelSlot() || this.expanded) &&
        !this.hasSelectedSlot()
      )
    },
    limitLabel () {
      if (this.multiple && this.max) {
        return `${(this.labels || []).length}/${this.max}`
      }
      return null
    },
    isEmpty () {
      return (
        this.realSelected == null ||
        (this.multiple && this.realSelected.length === 0)
      )
    }
  },
  mounted () {
    this.nativeInput = this.$refs.input && this.$refs.input.$refs.input
  },
  methods: {
    clear (e) {
      this.$emit('clear')
      e.stopPropagation()
      if (this.expanded) {
        this.focus()
      }
    },
    handleInputMouseup (e) {
      if (this.realReadonly || this.realDisabled) {
        return
      }

      this.$emit('toggle', !this.expanded)
      if (this.expanded) {
        this.focus()
      }
      e.preventDefault()
      e.stopPropagation()
    },
    handleInputBlur (e) {
      this.$emit('blur', e)
    },
    handleTriggerInput (val) {
      this.$emit('input', val)
      this.$emit('update:inputValue', val)
      // nextTick：一连串的输入不要多次触发相同的 toggle
      this.$nextTick(() => {
        if (!this.expanded) {
          this.$emit('toggle', true)
        }
      })

      if (this.multiple && this.searchable) {
        this.nativeInput.style.width = ''
        this.nativeInput.style.width = `${this.nativeInput.scrollWidth}px`
      }
    },
    // 这样判断 slots 不会响应的，所以写成方法每次重新计算（只要 slot 变化 vue 都会执行 update render）
    hasLabelSlot () {
      return !!(this.$scopedSlots.label || this.$slots.label)
    },
    hasSelectedSlot () {
      return !!(this.$scopedSlots.selected || this.$slots.selected)
    },
    focus () {
      let { input } = this.$refs
      if (input) {
        input.focus()
      }
    },
    blur () {
      let { input } = this.$refs
      if (input && input.$refs.input) {
        input.$refs.input.blur()
      }
    },
    // sub-renders
    renderSelectedTags () {
      return this.realSelected.map((item, index) => {
        let { label, value, disabled } = item
        return (
          <Tag
            key={value}
            data-key={value}
            onRemove={() => this.$emit('remove', item)}
            disabled={this.realDisabled || this.realReadonly || disabled}
            removable={!this.disabled && !disabled}
            {...{
              nativeOn: {
                '!mouseup': stopPropagation
              }
            }}
          >
            {renderSlot(this, 'tag', {
              ...item,
              index
            }) || label}
          </Tag>
        )
      })
    },
    renderCustomLabel (props) {
      let customLabel = renderSlot(this, 'label', props)
      if (customLabel) {
        return <div class={this.$c('trigger-custom-label')}>{customLabel}</div>
      }
    },
    renderCustomSelected (props) {
      let customSelected = renderSlot(this, 'selected', props)
      if (customSelected) {
        return (
          <div class={this.$c('trigger-custom-selected')}>{customSelected}</div>
        )
      }
    },
    renderLabelOrSelected (props) {
      return this.renderCustomLabel(props) || this.renderCustomSelected(props)
    },
    renderBefore () {
      if (!this.searchable && !this.isEmpty) {
        return (
          <span class={this.$c('select-label')} id={this.labelId}>
            {this.renderLabelOrSelected({
              ...this.realSelected,
              selected: true
            }) || this.label}
          </span>
        )
      }
    },
    renderBeforeForMultiple () {
      let hasSelected = !!this.realSelected.length
      if (hasSelected) {
        if (this.hasLabelSlot() && !this.expanded) {
          return (
            this.renderCustomLabel({ selected: this.realSelected }) ||
            this.renderSelectedTags()
          )
        } else if (this.hasSelectedSlot()) {
          return (
            this.renderCustomSelected({ selected: this.realSelected }) ||
            this.renderSelectedTags()
          )
        }
      }

      if (!hasSelected && !this.searchable) {
        return (
          <span class={this.$c('trigger-placeholder')} id={this.labelId}>
            {this.placeholder}
          </span>
        )
      }

      return this.renderSelectedTags()
    }
  },
  render () {
    return (
      <Input
        ref="input"
        class={{
          [this.$c('trigger')]: true,
          [this.$c('trigger-searchable')]: this.searchable,
          [this.$c('trigger-expanded')]: this.expanded,
          [this.$c('trigger-multiple')]: this.multiple,
          [this.$c('trigger-wrap')]: this.layoutWrap,
          [this.$c('trigger-empty')]: this.isEmpty
        }}
        disabled={this.realDisabled}
        readonly={this.realReadonly}
        invalid={this.realInvalid}
        placeholder={this.inputPlaceholder}
        value={this.inputValue}
        onMouseup={this.handleInputMouseup}
        onBlur={this.handleInputBlur}
        onInput={this.handleTriggerInput}
        autocomplete="off"
        composition
      >
        {!this.multiple &&
        this.searchable &&
        this.realSelected != null &&
        (this.hasLabelSlot() || this.hasSelectedSlot()) ? (
            <template slot="placeholder">
              {this.renderLabelOrSelected({
                ...this.realSelected,
                selected: !this.isEmpty
              }) || this.label}
            </template>
          ) : null}
        <template slot="before">
          {this.multiple ? this.renderBeforeForMultiple() : this.renderBefore()}
        </template>
        <template slot="after">
          {this.limitLabel && (
            <span class={this.$c('trigger-count')}>{this.limitLabel}</span>
          )}
          <div class={this.$c('trigger-icon')}>
            {this.clearable && !this.isEmpty ? (
              <Button
                class={this.$c('trigger-clear')}
                ui={this.uiParts.clear}
                aria-label={this.t('clear')}
                disabled={this.realDisabled || this.realReadonly}
                // had to do so because of vuejs/jsx#77
                {...{
                  on: {
                    click: this.clear,
                    '!keydown': stopPropagation,
                    '!mousedown': stopPropagation,
                    '!mouseup': stopPropagation
                  }
                }}
              >
                <Icon name={this.icons.clear} />
              </Button>
            ) : null}
            <Icon
              class={this.$c('trigger-toggle')}
              name={this.icons[this.expanded ? 'collapse' : 'expand']}
            />
          </div>
        </template>
      </Input>
    )
  }
}

function stopPropagation (e) {
  e.stopPropagation()
}
</script>
