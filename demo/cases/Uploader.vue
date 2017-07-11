<template>
  <article>
    <h1><code>&lt;veui-uploader&gt;</code></h1>
    <div style="margin-bottom: 10px">
      <veui-button @click="toggleUploaderType('')">切换上传类型</veui-button>
      <veui-button @click="toggleAlign('')">切换横竖排列</veui-button>
      <veui-button @click="togglePreview('')">上传类型是文件时，切换是否显示小图预览</veui-button>
      <br>
      <veui-button @click="toggleNeedButton">上传类型是图片时，切换显示上传按钮是button还是列表里的+</veui-button>
      <veui-button @click="toggleMaskType">上传类型是图片时，切换显示预览图遮罩类型是全部遮罩还是底部部分遮罩</veui-button>
      <br>
      <veui-button @click="changeUploadingContent('text')">切换上传进度中的内容，显示文字</veui-button>
      <veui-button @click="changeUploadingContent('progressPercent')">显示进度百分比</veui-button>
      <veui-button @click="changeUploadingContent('progressBar')">显示进度条</veui-button>
    </div>
    <veui-uploader :uploaderType="uploaderType"
      name="file"
      action="/upload"
      request-mode="xhr"
      v-model="files"
      :disabled="false"
      :max-count="3"
      :max-size="10"
      :preview-image="previewImage"
      :needButton="needButton"
      extention-types="jpg,jpeg,gif"
      :payload="payload"
      :ui="ui"
      :uploading-content="uploadingContent"
      @remove="removeFile"
      @cancel="cancelUploading"
      @success="onSuccess"
      @fail="onFailure">
      <template slot="tip">请选择jpg,jpeg,gif图片，大小在10M以内，最多上传3张图</template>
    </veui-uploader>
    <h1><code>&lt;veui-uploader(through iframe)&gt;</code></h1>
    <div style="margin-bottom: 10px">
      <veui-button @click="toggleUploaderType('Iframe')">切换上传类型</veui-button>
      <veui-button @click="toggleAlign('Iframe')">切换横竖排列</veui-button>
      <veui-button @click="togglePreview('Iframe')">上传类型是文件时，切换是否显示小图预览</veui-button>
    </div>
    <veui-uploader :uploaderType="uploaderTypeIframe"
      name="file"
      action="/uploadiframe"
      request-mode="iframe"
      v-model="filesIframe"
      :disabled="false"
      :max-count="3"
      :max-size="10"
      :preview-image="previewImageIframe"
      extention-types="jpg,jpeg,gif"
      :payload="payload"
      uploading-content="text"
      :ui="uiIframe"
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
      uploaderType: 'image',
      uploaderTypeIframe: 'file',
      ui: 'multiline horizontal bottom-mask list-icon',
      uiIframe: 'multiline horizontal',
      needButton: false,
      previewImage: true,
      previewImageIframe: true,
      uploadingContent: 'progressPercent',
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
          src: 'http://images.nvidia.com/graphics-cards/geforce/pascal/cn/images/1080-ti-design.png'
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
          src: 'http://images.nvidia.com/graphics-cards/geforce/pascal/cn/images/1080-ti-design.png'
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
    },
    toggleUploaderType (iframe = '') {
      this['uploaderType' + iframe] = this['uploaderType' + iframe] === 'image' ? 'file' : 'image'
    },
    toggleAlign (iframe = '') {
      let index = this['uiProps' + iframe].indexOf('horizontal')
      let ui = 'ui' + iframe
      if (index > -1) {
        this[ui] = this[ui].replace('horizontal', '')
      } else {
        this[ui] += ' horizontal'
      }
    },
    togglePreview (iframe = '') {
      this['previewImage' + iframe] = !this['previewImage' + iframe]
    },
    toggleMaskType () {
      if (this.uiProps.indexOf('bottom-mask') > -1) {
        this.ui = this.ui.replace('bottom-mask', '')
      } else {
        this.ui += ' bottom-mask'
      }
    },
    toggleNeedButton () {
      this.needButton = !this.needButton
    },
    changeUploadingContent (type) {
      this.uploadingContent = type
    }
  }
}
</script>

