<template>
<div :class="$c('steps')" :ui="realUi" role="list">
  <template v-for="(step, index) in steps">
    <div
      v-if="index !== 0"
      :key="`connector-${index}`"
      :class="[
        $c('steps-step-connector'),
        $c(`steps-step-connector-${stepStatus[index]}`)
      ]"
    />
    <veui-link
      :key="`step-${index}`"
      :class="[
        $c('steps-step'),
        $c(`steps-step-${stepStatus[index]}`),
        index < steps.length - 1
          ? $c(`steps-step-next-${stepStatus[index + 1]}`)
          : '',
        { [$c('steps-step-activatable')]: !stateless && !!step.to }
      ]"
      :to="stateless ? null : step.to"
      fallback="div"
      role="listitem"
      :aria-current="index === current ? 'step' : null"
      @click="$emit('click', index, $event)"
    >
      <slot v-bind="step" :index="index">
        <div :class="$c('steps-step-index-container')">
          <div :class="$c('steps-step-index')">
            <slot name="index" v-bind="step" :index="index">
              <veui-icon
                v-if="
                  !stateless && index < current && step.status !== 'error'
                "
                :name="icons.success"
              />
              <veui-icon
                v-else-if="!stateless && step.status === 'error'"
                :name="icons.error"
              />
              <template v-else>{{ index + 1 }}</template>
            </slot>
          </div>
          <div
            v-if="index < stepStatus.length - 1"
            :class="[
              $c('steps-step-connector-placeholder'),
              $c(`steps-step-connector-placeholder-${stepStatus[index + 1]}`)
            ]"
          />
        </div>
        <div v-if="step.label" :class="$c('steps-step-content')">
          <div :class="$c('steps-step-label')">
            <slot name="label" v-bind="step" :index="index">
              {{ step.label }}
            </slot>
          </div>
          <div v-if="step.desc" :class="$c('steps-step-desc')">
            <slot name="desc" v-bind="step" :index="index">
              {{ step.desc }}
            </slot>
          </div>
        </div>
      </slot>
    </veui-link>
  </template>
</div>
</template>

<script>
import Icon from './Icon'
import Link from './Link'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'
import '../common/global'

export default {
  name: 'veui-steps',
  components: {
    'veui-icon': Icon,
    'veui-link': Link
  },
  mixins: [prefix, ui, i18n],
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
    stateless: Boolean
  },
  computed: {
    stepStatus () {
      if (this.stateless) {
        return Array(this.steps.length).fill('stateless')
      }

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
