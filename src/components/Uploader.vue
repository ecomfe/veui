<template>
  <div class="veui-uploader" :ui="ui">
    <div>
      <label v-if="uploaderType === 'file'"
        class="veui-button veui-uploader-input-label"
        :class="{'veui-uploader-input-label-disabled': disabled}"
        ui="aux" ref="label"><icon class="veui-uploader-input-label-icon" name="upload"></icon>{{text}}
        <input hidden type="file" ref="input" @change="onChange" :name="name" :disabled="disabled">
      </label>
      <span class="veui-uploader-tip" slot="tip">{{tip}}</span>
    </div>
    <div class="veui-uploader-warning">
      <slot name="warning" :warning="warning">
        <span :class="warningClass">{{warningText}}</span>
      </slot>
    </div>
    <ul v-if="uploaderType === 'file'" class="veui-uploader-list">
      <li v-for="file in fileList" :class="{'veui-uploader-list-preview':
        previewImage && (!file.status || file.status === 'success')}">
        <template v-if="!file.status || file.status === 'success'">
          <slot name="file-content" :file="file">
            <div v-if="previewImage" class="veui-uploader-list-preview-container">
              <img :src="file.src" :alt="file.alt">
            </div>
            <span class="veui-uploader-list-name"
            :title="uiProps.indexOf('ellipsis') > -1 ? file.name: ''">{{file.name}}</span>
            <span class="veui-uploader-list-size">{{file.size}}</span>
            <veui-button ui="simple delete" @click="deleteFile(file.fileUid)"><icon name="close"></icon></veui-button>
          </slot>
        </template>
        <template v-else-if="file.status === 'uploading'">
          <slot name="uploading-content" :file="file">
            <span class="veui-uploader-list-hint veui-uploader-uploading">{{uploadingText}}</span>
            <veui-button ui="simple delete" @click="cancelUploading(file.fileUid)"><icon name="close"></icon></veui-button>
          </slot>
        </template>
        <template v-else-if="file.status === 'failure'">
          <slot name="failure-content" :file="file">
            <span class="veui-uploader-list-hint veui-uploader-upload-failure">{{failureText}}</span>
            <veui-button ui="simple" @click="retry">重试</veui-button>
          </slot>
        </template>
      </li>
    </ul>
    <ul v-else-if="uploaderType === 'image'" class="veui-uploader-list-image">
      <li v-for="file in fileList" :class="{'veui-uploader-list-image-content'
        : !file.status || file.status === 'success'}">
        <template v-if="!file.status || file.status === 'success'">
          <slot name="file-content" :file="file">
            <img :src="file.src" :alt="file.alt">
            <div class="veui-uploader-list-image-mask">
              <veui-button ui="simple" @click="deleteFile(file.fileUid)">移除</veui-button>
            </div>
          </slot>
        </template>
        <template v-else-if="file.status === 'uploading'">
          <slot name="uploading-content" :file="file">
            <div class="veui-uploader-list-image-hint">
              <span class="veui-uploader-uploading">{{uploadingText}}</span>
            </div>
            <veui-button ui="aux operation" @click="cancelUploading(file.fileUid)">取消</veui-button>
          </slot>
        </template>
        <template v-else-if="file.status === 'failure'">
          <slot name="failure-content" :file="file">
            <div class="veui-uploader-list-image-hint">
              <span class="veui-uploader-upload-failure">{{failureText}}</span>
            </div>
            <veui-button ui="aux operation" @click="retry">重试</veui-button>
          </slot>
        </template>
      </li>
      <li>
        <label class="veui-uploader-input-label-image"
          :class="{'veui-uploader-input-label-disabled': disabled}"
          ref="label"><input hidden type="file" ref="input" @change="onChange" :name="name" :disabled="disabled">
        </label>
      </li>
    </ul>
  </div>
</template>
<script>
import Icon from './Icon'
import Button from './Button'
import 'vue-awesome/icons/close'
import 'vue-awesome/icons/upload'
import 'vue-awesome/icons/plus'
import {endsWith, cloneDeep} from 'lodash'
import {ui} from '../mixins/index'

