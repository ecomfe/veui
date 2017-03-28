<template>
  <div class="veui-uploader" :ui="ui">
    <div ref="inputContainer">
      <label class="veui-button input-label"
        :class="{'input-label-disabled': disabled}"
        ui="aux" :for="inputId" ref="label"><icon name="upload"></icon>{{text}}</label>
      <input hidden type="file" :id="inputId" ref="input" @change="onChange" :name="name"  :disabled="disabled">
      <span class="veui-uploader-tip" slot="tip">{{tip}}</span>
    </div>
    <div class="veui-uploader-warning">
      <span v-if="warning === 'success'" class="veui-uploader-upload-success">{{successText}}</span>
      <span v-if="warning === 'typeInvalid'" class="veui-uploader-upload-warning">{{typeInvalidText}}</span>
      <span v-if="warning === 'sizeInvalid'" class="veui-uploader-upload-warning">{{sizeInvalidText}}</span>
    </div>
    <ul class="veui-uploader-file-list">
      <li v-for="file in fileList">
        <template v-if="!file.status || file.status === 'complete'">
          <slot name="fileContent" :file="file">
            <span class="veui-uploader-file-list-name"
              :title="ui.indexOf('ellipsis') > -1 ? file.name: ''">{{file.name}}</span>
            <div class="veui-uploader-file-list-sup">
              <span class="veui-uploader-file-list-size">{{file.size}}</span>
              <span class="veui-uploader-operation-delete" @click="deleteFile(file.fileUid)"><icon name="close"></icon></span>
            </div>
          </slot>
        </template>
        <template v-else-if="file.status === 'uploading'">
          <slot name="uploading" :file="file">
            <span>{{uploadingText}}</span>
            <span class="veui-uploader-operation-delete" @click="cancelUploading(file.fileUid)"><icon name="close"></icon></span>
          </slot>
        </template>
        <template v-else-if="file.status === 'failure'">
          <slot name="failure" :file="file">
            <span class="veui-uploader-upload-failure">{{failureText}}</span>
            <span class="veui-uploader-operation-retry" @click="retry">重试</span>
          </slot>
        </template>
      </li>
    </ul>
  </div>
</template>
<script>
import Icon from './Icon'
import 'vue-awesome/icons/close'
import 'vue-awesome/icons/upload'

