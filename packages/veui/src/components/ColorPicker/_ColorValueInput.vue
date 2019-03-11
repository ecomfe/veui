
<script>
import Input from '../Input'
import {nudge} from '../../directives'
import {identity} from 'lodash'

export default {
  name: 'color-value-input',
  components: {
    'veui-input': Input
  },
  directives: {
    nudge
  },
  props: {
    value: {
      type: [Number, String],
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    format: {
      type: Function,
      default: identity
    },
    parse: {
      type: Function,
      default: identity
    },
    nudge: {
      type: String
    }
  },
  data () {
    return {
      localValue: null
    }
  },
  computed: {
    formattedValue () {
      return this.format(this.value)
    },
    directives () {
      if (!this.nudge) {
        return []
      }
      return [
        {
          name: 'nudge',
          value: {
            update: this.hanleNudgeUpdate
          },
          modifiers: {}
        }
      ]
    }
  },
  watch: {
    value: {
      handler (val) {
        this.localValue = this.format(val)
      },
      immediate: true
    }
  },
  methods: {
    hanleNudgeUpdate (increase) {
      if (Math.abs(increase) < 1) {
        return
      }

      switch (this.nudge) {
        case 'hue':
        case 'ff':
          break

        case 'percentage':
          increase /= 100
          break

        default:
          return
      }

      this.handleValueInput(this.format(this.value + increase))
    },

    handleValueInput (val) {
      this.localValue = val
      let realValue
      try {
        realValue = this.parse(val)
      } catch (err) {
        return
      }
      this.$emit('input', realValue)
    },
    handleValueBlur () {
      if (this.formattedValue !== this.localValue) {
        this.localValue = this.formattedValue
      }
    }
  },
  render () {
    return (<veui-input
      type="text"
      value={this.localValue}
      readonly={this.readonly}
      onInput={this.handleValueInput}
      onBlur={this.handleValueBlur}
      {...{ directives: this.directives }}
    />)
  }
}
</script>
