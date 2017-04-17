<template>
  <article class="demo-dialog">
    <h1><code>&lt;veui-dialog&gt;</code></h1>
     <p>
      <veui-dialog :modal="true"
        overlay-class="test"
        :open="modalDialogVisible"
        @update:open="(value) => modalDialogVisible = value"></veui-dialog>
      <veui-button ui="primary"
        @click="modalDialogVisible = !modalDialogVisible">模态</veui-button>

      <veui-dialog :modal="false"
        :open="nonModalDialogVisible"
        @update:open="(value) => nonModalDialogVisible = value"></veui-dialog>
      <veui-button ui="primary"
        @click="nonModalDialogVisible = !nonModalDialogVisible">非模态</veui-button>
    </p>
    <p>
      <veui-dialog :draggable="true"
        :modal="false"
        :open="draggableDialog1Visible"
        @update:open="(value) => draggableDialog1Visible = value"
        ui="center"
        title="第一个可拖拽的"></veui-dialog>
      <veui-button ui="primary" @click="draggableDialog1Visible = !draggableDialog1Visible">可拖拽</veui-button>

       <veui-dialog :draggable="true"
        :modal="false"
        :open="draggableDialog2Visible"
        title="第二个可拖拽的"
        @update:open="(value) => draggableDialog2Visible = value"
        ui="reverse top"></veui-dialog>
      <veui-button ui="primary" @click="draggableDialog2Visible = !draggableDialog2Visible">可拖拽</veui-button>
    </p>
     <p>
      <veui-dialog :open="operationDialogVisible"
        @update:open="(value) => operationDialogVisible = value"
        @ok="handleOk"
        @cancel="handleCancel"></veui-dialog>
      <veui-button ui="primary" @click="operationDialogVisible = true">监听按钮操作</veui-button>
    </p>
    <p>
      <veui-dialog :open="customTextTitleDialogVisible"
        @update:open="(value) => customTextTitleDialogVisible = value"
        :title="'自定义的文本标题'"></veui-dialog>
      <veui-button ui="primary" @click="customTextTitleDialogVisible = true">自定义文本标题</veui-button>

      <veui-dialog :open="customIconTitleDialogVisible"
        @update:open="(value) => customIconTitleDialogVisible = value">
        <template slot="title">自定义ICON标题<icon class="svg" name="circle-o-notch"></icon></template>
      </veui-dialog>
      <veui-button ui="primary" @click="customIconTitleDialogVisible = true">自定义ICON标题</veui-button>
    </p>

    <p>
      <veui-dialog :open="customContentDialogVisible"
        @update:open="(value) => customContentDialogVisible = value">
        <div>自定义内容区</div>
      </veui-dialog>
      <veui-button ui="primary" @click="customContentDialogVisible = true">自定义内容区</veui-button>
    </p>
  </article>
</template>
<script>
import Dialog from '@/components/Dialog'
import Button from '@/components/Button'
import 'vue-awesome/icons/circle-o-notch'

export default {
  name: 'dialog',
  components: {
    'veui-dialog': Dialog,
    'veui-button': Button
  },
  data () {
    return {
      modalDialogVisible: false,
      nonModalDialogVisible: false,

      draggableDialog1Visible: false,
      draggableDialog2Visible: false,

      operationDialogVisible: false,

      customTextTitleDialogVisible: false,
      customIconTitleDialogVisible: false,

      customContentDialogVisible: false,

      test: '123'
    }
  },
  methods: {
    handleOk () {
      alert('点击了确定按钮')
    },
    handleCancel () {
      alert('点击了取消按钮')
    }
  }
}
</script>

<style lang="less">
.demo-dialog {
  .svg {
    width: 20px;
  }

  .veui-button {
    margin-right: 10px;
  }
}
</style>
