<template>
<div
  class="veui-steps"
  :ui="realUi"
  role="list"
>
  <veui-link
    v-for="(step, index) in steps"
    :key="index"
    class="veui-steps-step"
    :class="getStepClass(index, steps)"
    :to="step.to"
    fallback="div"
    role="listitem"
    :aria-current="index === current ? 'step' : null"
    :aria-label="t('step', { index: index + 1 })"
    :aria-posinset="String(index + 1)"
    :aria-setsize="String(steps.length)"
    tabindex="0"
    @click="$emit('click', index, $event)"
  >
    <slot
      v-bind="step"
      :index="index"
    >
      <div class="veui-steps-step-index">
        <slot
          name="index"
          v-bind="step"
          :index="index"
        >
          <veui-icon
            v-if="index < current && step.status !== 'error'"
            :name="icons.success"
          />
          <veui-icon
            v-else-if="step.status === 'error'"
            :name="icons.error"
          />
          <template v-else>
            {{ index + 1 }}
          </template>
        </slot>
      </div>
      <div
        v-if="step.label"
        class="veui-steps-step-content"
      >
        <h3 class="veui-steps-step-label">
          <slot
            name="label"
            v-bind="step"
            :index="index"
          >
            {{ step.label }}
          </slot>
        </h3>
        <p
          v-if="step.desc"
          class="veui-steps-step-desc"
        >
          <slot
            name="desc"
            v-bind="step"
            :index="index"
          >
            {{ step.desc }}
          </slot>
        </p>
      </div>
    </slot>
  </veui-link>
</div>
</template>

<script>
import Icon from './Icon'
import Link from './Link'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'
import { includes } from 'lodash'

export default {
  name: 'veui-steps',
  components: {
    'veui-icon': Icon,
    'veui-link': Link
  },
  mixins: [ui, i18n],
  props: {
    steps: {
      type: Array,
      default () {
        return []
      }
    },
    current: {
      type: Number,
      default: 0
    },
    labelPlace: {
      type: String,
      validator (val) {
        return includes(['horizontal', 'vertical'], val)
      },
      default: 'horizontal'
    }
  },
  methods: {
    getStepClass (index, steps) {
      let step = steps[index]
      let nextStep = index + 1 < steps.length ? steps[index + 1] : null
      let current = this.current

      let currentStatus = {
        'veui-steps-incomplete': index > current,
        'veui-steps-completed': index < current,
        'veui-steps-current': index === current,
        'veui-steps-error': index !== current && step.status === 'error',
        'veui-steps-current-error':
          index === current && step.status === 'error',
        'veui-steps-label-vertical': this.labelPlace === 'vertical'
      }

      let nextStatus = nextStep
        ? {
          'veui-steps-step-next-error': nextStep.status === 'error',
          'veui-steps-step-next-incomplete': index >= current,
          'veui-steps-step-next-current':
              index + 1 === current && nextStep.status !== 'error',
          'veui-steps-step-next-current-error':
              index + 1 === current && nextStep.status === 'error'
        }
        : {}

      return { ...currentStatus, ...nextStatus }
    }
  }
}
</script>
