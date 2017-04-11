<template>
  <div class="veui-uploader" :ui="ui">
    <div>
      <label v-if="uploaderType === 'file'"
        class="veui-button veui-uploader-input-label"
        :class="{'veui-uploader-input-label-disabled': disabled}"
        ui="aux" ref="label"><icon class="veui-uploader-input-label-icon" name="upload"></icon>{{text}}
        <input hidden="hidden" type="file" ref="input" @change="onChange" :name="name" :disabled="disabled" multiple>
      </label>
      <span class="veui-uploader-tip" slot="tip">{{tip}}</span>
    </div>
    <transition name="veui-uploader-warning">
      <div v-if="warningText" class="veui-uploader-warning-container">
        <slot name="warning" :warningText="warningText">
          <span class="veui-uploader-warning">{{warningText}}</span>
        </slot>
      </div>
    </transition>
    <transition-group name="veui-uploader-list" tag="ul" :class="classType">
      <li v-for="(file, index) in fileList" :key="index"
        :class="{ 'veui-uploader-list-preview': previewImage && uploaderType === 'file'}">
        <template v-if="!file.status || file.status === 'success'">
          <slot name="file-content" :file="file">
            <template v-if="uploaderType === 'file'">
              <div v-if="previewImage" class="veui-uploader-list-preview-container">
                <img :src="file.src" :alt="file.alt || ''">
              </div>
              <span :class="classType + '-name'"
                :title="uiProps.indexOf('ellipsis') > -1 ? file.name : ''">{{file.name}}</span>
              <span :class="classType + '-size'">{{convertSizeUnit(file.size)}}</span>
              <veui-button ui="simple delete" @click="$emit('delete', file)"><icon name="close"></icon></veui-button>
            </template>
            <template v-else-if="uploaderType === 'image'">
              <img :src="file.src" :alt="file.alt || ''">
              <div :class="classType + '-mask'">
                <veui-button ui="simple" @click="$emit('delete', file)">移除</veui-button>
              </div>
            </template>
            <transition name="veui-uploader-fade">
              <div v-if="file.status === 'success'"
                :class="classType + '-success'"
                @click="updateFileList(file, {status: null})">
                <span class="veui-uploader-success">{{successText}}</span>
                <icon name="check-circle-o"></icon>
              </div>
            </transition>
          </slot>
        </template>
        <template v-else-if="file.status === 'uploading'">
          <slot name="uploading-content" :file="file">
            <veui-uploader-progress :type="uploadingContent" :loaded="file.loaded" :total="file.total"
              :class="uploaderType === 'image' ? classType + '-status' : ''"
              :uploadingText="uploadingText" :convertSizeUnit="convertSizeUnit">
            </veui-uploader-progress>
            <veui-button v-if="uploaderType === 'file'" ui="simple delete"
              @click="$emit('cancel', file)"><icon name="close"></icon></veui-button>
            <veui-button v-else-if="uploaderType === 'image'" ui="aux operation"
              @click="$emit('cancel', file)">取消</veui-button>
          </slot>
        </template>
        <template v-else-if="file.status === 'failure'">
          <slot name="failure-content" :file="file">
            <div :class="classType + '-status'">
              <span class="veui-uploader-failure">{{file.failureReason}}</span>
            </div>
            <veui-button :ui="uploaderType === 'file' ? 'simple' : 'aux operation'"
              @click="retry(file)">重试</veui-button>
          </slot>
        </template>
      </li>
      <li v-if="uploaderType === 'image'" key="input">
        <label class="veui-uploader-input-label-image"
          :class="{'veui-uploader-input-label-disabled': disabled}"
          ref="label"><input hidden type="file" ref="input" @change="onChange" :name="name" :disabled="disabled" multiple>
        </label>
      </li>
    </transition-group>
    <iframe v-if="throughIframe" ref="iframe"
     :id="iframeId" :name="iframeId" style="display: none;"></iframe>
    <form v-if="throughIframe" ref="form" :action="action" enctype="multipart/form-data"
      method="POST" :target="iframeId" style="display: none;">
      <input v-for="(value, key) in args" :name="key" :value="typeof value === 'function' ? value() : value">
      <input v-if="iframeCallbackType === 'func'" name="callbackFunc" :value="callbackFuncName">
    </form>
  </div>