export default {
  name: 'veui-uploader',
  components: {
    Icon,
    'veui-button': Button
  },
  props: {
    uploaderType: {
      type: String,
      default: 'file'
    },
    files: Array,
    name: {
      type: String,
      default: 'file'
    },
    action: {
      type: String,
      required: true
    },
    previewImage: {
      type: Boolean,
      default: false
    },
    extentionTypes: [Array, String],
    disabled: Boolean,
    ui: String,
    maxNumber: Number,
    maxSize: Number,
    args: Object,
    cancelUploading: Function,
    deleteFile: Function,
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
    sizeInvalidText: {
      type: String,
      default: '文件大小超过限制！'
    },
    typeInvalidText: {
      type: String,
      default: '文件格式不符！'
    }
  },
  data () {
    return {
      fileList: cloneDeep(this.files),
      canceled: false,
      failureText: '',
      warning: '',
      iframeId: 'veui-uploader-iframe' + Date.now(),
      formId: 'veui-uploader-form' + Date.now(),
      onMessage: null
    }
  },
  watch: {
    files (val) {
      this.fileList = cloneDeep(val)
    }
  },
  computed: Object.assign({
    // 同一时间只能上传一个文件，只有一个文件传好了才能继续传，确保只有files里的最后一项是当前正在处理的文件
    latestFile () {
      return this.fileList[this.fileList.length - 1]
    },
    warningClass () {
      return this.warning === 'success' ? 'veui-uploader-upload-success' : 'veui-uploader-upload-warning'
    },
    warningText () {
      return this.warning ? this[this.warning + 'Text'] : ''
    }}, ui.computed
  ),
  created () {
    let iframe = document.createElement('iframe')
    iframe.id = this.iframeId
    iframe.name = this.iframeId
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    let form = document.createElement('form')
    form.id = this.formId
    form.setAttribute('enctype', 'multipart/form-data')
    form.method = 'POST'
    form.target = this.iframeId
    form.action = this.action
    form.style.display = 'none'
    document.body.appendChild(form)
  },
  mounted () {
    this.onMessage = event => {
      if (this.canceled) return
      let data = JSON.parse(event.data)
      if (data.status === 'success') {
        this.$emit('uploadSuccess', data)
        this.onSuccess(data)
      } else if (data.status === 'failure') {
        this.$emit('uploadFailure', data)
        this.onFailure(data)
      }
    }
    window.addEventListener('message', this.onMessage)
  },
  beforeDestroy () {
    window.removeEventListener('message', this.onMessage)
    document.body.removeChild(document.getElementById(this.iframeId))
    document.body.removeChild(document.getElementById(this.formId))
  },
  methods: {
    onChange () {
      this.canceled = false
      if (this.latestFile && this.latestFile.status === 'failure') {
        this.fileList.pop()
      }
      let filename = this.$refs.input.value
      if (!this.validateFileType(filename)) {
        this.warning = 'typeInvalid'
        return
      }
      if (!this.validateFileSize()) {
        this.warning = 'sizeInvalid'
        return
      }
      if (this.fileList.length >= this.maxNumber) {
        this.deleteFile(this.fileList[0].fileUid)
      }
      this.warning = ''
      this.fileList.push({status: 'uploading', name: filename})
      this.$emit('change', this.fileList)
      this.submit()
    },
    validateFileType (filename) {
      let extentionTypes = Array.isArray(this.extentionTypes)
        ? this.extentionTypes.slice(0)
        : this.extentionTypes.split(/[,;.]/)
      return extentionTypes.some(ext => endsWith(filename, '.' + ext))
    },
    validateFileSize () {
      let input = this.$refs.input
      if (input.files && this.maxSize) {
        return input.files[0].size <= this.maxSize * 1024 * 1024
      }
      return true
    },
    submit () {
      let form = document.getElementById(this.formId)
      form.appendChild(this.$refs.input)
      let extraArgsHTML = ''
      for (let key in this.args) {
        extraArgsHTML += `<input name="${key}"
          value="${typeof this.args[key] === 'function' ? this.args[key](this) : this.args[key]}">`
      }
      form.innerHTML += extraArgsHTML
      form.submit()
    },
    onSuccess (data) {
      Object.assign(this.latestFile, data)
      this.reset()
      this.warning = 'success'
    },
    onFailure (data) {
      this.latestFile.status = 'failure'
      this.failureText = '上传失败！' + (data.reason || '')
      this.warning = ''
      this.reset()
    },
    retry () {
      this.latestFile.status = 'uploading'
      document.getElementById(this.formId).submit()
    },
    reset () {
      this.$refs.label.appendChild(this.$refs.input)
      document.getElementById(this.formId).innerHTML = ''
    }
  }

}
</script>
<style lang="less">
@import "../styles/theme-default/lib.less";
@prefix: veui-uploader;
@prefix-button: veui-button;
@veui-uploader-icon-size: 16px;
@veui-uploader-preview-size: 60px;
@veui-uploader-image-large: 300px;
@veui-uploader-image-normal: 200px;
@veui-uploader-image-small: 100px;
@veui-uploader-list-padding: 3px;

.veui-uploader-disabled() {
  border: none;
  background-color: @veui-gray-color-sup-3;
  color: @veui-text-color-weak;
  box-shadow: none;
}

