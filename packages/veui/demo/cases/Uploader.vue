<template>
  <article class="veui-uploader-demo">
    <h1><code>&lt;veui-uploader&gt;</code></h1>
    <h2>图片上传模式 uploaderType="image"，上传进度以文字百分比显示uploadingContent="progressPercent"</h2>
    <veui-uploader uploaderType="image"
      name="file"
      action="/upload"
      v-model="files"
      :max-count="3"
      :max-size="10"
      extention-types="jpg,jpeg,gif"
      accept="image/jpg,image/jpeg,image/gif"
      ui="horizontal"
      :payload="payload"
      uploading-content="progressPercent"
      @remove="removeFile"
      @cancel="cancelUploading"
      @success="onSuccess"
      @fail="onFailure">
      <template slot="tip">请选择jpg,jpeg,gif图片，大小在10M以内，最多上传3张图</template>
    </veui-uploader>
    <h2>图片上传模式，用按钮上传文件needButton="true"，上传进度以进度条显示uploadingContent="progressBar"</h2>
    <veui-uploader uploaderType="image"
      name="file"
      action="/upload"
      v-model="files"
      :max-count="3"
      :max-size="10"
      need-button
      extention-types="jpg,jpeg,gif"
      accept="image/jpg,image/jpeg,image/gif"
      :payload="payload"
      ui="horizontal bottom-mask"
      uploading-content="progressBar"
      @remove="removeFile"
      @cancel="cancelUploading"
      @success="onSuccess"
      @fail="onFailure">
      <template slot="tip">请选择jpg,jpeg,gif图片，大小在10M以内，最多上传3张图</template>
    </veui-uploader>
    <h2>文件上传模式 uploaderType="file"</h2>
    <veui-uploader uploaderType="file"
      name="file"
      action="/upload"
      v-model="files"
      :max-count="3"
      :max-size="10"
      extention-types="jpg,jpeg,gif"
      accept="image/jpg,image/jpeg,image/gif"
      :payload="payload"
      ui="horizontal ellipsis"
      @remove="removeFile"
      @cancel="cancelUploading"
      @success="onSuccess"
      @fail="onFailure">
      <template slot="tip">请选择jpg,jpeg,gif图片，大小在10M以内，最多上传3张图</template>
    </veui-uploader>
    <h2>通过iframe上传文件 requestMode="iframe"，文件名前有小图预览previewImage="true"，垂直排列ui="vertical"</h2>
    <veui-uploader
      name="file"
      action="/uploadiframe"
      request-mode="iframe"
      v-model="filesIframe"
      :max-count="3"
      :max-size="10"
      preview-image
      extention-types="jpg,jpeg,gif"
      accept="image/jpg,image/jpeg,image/gif"
      :payload="payload"
      ui="multiline"
      @remove="removeFileIframe"
      @cancel="cancelUploadingIframe"
      @success="onSuccess"
      @fail="onFailure">
      <template slot="tip">请选择jpg,jpeg,gif图片，大小在10M以内，最多上传3张图</template>
    </veui-uploader>
  </article>
</template>
<script>
import { Uploader, Button } from 'veui'
import { ui } from 'veui/mixins'

export default {
  name: 'uploader-demo',
  components: {
    'veui-uploader': Uploader,
    'veui-button': Button
  },
  data: function () {
    return {
      files: [
        {
          name: 'demo-file1.jpg',
          fileUid: '123456',
          size: '200kb',
          src: 'https://www.baidu.com/img/bd_logo1.png'
        },
        {
          name: 'demo-file2.gif',
          fileUid: '222333',
          size: '350kb',
          src: 'http://nodejs.cn/static/images/logo.svg'
        }
      ],
      filesIframe: [
        {
          name: 'demo-file1.jpg',
          fileUid: '123456',
          size: '200kb',
          src: 'https://www.baidu.com/img/bd_logo1.png'
        },
        {
          name: 'demo-file2.gif',
          fileUid: '222333',
          size: '350kb',
          src: 'http://nodejs.cn/static/images/logo.svg'
        }
      ],
      payload: {
        year: '2017',
        month: '4'
      }
    }
  },
  computed: {
    uiPropsIframe () {
      if (!this.uiIframe || !this.uiIframe.trim()) {
        return []
      }
      return this.uiIframe.trim().split(/\s+/)
    }
  },
  mixins: [ui],
  methods: {
    onSuccess (data) {
      console.log(data)
    },
    onFailure (data) {
      console.log(data)
    },
    removeFile (file) {
      this.files = this.files.filter(item => {
        return item.name !== file.name
      })
    },
    removeFileIframe (file) {
      this.filesIframe = this.filesIframe.filter(item => {
        return item.name !== file.name
      })
    },
    cancelUploading (file) {
      file.xhr.abort()
      this.removeFile(file)
    },
    cancelUploadingIframe () {
      this.filesIframe.pop()
    }
  }
}
</script>

<style lang="less">
.veui-uploader-demo {
  h2 {
    font-size: 16px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-top: 40px;
  }
}
</style>
