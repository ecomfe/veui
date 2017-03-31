<template>
  <article>
    <h1><code>&lt;veui-dialog&gt;</code></h1>
    <p>
      <veui-dialog :mask="true"
        :visible="modalDialogVisible"
        @hide="modalDialogVisible = false"></veui-dialog>
      <veui-button ui="primary"
        @click="modalDialogVisible = !modalDialogVisible">模态</veui-button>

      <veui-dialog :mask="false"
        :visible="nonModalDialogVisible"
        @hide="nonModalDialogVisible = false"></veui-dialog>
      <veui-button ui="primary"
        @click="nonModalDialogVisible = !nonModalDialogVisible">非模态</veui-button>
    </p>
    <p>
      <veui-dialog :draggable="true"
        :mask="false"
        :visible="draggableDialog1Visible"
        :left="500"
        :top="100"
        title="第一个可拖拽的"
        @hide="draggableDialog1Visible = false"></veui-dialog>
      <veui-button ui="primary" @click="draggableDialog1Visible = true">可拖拽</veui-button>

      <veui-dialog :draggable="true"
        :mask="false"
        :visible="draggableDialog2Visible"
        :left="800"
        :top="100"
        title="第二个可拖拽的"
        @hide="draggableDialog2Visible = false"
        ui="reverse"></veui-dialog>
      <veui-button ui="primary" @click="draggableDialog2Visible = true">可拖拽</veui-button>
    </p>
    <p>
      <veui-dialog :visible="operationDialogVisible"
        @hide="operationDialogVisible = false"
        @ok="handleOk"
        @cancel="handleCancel"></veui-dialog>
      <veui-button ui="primary" @click="operationDialogVisible = true">监听按钮操作</veui-button>
    </p>
    <p>
      <veui-dialog :visible="customTextTitleDialogVisible"
        @hide="customTextTitleDialogVisible = false"
        :title="'自定义的文本标题'"></veui-dialog>
      <veui-button ui="primary" @click="customTextTitleDialogVisible = true">自定义文本标题</veui-button>

      <veui-dialog :visible="customIconTitleDialogVisible"
        @hide="customIconTitleDialogVisible = false">
        <template slot="title">自定义ICON标题<icon class="svg" name="circle-o-notch"></icon></template>
      </veui-dialog>
      <veui-button ui="primary" @click="customIconTitleDialogVisible = true">自定义ICON标题</veui-button>
    </p>

    <p>
      <veui-dialog :visible="customContentDialogVisible"
        @hide="customContentDialogVisible = false">
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

      customContentDialogVisible: false
    }
  },
  methods: {
    handleOk () {
      alert('点击了确定按钮')
    },
    handleCancel () {
      alert('点击了删除按钮')
    }
  }
}
</script>

<style lang="less">
.svg {
  width: 20px;
}
</style>
