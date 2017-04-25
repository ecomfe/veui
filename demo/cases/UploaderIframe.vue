<template>
  <article>
    <h1><code>&lt;veui-uploader(through iframe)&gt;</code></h1>
    <div style="margin-bottom: 10px">
      <veui-button @click="toggleUploaderType">切换上传类型</veui-button>
      <veui-button @click="toggleAlign">切换横竖排列</veui-button>
      <veui-button @click="togglePreview">上传类型是文件时，切换是否显示小图预览</veui-button>
      <br>
      <veui-button @click="changeImageSize('large')">上传类型是图片时，显示大图</veui-button>
      <veui-button @click="changeImageSize('')">中图</veui-button>
      <veui-button @click="changeImageSize('small')">小图</veui-button>
    </div>
    <veui-uploader :uploaderType="uploaderType"
      name="file"
      action="/uploadiframe"
      :disabled="false"
      :max-count="3"
      :value="files"
      :max-size="10"
      :previewImage="previewImage"
      extentionTypes="jpg,jpeg,gif"
      :payload="payload"
      uploadingContent="text"
      :ui="ui"
      @remove="removeFile"
      @cancel="cancelUploading"
      @change="onChange"
      @success="onSuccess"
      @fail="onFailure"
      ref="iframeUploader">
      <template slot="tip">请选择jpg,jpeg,gif图片，大小在10M以内，最多上传3张图</template>
    </veui-uploader>
  </article>
</template>
<script>
import Uploader from '@/components/Uploader'
import Button from '@/components/Button'
import {cloneDeep} from 'lodash'
import {ui} from '../../src/mixins'
import config from '../../src/managers/config'

export default {
  name: 'uploader',
  components: {
    'veui-uploader': Uploader,
    'veui-button': Button
  },
  data: function () {
    return {
      uploaderType: 'file',
      ui: 'multiline horizontal',
      needButton: false,
      previewImage: true,
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
      payload: {
        year: '2017',
        month () {
          return new Date().getMonth() + 1
        }
      }
    }
  },
  mixins: [ui],
  created () {
    config.set('requestMode', 'iframe')
  },
  methods: {
    onChange (fileList) {
      this.files = cloneDeep(fileList)
    },
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
    cancelUploading () {
      this.files.pop()
    },
    toggleUploaderType () {
      this.uploaderType = this.uploaderType === 'image' ? 'file' : 'image'
    },
    toggleAlign () {
      let index = this.uiProps.indexOf('horizontal')
      if (index > -1) {
        this.ui = this.ui.replace('horizontal', '')
      } else {
        this.ui += ' horizontal'
      }
    },
    togglePreview () {
      this.previewImage = !this.previewImage
    },
    toggleNeedButton () {
      this.needButton = !this.needButton
    },
    changeImageSize (size) {
      this.ui = this.ui.replace(/\s?(large)|(small)/, '')
      this.ui += (size ? ' ' + size : '')
    },
    changeUploadingContent (type) {
      this.uploadingContent = type
    }
  }
}
</script>

