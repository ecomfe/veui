<script>
import Icon from '../Icon'
import Input from '../Input'
import Option from './Option'
import OptionGroup from './OptionGroup'
import Overlay from '../Overlay'
import config from '../../managers/config'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import dropdown from '../../mixins/dropdown'
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
  mixins: [ui, input, dropdown, keySelect],
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
    options: Array
  },
  data () {
    return {
      labelId: uniqueId('veui-select-label-'),
      localValue: this.value,
      outsideRefs: ['input'],
      initOptionLabel: '',
      inputValue: ''
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
    label () {
      if (this.localValue == null) {
        return this.realPlaceholder
      }
      if (this.options) {
        return this.labelMap[this.localValue]
      }
      if (this.$refs.options) {
        return this.findOptionsLabel()
      }
      return ''
    },
    searchInputLabel () {
      if (this.localValue === null) {
        return ''
      }
      return this.label
    },
    realOptions () {
      if (this.searchable && this.inputValue) {
        let matched = this.filterFlattedDatasource(
          this.options,
          this.inputValue
        )
        if (!matched) {
          return [
            {
              label: '无搜索结果',
              disabled: true
            }
          ]
        }
        return this.flattedDatasource
      }
      return this.options
    },
    inputClass () {
      if (this.searchable) {
        return 'veui-select-search-input'
      }
      return 'veui-select-input'
    },
    focusClass () {
      return this.searchable ? config.get('keySelect.focusClass') : null
    }
  },
  watch: {
    value (val) {
      this.localValue = val
    },
    localValue (val) {
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
      this.initOptionLabel = this.findOptionsLabel()
    }
  },
  methods: {
    findOptionsLabel () {
      let option = this.$refs.options.find(this.localValue)
      return option ? option.label : ''
    },
    handleSelect (value) {
      this.expanded = false
      this.localValue = value
    },
    handleRelocate () {
      this.$refs.options.relocateDeep()
    },
    handleInputClick (e) {
      if (this.realReadonly || this.realDisabled) {
        return
      }
      if (!this.searchable) {
        this.expanded = !this.expanded
        e.stopPropagation()
        e.preventDefault()
      }
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
        case 'Enter':
          if (this.searchable) {
            let elem = this.getCurrentActiveElement()
            if (elem) {
              elem.click()
            }
            passive = false
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
      this.expanded = !!val
      if (!val) {
        this.localValue = ''
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
        {this.searchable ? (
          <Input
            ref="input"
            class={this.inputClass}
            placeholder={this.realPlaceholder}
            value={this.searchInputLabel}
            disabled={this.realDisabled || this.realReadonly}
            onKeydown={this.handleInputKeydown}
            onClick={this.handleInputClick}
            onInput={this.handleTriggerInput}
            clearable
          >
            <template slot="append">
              <Icon
                class="veui-select-icon"
                name={this.icons[this.expanded ? 'collapse' : 'expand']}
              />
            </template>
          </Input>
        ) : (
          <Input
            ref="input"
            class={this.inputClass}
            disabled={this.realDisabled || this.realReadonly}
            /**
             * register event on capture stage
             * to prevent input from setting fouse state
             */
            {...{
              nativeOn: {
                '!click': this.handleInputClick,
                '!keydown': this.handleInputKeydown
              }
            }}
          >
            <template slot="prepend">
              <span
                class={{
                  'veui-select-label': true,
                  'veui-select-placeholder': this.localValue === null
                }}
                id={this.labelId}
              >
                {this.$scopedSlots.label
                  ? this.$scopedSlots.label(
                    this.selectedOption || { selected: false }
                  )
                  : this.label || this.initOptionLabel}
              </span>
            </template>
            <template slot="append">
              <Icon
                class="veui-select-icon"
                name={this.icons[this.expanded ? 'collapse' : 'expand']}
              />
            </template>
          </Input>
        )}
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
              <OptionGroup
                ref="options"
                options={this.realOptions}
                ui={this.realUi}
                scopedSlots={{
                  label: this.$scopedSlots['group-label'] || null,
                  option: this.$scopedSlots.option || null,
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
