<script>
import Icon from '../Icon'
import Input from '../Input'
import Button from '../Button'
import Tag from '../Tag'
import OptionGroup from './OptionGroup'
import Overlay from '../Overlay'
import Checkbox from '../Checkbox'
import config from '../../managers/config'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import dropdown from '../../mixins/dropdown'
import searchable from '../../mixins/searchable'
import keySelect from '../../mixins/key-select'
import i18n from '../../mixins/i18n'
import { find } from '../../utils/datasource'
import { uniqueId, isEqual, omit } from 'lodash'
import { contains } from '../../utils/dom'
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
  mixins: [
    prefix,
    ui,
    input,
    dropdown,
    keySelect,
    searchable({
      datasourceKey: 'realOptions',
      childrenKey: 'options',
      keywordKey: 'inputValue',
      resultKey: 'filteredOptions'
    }),
    i18n
  ],
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
        return !this.localValue ? this.realPlaceholder : ''
      }

      return !this.localValue ? this.realPlaceholder : this.label
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
        return option ? option.label : val
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
      return this.options ? this.options.map(normalizeItem) : this.inlineOptions
    },
    isFiltered () {
      return !!(this.searchable && this.inputValue)
    },
    isEmpty () {
      return (
        !this.localValue ||
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
    focusSelector () {
      return this.searchable ? config.get('keyselect.focusSelector') : null
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
    updateValue (val) {
      this.localValue = val
      this.$emit('change', val)
    },
    clear (e) {
      this.updateValue(this.multiple ? [] : null)
      this.inputValue = ''
      this.$emit('clear')
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
          this.updateValue(value)
        }
        return
      }

      let index = this.localValue.indexOf(value)
      if (index !== -1) {
        // remove
        this.removeSelectedAt(index)
      } else {
        if (!this.max || (this.max && this.localValue.length < this.max)) {
          this.updateValue(this.localValue.concat(value))
        }
      }
    },
    removeSelectedAt (index) {
      this.localValue.splice(index, 1)
      this.updateValue([...this.localValue])
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
      e.preventDefault()
      e.stopPropagation()
    },
    handleInputBlur (e) {
      if (this.multiple && contains(this.$refs.box, e.relatedTarget, true)) {
        e.target.focus()
      }
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
            this.$refs.input.focus()
            this.$nextTick(() => {
              this.handleKeydown(e)
            })
          }
          break
        case 'Esc':
        case 'Escape':
          if (this.searchable) {
            this.$el.focus()
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
              this.$refs.input.focus()
              this.expanded = true
              break
            }
            let elem = this.getCurrentActiveElement()
            if (elem) {
              elem.click()
            }
            this.$el.focus()
          } else {
            this.expanded = true
          }
          break
        case 'Backspace':
          if (this.multiple && this.searchable && !this.inputValue) {
            this.localValue.pop()
            this.updateValue([...this.localValue])
          }
          break
        default:
          break
      }
      if (!passive) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    handleTriggerInput (val) {
      this.$emit('input', val)
      this.inputValue = val
      this.expanded = true
      if (!val && !this.multiple) {
        this.updateValue('')
      }
      if (this.multiple && this.searchable) {
        this.nativeInput.style.width = ''
        this.nativeInput.style.width = `${this.nativeInput.scrollWidth}px`
      }
    },
    handleAfteropen () {
      this.$emit('afteropen')
    },
    focus () {
      if (!this.searchable) {
        this.$el.focus()
        return
      }
      this.$refs.input.focus()
    }
  },
  render () {
    let optionLabel = this.isFiltered
      ? ({ matches }) => {
        if (!matches) {
          return null
        }
        return matches.map(({ parts }, idx) => {
          let item = parts.map(({ text, matched }, index) => {
            return matched ? (
              <mark class={this.$c('option-matched')}>{text}</mark>
            ) : (
              <span>{text}</span>
            )
          })
          if (idx < matches.length - 1) {
            item.push(<span class={this.$c('option-separator')}> &gt; </span>)
          }
          return item
        })
      }
      : null

    let option = this.multiple
      ? option => {
        return (
          <Checkbox
            tabindex="-1"
            ui={this.uiParts.checkbox}
            checked={option.selected}
            onClick={e => e.preventDefault()}
          >
            {option.renderLabel
              ? option.renderLabel(omit(option, ['renderLabel']))
              : this.$scopedSlots['option-label']
                ? this.$scopedSlots['option-label'](option)
                : this.isFiltered
                  ? optionLabel(option)
                  : option.label}
          </Checkbox>
        )
      }
      : null

    let selectedTags = (this.labels || []).map((label, index) => (
      <Tag
        key={label}
        ui={this.uiParts.tag}
        onClose={() => this.removeSelectedAt(index)}
        disabled={this.realDisabled || this.realReadonly}
        closable
      >
        {this.$scopedSlots.tag
          ? this.$scopedSlots.tag({
            label,
            ...findOptionByValue(this.realOptions, this.localValue[index]),
            index
          })
          : label}
      </Tag>
    ))

    let multiPrependSlot = this.searchable ? (
      selectedTags
    ) : this.labels.length === 0 ? (
      <span class={this.$c('select-placeholder')} id={this.labelId}>
        {this.realPlaceholder}
      </span>
    ) : (
      selectedTags
    )

    let prependSlot = !this.searchable ? (
      <span
        class={{
          [this.$c('select-label')]: true,
          [this.$c('select-placeholder')]: this.localValue === null
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
          [this.$c('select')]: true,
          [this.$c('select-empty')]: this.isEmpty,
          [this.$c('select-expanded')]: this.expanded,
          [this.$c('select-searchable')]: this.searchable,
          [this.$c('select-multiple')]: this.multiple,
          [this.$c('readonly')]: this.realReadonly,
          [this.$c('disabled')]: this.realDisabled,
          [this.$c('input-invalid')]: this.realInvalid
        }}
        ui={this.realUi}
        role="listbox"
        aria-owns={this.dropdownId}
        aria-readonly={this.realReadonly}
        aria-expanded={this.expanded}
        aria-disabled={this.realDisabled}
        aria-labelledby={this.labelId}
        aria-haspopup="listbox"
        tabindex={
          (this.searchable && this.multiple) || this.realDisabled ? null : '0'
        }
        onKeydown={this.handleTriggerKeydown}
      >
        <Input
          ref="input"
          class={this.$c('select-trigger')}
          disabled={this.realDisabled}
          readonly={this.realReadonly}
          placeholder={this.inputPlaceholder}
          value={this.inputValue}
          onMouseup={this.handleInputMouseup}
          onBlur={this.handleInputBlur}
          onInput={this.handleTriggerInput}
          composition
        >
          <template slot="prepend">
            {this.multiple ? multiPrependSlot : prependSlot}
          </template>
          <template slot="append">
            {this.limitLabel ? (
              <span class={this.$c('select-count')}>{this.limitLabel}</span>
            ) : null}
            <div class={this.$c('select-icon')}>
              {this.clearable &&
              (this.multiple
                ? this.localValue.length > 0
                : !!this.localValue) ? (
                  <Button
                    class={this.$c('select-clear')}
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
                class={this.$c('select-toggle')}
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
                [this.$c('select-options')]: true,
                [this.$c('select-options-multiple')]: this.multiple
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
                this.isFiltered ? this.filteredOptions : this.realOptions,
                this.isFiltered && !this.filteredOptions.length ? (
                  <div class={this.$c('select-options-no-data')}>
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

function normalizeItem (item) {
  let options = (item.options || []).map(normalizeItem)
  let isGroup = options.length > 0
  return {
    ...item,
    ...(isGroup ? { options } : {})
  }
}
</script>