</template>

<script>
import Icon from './Icon'
import Button from './Button'
import 'vue-awesome/icons/close'
import 'vue-awesome/icons/upload'
import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/check-circle-o'
import {endsWith, cloneDeep, filter, map, uniqueId} from 'lodash'
import {ui} from '../mixins'

export default {
  name: 'veui-uploader',
  components: {
    Icon,
    'veui-button': Button,
    'veui-uploader-progress': getProgress()
  },
  props: {
    uploaderType: {
      type: String,
      default: 'file'
    },
    throughIframe: Boolean,
    iframeCallbackType: String,
    uploadCallback: Function,
    files: Array,
    name: {
      type: String,
      default: 'file'
    },
    action: {
      type: String,
      required: true
    },
    headers: Object,
    withCredentials: {
      type: Boolean,
      default: true
    },
    previewImage: {
      type: Boolean,
      default: false
    },
    extentionTypes: [Array, String],
    disabled: Boolean,
    ui: String,
    maxCount: Number,
    maxSize: Number,
    args: Object,
    uploadingContent: {
      type: String,
      default: 'text'
    },
    text: {
      type: String,
      default: '选择文件'
    },
    tip: String,
    uploadingText: {
      type: String,
      default: '上传中...'
    },
    successText: {
      type: String,
      default: '上传成功！'
    },
    failureText: {
      type: String,
      default: '上传失败！'
    },
    sizeInvalidText: {
      type: String,
      default: '文件大小超过限制！'
    },
    typeInvalidText: {
      type: String,
      default: '文件格式不符！'
    },
    autoUpload: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      fileList: cloneDeep(this.files),
      canceled: false,
      warning: {
        typeInvalid: false,
        sizeInvalid: false
      },
      iframeId: uniqueId('veui-uploader-iframe'),
      callbackFuncName: uniqueId('veui-uploader-callback'),
      onMessage: null
    }
  },
  watch: {
    files (val) {
      this.fileList = cloneDeep(val)
    }
  },
  computed: {
    classType () {
      return 'veui-uploader-list-' + this.uploaderType
    },
    latestFile () {
      return this.fileList[this.fileList.length - 1]
    },
    warningText () {
      let text = ''
      text += this.warning.typeInvalid ? this.typeInvalidText : ''
      text += this.warning.sizeInvalid ? this.sizeInvalidText : ''
      return text
    }
  },
  mixins: [ui],
  mounted () {
    if (!this.throughIframe) return
    document.body.appendChild(this.$refs.iframe)
    document.body.appendChild(this.$refs.form)
    if (this.iframeCallbackType === 'postmessage') {
      this.onMessage = event => {
        if (event.source.frameElement.id !== this.iframeId) return
        if (this.canceled) return
        // 支持action为绝对路径或相对路径，ie9里的location没有origin
        let actionOrigin = /^https?:\/\//.test(this.action)
          ? this.action.match(/^https?:\/\/[^/]*/)[0]
          : location.origin || (location.protocol + '//' + location.host)
        if (actionOrigin !== event.origin) return

        let data = JSON.parse(event.data)
        this.uploadCallback(data, this.latestFile)
      }
      window.addEventListener('message', this.onMessage)
    } else if (this.iframeCallbackType === 'func') {
      if (!window.veuiUploaderCallback) window.veuiUploaderCallback = {}
      window.veuiUploaderCallback[this.callbackFuncName] = data => {
        data = JSON.parse(data)
        this.uploadCallback(data, this.latestFile)
      }
    }
  },
  beforeDestroy () {
    if (!this.throughIframe) return
    window.removeEventListener('message', this.onMessage)
    document.body.removeChild(this.$refs.form)
    document.body.removeChild(this.$refs.iframe)
    if (this.iframeCallbackType === 'func') window.veuiUploaderCallback[this.callbackFuncName] = null
  },
  methods: {
    onChange () {
      this.canceled = false
      let newFiles
      if (!this.throughIframe) {
        newFiles = filter(this.$refs.input.files, file => {
          let typeValidation = this.validateFileType(file.name)
          this.warning.typeInvalid = !typeValidation
          let sizeValidation = this.validateFileSize(file.size)
          this.warning.sizeInvalid = !sizeValidation
          return typeValidation && sizeValidation
        })
      } else {
        let filename = this.$refs.input.value
        if (!this.validateFileType(filename)) {
          this.warning.typeInvalid = false
          return
        }
        if (this.$refs.input.files && !this.validateFileSize(this.$refs.input.files[0]).size) {
          this.warning.sizeInvalid = false
          return
        }
        newFiles = [{status: 'uploading', name: filename}]
      }
      if (!newFiles.length) return

      this.fileList = [
        ...filter(this.fileList, file => {
          return file.status !== 'failure'
        }),
        ...map(newFiles, file => {
          if (!this.throughIframe && (this.uploaderType === 'image' || this.previewImage)) {
            if (window.URL) file.src = window.URL.createObjectURL(file)
          }
          file.toBeUploaded = true
          return file
        })
      ]

      if (this.maxCount && this.fileList.length > this.maxCount) {
        this.fileList = this.fileList.slice(-this.maxCount)
      }
      this.$emit('change', this.fileList)
      if (this.throughIframe) this.submit()
      if (!this.throughIframe && this.autoUpload) this.uploadFiles()
      this.$refs.input.value = ''
    },
    validateFileType (filename) {
      let extentionTypes = Array.isArray(this.extentionTypes)
        ? this.extentionTypes
        : this.extentionTypes.split(/[,;.]/)
      return extentionTypes.some(ext => endsWith(filename, '.' + ext))
    },
    validateFileSize (fileSize) {
      return !this.maxSize || fileSize <= this.maxSize * 1024 * 1024
    },
    uploadFiles () {
      this.fileList.forEach(file => {
        if (!file.toBeUploaded) return
        this.upload(file)
      })
    },
    upload (file) {
      file.status = 'uploading'
      this.updateFileList(file)
      let xhr = new XMLHttpRequest()
      file.xhr = xhr
      xhr.upload.onprogress = e => {
        switch (this.uploadingContent) {
          case 'progressPercent':
          case 'progressBar':
            file.loaded = e.loaded
            file.total = e.total
            this.updateFileList(file)
            break
        }
      }
      xhr.onload = () => {
        this.uploadCallback(JSON.parse(xhr.responseText), file)
      }
      xhr.onerror = () => {
        this.onFailure({}, file)
      }
      let formData = new FormData()
      formData.append(this.name, file)

      for (let key in this.args) {
        formData.append(key, typeof this.args[key] === 'function' ? this.args[key](this) : this.args[key])
      }

      xhr.open('POST', this.action, true)
      for (let key in this.headers) {
        xhr.setRequestHeader(key, this.headers[key])
      }
      xhr.withCredentials = this.withCredentials
      xhr.send(formData)
    },
    submit () {
      this.latestFile.status = 'uploading'
      let form = this.$refs.form
      form.appendChild(this.$refs.input)
      form.submit()
    },
    onSuccess (data, file) {
      Object.assign(file, data)
      file.status = 'success'
      file.xhr = null
      file.toBeUploaded = null
      this.updateFileList(file)
      if (this.throughIframe) this.reset()
    },
    onFailure (data, file) {
      file.status = 'failure'
      file.xhr = null
      file.toBeUploaded = null
      file.failureReason = this.failureText + (data.reason || '')
      this.updateFileList(file)
    },
    updateFileList (file, options) {
      if (options) Object.assign(file, options)
      this.$set(this.fileList, this.fileList.indexOf(file), file)
    },
    retry (file) {
      if (this.throughIframe) this.submit()
      else this.upload(file)
    },
    reset () {
      this.$refs.input.value = ''
      this.$refs.label.appendChild(this.$refs.input)
    },
    convertSizeUnit (size) {
      if (!size) return ''
      if (typeof size === 'string' && /\w+$/.test(size)) return size
      return size > 1024 * 1024
        ? (size / 1024 / 1024).toFixed(1) + 'M'
        : Math.ceil(size / 1024) + 'KB'
    }
  }
}

