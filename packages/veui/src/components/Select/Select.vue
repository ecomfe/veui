<script>
import Icon from '../Icon'
import Input from '../Input'
import Tag from '../Tag'
import Option from './Option'
import OptionGroup from './OptionGroup'
import Overlay from '../Overlay'
import Checkbox from '../Checkbox'
import config from '../../managers/config'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import dropdown from '../../mixins/dropdown'
import suggestion from '../../mixins/suggestion'
import keySelect from '../../mixins/key-select'
import warn from '../../utils/warn'
import { walk } from '../../utils/data'
import { uniqueId, mapValues } from 'lodash'
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
  mixins: [ui, input, dropdown, keySelect, suggestion],
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
      localValue: this.multiple ? this.genMultiValue(this.value) : this.value,
      outsideRefs: ['input'],
      initOptionLabel: '',
      inputValue: '',
      multiLabels: null
    }
  },
  computed: {
    optionMap () {
      return this.extractOptions()
    },
    labelMap () {
      return mapValues(this.optionMap, 'label')
    },
    selectedOption () {
      if (this.multiple) {
        return null
      }
      if (this.localValue == null) {
        return null
      }
      return this.optionMap[this.localValue]
    },
    realPlaceholder () {
      return this.placeholder == null
        ? config.get('select.placeholder')
        : this.placeholder
    },
    inputPlaceholder () {
      if (this.searchable) {
        if (!this.multiple || (this.multiple && !this.multiLabels)) {
          return this.realPlaceholder
        }
      }
      return null
    },
    label () {
      if (this.multiple) {
        return ''
      }
      if (this.localValue == null) {
        return this.realPlaceholder
      }
      if (this.options) {
        return this.labelMap[this.localValue]
      }
      if (this.$refs.options) {
        return this.findOptionsLabel(this.localValue)
      }
      return ''
    },
    searchInputLabel () {
      if (this.localValue === null) {
        return ''
      }
      return this.label
    },
    limitLabel () {
      if (this.multiple && this.max) {
        return `${(this.multiLabels || []).length}/${this.max}`
      }
      return null
    },
    realOptions () {
      if (this.searchable && this.inputValue) {
        let matched = this.filterFlattedDatasource(this.inputValue)
        return matched ? this.flattedDatasource : null
      }
      return this.options || []
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
    value (val) {
      this.localValue = this.multiple ? this.genMultiValue(val) : val
    },
    localValue (val) {
      if (this.multiple) {
        this.multiLabels = this.genMultiLabels(val)
      }
      if (this.value !== val) {
        this.$emit('change', val)
      }
    }
  },
  mounted () {
    /**
     * It cann't obtain 'options' refs in computed attribute
     * when the default slot component (OptionGroup) did not mounted.
     * This caused the label data cann't computed by $refs.options.find function.
     * So it recomputed option label on this component mounted.
     */
    if (this.localValue && !this.label) {
      if (!this.searchable && !this.multiple) {
        this.initOptionLabel = this.findOptionsLabel(this.localValue)
      }
      if (this.multiple) {
        this.multiLabels = this.genMultiLabels(this.localValue)
      }
    }
    this.nativeInput = this.$refs.input.$refs.input
  },
  methods: {
    genMultiValue (value) {
      if (value) {
        if (Array.isArray(value)) {
          return value
        }
        return [value]
      }
      return []
    },
    genMultiLabels (value) {
      if (value && value.length && this.$refs.options) {
        return value
          .map(val => this.findOptionsLabel(val))
          .filter(val => !!val)
      }
      return null
    },
    findOptionsLabel (value) {
      let option = this.$refs.options.find(value)
      return option ? option.label : ''
    },
    handleSelect (value) {
      if (!this.multiple) {
        this.expanded = false
        this.localValue = value
        if (this.searchable) {
          // change the input value to option'label when selected
          this.$nextTick(() => {
            this.inputValue = this.searchInputLabel
          })
        }
        return
      }
      if (!value) {
        // clear
        this.localValue = []
        this.expanded = false
        return
      }

      let index = this.localValue.indexOf(value)
      if (index !== -1) {
        // remove
        this.removeSelectedValue(index)
      } else {
        if (!this.max || (this.max && this.localValue.length < this.max)) {
          this.localValue.push(value)
        }
      }
    },
    removeSelectedValue (index) {
      this.localValue.splice(index, 1)
    },
    handleRelocate () {
      this.$refs.options.relocateDeep()
    },
    handleInputClick (e) {
      if (this.realReadonly || this.realDisabled) {
        return
      }

      this.expanded = !this.expanded
      if (this.expanded) {
        this.$refs.input.focus()
      } else {
        this.$el.blur()
      }
      e.stopPropagation()
      e.preventDefault()
    },
    handleInputKeydown (e) {
      let passive = true
      switch (e.key) {
        case 'Up':
        case 'ArrowUp':
        case 'Down':
        case 'ArrowDown':
          this.expanded = true
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
            passive = false
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
    extractOptions () {
      let map = {}
      walk(
        this.options,
        option => {
          let { value } = option
          if (value != null) {
            if (map[value]) {
              warn(
                `[veui-select] Duplicate item value [${value}] for select options.`,
                this
              )
            }
            map[value] = option
          }
        },
        ['options', 'children']
      )
      return map
    },
    focus () {
      this.$refs.input.focus()
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
            checked={option.selected}
            onClick={e => e.preventDefault()}
          >
            {option.label}
          </Checkbox>
        )
      }
      : null

    let selectedTags = (this.multiLabels || []).map((label, index) => (
      <Tag
        key={label}
        onClose={() => this.removeSelectedValue(index)}
        disabled={this.realDisabled || this.realReadonly}
        closable
      >
        {label}
      </Tag>
    ))
    let multiPrependSlot = this.searchable ? (
      selectedTags
    ) : !this.multiLabels ? (
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
          : this.label || this.initOptionLabel}
      </span>
    ) : null
    return (
      <div
        class={{
          'veui-select': true,
          'veui-select-empty': this.localValue == null,
          'veui-select-expanded': this.expanded,
          'veui-input-invalid': this.realInvalid
        }}
        ui={this.realUi}
        role="listbox"
        aria-owns={this.dropdownId}
        aria-readonly={this.realReadonly}
        aria-expanded={this.expanded}
        aria-disabled={this.realDisabled || this.realReadonly}
        aria-labelledby={this.labelId}
        aria-haspopup="listbox"
      >
        <Input
          ref="input"
          class={this.inputClass}
          disabled={this.realDisabled || this.realReadonly}
          placeholder={this.inputPlaceholder}
          value={this.searchInputLabel}
          onClick={this.handleInputClick}
          onKeydown={this.handleInputKeydown}
          onInput={this.handleTriggerInput}
          clearable={this.searchable && !this.multiple}
          composition
        >
          <template slot="prepend">
            {this.multiple ? multiPrependSlot : prependSlot}
          </template>
          <template slot="append">
            {this.limitLabel}
            <Icon
              class="veui-select-icon"
              name={this.icons[this.expanded ? 'collapse' : 'expand']}
            />
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
            onLocate={this.handleRelocate}
            match-width
          >
            <div
              id={this.dropdownId}
              ref="box"
              class="veui-select-options"
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
              {this.clearable && !this.searchable ? (
                <Option value={null} label={this.realPlaceholder} />
              ) : null}
              {!this.realOptions ? (
                <Option value={null} disabled>
                  <template slot="label">
                    {this.$scopedSlots['no-data']
                      ? this.$scopedSlots['no-data']({
                        searchValue: this.inputValue
                      })
                      : this.$slots['no-data'] || '无搜索结果'}
                  </template>
                </Option>
              ) : null}
              <OptionGroup
                ref="options"
                options={this.realOptions}
                ui={this.realUi}
                scopedSlots={{
                  label: this.$scopedSlots['group-label'] || null,
                  option: this.$scopedSlots.option || option,
                  'option-label':
                    this.$scopedSlots['option-label'] || optionLabel
                }}
              >
                {this.$slots.default}
              </OptionGroup>
              {this.$slots.after}
            </div>
          </Overlay>
        }
      </div>
    )
  }
}
</script>
