<template>
<div class="veui-color-value-alpha">
  <div class="veui-color-value">
    <veui-color-value-input
      :value="alpha"
      :readonly="readonly"
      :format="formatPercentage"
      :parse="parsePercentage"
      nudge="percentage"
      @input="handleValueInput"
    />
  </div>
</div>
</template>

<script>
import ColorValueInput from './mixins/_ColorValueInput'

export default {
  name: 'color-value-alpha',
  mixins: [ColorValueInput],
  computed: {
    alpha () {
      return this.hsl.a === undefined ? 1 : this.hsl.a
    }
  },
  methods: {
    handleValueInput (val) {
      this.updateColor({a: val})
    }
  }
}
</script>