function getProgress () {
  return {
    props: ['loaded', 'total', 'type', 'uploadingText', 'convertSizeUnit'],
    computed: {
      percent () {
        if (this.type !== 'text') {
          return Math.ceil(this.loaded / this.total * 100) + '%'
        }
        return ''
      },
      content () {
        switch (this.type) {
          case 'text':
            return this.uploadingText
          case 'progressPercent':
            return `${this.percent} ${this.convertSizeUnit(this.loaded)}/${this.convertSizeUnit(this.total)}`
          case 'progressBar':
            return ''
        }
      }
    },
    render () {
      let bar = this.type === 'progressBar'
        ? [<span class="veui-uploader-progress-bar" style={{ width: this.percent || '0%' }}></span>,
          <span class="veui-uploader-progress-bar-full"></span>]
        : ''
      return (
        <div class="veui-uploader-progress">
          { this.content }
          { bar }
        </div>
      )
    }
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";
@prefix: veui-uploader;
@prefix-button: veui-button;

.@{prefix} {
  @width: 350px;
  @icon-size: 16px;
  @preview-size: 60px;
  @image-large: 300px;
  @image-normal: 200px;
  @image-small: 100px;
  @list-padding: 3px;
  .disabled() {
    border: none;
    background-color: @veui-gray-color-sup-3;
    color: @veui-text-color-weak;
    box-shadow: none;
  }

  width: @width;
  overflow: hidden;
  &-input-label {
    cursor: pointer;
    display: inline-block;
    color: @veui-text-color-strong;
    margin-right: 1em;
    &-icon {
      margin-right: 5px;
    }
    &-disabled {
      cursor: default !important;
      .disabled()!important;
      &:hover {
        .disabled()!important;
      }
    }
  }
  &-input-label-image {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;

    &::before,
    &::after, {
      content: '';
      position: absolute;
    }
    &::before {
      border-top: 2px solid @veui-gray-color-sup-2;
      top: ~"calc(50% - 1px)";
      left: 30%;
      width: 40%;
    }
    &::after {
      border-left: 2px solid @veui-gray-color-sup-2;
      top: 30%;
      left: ~"calc(50% - 1px)";
      height: 40%;
    }
  }

  &-list-file,
  &-list-image {
    padding: 0;
    margin: 0;
    list-style: none;
    overflow: hidden;
    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
    &-status {
      line-height: 1.2;
      & > span {
        display: inline-block;
        vertical-align: middle;
        word-break: break-all;
      }
      &::after {
        content: '';
        height: 100%;
        display: inline-block;
        vertical-align: middle;
      }
    }
    &-success {
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
      background-color: #fff;
      color: @veui-success-color-primary;
    }
  }
  &-list-file {
    color: @veui-theme-color-primary;
    li {
      position: relative;
      padding: 10px 5px;
      box-sizing: content-box;
    }
    li:hover {
      background-color: @veui-gray-color-sup-3;
      .@{prefix-button}[ui~="simple"] {
        background-color: @veui-gray-color-sup-3;
      }
      .@{prefix-button}[ui~="delete"] {
        visibility: visible;
      }
    }
    &-name,
    &-size {
      display: inline-block;
      vertical-align: middle;
    }
    &-name {
      overflow: hidden;
      width: 70%;
    }
    &-size {
      color: @veui-gray-color-weak;
      width: ~"calc(30% - 2em)";
    }
    &-status {
      display: inline-block;
      width: ~"calc(100% - 3em)";
      height: 100%;
    }
    &-success {
      padding: 10px 5px;
      svg {
        position: relative;
        top: 2px;
      }
    }

    .@{prefix}-progress {
      width: ~"calc(100% - 3em)";
      top: 0;
      & + button {
        float: right;
        position: relative;
        right: 5px;
      }
    }
  }
  &-list-preview {
    height: @preview-size;
    padding: @list-padding !important;
    &-container {
      display: inline-block;
      vertical-align: middle;
      width: @preview-size;
      height: @preview-size;
      line-height: @preview-size;
      font-size: 0;
      text-align: center;
    }

    .@{prefix}-list-file-success {
      line-height: @preview-size;
      padding: 0;
    }
    .@{prefix}-list-file-name {
      width: ~"calc(70% - "@preview-size~")";
    }
    .@{prefix}-progress {
      width: ~"calc(100% - 3em)";
      top: (@preview-size - 14px) / 2;

      & + button {
        top: (@preview-size - @icon-size) / 2;
      }
    }
  }
  &-list-image {
    li {
      overflow: hidden;
      width: @image-normal;
      height: @image-normal;
      padding: @list-padding;
      box-sizing: content-box;
      margin: 5px;
      border: 2px dashed @veui-gray-color-sup-2;
      text-align: center;
      line-height: @image-normal;
      position: relative;
      button[ui~="operation"] {
        position: absolute;
        min-width: 70px;
        top: ~"calc(50% + 10px)";
        left: ~"calc(50% - 35px)";
      }
    }
    li:hover &-mask {
      display: block;
    }
    &-mask {
      display: none;
      position: absolute;
      top: @list-padding;
      left: @list-padding;
      width: ~"calc(100% - "2 * @list-padding~")";
      height: ~"calc(100% - "2 * @list-padding~")";
      background-color: rgba(0, 0, 0, .5);
      text-align: center;
      button {
        vertical-align: middle;
        background: none;
        font-size: 18px;
        height: 18px !important;
        color: #fff;
        line-height: 1;
      }
      button:active,
      button:hover {
        background: none;
        color: #fff !important;
      }
    }
    &-status {
      margin-top: 10%;
      height: 40%;
      & > span {
        max-width: 90%;
      }
    }
    &-success {
      padding-top: 25%;
      line-height: 1;
      span {
        display: block;
        margin-bottom: 25%;
      }
      svg {
        font-size: @icon-size;
      }
    }
    .@{prefix}-progress {
      display: block;
    }
  }
  &-warning-container {
    margin: 20px 0 5px 5px;
    overflow: hidden;
  }
  &-tip {
    color: @veui-gray-color-weak;
    margin-left: 3px;
  }
  &-uploading {
    color: @veui-theme-color-primary;
  }
  &-failure {
    color: @veui-alert-color-primary;
  }
  &-success {
    color: @veui-success-color-primary;
  }
  &-warning {
    color: @veui-warning-color-primary;
  }
  &[ui~="ellipsis"] &-list-file-name {
    text-overflow: ellipsis;
  }
  &[ui~="multiline"] &-list-file-name {
    word-break: break-all;
  }
  &[ui~="horizontal"] {
    width: 100%;
    .@{prefix}-list-file {
      width: 100%;
      li {
        float: left;
        width: @width;
        margin-right: 10px;
      }
    }
    .@{prefix}-list-image li {
      float: left;
    }
  }
  &[ui~="small"] &-list-image {
    li {
      height: @image-small;
      width: @image-small;
      line-height: @image-small;
    }
  }
  &[ui~="large"] &-list-image {
    li {
      height: @image-large;
      width: @image-large;
      line-height: @image-large;
    }
  }
  .@{prefix-button}[ui~="simple"] {
    border: none;
    background-color: none;
    transition: none;
    .veui-shadow(none);
    height: @icon-size;
    min-width: 2em;
    padding: 0;
  }
  .@{prefix-button}[ui~="delete"] {
    color: @veui-alert-color-primary;
    font-size: @icon-size;
    min-width: @icon-size;
    width: @icon-size;
    visibility: hidden;
  }

  &-warning-enter,
  &-warning-leave-active {
    margin: 0;
    opacity: 0;
    height: 0;
    width: 0;
    line-height: 0;
  }
  &-warning-enter-active,
  &-warning-leave-active {
    transition: all .6s ease;
  }
  &-list-enter,
  &-list-leave-active {
    opacity: 0;
  }
  &-list-enter-active,
  &-list-leave-active {
    transition: all .6s ease;
  }
  &-list-move {
    transition: transform 1s;
  }
  &-fade-leave-active {
    opacity: 0;
    transition: all .6s ease;
  }

  &-progress {
    display: inline-block;
    position: relative;
    line-height: 1.2;
    color: @veui-theme-color-primary;
    &-bar,
    &-bar-full {
      display: inline-block;
      position: absolute;
      left: 0;
      top: 50%;
      height: 5px;
      max-width: 100% !important;
    }
    &-bar {
      background-color: @veui-theme-color-primary;
      &-full {
        z-index: -1;
        width: 100%;
        background-color: @veui-gray-color-sup-3;
      }
    }
  }
}
</style>
