<template>
<div :class="`veui-steps-step-${index}`">
  <div class="veui-steps-step-index">
    <slot name="index" v-bind="step" :index="index">
      <template v-if="index < current">
        <slot name="done" v-bind="step" :index="index"><veui-icon name="check"></veui-icon></slot>
      </template>
      <template v-else>
        <slot name="number" v-bind="step" :index="index">{{ index + 1 }}</slot>
      </template>
    </slot>
  </div>
  <div class="veui-steps-step-content" v-if="step.label">
    <h3 class="veui-steps-step-label">
      <slot name="label" v-bind="step" :index="index">{{ step.label }}</slot>
    </h3>
    <p v-if="step.desc" class="veui-steps-step-desc"><slot name="desc" v-bind="step" :index="index">{{ step.desc }}</slot></p>
  </div>
</div>
</template>

<script>
import Icon from './Icon'

export default {
  name: 'veui-step',
  components: {
    'veui-icon': Icon
  },
  props: {
    step: Object,
    index: Number,
    current: Number
  }
}
</script>
