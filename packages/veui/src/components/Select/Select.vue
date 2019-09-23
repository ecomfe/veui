<script>
import Icon from '../Icon'
import Input from '../Input'
import Button from '../Button'
import Tag from '../Tag'
import OptionGroup from './OptionGroup'
import Overlay from '../Overlay'
import Checkbox from '../Checkbox'
import config from '../../managers/config'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import dropdown from '../../mixins/dropdown'
import suggestion from '../../mixins/suggestion'
import keySelect from '../../mixins/key-select'
import i18n from '../../mixins/i18n'
import { find } from '../../utils/datasource'
import { uniqueId, isEqual } from 'lodash'
import '../../common/uiTypes'

config.defaults(
  {
    placeholder: '@@select.placeholder'
  },
  'select'
)

export default {
  name: 'veui-select',
  uiTypes: ['select'],
  mixins: [ui, input, dropdown, keySelect, suggestion, i18n],
  model: {
    event: 'change'
  },
  props: {
    /* eslint-disable vue/require-prop-types */
    value: {},
    /* eslint-ensable vue/require-prop-types */
    placeholder: String,
    clearable: Boolean,
    searchable: Boolean,
    options: Array,
    multiple: Boolean,
    max: Number
  },
  data () {
    return {
      labelId: uniqueId('veui-select-label-'),
      localValue: this.multiple
        ? this.value != null
          ? [].concat(this.value)
          : []
        : this.value,
      outsideRefs: ['input'],
      inputValue: '',
      inlineOptions: null
    }
  },
  computed: {
    selectedOption () {
      if (this.multiple) {
        return null
      }
      if (this.localValue == null) {
        return null
      }
      return findOptionByValue(this.realOptions, this.localValue)
    },
    realPlaceholder () {
      return this.placeholder == null
        ? config.get('select.placeholder')
        : this.placeholder
    },
    inputPlaceholder () {
      if (this.multiple) {
        if (
          (this.localValue && this.localValue.length > 0) ||
          !this.searchable
        ) {
          return ''
        }
        return this.realPlaceholder
      }

      if (!this.searchable) {
        return this.localValue == null ? this.realPlaceholder : ''
      }

      return this.localValue == null ? this.realPlaceholder : this.label
    },
    label () {
      return this.selectedOption ? this.selectedOption.label : ''
    },
    labels () {
      let { localValue } = this
      if (!Array.isArray(localValue)) {
        return []
      }
      return this.localValue.map(val => {
        let option = findOptionByValue(this.realOptions, val)
        return option ? option.label : ''
      })
    },
    searchInputLabel () {
      if (this.inputValue) {
        return this.inputValue
      }
      if (this.localValue === null || this.expanded) {
        return ''
      }
      return this.label
    },
    limitLabel () {
      if (this.multiple && this.max) {
        return `${(this.labels || []).length}/${this.max}`
      }
      return null
    },
    realOptions () {
      return this.options || this.inlineOptions
    },
    isFiltered () {
      return this.searchable && this.inputValue
    },
    filteredOptions () {
      if (this.isFiltered) {
        let matched = this.filterFlattedDatasource(this.inputValue)
        return matched ? this.flattedDatasource : []
      }
      return this.realOptions || []
    },
    filteredOptionsEmpty () {
      return !this.filteredOptions.some(({ hidden }) => !hidden)
    },
    isEmpty () {
      return (
        this.localValue == null ||
        (Array.isArray(this.localValue) && this.localValue.length === 0)
      )
    },
    isMultiLevel () {
      return this.realOptions
        ? this.realOptions.some(
          option =>
            option.options &&
              option.options.length > 0 &&
              option.position === 'popup'
        )
        : false
    },
    isMatchWidth () {
      return !this.isMultiLevel || !!this.inputValue
    },
    inputClass () {
      if (this.multiple) {
        return this.searchable
          ? 'veui-select-search-multi-input'
          : 'veui-select-multi-input'
      }
      return this.searchable ? 'veui-select-search-input' : 'veui-select-input'
    },
    focusClass () {
      return this.searchable ? config.get('keySelect.focusClass') : null
    }
  },
  watch: {
    value (val, oldVal) {
      if (isEqual(val, oldVal)) {
        return
      }
      this.localValue = this.multiple ? [].concat(val) : val
    },
    expanded (val) {
      if (this.searchable && !val) {
        this.inputValue = ''
      }
    }
  },
  mounted () {
    this.nativeInput = this.$refs.input.$refs.input
  },
  methods: {
    clear (e) {
      if (this.multiple) {
        this.localValue = []
      } else {
        this.localValue = null
      }
      this.inputValue = ''
      e.stopPropagation()
      this.focus()
    },
    handleSelect (value) {
      if (this.searchable) {
        this.$nextTick(() => {
          if (this.multiple) {
            this.inputValue = ''
            this.focus()
          }
        })
      }
      if (!this.multiple) {
        this.expanded = false
        if (this.localValue !== value) {
          this.localValue = value
          this.$emit('change', value)
        }
        return
      }
      if (!value) {
        // clear
        this.expanded = false
        this.localValue = []
        this.$emit('change', value)
        return
      }

      let index = this.localValue.indexOf(value)
      if (index !== -1) {
        // remove
        this.removeSelectedValue(index)
      } else {
        if (!this.max || (this.max && this.localValue.length < this.max)) {
          this.localValue.push(value)
          this.$emit('change', [...this.localValue])
        }
      }
    },
    removeSelectedValue (index) {
      this.localValue.splice(index, 1)
      this.$emit('change', [...this.localValue])
    },
    handleRelocate () {
      let { options } = this.$refs
      if (options) {
        options.relocateDeep()
      }
    },
    handleInputMouseup (e) {
      if (this.realReadonly || this.realDisabled) {
        return
      }

      this.expanded = !this.expanded
      if (this.expanded) {
        this.focus()
      }
      e.stopPropagation()
      e.preventDefault()
    },
    handleTriggerKeydown (e) {
      let passive = true
      switch (e.key) {
        case 'Up':
        case 'ArrowUp':
        case 'Down':
        case 'ArrowDown':
          this.expanded = true
          passive = false
          if (this.searchable) {
            this.handleKeydown(e)
            this.getCurrentActiveElement()
          }
          break
        case 'Esc':
        case 'Escape':
          if (this.searchable) {
            this.expanded = false
            passive = false
          }
          break
        case 'Tab':
          this.expanded = false
          break
        case 'Enter':
          if (this.searchable) {
            if (!this.expanded) {
              this.expanded = true
              break
            }
            if (this.expanded) {
              let elem = this.getCurrentActiveElement()
              if (elem) {
                elem.click()
              }
            }
          } else {
            this.expanded = true
          }
          break
        case 'Backspace':
          if (this.multiple && this.searchable && !this.inputValue) {
            this.localValue.pop()
          }
          break
        default:
          break
      }
      if (!passive) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    handleTriggerInput (val) {
      this.inputValue = val
      this.expanded = true
      if (!val && !this.multiple) {
        this.localValue = ''
      }
      if (this.multiple && this.searchable) {
        this.nativeInput.style.width = ''
        this.nativeInput.style.width = `${this.nativeInput.scrollWidth}px`
      }
    },
    handleAfteropen () {
      this.$emit('afteropen')
    },
    focus (visible) {
      if (!this.searchable) {
        this.$el.focus()
        return
      }
      let { input } = this.$refs
      if (input) {
        input.focus()
      }
    }
  },
  render () {
    let optionLabel = option => {
      let { groups } = option

      if (groups) {
        let res = groups.map((group, index) => {
          if (group.isSeparator) {
            return <mark>{group.value}</mark>
          }
          return <span>{group.value}</span>
        })
        return <span>{res}</span>
      }
      return null
    }

    let option = this.multiple
      ? option => {
        return (
          <Checkbox
            tabindex="-1"
            ui={this.uiParts.checkbox}
            checked={option.selected}
            onClick={e => e.preventDefault()}
          >
            {option.label}
          </Checkbox>
        )
      }
      : null

    let selectedTags = (this.labels || []).map((label, index) => (
      <Tag
        key={label}
        ui={this.uiParts.tag}
        onClose={() => this.removeSelectedValue(index)}
        disabled={this.realDisabled || this.realReadonly}
        closable
      >
        {label}
      </Tag>
    ))

    let multiPrependSlot = this.searchable ? (
      selectedTags
    ) : this.labels.length === 0 ? (
      <span class="veui-select-placeholder" id={this.labelId}>
        {this.realPlaceholder}
      </span>
    ) : (
      selectedTags
    )

    let prependSlot = !this.searchable ? (
      <span
        class={{
          'veui-select-label': true,
          'veui-select-placeholder': this.localValue === null
        }}
        id={this.labelId}
      >
        {this.$scopedSlots.label
          ? this.$scopedSlots.label(this.selectedOption || { selected: false })
          : this.label}
      </span>
    ) : null

    let renderGroup = (options, children) => {
      return (
        <OptionGroup
          v-show={!!options}
          hidden={!options}
          aria-hidden={!options}
          ref="options"
          options={options}
          scopedSlots={{
            label: this.$scopedSlots['group-label'] || null,
            option: this.$scopedSlots.option || option,
            'option-label': this.$scopedSlots['option-label'] || optionLabel
          }}
        >
          {children}
        </OptionGroup>
      )
    }

    return (
      <div
        class={{
          'veui-select': true,
          'veui-select-empty': this.isEmpty,
          'veui-select-expanded': this.expanded,
          'veui-select-searchable': this.searchable,
          'veui-readonly': this.realReadonly,
          'veui-disabled': this.realDisabled,
          'veui-input-invalid': this.realInvalid
        }}
        ui={this.realUi}
        role="listbox"
        aria-owns={this.dropdownId}
        aria-readonly={this.realReadonly}
        aria-expanded={this.expanded}
        aria-disabled={this.realDisabled}
        aria-labelledby={this.labelId}
        aria-haspopup="listbox"
        tabindex={this.searchable || this.realDisabled ? null : '0'}
        onKeydown={this.handleTriggerKeydown}
      >
        <Input
          ref="input"
          class={{
            'veui-select-trigger': true,
            [this.inputClass]: true
          }}
          disabled={this.realDisabled}
          readonly={this.realReadonly}
          placeholder={this.inputPlaceholder}
          value={this.inputValue}
          onMouseup={this.handleInputMouseup}
          onInput={this.handleTriggerInput}
          composition
        >
          <template slot="prepend">
            {this.multiple ? multiPrependSlot : prependSlot}
          </template>
          <template slot="append">
            {this.limitLabel ? (
              <span class="veui-select-count">{this.limitLabel}</span>
            ) : null}
            <div class="veui-select-icon">
              {this.clearable &&
              (this.multiple
                ? this.localValue.length > 0
                : this.localValue != null) ? (
                  <Button
                    class="veui-select-clear"
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
                class="veui-select-toggle"
                name={this.icons[this.expanded ? 'collapse' : 'expand']}
              />
            </div>
          </template>
        </Input>
        {
          <Overlay
            v-show={this.expanded}
            target="input"
            open={this.expanded}
            autofocus={!this.searchable}
            modal
            options={this.realOverlayOptions}
            overlay-class={this.overlayClass}
            match-width={this.isMatchWidth}
            onLocate={this.handleRelocate}
            onAfteropen={this.handleAfteropen}
          >
            <div
              id={this.dropdownId}
              ref="box"
              class={{
                'veui-select-options': true,
                'veui-select-options-multiple': this.multiple
              }}
              {...{
                directives: [
                  {
                    name: 'outside',
                    value: {
                      refs: this.outsideRefs,
                      handler: this.close
                    }
                  }
                ]
              }}
              tabindex="-1"
              ui={this.realUi}
              role="listbox"
              onKeydown={this.handleKeydown}
            >
              {this.$slots.before}
              {!this.options ? renderGroup(null, this.$slots.default) : null}
              {renderGroup(
                this.filteredOptions,
                this.searchable && this.filteredOptionsEmpty ? (
                  <div class="veui-select-options-no-data">
                    {this.$scopedSlots['no-data']
                      ? this.$scopedSlots['no-data']({
                        keyword: this.inputValue
                      })
                      : this.$slots['no-data'] || this.t('noData')}
                  </div>
                ) : null
              )}
              {this.$slots.after}
            </div>
          </Overlay>
        }
      </div>
    )
  }
}

function stopPropagation (e) {
  e.stopPropagation()
}

function findOptionByValue (options, value) {
  return find(options, item => item.value === value, 'options')
}
</script>
