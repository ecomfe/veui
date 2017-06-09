<template>
  <div class="veui-uploader" :ui="ui">
    <div class="veui-uploader-button-container">
      <label v-if="uploaderType === 'file' || (uploaderType === 'image' && needButton)"
        class="veui-button veui-uploader-input-label"
        :class="{'veui-uploader-input-label-disabled': disabled}"
        ui="aux" ref="label">
        <icon class="veui-uploader-input-label-icon" name="upload"></icon><slot name="text">选择文件</slot>
        <input hidden="hidden" type="file" ref="input" @change="onChange" :name="realName" :disabled="disabled" :accept="accept" multiple>
      </label>
      <slot name="button"></slot>
      <span class="veui-uploader-tip"><slot name="tip"></slot></span>
    </div>
    <transition name="veui-uploader-warning">
      <div v-if="warning.typeInvalid || warning.sizeInvalid" class="veui-uploader-warning-container">
        <slot name="warning" :warning="warning">
          <span v-if="warning.typeInvalid" class="veui-uploader-warning"><slot name="typeInvalidText">文件类型不符合要求！</slot></span>
          <span v-if="warning.sizeInvalid" class="veui-uploader-warning"><slot name="sizeInvalidText">文件大小超过限制！</slot></span>
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
              <veui-button ui="link delete" @click="$emit('remove', file)"><icon name="cross"></icon></veui-button>
            </template>
            <template v-else-if="uploaderType === 'image'">
              <img :src="file.src" :alt="file.alt || ''">
              <div :class="classType + '-mask'">
                <veui-button ui="link" @click="$emit('remove', file)">移除</veui-button>
              </div>
            </template>
            <transition name="veui-uploader-fade">
              <div v-if="file.status === 'success'"
                :class="classType + '-success'"
                @click="updateFileList(file, {status: null})">
                <span class="veui-uploader-success"><slot name="successText">上传成功！</slot></span>
                <icon name="check-circle"></icon>
              </div>
            </transition>
          </slot>
        </template>
        <template v-else-if="file.status === 'uploading'">
          <slot name="uploading-content" :file="file">
            <veui-uploader-progress :type="uploadingContent" :loaded="file.loaded" :total="file.total"
              :class="uploaderType === 'image' ? classType + '-status' : ''"
              :convertSizeUnit="convertSizeUnit">
              <slot name="uploadingText">上传中...</slot>
            </veui-uploader-progress>
            <veui-button v-if="uploaderType === 'file'" ui="link delete"
              @click="cancelFile(file)"><icon name="close"></icon></veui-button>
            <veui-button v-else-if="uploaderType === 'image'" ui="aux operation"
              @click="cancelFile(file)">取消</veui-button>
          </slot>
        </template>
        <template v-else-if="file.status === 'failure'">
          <slot name="failure-content" :file="file">
            <div :class="classType + '-status'">
              <span class="veui-uploader-failure"><slot name="failureText">上传失败！</slot>{{file.failureReason}}</span>
            </div>
            <veui-button :ui="uploaderType === 'file' ? 'link' : 'aux operation'"
              @click="retry(file)">重试</veui-button>
          </slot>
        </template>
      </li>
      <li v-if="uploaderType === 'image' && !needButton" key="input">
        <label class="veui-uploader-input-label-image"
          :class="{'veui-uploader-input-label-disabled': disabled}"
          ref="label"><input hidden type="file" ref="input" @change="onChange" :name="realName" :disabled="disabled" :accept="accept" multiple>
        </label>
      </li>
    </transition-group>
    <iframe v-if="requestMode === 'iframe'" ref="iframe"
     :id="iframeId" :name="iframeId" class="veui-uploader-hide"></iframe>
    <form v-if="requestMode === 'iframe'" ref="form" :action="`${action}?callback=parent.${callbackNamespace}['${callbackFuncName}']`" enctype="multipart/form-data"
      method="POST" :target="iframeId" class="veui-uploader-hide">
      <input v-for="(value, key) in payload" :name="key" :value="value">
      <input v-if="iframeMode === 'callback'" name="callback" :value="`parent.${callbackNamespace}['${callbackFuncName}']`">
    </form>
  </div>
