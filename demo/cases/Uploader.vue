<template>
  <article>
    <h1><code>&lt;veui-uploader&gt;</code></h1>
    <div style="margin-bottom: 10px">
      <veui-button @click="toggleUploaderType('')">切换上传类型</veui-button>
      <veui-button @click="toggleAlign('')">切换横竖排列</veui-button>
      <veui-button @click="togglePreview('')">上传类型是文件时，切换是否显示小图预览</veui-button>
      <br>
      <veui-button @click="changeImageSize('large')">上传类型是图片时，显示大图</veui-button>
      <veui-button @click="changeImageSize('')">中图</veui-button>
      <veui-button @click="changeImageSize('small')">小图</veui-button>
      <br>
      <veui-button @click="toggleNeedButton">上传类型是图片时，切换显示上传按钮是button还是列表里的+</veui-button>
      <veui-button @click="toggleMaskType">上传类型是图片时，切换显示预览图遮罩类型是全部遮罩还是底部部分遮罩</veui-button>
      <br>
      <veui-button @click="changeUploadingContent('text')">切换上传进度中的内容，显示文字</veui-button>
      <veui-button @click="changeUploadingContent('progressPercent')">显示进度百分比</veui-button>
      <veui-button @click="changeUploadingContent('progressBar')">显示进度条</veui-button>

    </div>
    <veui-uploader :uploaderType="uploaderType"
      :throughIframe="false"
      action="/upload"
      :disabled="false"
      :maxCount="3"
      :tip="tip"
      :files="files"
      :maxSize="10"
      :previewImage="previewImage"
      :needButton="needButton"
      extentionTypes="jpg,jpeg,gif"
      :args="extraArgs"
      :ui="ui"
      :uploadCallback="uploadCallback"
      :uploadingContent="uploadingContent"
      @delete="deleteFile"
      @cancel="cancelUploading"
      @change="onChange"
      @success="onSuccess"
      @failure="onFailure">
    </veui-uploader>
    <h1><code>&lt;veui-uploader(through iframe)&gt;</code></h1>
    <div style="margin-bottom: 10px">
      <veui-button @click="toggleUploaderType('Iframe')">切换上传类型</veui-button>
      <veui-button @click="toggleAlign('Iframe')">切换横竖排列</veui-button>
      <veui-button @click="togglePreview('Iframe')">上传类型是文件时，切换是否显示小图预览</veui-button>
      <br>
      <veui-button @click="changeImageSize('large', 'Iframe')">上传类型是图片时，显示大图</veui-button>
      <veui-button @click="changeImageSize('', 'Iframe')">中图</veui-button>
      <veui-button @click="changeImageSize('small', 'Iframe')">小图</veui-button>
    </div>
    <veui-uploader :uploaderType="uploaderTypeIframe"
      action="/uploadiframe"
      :throughIframe="true"
      iframeCallbackType="postmessage"
      :disabled="false"
      :maxCount="3"
      :tip="tip"
      :files="filesIframe"
      :maxSize="10"
      :previewImage="previewImageIframe"
      extentionTypes="jpg,jpeg,gif"
      :uploadCallback="uploadCallback"
      :args="extraArgs"
      uploadingContent="text"
      :ui="uiIframe"
      @delete="deleteFileIframe"
      @cancel="cancelUploadingIframe"
      @change="onChangeIframe"
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
      uploaderTypeIframe: 'file',
      ui: 'multiline horizontal bottom-mask',
      uiIframe: 'multiline horizontal',
      needButton: false,
      previewImage: true,
      previewImageIframe: true,
      uploadingContent: 'progressPercent',
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
      filesIframe: [
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
      tip: '请选择jpg,jpeg,gif图片，大小在10M以内',
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
    onChange (fileList) {
      this.files = cloneDeep(fileList)
    },
    onChangeIframe (fileList) {
      this.filesIframe = cloneDeep(fileList)
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
    deleteFileIframe (file) {
      this.filesIframe = this.filesIframe.filter(item => {
        return item.name !== file.name
      })
    },
    cancelUploading (file) {
      file.xhr.abort()
      this.deleteFile(file)
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
        this.ui += 'bottom-mask'
      }
    },
    toggleNeedButton () {
      this.needButton = !this.needButton
    },
    changeImageSize (size, iframe = '') {
      let ui = 'ui' + iframe
      this[ui] = this[ui].replace(/\s?(large)|(small)/, '')
      this[ui] += (size ? ' ' + size : '')
    },
    changeUploadingContent (type) {
      this.uploadingContent = type
    }
  }
}
</script>