export default {
  name: 'veui-uploader',
  components: {
    Icon
  },
  props: {
    files: Array,
    uploaderType: String,
    name: {
      type: String,
      default: 'file'
    },
    action: String,
    withCredentials: Boolean,
    headers: Object,
    extentionTypes: [Array, String],
    disabled: Boolean,
    ui: String,
    maxNumber: Number,
    repeatable: Boolean,
    args: Object,
    uploadCallback: {
      type: Function,
      default (data) {
        data = JSON.parse(data)
        if (data.status === 'success') {
          this.onSuccess(data)
        } else if (data.status === 'failure') {
          this.onFailure(data)
        }
      }
    },
    onSuccess: {
      type: Function,
      default (data) {
        this.latestFile.status = 'complete'
        this.latestFile.name = data.name
        this.latestFile.fileUid = data.fileUid
        this.latestFile.size = data.size
        this.reset()
        this.warning = 'success'
      }
    },
    onFailure: {
      type: Function,
      default (data) {
        this.latestFile.status = 'failure'
        this.failureText = '上传失败！' + (data.reason || '')
        this.warning = ''
      }
    },
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
      fileList: this.files,
      canceled: false,
      warning: '',
      failureText: '',
      iframeId: 'veui-uploader-iframe' + Date.now(),
      formId: 'veui-uploader-form' + Date.now(),
      inputId: 'veui-uploader-input' + Date.now()
    }
  },
  computed: {
    // 同一时间只能上传一个文件，只有一个文件传好了才能继续传，确保只有fileList里的最后一项是当前正在处理的文件
    latestFile () {
      return this.fileList[this.fileList.length - 1]
    }
  },
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
    window.onmessage = event => {
      if (this.canceled) return
      this.uploadCallback(event.data)
    }
  },
  beforeDestroy () {
    document.body.removeChild(document.getElementById(this.iframeId))
    document.body.removeChild(document.getElementById(this.formId))
  },
  methods: {
    onChange () {
      this.canceled = false
      let filename = this.$refs.input.value
      if (!this.validateFileType(filename)) {
        this.warning = 'typeInvalid'
        return
      }
      if (this.latestFile && this.latestFile.status === 'failure') {
        this.fileList.pop()
      }
      if (this.fileList.length >= this.maxNumber) {
        this.deleteFile(this.fileList[0].fileUid)
      }
      this.warning = ''
      this.fileList.push({status: 'uploading', name: filename})
      this.$emit('change')
      this.submit()
    },
    cancelUploading () {
      if (this.latestFile.status === 'failure') {
        this.fileList.pop()
      } else if (this.latestFile.status === 'uploading') {
        this.canceled = true
        this.deleteFile(this.latestFile.fileUid)
      }
      this.reset()
    },
    validateFileType (filename) {
      let reg = Array.isArray(this.extentionTypes)
        ? `\\.(?:${this.extentionTypes.join('|')})$`
        : `\\.(?:${this.extentionTypes.replace(/,|;|\./g, '|')})$`
      return new RegExp(reg, 'i').test(filename)
    },
    submit () {
      let form = document.getElementById(this.formId)
      form.appendChild(this.$refs.input)

      for (let key in this.args) {
        let extraArgsInput = document.createElement('input')
        extraArgsInput.name = key
        extraArgsInput.value = typeof this.args[key] === 'function' ? this.args[key].call(this) : this.args[key]
        form.appendChild(extraArgsInput)
      }
      form.submit()
    },
    retry () {
      document.getElementById(this.formId).submit()
    },
    reset () {
      this.$refs.inputContainer.appendChild(this.$refs.input)
      document.getElementById(this.formId).innerHTML = ''
    }
  }

}
</script>
<style lang="less">
@import "../styles/theme-default/lib.less";
@prefix: veui-uploader;

.@{prefix} {
  width: 350px;
  overflow: hidden;
  .input-label {
    cursor: pointer;
    display: inline-block;
    color: @veui-text-color-strong;
    margin-right: 1em;

    &-disabled {
      border: none;
      background-color: @veui-gray-color-sup-3;
      color: @veui-text-color-weak;
      .veui-shadow(none);
      cursor: default;
      &:hover {
        border: none;
        background-color: @veui-gray-color-sup-3;
        color: @veui-text-color-weak;
      }
    }
  }
  &-file-list {
    color: @veui-theme-color-primary;
    padding: 0;
    margin: 0;
    width: 300px;
    list-style: none;
    li {
      padding: 10px 5px;
    }
    li:hover {
      background-color: @veui-gray-color-sup-3;
      .@{prefix}-operation-delete {
        visibility: visible;
      }
    }
    &-name {
      overflow: hidden;
      max-width: 180px;
      display: inline-block;
    }
    &-sup {
      float: right;
    }
    &-size {
      color: @veui-gray-color-weak;
      margin-right: 40px;
    }
  }
  &[ui~="ellipsis"] {
    .@{prefix}-file-list-name {
      text-overflow: ellipsis;
    }
  }
  &[ui~="multiline"] {
    .@{prefix}-file-list-name {
      word-break: break-all;
    }
  }
  &[ui~="horizontal"] {
    width: 100%;
    .@{prefix}-file-list {
      width: 100%;
      li {
        width: 350px;
        float: left;
        margin-right: 10px;
      }
    }
  }
  &[ui~="vertical"] {

  }
  &-tip {
    color: @veui-gray-color-weak;
  }
  &-warning {
    margin: 20px 0 5px 5px;
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
  &-operation-delete {
    font-size: 16px;
    color: @veui-alert-color-primary;
    cursor: pointer;
    visibility: hidden;
  }
  &-operation-retry {
    cursor: pointer;
    color: @veui-theme-color-primary;
    float: right;
  }
}
</style>
