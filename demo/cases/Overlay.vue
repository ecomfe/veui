<template>
  <article class="demo-overlay">
    <h1><code>&lt;veui-overlay&gt;</code></h1>

    <div class="row">
      <veui-overlay overlay-class="demo-overlay-box" :open="overlayVisible"
        :options="{attachment: 'top right', targetAttachment: 'top left'}">
        点击按钮展开的
        <veui-button slot="target"
          ui="primary"
          @click="overlayVisible=!overlayVisible">
          <template v-if="overlayVisible">隐藏overlay</template>
          <template v-else>展示overlay</template>
        </veui-button>
      </veui-overlay>
    </div>

    <div class="row">
      <pre>
      {
        attachment: 'top right',
        targetAttachment: 'top left'
      }
      </pre>
      <div class="preview">
        <div class="scroll-content">
          <veui-overlay overlay-class="demo-overlay-box" :open="true"
            :options="{attachment: 'top right', targetAttachment: 'top left'}">
            提示信息
            <div class="target" slot="target"></div>
          </veui-overlay>
        </div>
      </div>
    </div>

    <div class="row">
      <pre>
      {
        attachment: 'bottom left',
        targetAttachment: 'top left'
      }
      </pre>
      <div class="preview">
        <div class="scroll-content">
          <veui-overlay overlay-class="demo-overlay-box" :open="true"
            :options="{attachment: 'bottom left', targetAttachment: 'top left'}">
            提示信息
            <div class="target" slot="target"></div>
          </veui-overlay>
        </div>
      </div>
    </div>

  </article>
</template>
<script>
import Overlay from '../../src/components/Overlay'
import Button from '../../src/components/Button'

export default {
  components: {
    'veui-overlay': Overlay,
    'veui-button': Button
  },
  data () {
    return {
      overlayVisible: false
    }
  },
  methods: {
  }
}
</script>
<style lang="less">
@import "../../src/styles/theme-default/variables";

.demo-overlay-box {
  box-shadow: 1px 1px 6px @veui-shadow-color-normal;
  padding: 10px 20px;
}

.demo-overlay {
  .row {
    background: @veui-gray-color-sup-4;
    align-items: center;
    padding: 10px 15px 10px 5px;
    margin-bottom: 20px;
    .clearfix();
  }

  pre {
    float: left;
    width: 400px;
    margin: 0;
  }

  .preview {
    margin-left: 400px;
    height: 160px;
    overflow: scroll;
    border: 1px solid @veui-gray-color-sup-1;

    .scroll-content {
      width: 2000px;
      height: 2000px;
    }

    .veui-overlay {
      margin-top: 65px;
      margin-left: 100px;
    }
  }

  .target {
    background: @veui-success-color-primary;
    width: 100px;
    height: 80px;
  }
}
</style>