.@{prefix} {
  width: 350px;
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
      cursor: default;
      .veui-uploader-disabled()!important;
      &:hover {
        .veui-uploader-disabled()!important;
      }
    }
  }
  &-list {
    color: @veui-theme-color-primary;
    padding: 0;
    margin: 0;
    list-style: none;
    overflow: hidden;
    li {
      position: relative;
      padding: 10px 5px;
      box-sizing: content-box;
    }
    &-preview {
      height: @veui-uploader-preview-size;
      padding: @veui-uploader-list-padding !important;
    }
    &-preview &-name {
      width: ~"calc(70% - "@veui-uploader-preview-size~")";
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
    &-preview-container,
    &-name,
    &-size {
      display: inline-block;
      vertical-align: middle;
    }
    &-preview-container {
      width: @veui-uploader-preview-size;
      height: @veui-uploader-preview-size;
      line-height: @veui-uploader-preview-size;
      font-size: 0;
      text-align: center;
      img {
        max-width: 100%;
        max-height: 100%;
        vertical-align: middle;
      }
    }
    &-name {
      overflow: hidden;
      width: 70%;
    }
    &-size {
      color: @veui-gray-color-weak;
      width: ~"calc(30% - 2em)";
    }
    &-hint {
      display: inline-block;
      width: ~"calc(100% - 3em)";
      word-break: break-all;
    }
  }
  &-list-image {
    list-style: none;
    overflow: hidden;
    padding: 0;
    margin: 0;
    li {
      overflow: hidden;
      width: @veui-uploader-image-normal;
      height: @veui-uploader-image-normal;
      padding: @veui-uploader-list-padding;
      box-sizing: content-box;
      margin: 5px;
      border: 2px dashed @veui-gray-color-sup-2;
      text-align: center;
      position: relative;
      button[ui~="operation"] {
        position: absolute;
        min-width: 70px;
        top: ~"calc(50% + 10px)";
        left: ~"calc(50% - 35px)";
      }
    }

    &-content {
      line-height: @veui-uploader-image-normal;
      img {
        max-width: 100%;
        max-height: 100%;
        vertical-align: middle;
      }
      &:hover {
        .@{prefix}-list-image-mask {
          display: block;
        }
      }
    }
    &-mask {
      display: none;
      position: absolute;
      background-color: rgba(0, 0, 0, .5);
      top: @veui-uploader-list-padding;
      left: @veui-uploader-list-padding;
      width: ~"calc(100% - "2 * @veui-uploader-list-padding~")";;
      height: ~"calc(100% - "2 * @veui-uploader-list-padding~")";;
      text-align: center;
      button {
        vertical-align: middle;
        float: none !important;
        background: none;
        font-size: 18px;
        color: #fff;
        line-height: 1;
      }
      button:active,
      button:hover {
        background: none !important;
        color: #fff !important;
      }
    }
    &-hint {
      margin-top: 10%;
      height: 40%;
      span {
        vertical-align: middle;
        display: inline-block;
        word-break: break-all;
        max-width: 90%;
      }
      &::after {
        content: '';
        height: 100%;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .@{prefix}-input-label-image {
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
  }
  &-warning {
    margin: 20px 0 5px 5px;
  }
  &-tip {
    color: @veui-gray-color-weak;
    margin-left: 3px;
  }
  &-uploading {
    color: @veui-theme-color-primary;
  }
  &-upload-failure {
    color: @veui-alert-color-primary;
  }
  &-upload-success {
    color: @veui-success-color-primary;
  }
  &-upload-warning {
    color: @veui-warning-color-primary;
  }
  &[ui~="ellipsis"] {
    .@{prefix}-list-name {
      text-overflow: ellipsis;
    }
  }
  &[ui~="multiline"] {
    .@{prefix}-list-name {
      word-break: break-all;
    }
  }
  &[ui~="horizontal"] {
    width: 100%;
    .@{prefix}-list {
      width: 100%;
      li {
        float: left;
        width: 350px;
        margin-right: 10px;
      }
    }
    .@{prefix}-list-image li {
      float: left;
    }
  }
  &[ui~="small"] {
    .@{prefix}-list-image {
      li {
        height: @veui-uploader-image-small;
        width: @veui-uploader-image-small;
      }
      &-content {
        line-height: @veui-uploader-image-small;
      }
    }
  }
  &[ui~="large"] {
    .@{prefix}-list-image {
      li {
        height: @veui-uploader-image-large;
        width: @veui-uploader-image-large;
      }
      &-content {
        line-height: @veui-uploader-image-large;
      }
    }
  }
  .@{prefix-button}[ui~="simple"] {
    border: none;
    background-color: none;
    transition: none;
    .veui-shadow(none);
    height: @veui-uploader-icon-size;
    min-width: 2em;
    padding: 0;
  }
  .@{prefix-button}[ui~="delete"] {
    color: @veui-alert-color-primary;
    font-size: @veui-uploader-icon-size;
    min-width: @veui-uploader-icon-size;
    width: @veui-uploader-icon-size;
    visibility: hidden;
  }
}
</style>
