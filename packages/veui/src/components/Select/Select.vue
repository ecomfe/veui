<script>
import Icon from '../Icon'
import Button from '../Button'
import Option from './Option'
import OptionGroup from './OptionGroup'
import Overlay from '../Overlay'
import input from '../../mixins/input'
import keySelect from '../../mixins/key-select'
import ui from '../../mixins/ui'
import overlay from '../../mixins/overlay'
import dropdown from '../../mixins/dropdown'
import warn from '../../utils/warn'
import { walk } from '../../utils/data'
import { cloneDeep } from 'lodash'
import '../../common/uiTypes'

export default {
  name: 'veui-select',
  uiTypes: ['select'],
  mixins: [ui, input, overlay, dropdown, keySelect],
  model: {
    event: 'change'
  },
  components: {
    'veui-icon': Icon,
    'veui-button': Button,
    'veui-option': Option,
    'veui-option-group': OptionGroup,
    'veui-overlay': Overlay
  },
  props: {
    value: null,
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    clearable: Boolean,
    options: Array,
    filter: Function
  },
  data () {
    return {
      localValue: this.value,
      outsideRefs: ['button']
    }
  },
  computed: {
    labelMap () {
      return extractOptions(this.options, {})
    },
    label () {
      if (this.value === null) {
        return this.placeholder
      }
      if (this.options) {
        return this.labelMap[this.value]
      }
      let option = this.$refs.options.find(this.value)
      return option ? option.label : ''
    },
    realOptions () {
      if (typeof this.filter !== 'function') {
        return this.options
      }
      let filtered = cloneDeep(this.options)
      walk(filtered, option => {
        option.hidden = !this.filter(option)
      })
      return filtered
    }
  },
  render () {
    return <div
      class={{
        'veui-select': true,
        'veui-select-empty': this.value === null,
        'veui-select-expanded': this.expanded,
        'veui-input-invalid': this.realInvalid
      }}
      ui={this.ui}>
      <veui-button
        ref="button"
        class="veui-select-button"
        ui={this.ui}
        aria-haspopup="listbox"
        aria-disabled={String(this.realDisabled)}
        aria-readonly={String(this.realReadonly)}
        disabled={this.realDisabled || this.realReadonly}
        onKeydown={this.handleButtonKeydown}
        onClick={this.handleButtonClick}>
        <span class="veui-select-label">
          {
            this.$scopedSlots.label
              ? this.$scopedSlots.label({ label: this.label })
              : this.label
          }
        </span>
        <veui-icon
          class="veui-select-icon"
          name={this.icons[this.expanded ? 'collapse' : 'expand']}/>
      </veui-button>
      {
        this.options && this.expanded || !this.options
          ? <veui-overlay
            v-show={this.expanded}
            target="button"
            open={this.expanded}
            autofocus
            modal
            options={this.realOverlayOptions}
            overlay-class={this.overlayClass}
            onLocate={this.handleRelocate}>
            <div
              ref="box"
              class="veui-select-options"
              {...{
                directives: [{
                  name: 'outside',
                  value: {
                    refs: this.outsideRefs,
                    handler: this.close
                  }
                }]
              }}
              tabindex="-1"
              role="listbox"
              aria-expanded={String(this.expanded)}
              ui={this.ui}
              onKeydown={this.handleKeydown}>
              {this.$slots.before}
              {
                this.clearable
                  ? <veui-option value={null} label={this.placeholder}/>
                  : null
              }
              <veui-option-group
                ref="options"
                options={this.realOptions}
                ui={this.ui}
                scopedSlots={{
                  label: this.$scopedSlots['group-label'] || null,
                  option: this.$scopedSlots.option || null,
                  'option-label': this.$scopedSlots['option-label'] || null
                }}>
                {this.$slots.default}
              </veui-option-group>
              {this.$slots.after}
            </div>
          </veui-overlay>
          : null
      }
    </div>
  },
  methods: {
    handleSelect (value) {
      this.expanded = false
      this.localValue = value
    },
    handleRelocate () {
      this.$refs.options.relocateDeep()
    },
    handleButtonClick () {
      this.expanded = !this.expanded
    },
    handleButtonKeydown (e) {
      if (e.key === 'Up' || e.key === 'ArrowUp' || e.key === 'Down' || e.key === 'ArrowDown') {
        this.expanded = true
        e.stopPropagation()
        e.preventDefault()
      }
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
  }
}

function extractOptions (options, map) {
  walk(options, ({ label, value, options, children }) => {
    if (value != null) {
      if (map[value]) {
        warn(`[veui-select] Duplicate item value [${value}] for select options.`)
      }
      map[value] = label
    }
  }, ['options', 'children'])
  return map
}
</script>
