<template>
<transition :name="$c('loading-bar')">
  <veui-progress
    v-if="loading || leaving"
    :value="value"
    :ui="uiParts.progress"
    :class="$c('loading-bar')"
  />
</transition>
</template>

<script>
import { random } from 'lodash'
import Progress from './Progress'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import '../common/global'

const INTERVAL_RANGE = [200, 500]
const INTERVAL_SLOWDOWN_RATE = 0.25
const ANCHOR_STOPS = [0.4, 0.7, 0.8]
const DEVIATION_RANGE = [-0.05, 0.1]
const REMAINING_STEP_RANGE = [0.01, 0.25]

export default {
  name: 'veui-loading-bar',
  components: {
    'veui-progress': Progress
  },
  mixins: [prefix, ui],
  props: {
    loading: Boolean
  },
  data () {
    return {
      round: 0,
      value: 0,
      leaving: false
    }
  },
  computed: {
    remaining () {
      return 1 - this.value
    }
  },
  watch: {
    loading (val) {
      if (val) {
        this.start()
      } else {
        this.stop(true)
      }
    }
  },
  mounted () {
    if (this.loading) {
      this.start()
    }
  },
  beforeDestroy () {
    this.stop(true)
  },
  methods: {
    step () {
      const { value, round, remaining } = this
      const interval = random(...INTERVAL_RANGE)
      const deviation = random(...DEVIATION_RANGE)
      const remainingStep = random(...REMAINING_STEP_RANGE)

      let targetValue
      const unanchoredRounds = round - ANCHOR_STOPS.length
      if (unanchoredRounds < 0) {
        targetValue = Math.max(ANCHOR_STOPS[round] + deviation, value)
      } else {
        targetValue = Math.min(value + remaining * remainingStep, 1)
      }
      this.value = targetValue

      if (targetValue < 1) {
        this.stepping = setTimeout(() => {
          this.round++
          this.step()
        }, interval + Math.max(0, unanchoredRounds) * interval * INTERVAL_SLOWDOWN_RATE)
      } else {
        this.stop(true)
      }
    },
    start () {
      this.stop()

      this.starting = requestAnimationFrame(() => {
        this.starting = null
        this.step()
      })
    },
    stop (done) {
      if (this.stepping != null) {
        clearTimeout(this.stepping)
        this.stepping = null
      }

      if (this.starting != null) {
        cancelAnimationFrame(this.starting)
        this.starting = null
      }

      this.round = 0
      this.value = done ? 1 : 0

      if (done) {
        // extend the lifecycle for one extra tick
        // so it triggers the transition of setting value to 1
        this.leaving = true

        this.$nextTick(() => {
          this.leaving = false
        })
      }
    }
  }
}
</script>
