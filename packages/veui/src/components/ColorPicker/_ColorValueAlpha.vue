<template>
<div class="veui-color-value-alpha">
  <div class="veui-color-value">
    <veui-color-value-input
      :value="alpha"
      :readonly="readonly"
      :format="formatPercentage"
      :parse="parsePercentage"
      nudge="percentage"
      @input="updateAlphaValue"
    />
  </div>
</div>
</template>

<script>
import ColorValueInput from './mixins/_ColorValueInput'

export default {
  name: 'color-value-alpha',
  mixins: [ColorValueInput],
  props: {
    alpha: Number
  }
}
</script>
