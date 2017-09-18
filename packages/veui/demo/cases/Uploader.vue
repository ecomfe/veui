<template>
  <article class="veui-uploader-demo">
    <h1><code>&lt;veui-uploader&gt;</code></h1>
    <h2>图片上传模式，上传进度以文字百分比显示</h2>
    <veui-uploader type="image"
      name="file"
      action="/upload"
      v-model="files"
      :max-count="3"
      max-size="10mb"
      accept=".jpg,.jpeg,.gif"
      ui="horizontal"
      :payload="payload"
      progress="number"
      @remove="removeFile"
      @cancel="cancelUploading"
      @success="onSuccess"
      @fail="onFailure">
      <template slot="desc">请选择jpg,jpeg,gif图片，大小在10M以内，最多上传3张图</template>
    </veui-uploader>
    <h2>图片上传模式，上传进度以进度条显示</h2>
    <veui-uploader type="image"
      name="file"
      action="/upload"
      v-model="files"
      :max-count="3"
      max-size="10mb"
      accept=".jpg,.jpeg,.gif"
      :payload="payload"
      ui="horizontal bottom-mask"
      progress="bar"
      @remove="removeFile"
      @cancel="cancelUploading"
      @success="onSuccess"
      @fail="onFailure">
      <template slot="desc">请选择jpg,jpeg,gif图片，大小在10M以内，最多上传3张图</template>
    </veui-uploader>
    <h2>文件上传模式</h2>
    <veui-uploader
      name="file"
      action="/upload"
      v-model="files"
      :max-count="3"
      max-size="10mb"
      accept=".jpg,.jpeg,.gif"
      :payload="payload"
      ui="horizontal button-primary"
      progress="number"
      @remove="removeFile"
      @cancel="cancelUploading"
      @success="onSuccess"
      @fail="onFailure">
      <template slot="desc">请选择jpg,jpeg,gif图片，大小在10M以内，最多上传3张图</template>
    </veui-uploader>
    <h2>文件上传模式，通过iframe上传</h2>
    <veui-uploader ref="iframeUploader"
      name="file"
      action="/uploadiframe"
      request-mode="iframe"
      v-model="filesIframe"
      :max-count="1"
      max-size="10mb"
      accept="image/*"
      :payload="payload"
      @remove="removeFileIframe"
      @cancel="cancelUploadingIframe"
      @success="onSuccess"
      @fail="onFailure"
      @change="mockResult">
      <template slot="desc">可上传所有类型图片，大小在10M以内，只能上传1张图</template>
    </veui-uploader>
  </article>
</template>
<script>
import { Uploader } from 'veui'
import { ui } from 'veui/mixins'

export default {
  name: 'uploader-demo',
  components: {
    'veui-uploader': Uploader
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
      filesIframe: 'http://nodejs.cn/static/images/logo.svg',
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
      this.filesIframe = ''
    },
    cancelUploading (file) {
      file.xhr.abort()
      this.removeFile(file)
    },
    cancelUploadingIframe () {
      this.filesIframe = ''
    },
    mockResult () {
      setTimeout(() => {
        this.$refs.iframeUploader.uploadCallback({
          status: 'success',
          name: 'demo-file.jpg'
        }, this.$refs.iframeUploader.currentSubmitingFile)
      }, 1000)
    }
  }
}
</script>

<style lang="less">
.veui-uploader-demo {
  padding-bottom: 20px;
  h2 {
    font-size: 16px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-top: 40px;
  }
}
</style>
