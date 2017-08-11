<template>
<div class="veui-steps">
  <ol v-if="steps.length">
    <li class="veui-steps-step" :class="{
        'veui-steps-current': index === current
      }" v-for="(step, index) in steps" :key="index" @click="$emit('click', index)">
      <slot v-bind="step" :index="index">
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
          <h3 class="veui-steps-step-label"><slot name="label">{{ step.label }}</slot></h3>
          <p v-if="step.desc" class="veui-steps-step-desc"><slot name="desc">{{ step.desc }}</slot></p>
        </div>
      </slot>
    </li>
  </ol>
</div>
</template>

<script>
import Icon from './Icon'

export default {
  name: 'veui-steps',
  components: {
    'veui-icon': Icon
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
