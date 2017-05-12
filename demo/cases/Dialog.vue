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

    <p>
      <veui-dialog :open="contentAutoHeightDialogVisible"
        @update:open="(value) => contentAutoHeightDialogVisible = value">
        <div>高度自适应</div>
        <div v-html="dynamicContent"></div>
      </veui-dialog>
      <veui-button ui="primary" @click="contentAutoHeightDialogVisible = true">内容区高度自适应</veui-button>
      <veui-dialog :open="veryLongDialogVisible"
        @update:open="(value) => veryLongDialogVisible = value"
        draggable
        :modal="false">
        <div class="RichContent-inner"><span class="RichText CopyrightRichText-richText"><p>北冰洋啊！</p><img style="max-width:100%" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1495178619&di=405a920d0891049815b6c2e67cf288cf&imgtype=jpg&er=1&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201504%2F11%2F20150411H1005_Gr4PZ.jpeg" data-rawwidth="780" class="origin_image zh-lightbox-thumb" width="780"><br><br><p>刚来北京的时候跟朋友吃饭，一个德国小哥非常熟练的用中文念出：我要喝北冰洋。</p><p>我问那是啥啊？啤酒吗？他一脸惊讶你居然不知道北冰洋！这是我最喜欢的饮料耶。</p><p>一开始觉得这不就是芬达？这么接地气的包装5块钱一瓶？？</p><p>然后慢慢的 慢慢的 可以吃一顿烧烤10瓶北冰洋了。。</p>听说还有冰淇淋卖了！想吃！<br><img style="max-width:100%" data-rawheight="655" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494585692441&di=ece6067de053e8e74c4abf1cb0d23d7e&imgtype=0&src=http%3A%2F%2Ff.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F902397dda144ad3464639dc8d1a20cf430ad85a4.jpg" data-rawwidth="545" class="origin_image zh-lightbox-thumb" width="545"><br><img style="max-width:100%" data-rawwidth="640" data-rawheight="852" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494585692441&di=ece6067de053e8e74c4abf1cb0d23d7e&imgtype=0&src=http%3A%2F%2Ff.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F902397dda144ad3464639dc8d1a20cf430ad85a4.jpg" class="origin_image zh-lightbox-thumb" width="640" data-original="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494585636287&di=0911d3a6f878002561337bf8dd2bdf12&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F72f082025aafa40fe871b36bad64034f79f019d4.jpg"></span></div>
      </veui-dialog>
      <veui-button ui="primary" @click="veryLongDialogVisible = true">超级长的内容区域</veui-button>
    </p>
  </article>
</template>
<script>
import Dialog from '@/components/Dialog'
import Button from '@/components/Button'
import 'vue-awesome/icons/circle-o-notch'

export default {
  name: 'dialog-demo',
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

      contentAutoHeightDialogVisible: false,
      veryLongDialogVisible: false,

      dynamicContent: '',

      test: '123'
    }
  },
  created () {
    setInterval(() => {
      this.dynamicContent += `${Date.now()}<br>`
    }, 1000)
  },
  watch: {
    contentAutoHeightDialogVisible (value) {
      if (value) {
        this.dynamicContent = ''
      }
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
