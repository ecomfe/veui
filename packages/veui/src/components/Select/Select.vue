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
import useSearchable from '../../mixins/searchable'
import { useKeySelect } from '../../mixins/key-select'
import useControllable from '../../mixins/controllable'
import i18n from '../../mixins/i18n'
import { find } from '../../utils/datasource'
import { uniqueId, omit } from 'lodash'
import { contains } from '../../utils/dom'
import { renderSlot } from '../../utils/helper'
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
    useKeySelect({ expandedKey: 'realExpanded' }),
    useSearchable({
      datasourceKey: 'realOptions',
      childrenKey: 'options',
      keywordKey: 'inputValue',
      resultKey: 'filteredOptions'
    }),
    useControllable({
      prop: 'value',
      event: 'change',
      get (val) {
        return this.multiple ? (val != null ? [].concat(val) : []) : val
      }
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
      outsideRefs: ['input'],
      inputValue: '',
      inlineOptions: null
    }
  },
  computed: {
    selected () {
      if (this.realValue == null) {
        if (this.multiple) {
          return []
        }
        return null
      }

      if (this.multiple) {
        return (this.realValue || [])
          .map(val => findOptionByValue(this.realOptions, val))
          .filter(Boolean)
      }

      return findOptionByValue(this.realOptions, this.realValue)
    },
    realPlaceholder () {
      return this.placeholder == null
        ? config.get('select.placeholder')
        : this.placeholder
    },
    inputPlaceholder () {
      if (this.multiple) {
        if ((this.realValue && this.realValue.length > 0) || !this.searchable) {
          return ''
        }
        return this.realPlaceholder
      }

      if (!this.searchable) {
        return !this.realValue ? this.realPlaceholder : ''
      }

      return !this.realValue ? this.realPlaceholder : this.label
    },
    label () {
      return this.selected ? this.selected.label : ''
    },
    labels () {
      if (!Array.isArray(this.selected)) {
        return []
      }
      return this.selected.map(({ label, value }) => label || value)
    },
    searchInputLabel () {
      if (this.inputValue) {
        return this.inputValue
      }
      if (this.realValue === null || this.realExpanded) {
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
        !this.realValue ||
        (Array.isArray(this.realValue) && this.realValue.length === 0)
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
    },
    hasLabelSlot () {
      return this.$scopedSlots.label || this.$slots.label
    }
  },
  watch: {
    realExpanded (val) {
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
      this.commit('value', this.multiple ? [] : null)
      this.inputValue = ''
      this.$emit('clear')
      e.stopPropagation()
      if (this.realExpanded) {
        this.focus()
      }
    },
    handleSelect (val) {
      if (this.searchable) {
        this.$nextTick(() => {
          if (this.multiple) {
            this.inputValue = ''
            this.focus()
          }
        })
      }
      if (!this.multiple) {
        this.commit('expanded', false)
        this.commit('value', val)
        return
      }

      let index = this.realValue.indexOf(val)
      if (index !== -1) {
        // remove
        this.removeSelectedAt(index)
      } else {
        if (!this.max || (this.max && this.realValue.length < this.max)) {
          this.commit('value', this.realValue.concat(val))
        }
      }
    },
    removeSelectedAt (index) {
      let val = [...this.realValue]
      val.splice(index, 1)
      this.commit('value', val)
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

      this.commit('expanded', !this.realExpanded)
      if (this.realExpanded) {
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
          this.commit('expanded', true)
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
            this.commit('expanded', false)
            passive = false
          }
          break
        case 'Tab':
          this.commit('expanded', false)
          break
        case 'Enter':
          if (this.searchable) {
            if (!this.realExpanded) {
              this.$refs.input.focus()
              this.commit('expanded', true)
              break
            }
            let elem = this.getCurrentActiveElement()
            if (elem) {
              elem.click()
            }
            this.$el.focus()
          } else {
            this.commit('expanded', true)
          }
          break
        case 'Backspace': {
          let values = this.realValue
          if (!values.length) {
            break
          }

          if (this.multiple && this.searchable && !this.inputValue) {
            for (let i = this.realValue.length - 1; i >= 0; i--) {
              let option = findOptionByValue(this.realOptions, values[i])
              if (!option.disabled) {
                let result = [...this.realValue]
                result.splice(i, 1)
                this.commit('value', result)
                break
              }
            }
          }
          break
        }
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
      this.commit('expanded', true)
      if (!val && !this.multiple) {
        this.commit('value', '')
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
            checked={!!option.selected}
            disabled={!!option.disabled}
            onClick={e => e.preventDefault()}
          >
            {option.renderLabel
              ? option.renderLabel(omit(option, ['renderLabel']))
              : renderSlot(this, 'option-label', option) ||
                  (this.isFiltered ? optionLabel(option) : option.label)}
          </Checkbox>
        )
      }
      : null

    let selected = Array.isArray(this.selected) ? this.selected : []
    let selectedTags = selected.map(({ label, value, disabled }, index) => (
      <Tag
        key={value}
        data-key={value}
        onRemove={() => this.removeSelectedAt(index)}
        disabled={this.realDisabled || this.realReadonly || disabled}
        removable={!this.disabled && !disabled}
        {...{
          nativeOn: {
            '!mouseup': stopPropagation
          }
        }}
      >
        {renderSlot(this, 'tag', {
          label,
          ...findOptionByValue(this.realOptions, value),
          index
        }) || label}
      </Tag>
    ))

    let renderCustomLabel = props => {
      let customLabel = renderSlot(this, 'label', props)
      if (!customLabel) {
        return null
      }

      return <div class={this.$c('select-custom-label')}>{customLabel}</div>
    }

    let multiBeforeSlot = this.multiple ? (
      this.selected.length > 0 && this.hasLabelSlot && !this.realExpanded ? (
        renderCustomLabel({
          selected: this.selected
        })
      ) : this.selected.length === 0 && !this.searchable ? (
        <span class={this.$c('select-placeholder')} id={this.labelId}>
          {this.realPlaceholder}
        </span>
      ) : (
        selectedTags
      )
    ) : null

    let beforeSlot = !this.searchable ? (
      <span
        class={{
          [this.$c('select-label')]: true,
          [this.$c('select-placeholder')]: this.realValue === null
        }}
        id={this.labelId}
      >
        {renderCustomLabel(this.selected || { selected: false }) || this.label}
      </span>
    ) : null

    let renderGroup = (options, children, key) => {
      return (
        <OptionGroup
          key={key}
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
          [this.$c('select-expanded')]: this.realExpanded,
          [this.$c('select-searchable')]: this.searchable,
          [this.$c('select-multiple')]: this.multiple,
          [this.$c('select-wrap')]:
            this.multiple &&
            !this.isEmpty &&
            (!this.hasLabelSlot || this.realExpanded),
          [this.$c('readonly')]: this.realReadonly,
          [this.$c('disabled')]: this.realDisabled,
          [this.$c('input-invalid')]: this.realInvalid
        }}
        ui={this.realUi}
        role="listbox"
        aria-owns={this.dropdownId}
        aria-readonly={this.realReadonly}
        aria-expanded={this.realExpanded}
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
          autocomplete="off"
          composition
        >
          {!this.multiple && this.selected != null && this.hasLabelSlot ? (
            <template slot="placeholder">
              {renderCustomLabel(this.selected || { selected: false }) ||
                this.label}
            </template>
          ) : null}
          <template slot="before">
            {this.multiple ? multiBeforeSlot : beforeSlot}
          </template>
          <template slot="after">
            {this.limitLabel ? (
              <span class={this.$c('select-count')}>{this.limitLabel}</span>
            ) : null}
            <div class={this.$c('select-icon')}>
              {this.clearable &&
              (this.multiple ? this.realValue.length > 0 : !!this.realValue) ? (
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
                name={this.icons[this.realExpanded ? 'collapse' : 'expand']}
              />
            </div>
          </template>
        </Input>
        {
          <Overlay
            v-show={this.realExpanded}
            target="input"
            open={this.realExpanded}
            autofocus={!this.searchable}
            modal
            overlay-class={this.overlayClass}
            local={this.realOverlayOptions.local}
            options={this.realOverlayOptions}
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
              {!this.options
                ? renderGroup(null, this.$slots.default, 'data')
                : null}
              {renderGroup(
                this.isFiltered ? this.filteredOptions : this.realOptions,
                this.isFiltered && !this.filteredOptions.length ? (
                  <div class={this.$c('select-options-no-data')}>
                    {renderSlot(this, 'no-data', {
                      keyword: this.inputValue
                    }) || this.t('noData')}
                  </div>
                ) : null,
                'render'
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
