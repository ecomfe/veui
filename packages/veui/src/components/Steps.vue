<template>
<div
  class="veui-steps"
  :ui="realUi"
  role="list">
  <veui-link
    v-for="(step, index) in steps"
    class="veui-steps-step"
    :class="{
      'veui-steps-current': index === current
    }"
    :to="step.to"
    :key="index"
    fallback="div"
    role="listitem"
    :aria-current="index === current ? 'step' : null"
    :aria-label="t('step', { index: index + 1 })"
    :aria-posinset="String(index + 1)"
    :aria-setsize="String(steps.length)"
    @click="$emit('click', index, $event)">
    <slot v-bind="step" :index="index">
      <div class="veui-steps-step-index">
        <slot name="index" v-bind="step" :index="index">
          <veui-icon v-if="index < current" :name="icons.success"/>
          <template v-else>{{ index + 1 }}</template>
        </slot>
      </div>
      <div class="veui-steps-step-content" v-if="step.label">
        <h3 class="veui-steps-step-label">
          <slot name="label" v-bind="step" :index="index">{{ step.label }}</slot>
        </h3>
        <p v-if="step.desc" class="veui-steps-step-desc">
          <slot name="desc" v-bind="step" :index="index">{{ step.desc }}</slot>
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

export default {
  name: 'veui-steps',
  mixins: [ui, i18n],
  components: {
    'veui-icon': Icon,
    'veui-link': Link
  },
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
  }
}
</script>
