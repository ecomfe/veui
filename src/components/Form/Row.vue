<template>
  <div class="veui-form-row">
    <label v-if="label" class="veui-form-key" :class="{'veui-form-key-for': !!labelFor}" @click="findInputComponent">{{ label }}：</label>
    <label v-else class="veui-form-key-empty"></label>
    <slot></slot>
    <span v-if="tip" class="veui-form-row-tip">{{ tip }}</span>
  </div>
</template>

<script>
export default {
  name: 'veui-form-row',
  uiTypes: ['formRow', 'formContainer'],
  props: {
    label: String,
    tip: String,
    labelFor: String
  },
  data () {
    return {
      showError: false,
      errMsg: ''
    }
  },
  methods: {
    findInputComponent () {
      let labelFor = this.labelFor
      if (this.label && labelFor) {
        let target = this.$vnode.context.$refs[labelFor]
        target.$emit('labelclick')
      }
    }
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";

.veui-form-row {
  margin-bottom: 30px;

  &:last-of-type {
    margin-bottom: 0;
  }

  > [class*="veui"]:not([class*="veui-form-key"]) {
    vertical-align: top;
  }

  > [class*="veui"]:not([class*="veui-form-key"]),
  > .veui-span {
    display: inline-block;

    & + [class*="veui"],
    & + .veui-span {
      margin-left: 10px;
    }
  }

  .clearfix();
}

.veui-form-key {
  display: inline-block;
  height: @veui-height-normal;
  width: 120px;
  line-height: @veui-height-normal;
}

.veui-form-key-for {
  cursor: pointer;
}

.veui-form-row-tip {
  display: inline-block;
  line-height: @veui-height-normal;
  margin-left: 10px;
  color: @veui-text-color-weak;
}

.veui-form-key-empty {
  display: inline-block;
  height: @veui-height-normal;
  width: 120px;
}

</style>