</template>

<script>
import Icon from './Icon'
import '../icons'
import Button from './Button'
import { endsWith, cloneDeep, filter, map, uniqueId, assign } from 'lodash'
import { ui, input } from '../mixins'
import { config } from '../managers'

config.defaults({
  'uploader.requestMode': 'xhr',
  'uploader.iframeMode': 'postmessage',
  'uploader.callbackNamespace': 'veuiUploadResult'
})

export default {
  name: 'veui-uploader',
  components: {
    Icon,
    'veui-button': Button,
    'veui-uploader-progress': getProgress()
  },
  mixins: [ui, input],
  model: {
    event: 'change'
  },
  props: {
    value: {
      type: Array
    },
    uploaderType: {
      type: String,
      default: 'file'
    },
    action: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default () {
        return config.get('uploader.headers')
      }
    },
    withCredentials: {
      type: Boolean,
      default: true
    },
    requestMode: {
      type: String,
      default () {
        return config.get('uploader.requestMode')
      }
    },
    iframeMode: {
      type: String,
      default () {
        return config.get('uploader.iframeMode')
      }
    },
    convertResponse: {
      type: Function,
      default () {
        return config.get('uploader.convertResponse')
      }
    },
    callbackNamespace: {
      type: String,
      default () {
        return config.get('uploader.callbackNamespace')
      }
    },
    previewImage: {
      type: Boolean,
      default: false
    },
    extentionTypes: [Array, String],
    accept: String,
    needButton: {
      type: Boolean,
      default: false
    },
    ui: String,
    'max-count': Number,
    'max-size': Number,
    payload: Object,
    uploadingContent: {
      type: String,
      default: 'text'
    },
    autoUpload: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      fileList: cloneDeep(this.value),
      canceled: false,
      warning: {
        typeInvalid: false,
        sizeInvalid: false
      },
      iframeId: uniqueId('veui-uploader-iframe'),
      callbackFuncName: uniqueId('veuiUploaderCallback'),
      onMessage: null
    }
  },
  watch: {
    value (val) {
      this.fileList = cloneDeep(val)
    }
  },
  computed: {
    classType () {
      return 'veui-uploader-list-' + this.uploaderType
    },
    latestFile () {
      return this.fileList[this.fileList.length - 1]
    }
  },
  mounted () {
    if (this.$slots.button && (this.uploaderType === 'file' || this.needButton)) {
      let button = this.$slots.button[0].elm
      let labelStyle = this.$refs.label.style
      labelStyle.height = button.offsetHeight + 'px'
      labelStyle.width = button.offsetWidth + 'px'
      labelStyle.opacity = 0
    }
    if (this.requestMode === 'xhr') return
    document.body.appendChild(this.$refs.iframe)
    document.body.appendChild(this.$refs.form)
    if (this.iframeMode === 'postmessage') {
      this.onMessage = event => {
        if (!event.source.frameElement || event.source.frameElement.id !== this.iframeId) return
        if (this.canceled) return
        // 支持action为绝对路径或相对路径，ie9里的location没有origin
        let actionOrigin = /^https?:\/\//.test(this.action)
          ? this.action.match(/^https?:\/\/[^/]*/)[0]
          : location.origin || (location.protocol + '//' + location.host)
        if (actionOrigin !== event.origin) return

        this.uploadCallback(this.parseData(event.data), this.latestFile)
      }
      window.addEventListener('message', this.onMessage)
    } else if (this.iframeMode === 'callback') {
      if (!window[this.callbackNamespace]) {
        window[this.callbackNamespace] = {}
      }
      window[this.callbackNamespace][this.callbackFuncName] = data => {
        if (this.canceled) return
        this.uploadCallback(this.parseData(data), this.latestFile)
      }
    }
  },
  beforeDestroy () {
    if (this.requestMode === 'xhr') return
    window.removeEventListener('message', this.onMessage)
    document.body.removeChild(this.$refs.form)
    document.body.removeChild(this.$refs.iframe)
    if (this.iframeMode === 'callback') {
      window[this.callbackNamespace][this.callbackFuncName] = null
    }
  },
  methods: {
    onChange () {
      this.canceled = false
      let newFiles
      if (this.requestMode === 'xhr') {
        newFiles = filter(this.$refs.input.files, file => {
          return this.validateFile(file)
        })
      } else {
        let name = this.$refs.input.value
        let size = this.$refs.input.files && this.$refs.input.files[0].size
        if (!this.validateFile({name, size})) return
        newFiles = [{status: 'uploading', name}]
      }

      if (!newFiles.length) return

      this.fileList = [
        ...filter(this.fileList, file => {
          return file.status !== 'failure'
        }),
        ...map(newFiles, file => {
          if (this.requestMode === 'xhr' && (this.uploaderType === 'image' || this.previewImage)) {
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

      if (this.requestMode === 'iframe' && this.autoUpload) this.submit()
      if (this.requestMode === 'xhr' && this.autoUpload) this.uploadFiles()
      this.$refs.input.value = ''
    },
    validateFile (file) {
      let typeValidation = this.validateFileType(file.name)
      this.warning.typeInvalid = !typeValidation
      let sizeValidation = this.validateFileSize(file.size)
      this.warning.sizeInvalid = !sizeValidation
      return typeValidation && sizeValidation
    },
    validateFileType (filename) {
      if (!this.extentionTypes || !this.extentionTypes.length) return true
      let extentionTypes = Array.isArray(this.extentionTypes)
        ? this.extentionTypes
        : this.extentionTypes.split(/[,;.]/)
      return extentionTypes.some(ext => endsWith(filename, '.' + ext))
    },
    validateFileSize (fileSize) {
      return !this.maxSize || !fileSize || fileSize <= this.maxSize * 1024 * 1024
    },
    uploadFiles () {
      this.fileList.forEach(file => {
        if (!file.toBeUploaded) return
        this.upload(file)
      })
    },
    upload (file) {
      this.updateFileList(file, {status: 'uploading'})
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
        this.$emit('progress', e)
      }
      xhr.onload = () => {
        this.uploadCallback(this.parseData(xhr.responseText), file)
      }
      xhr.onerror = () => {
        this.onFailure({}, file)
      }
      let formData = new FormData()
      formData.append(this.name, file)

      for (let key in this.payload) {
        formData.append(key, this.payload[key])
      }

      xhr.open('POST', this.action, true)
      for (let key in this.headers) {
        xhr.setRequestHeader(key, this.headers[key])
      }
      xhr.withCredentials = this.withCredentials
      xhr.send(formData)
    },
    submit () {
      this.updateFileList(this.latestFile, {status: 'uploading'})
      let form = this.$refs.form
      form.appendChild(this.$refs.input)
      form.submit()
      this.reset()
    },
    uploadCallback (data, file) {
      this.convertResponse(data) || data
      if (data.status === 'success') {
        this.$emit('success', data)
        this.onSuccess(data, file)
      } else if (data.status === 'failure') {
        this.$emit('fail', data)
        this.onFailure(data, file)
      }
    },
    onSuccess (data, file) {
      assign(file, data)
      file.status = 'success'
      file.xhr = null
      file.toBeUploaded = null
      this.updateFileList(file)
    },
    onFailure (data, file) {
      file.status = 'failure'
      file.xhr = null
      file.toBeUploaded = null
      file.failureReason = data.reason || ''
      this.updateFileList(file)
    },
    updateFileList (file, options) {
      if (options) assign(file, options)
      this.$set(this.fileList, this.fileList.indexOf(file), file)
      this.$emit('change', this.fileList)
    },
    retry (file) {
      if (this.requestMode === 'iframe') this.submit()
      else this.upload(file)
    },
    cancelFile (file) {
      if (this.requestMode === 'iframe') this.canceled = true
      this.$emit('cancel', file)
      this.reset()
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
    },
    parseData (data) {
      if (typeof data === 'object') return data
      if (typeof data === 'string') {
        try {
          return JSON.parse(data)
        } catch (error) {
          this.$emit('fail', {error})
        }
      }
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
            return this.$slots.default
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

.veui-uploader {
  @width: 292px;
  @icon-size: 16px;
  @preview-size: 32px;
  @image-size: 140px;
  @list-padding: 2px;
  .disabled() {
    border: none;
    background-color: @veui-gray-color-sup-3;
    color: @veui-text-color-weak;
    box-shadow: none;
  }

  width: @width;
  overflow: hidden;
  &-button-container {
    position: relative;
    margin-bottom: 20px;
  }
  &-input-label {
    cursor: pointer;
    display: inline-block;
    color: @veui-text-color-strong;
    margin-right: 1em;
    box-sizing: border-box;
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
      border-top: 4px solid @veui-gray-color-sup-1;
      top: ~"calc(50% - 2px)";
      left: @image-size / 2 - @list-padding - 1px - 30px;
      width: 60px;
    }
    &::after {
      border-left: 4px solid @veui-gray-color-sup-1;
      top: @image-size / 2 - @list-padding - 1px - 30px;
      left: ~"calc(50% - 2px)";
      height: 60px;
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
      padding: 9px 4px;
      display: block;
      background-color: #fff;
      color: @veui-success-color-primary;
    }
  }
  &-list-file {
    color: @veui-theme-color-primary;
    li {
      position: relative;
      padding: 9px 4px;
      box-sizing: content-box;
    }
    li:hover {
      background-color: @veui-gray-color-sup-3;
      .veui-button[ui~="link"] {
        background-color: @veui-gray-color-sup-3;
      }
      .veui-button[ui~="delete"] {
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
      svg {
        position: relative;
        top: 2px;
      }
    }

    .veui-uploader-progress {
      width: ~"calc(100% - 3em)";
      top: 0;
      & + button {
        float: right;
        position: relative;
        right: 5px;
      }
    }
  }
  &-list-icon {
    display: none;
  }
  &-list-preview {
    height: @preview-size;
    padding: 4px !important;
    &-container {
      display: inline-block;
      vertical-align: middle;
      width: @preview-size;
      height: @preview-size;
      line-height: @preview-size;
      font-size: 0;
      text-align: center;
      background-color: #fff;
      margin-right: 8px;
    }

    .veui-uploader-list-file-name {
      width: ~"calc(70% - "@preview-size~")";
    }
    .veui-uploader-progress {
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
      width: @image-size;
      height: @image-size;
      padding: @list-padding;
      box-sizing: border-box;
      margin: 0 10px 5px 0;
      border: 1px dashed @veui-gray-color-sup-2;
      text-align: center;
      line-height: @image-size - 2px - 2 * @list-padding;
      position: relative;
      button[ui~="operation"] {
        position: absolute;
        min-width: 70px;
        font-size: 12px;
        height: 30px;
        bottom: 30px;
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
        color: #fff !important;
        font-size: @veui-font-size-normal;
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
      padding-top: 50px;
      line-height: 1;
      span {
        display: block;
        margin-bottom: 10px;
      }
      svg {
        font-size: @icon-size;
      }
    }
    .veui-uploader-progress {
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
  &-hide {
    display: none;
  }
  &[ui~="ellipsis"] &-list-file-name {
    text-overflow: ellipsis;
  }
  &[ui~="multiline"] &-list-file-name {
    word-break: break-all;
  }
  &[ui~="horizontal"] {
    width: 100%;
    .veui-uploader-list-file {
      width: 100%;
      li {
        float: left;
        width: @width;
        margin-right: 10px;
      }
    }
    .veui-uploader-list-image li {
      float: left;
    }
  }
  &[ui~="list-icon"] &-list-icon {
    display: inline;
    margin-right: 3px;
  }
  &[ui~="bottom-mask"] &-list-image-mask {
    top: auto;
    bottom: @list-padding;
    left: @list-padding;
    width: ~"calc(100% - "2 * @list-padding~")";
    height: 30px;
    line-height: 30px;
  }
  .veui-button[ui~="delete"] {
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
      left: ~"calc(50% - 35px)";
      top: 50%;
      height: 6px;
      max-width: 70px !important;
      border-radius: 3px;
    }
    &-bar {
      background-color: @veui-theme-color-primary;
      &-full {
        z-index: -1;
        width: 70px;
        background-color: @veui-gray-color-sup-3;
      }
    }
  }
}
</style>
