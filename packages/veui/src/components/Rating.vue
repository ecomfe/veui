<script>
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import i18n from '../mixins/i18n'
import { focusIn } from '../utils/dom'
import Icon from './Icon'
import Tooltip from './Tooltip'
import useControllable from '../mixins/controllable'
import { uniqueId } from 'lodash'
import '../common/global'

export default {
  name: 'veui-rating',
  mixins: [
    prefix,
    ui,
    input,
    i18n,
    useControllable({
      prop: 'value',
      event: 'change'
    })
  ],
  model: {
    event: 'change'
  },
  props: {
    max: {
      type: Number,
      default: 5
    },
    value: Number,
    labels: [Object, Function],
    clearable: Boolean,
    allowHalf: Boolean,
    labelPosition: {
      type: String,
      validator (val) {
        return ['inline', 'popup'].indexOf(val) !== -1
      }
    }
  },
  data () {
    return {
      hoverValue: null,
      tooltipTarget: null
    }
  },
  computed: {
    ariaLabel () {
      const { value, max } = this
      return this.t('ratingLabel', { value, max })
    },
    localName () {
      return this.realName || uniqueId('veui-rating-')
    },
    label () {
      if (!this.labels) {
        return null
      }

      if (typeof this.labels === 'function') {
        return this.labels(this.activeValue)
      }

      return this.labels[this.activeValue]
    },
    activeValue () {
      return this.hoverValue == null ? this.realValue : this.hoverValue
    }
  },
  methods: {
    getAriaLabel (value) {
      return this.t('ratingLabel', { value, max: this.max })
    },
    handleChange (value) {
      this.$nextTick(() => {
        const val = this.realValue

        const index = this.allowHalf ? val * 2 - 1 : val - 1

        const checked = this.$el.querySelector(':checked')
        if (checked.dataset.value === value) {
          return
        }

        // DOM state may be out of sync with Vue state
        // so we need to manually sync them
        checked.checked = false

        const inputs = this.$el.querySelectorAll('input')
        inputs[index].checked = true
        inputs[index].focus()
      })

      this.commit('value', value)
    },
    handleClick (value) {
      if (!this.clearable) {
        return
      }
      this.commit('value', value === this.realValue ? null : value)
      this.hoverValue = null
    },
    handleMouseEnter (value) {
      if (this.realReadonly) {
        return
      }
      this.hoverValue = value

      if (this.labelPosition === 'popup') {
        const index = Math.floor(value - 0.5)
        this.tooltipTarget = this.$refs[`symbol-${index}`]
      }
    },
    handleMouseLeave () {
      if (this.realReadonly) {
        return
      }
      this.hoverValue = null
    },
    isSelected (index) {
      if (this.hoverValue != null) {
        return index <= this.hoverValue
      }

      return index <= this.realValue
    },
    focus () {
      focusIn(this.$el)
    },
    renderPart (value, isHalf) {
      const val = this.allowHalf && isHalf ? value - 0.5 : value

      return [
        <input
          id={`${this.localName}-${val}`}
          type="radio"
          name={this.localName}
          class={this.$c('rating-input')}
          aria-label={this.getAriaLabel(val)}
          checked={val === this.realValue}
          disabled={this.realReadonly}
          data-value={val}
          onChange={() => {
            this.handleChange(val)
          }}
          onClick={() => {
            this.handleClick(val)
          }}
        />,
        <label
          for={`${this.localName}-${val}`}
          class={{
            [this.$c('rating-symbol-part')]: true,
            [this.$c('rating-symbol-part-half')]: isHalf,
            [this.$c('rating-symbol-part-selected')]: this.isSelected(val)
          }}
          onMouseenter={() => {
            this.handleMouseEnter(val)
          }}
        >
          <div class={this.$c('rating-symbol-wrapper')}>
            {this.$scopedSlots.symbol ? (
              this.$scopedSlots.symbol({ value: val })
            ) : (
              <Icon name={this.icons.symbol} />
            )}
          </div>
        </label>
      ]
    }
  },
  render () {
    const labelContent =
      (this.$scopedSlots.label
        ? this.$scopedSlots.label({ value: this.activeValue })
        : this.label) || null

    return (
      <div
        class={{
          [this.$c('rating')]: true,
          [this.$c('readonly')]: this.realReadonly
        }}
        ui="realUi"
        role="img"
        aria-label={this.ariaLabel}
        aria-readonly={this.realReadonly}
        aria-valuemax={this.max}
        aria-valuemin={0}
        aria-valuenow={this.realValue}
      >
        <div
          class={this.$c('rating-symbols')}
          onMouseleave={this.handleMouseLeave}
        >
          {Array.from({ length: this.max }).map((_, index) => {
            const value = index + 1
            return (
              <div
                key={value}
                ref={`symbol-${index}`}
                class={{
                  [this.$c('rating-symbol')]: true,
                  [this.$c('rating-symbol-allow-half')]: this.allowHalf
                }}
              >
                {this.renderPart(value, this.allowHalf)}
                {this.allowHalf ? this.renderPart(value, false) : null}
              </div>
            )
          })}
        </div>
        {labelContent ? (
          this.labelPosition === 'popup' ? (
            <Tooltip
              ui={this.uiParts.tooltip}
              open={!!this.hoverValue}
              target={this.tooltipTarget}
            >
              {labelContent}
            </Tooltip>
          ) : (
            <div class={this.$c('rating-label')}>{labelContent}</div>
          )
        ) : null}
      </div>
    )
  }
}
</script>
