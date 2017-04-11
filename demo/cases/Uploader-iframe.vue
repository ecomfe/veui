<template>
  <article>
    <h1><code>&lt;veui-uploader-iframe&gt;</code></h1>
    <div style="margin-bottom: 10px">
      <veui-button @click="toggleUploaderType">切换上传类型</veui-button>
      <veui-button @click="toggleAlign">切换横竖排列</veui-button>
      <veui-button @click="togglePreview">上传类型是文件时，切换显示小图预览</veui-button>
      <veui-button @click="changeImageSize('large')">上传类型是图片时，显示大图</veui-button>
      <veui-button @click="changeImageSize('')">中图</veui-button>
      <veui-button @click="changeImageSize('small')">小图</veui-button>
    </div>
    <veui-uploader :uploaderType="uploaderType"
      action="/uploadiframe"
      :throughIframe="true"
      iframeCallbackType="postmessage"
      :disabled="false"
      :maxCount="3"
      :tip="tip"
      :files="files"
      :maxSize="0.5"
      :previewImage="previewImage"
      extentionTypes="jpg,jpeg,gif"
      :uploadCallback="uploadCallback"
      :args="extraArgs"
      uploadingContent="text"
      :ui="ui"
      @delete="deleteFile"
      @cancel="cancelUploading"
      @change="onChange"
      @success="onSuccess"
      @failure="onFailure">
    </veui-uploader>
  </article>
</template>
<script>
import Uploader from '@/components/Uploader'
import Button from '@/components/Button'
import {cloneDeep} from 'lodash'
import {ui} from '../../src/mixins'

export default {
  name: 'uploader',
  components: {
    'veui-uploader': Uploader,
    'veui-button': Button
  },
  data: function () {
    return {
      uploaderType: 'image',
      ui: 'multiline horizontal',
      previewImage: true,
      files: [
        {
          name: 'aaaa.jpg',
          fileUid: '123456',
          size: '200kb',
          src: 'http://ww4.sinaimg.cn/bmiddle/88d71a4bjw1eyhwlb01d0j20ci0go0tu.jpg'
        },
        {
          name: 'bbbb.gif',
          fileUid: '222333',
          size: '350kb',
          src: 'http://ww4.sinaimg.cn/mw690/6926e2a6gw1f2dhgdg52qj20j60as40h.jpg'
        }
      ],
      extraArgs: {
        year: '2017',
        month () {
          return new Date().getMonth() + 1
        }
      },
      tip: '请选择图片',
      uploadCallback (data, file) {
        if (data.status === 'success') {
          this.$emit('success', data)
          this.onSuccess(data, file)
        } else if (data.status === 'failure') {
          this.$emit('failure', data)
          this.onFailure(data, file)
        }
      }
    }
  },
  mixins: [ui],
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
    deleteFile (file) {
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
    changeImageSize (size) {
      this.ui = this.ui.replace(/\s?(large)|(small)/, '')
      this.ui += (size ? ' ' + size : '')
    }
  }
}
</script>
