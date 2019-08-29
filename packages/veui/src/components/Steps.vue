<template>
<div
  class="veui-steps"
  :ui="realUi"
  role="list"
>
  <template v-for="(step, index) in steps">
    <div
      v-if="index !== 0"
      :key="'connector-' + index"
      class="veui-steps-step-connector"
      :class="'veui-steps-step-connector-' + stepStatus[index]"
    />
    <veui-link
      :key="'step-' + index"
      class="veui-steps-step"
      :class="[
        'veui-steps-step-' + stepStatus[index],
        index < steps.length - 1
          ? 'veui-steps-step-next-' + stepStatus[index + 1]
          : ''
      ]"
      :to="step.to"
      fallback="div"
      role="listitem"
      :aria-current="index === current ? 'step' : null"
      @click="$emit('click', index, $event)"
    >
      <slot
        v-bind="step"
        :index="index"
      >
        <div class="veui-steps-step-index-container">
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
            v-if="index < stepStatus.length - 1"
            class="veui-steps-step-connector-placeholder"
            :class="
              'veui-steps-step-connector-placeholder-' + stepStatus[index + 1]
            "
          />
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
  </template>
</div>
</template>

<script>
import Icon from './Icon'
import Link from './Link'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'

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
    }
  },
  computed: {
    stepStatus () {
      return this.steps.reduce((acc, step, i) => {
        let status =
          step.status === 'error'
            ? i === this.current
              ? 'error-current'
              : 'error'
            : i === this.current
              ? 'current'
              : i < this.current
                ? 'completed'
                : 'incomplete'

        acc.push(status)
        return acc
      }, [])
    }
  }
}
</script>
