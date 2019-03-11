<template>
<div class="veui-color-value-rgb">
  <div class="veui-color-value">
    <veui-color-value-input
      :value="rgb.r"
      :readonly="readonly"
      :parse="parseFFValue"
      nudge="ff"
      @input="handleRedValueInput"
    />
  </div>

  <div class="veui-color-value">
    <veui-color-value-input
      :value="rgb.g"
      :readonly="readonly"
      :parse="parseFFValue"
      nudge="ff"
      @input="handleGreenValueInput"
    />
  </div>

  <div class="veui-color-value">
    <veui-color-value-input
      :value="rgb.b"
      :readonly="readonly"
      :parse="parseFFValue"
      nudge="ff"
      @input="handleBlueValueInput"
    />
  </div>
</div>
</template>

<script>
import ColorValueInput from './mixins/_ColorValueInput'

export default {
  name: 'color-value-rgb',
  mixins: [ColorValueInput],
  methods: {
    handleRedValueInput (val) {
      this.updateColor({r: val})
    },
    handleGreenValueInput (val) {
      this.updateColor({g: val})
    },
    handleBlueValueInput (val) {
      this.updateColor({b: val})
    }
  }
}
</script>
