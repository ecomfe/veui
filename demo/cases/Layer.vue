<template>
  <article class="demo-layer">
    <h1><code>&lt;veui-layer&gt;</code></h1>

    <div class="row">
      <veui-layer layer-class="demo-layer-box" :layer-visible="layerVisible"
        :options="{attachment: 'top right', targetAttachment: 'top left'}">
        点击按钮展开的
        <veui-button slot="target"
          ui="primary"
          @click="layerVisible=!layerVisible">
          <template v-if="layerVisible">隐藏layer</template>
          <template v-else>展示layer</template>
        </veui-button>
      </veui-layer>
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
          <veui-layer layer-class="demo-layer-box" :layer-visible="true"
            :options="{attachment: 'top right', targetAttachment: 'top left'}">
            提示信息
            <div class="target" slot="target"></div>
          </veui-layer>
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
          <veui-layer layer-class="demo-layer-box" :layer-visible="true"
            :options="{attachment: 'bottom left', targetAttachment: 'top left'}">
            提示信息
            <div class="target" slot="target"></div>
          </veui-layer>
        </div>
      </div>
    </div>

  </article>
</template>
<script>
import Layer from '../../src/components/Layer'
import Button from '../../src/components/Button'

export default {
  components: {
    'veui-layer': Layer,
    'veui-button': Button
  },
  data () {
    return {
      layerVisible: false
    }
  },
  methods: {
  }
}
</script>
<style lang="less">
@import "../../src/styles/theme-default/variables";

.demo-layer-box {
  box-shadow: 1px 1px 6px @veui-shadow-color-normal;
  padding: 10px 20px;
}

.demo-layer {
  .row {
    display: flex;
    background: @veui-gray-color-sup-4;
    align-items: center;
    padding: 10px 15px 10px 5px;
    margin-bottom: 20px;
  }

  pre {
    width: 400px;
    margin: 0;
  }

  .preview {
    flex: 1;
    height: 160px;
    width: 400px;
    overflow: scroll;
    border: 1px solid @veui-gray-color-sup-1;

    .scroll-content {
      width: 2000px;
      height: 2000px;
    }

    .veui-layer {
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
