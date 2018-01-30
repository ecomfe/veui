<template>
  <div class="veui-uploader" :ui="ui" ref="main">
    <div class="veui-uploader-button-container" v-if="type === 'file'">
      <label class="veui-button veui-uploader-input-label"
        :class="{'veui-uploader-input-label-disabled': realUneditable ||
          (maxCount > 1 && fileList.length >= maxCount) ||
          (requestMode === 'iframe' && isSubmiting)}"
        @click="replacingFile = null" ref="label">
        <slot name="button-label"><icon class="veui-uploader-input-label-icon"
          :name="icons.upload"></icon>选择文件</slot>
        <input :id="inputId" hidden type="file" ref="input"
          @change="handleNewFiles"
          :name="name"
          :disabled="realUneditable ||
            (maxCount > 1 && fileList.length >= maxCount) ||
            (requestMode === 'iframe' && disabledWhenSubmiting)"
          :accept="accept"
          :multiple="requestMode !== 'iframe' && (maxCount > 1 || maxCount === undefined) && !isReplacing"
          @click.stop>
      </label>
      <span v-if="$slots.desc" class="veui-uploader-tip"><slot name="desc"></slot></span>
      <span class="veui-uploader-error">
        <template v-if="error.typeInvalid"><slot name="type-invalid"><icon :name="icons.alert"></icon>文件的类型不符合要求</slot></template>
        <template v-if="error.sizeInvalid"><slot name="size-invalid"><icon :name="icons.alert"></icon>文件的大小不符合要求</slot></template>
        <template v-if="error.countOverflow"><slot name="count-overflow"><icon :name="icons.alert"></icon>文件的数量超过限制</slot></template>
      </span>
    </div>
    <ul :class="listClass">
      <li v-for="(file, index) in fileList" :key="index">
        <template v-if="(type === 'file' && file.status !== 'uploading')
          || type === 'image' && (!file.status || file.status === 'success')">
          <slot name="file" :file="file">
            <template v-if="type === 'file'">
              <icon :name="icons.file" class="veui-uploader-list-icon"></icon>
              <span class="veui-uploader-list-name"
                :class="{'veui-uploader-list-name-success': file.status === 'success',
                  'veui-uploader-list-name-failure': file.status === 'failure'
                }"
                :title="file.name">{{file.name}}</span>
              <span v-if="file.status === 'success'" class="veui-uploader-success"><slot name="success-label">上传成功！</slot></span>
              <span v-if="file.status === 'failure'" class="veui-uploader-failure" :ref="`fileFailure${index}`">
                <slot name="failure-label">上传失败</slot>
              </span>
              <veui-button v-if="file.status === 'failure'" ui="link" @click="retry(file)" :class="listClass + '-retry'"><icon :name="icons.redo"></icon>重试</veui-button>
              <veui-button ui="link remove" @click="removeFile(file)" :disabled="realUneditable"><icon :name="icons.clear"></icon></veui-button>
              <veui-tooltip position='top' :target="`fileFailure${index}`">{{ file.failureReason }}</veui-tooltip>
            </template>
            <template v-else>
              <img :src="file.src" :alt="file.alt || ''">
              <div v-if="!realUneditable" :class="listClass + '-mask'">
                <label :for="inputId"
                  class="veui-button"
                  :class="{'veui-uploader-input-label-disabled': realUneditable}"
                  @click.stop="replaceFile(file)">重新上传</label>
                <veui-button @click="removeFile(file)" :disabled="realUneditable" :class="listClass + '-mask-remove'"><icon :name="icons.clear"></icon>移除</veui-button>
              </div>
            </template>
            <transition name="veui-uploader-fade">
              <div v-if="type === 'image' && file.status === 'success'"
                :class="listClass + '-success'"
                @click="updateFileList(file, {status: null})">
                <span class="veui-uploader-success"><slot name="success-label"><icon :name="icons.success"></icon>完成</slot></span>
              </div>
            </transition>
          </slot>
        </template>
        <template v-else-if="file.status === 'uploading'">
          <slot name="uploading" :file="file">
            <veui-uploader-progress :type="progress" :loaded="file.loaded" :total="file.total"
              :class="type === 'image' ? listClass + '-status' : ''"
              :convertSizeUnit="convertSizeUnit">
              <slot name="uploading-label">上传中...</slot>
            </veui-uploader-progress>
            <veui-button v-if="type === 'file'" ui="link remove"
              @click="cancelFile(file)"><icon :name="icons.clear"></icon></veui-button>
            <veui-button v-else ui="aux operation"
              @click="cancelFile(file)">取消</veui-button>
          </slot>
        </template>
        <template v-else-if="file.status === 'failure' && type === 'image'">
          <slot name="failure" :file="file">
            <div :class="listClass + '-status'">
              <span class="veui-uploader-failure"><slot name="failure-label">错误！</slot>{{file.failureReason}}</span>
            </div>
            <veui-button ui="aux operation" @click="retry(file)">重试</veui-button>
            <veui-button ui="link" @click="removeFile(file)"
              :class="`${listClass}-mask-remove ${listClass}-mask-remove-failure`"><icon :name="icons.clear"></icon>移除</veui-button>
          </slot>
        </template>
      </li>
      <li v-if="type === 'image'" key="input"
        v-show="!maxCount || fileList.length < maxCount">
        <label class="veui-uploader-input-label-image"
          :class="{'veui-uploader-input-label-disabled': realUneditable || (requestMode === 'iframe' && isSubmiting)}"
          @click="replacingFile = null"
          ref="label"><input :id="inputId" hidden type="file" ref="input"
            @change="handleNewFiles"
            :name="name"
            :disabled="realUneditable || (requestMode === 'iframe' && disabledWhenSubmiting)"
            :accept="accept"
            :multiple="requestMode !== 'iframe' && (maxCount > 1 || maxCount === undefined) && !isReplacing"
            @click.stop>
            <icon :name="icons.add"></icon>
        </label>
      </li>
    </ul>
    <span class="veui-uploader-tip" v-if="$slots.desc && type === 'image'"><slot name="desc"></slot></span>
    <span class="veui-uploader-error" v-if="type === 'image'">
      <template v-if="error.typeInvalid"><slot name="type-invalid"><icon :name="icons.alert"></icon>文件的类型不符合要求</slot></template>
      <template v-if="error.sizeInvalid"><slot name="size-invalid"><icon :name="icons.alert"></icon>文件的大小不符合要求</slot></template>
      <template v-if="error.countOverflow"><slot name="count-overflow"><icon :name="icons.alert"></icon>文件的数量超过限制</slot></template>
    </span>
    <iframe v-if="requestMode === 'iframe' && isSubmiting" ref="iframe"
     :id="iframeId" :name="iframeId" class="veui-uploader-hide"></iframe>
    <form v-if="requestMode === 'iframe' && isSubmiting" ref="form" :action="queryURL" enctype="multipart/form-data"
      method="POST" :target="iframeId" class="veui-uploader-hide">
      <input v-for="(value, key) in payload" :name="key" :value="value" :key="key">
      <input v-if="iframeMode === 'callback'" name="callback" :value="`parent.${callbackNamespace}['${callbackFuncName}']`">
    </form>
  </div>
</template>

<script>
import Button from './Button'
import Icon from './Icon'
import Tooltip from './Tooltip'
import { cloneDeep, uniqueId, assign, isNumber, isArray, last, pick, omit, includes } from 'lodash'
import { ui, input, icons } from '../mixins'
import config from '../managers/config'
import { stringifyQuery } from '../utils/helper'
import bytes from 'bytes'

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
    'veui-tooltip': Tooltip,
    'veui-uploader-progress': getProgress()
  },
  mixins: [ui, input, icons],
  model: {
    event: 'change'
  },
  props: {
    name: {
      type: String,
      default: 'file'
    },
    value: {
      type: [Array, String]
    },
    type: {
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
      default: config.get('uploader.convertResponse') || function () {}
    },
    callbackNamespace: {
      type: String,
      default () {
        return config.get('uploader.callbackNamespace')
      }
    },
    dataType: {
      type: String,
      default: 'json',
      validator (value) {
        return includes(['json', 'text'], value)
      }
    },
    extensions: {
      type: Array,
      default () {
        return ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'tif', 'tiff', 'webp', 'apng', 'svg']
      }
    },
    accept: String,
    ui: String,
    maxCount: Number,
    maxSize: [Number, String],
    payload: Object,
    progress: {
      type: String,
      default: 'text'
    },
    /**
     * @deprecated
     */
    autoUpload: {
      type: Boolean,
      default: true
    },
    autoupload: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      fileList: this.genFileList(this.value),
      // pureFileList只有已经上传成功了文件，每个文件只保留name、src以及后端返回数据
      pureFileList: this.genFileList(this.value),
      canceled: false,
      // inputId用于图片里的重新上传的label的for
      inputId: uniqueId('veui-uploader-input'),
      iframeId: uniqueId('veui-uploader-iframe'),
      callbackFuncName: uniqueId('veuiUploaderCallback'),
      replacingFile: null,
      currentSubmitingFile: null,
      // isSubmiting 控制form与iframe是否存在
      isSubmiting: false,
      // disabledWhenSubmiting 控制input在submit时是否禁用
      disabledWhenSubmiting: false,
      error: {
        sizeInvalid: false,
        typeInvalid: false,
        countOverflow: false
      }
    }
  },
  watch: {
    value (val) {
      this.pureFileList = this.genFileList(val)

      let successIndex = 0
      this.fileList = this.fileList
        .map(file => {
          if (file.status === 'success' || !file.status) {
            // 处理外部直接减少文件的情形
            if (successIndex + 1 > this.pureFileList.length) {
              return null
            }
            return assign(file, this.pureFileList[successIndex++])
          }
          return file
        })
        .filter(file => !!file)
        // 处理外部直接增加文件的情形
        .concat(cloneDeep(this.pureFileList.slice(successIndex)))
    },
    status (val) {
      if (val) {
        this.$emit('statuschange', val)
      }
    }
  },
  computed: {
    listClass () {
      return `veui-uploader-list${this.type === 'image' ? '-image' : ''}`
    },
    latestFile () {
      return this.fileList[this.fileList.length - 1]
    },
    queryURL () {
      let queryString = stringifyQuery(assign(
        this.requestMode === 'iframe' && this.iframeMode === 'callback'
          ? {callback: `parent.${this.callbackNamespace}['${this.callbackFuncName}']`}
          : {},
        this.payload
      ))
      return `${this.action}${queryString ? '?' + queryString : ''}`
    },
    isReplacing () {
      return !!this.replacingFile
    },
    realUneditable () {
      return this.realDisabled || this.realReadonly
    },
    status () {
      if (!this.fileList.length) {
        return 'empty'
      }

      if (this.fileList.some(file => file.status === 'uploading')) {
        return 'uploading'
      }

      if (this.fileList.some(file => file.status === 'failure')) {
        return 'failure'
      }

      return 'success'
    },
    realAutoupload () {
      return this.autoupload && this.autoUpload
    }
  },
  mounted () {
    if (this.requestMode === 'xhr') {
      return
    }

    if (this.iframeMode === 'postmessage') {
      this.handlePostmessage = event => {
        if (!event.source ||
          !event.source.frameElement ||
          event.source.frameElement.id !== this.iframeId ||
          this.canceled) {
          return
        }

        // 支持action为绝对路径或相对路径，ie9里的location没有origin
        let actionOrigin = /^https?:\/\//.test(this.action)
          ? this.action.match(/^https?:\/\/[^/]*/)[0]
          : location.origin || (location.protocol + '//' + location.host)

        if (actionOrigin === event.origin) {
          this.uploadCallback(this.parseData(event.data), this.currentSubmitingFile)
        }
      }
      window.addEventListener('message', this.handlePostmessage)
    } else if (this.iframeMode === 'callback') {
      if (!window[this.callbackNamespace]) {
        window[this.callbackNamespace] = {}
      }
      window[this.callbackNamespace][this.callbackFuncName] = data => {
        if (!this.canceled) {
          this.uploadCallback(this.parseData(data), this.currentSubmitingFile)
        }
      }
    }
  },
  beforeDestroy () {
    if (this.requestMode === 'xhr') {
      return
    }

    if (this.iframeMode === 'callback') {
      window[this.callbackNamespace][this.callbackFuncName] = null
    } else if (this.iframeMode === 'postmessage') {
      window.removeEventListener('message', this.handlePostmessage)
    }
  },
  methods: {
    genFileList (value) {
      if (this.maxCount !== 1 && isArray(value)) {
        return cloneDeep(value)
      }
      return value ? [assign(this.fileList ? this.fileList[0] : {}, {
        src: value,
        name: value
      })] : []
    },
    handleNewFiles () {
      this.canceled = false

      this.error = {
        sizeInvalid: false,
        typeInvalid: false,
        countOverflow: false
      }

      let newFiles
      if (this.requestMode === 'xhr') {
        newFiles = [...this.$refs.input.files].filter(file => {
          return this.validateFile(file)
        })
      } else {
        let name = this.$refs.input.value.replace('C:\\fakepath\\', '')
        let size = this.$refs.input.files && this.$refs.input.files[0].size
        if (!this.validateFile({name, size})) {
          return
        }
        newFiles = [{status: 'uploading', name}]
      }

      if (!newFiles.length) {
        return
      }

      if (this.isReplacing) {
        // type=image时，点击重新上传进入此分支，替换掉原位置的文件replacingFile
        let newFile = newFiles[0]
        if (this.requestMode === 'xhr' && window.URL) {
          newFile.src = window.URL.createObjectURL(newFile)
          newFile.toBeUploaded = true
        }

        let replacingIndex = this.fileList.indexOf(this.replacingFile)
        this.removeFile(this.replacingFile)
        this.fileList.splice(replacingIndex, 0, newFile)
        this.replacingFile = null

        if (this.requestMode === 'iframe' && this.realAutoupload) {
          this.submit(newFile)
        }
        if (this.requestMode === 'xhr' && this.realAutoupload) {
          this.upload(newFile)
        }
      } else {
        if (this.maxCount !== 1 && (this.fileList.length + newFiles.length) > this.maxCount) {
          this.error.countOverflow = true
          return
        }

        this.fileList = [
          ...this.fileList.filter(file => {
            return file.status !== 'failure'
          }),
          ...newFiles.map(file => {
            if (this.requestMode === 'xhr' && this.type === 'image' && window.URL) {
              file.src = window.URL.createObjectURL(file)
            }
            file.toBeUploaded = true
            return file
          })
        ]

        if (this.maxCount === 1) {
          this.fileList = this.fileList.slice(-1)
        }

        if (this.requestMode === 'iframe' && this.realAutoupload) {
          this.submit()
        }
        if (this.requestMode === 'xhr' && this.realAutoupload) {
          this.uploadFiles()
        }
      }
    },
    validateFile ({name, size}) {
      let typeValidation = this.validateFileType(name)
      this.error.typeInvalid = !typeValidation

      let sizeValidation = this.validateFileSize(size)
      this.error.sizeInvalid = !sizeValidation

      return typeValidation && sizeValidation
    },
    validateFileType (filename) {
      if (!this.accept) {
        return true
      }

      let extension = last(filename.split('.')).toLowerCase()

      return this.accept.split(/,\s*/).some(item => {
        let acceptExtention = last(item.split(/[./]/)).toLowerCase()

        if (acceptExtention === extension ||
          // 对于类似'application/msword'这样的mimetype与扩展名对不上的情形跳过校验
          (acceptExtention !== '*' && item.indexOf('/') > -1)) {
          return true
        }

        if (acceptExtention === '*' &&
          item.indexOf('/') > -1 &&
          this.extensions.indexOf(extension) > -1) {
          return true
        }
        return false
      })
    },
    validateFileSize (fileSize) {
      return !this.maxSize || !fileSize || fileSize <= bytes.parse(this.maxSize)
    },
    uploadFiles () {
      this.fileList.forEach(file => {
        if (file.toBeUploaded) {
          this.upload(file)
        }
      })
    },
    upload (file) {
      this.reset()

      this.updateFileList(file, {status: 'uploading'})
      let xhr = new XMLHttpRequest()
      file.xhr = xhr

      xhr.upload.onprogress = e => {
        switch (this.progress) {
          case 'number':
          case 'bar':
            file.loaded = e.loaded
            file.total = e.total
            this.updateFileList(file)
            break
        }
        this.$emit('progress', file, e)
      }
      xhr.onload = () => {
        this.uploadCallback(this.parseData(xhr.responseText), file)
      }
      xhr.onerror = () => {
        this.showFailureResult({}, file)
        this.$emit('failure')
      }
      let formData = new FormData()
      formData.append(this.name, file)

      for (let key in this.payload) {
        formData.append(key, this.payload[key])
      }

      xhr.open('POST', this.queryURL, true)
      for (let key in this.headers) {
        xhr.setRequestHeader(key, this.headers[key])
      }
      xhr.withCredentials = this.withCredentials
      xhr.send(formData)
    },
    replaceFile (file) {
      this.replacingFile = file
    },
    submit (file = this.latestFile) {
      this.currentSubmitingFile = file
      this.updateFileList(file, {status: 'uploading'})

      this.isSubmiting = true

      this.$nextTick(() => {
        let form = this.$refs.form

        document.body.appendChild(this.$refs.iframe)
        document.body.appendChild(form)

        form.appendChild(this.$refs.input)
        form.submit()
        this.disabledWhenSubmiting = true

        this.reset()
      })
    },
    uploadCallback (data, file) {
      this.isSubmiting = false
      this.disabledWhenSubmiting = false

      data = this.convertResponse(data) || data
      if (data.status === 'success') {
        this.showSuccessResult(data, file)
        this.$emit('success', this.getPureFile(file, data))
      } else if (data.status === 'failure') {
        this.showFailureResult(data, file)
        this.$emit('failure', this.getPureFile(file, data))
      }
      this.currentSubmitingFile = null
    },
    showSuccessResult (data, file) {
      file.xhr = null
      file.toBeUploaded = null
      this.updateFileList(file, data, true)
      setTimeout(() => {
        this.updateFileList(file, {status: null})
      }, 300)
    },
    showFailureResult (data, file) {
      file.xhr = null
      file.toBeUploaded = null
      file.failureReason = data.reason || ''
      this.updateFileList(file, data)
    },
    updateFileList (file, properties, toEmit = false) {
      if (properties) {
        assign(file, properties)
      }

      this.$set(this.fileList, this.fileList.indexOf(file), file)

      if (toEmit) {
        this.pureFileList.splice(this.getIndexInPureList(file),
          0,
          this.getPureFile(file, properties))

        this.$emit('change', this.maxCount === 1
          ? (this.pureFileList[0].src || this.pureFileList[0].name)
          : this.pureFileList)
      }
    },
    getPureFile (file, properties) {
      return assign(pick(file, ['name', 'src']), omit(properties, 'status'))
    },
    getIndexInPureList (file) {
      let initialIndex = this.fileList.indexOf(file)
      return initialIndex - this.fileList
        .slice(0, initialIndex)
        .filter(f => f.status === 'uploading' || f.status === 'failure')
        .length
    },
    retry (file) {
      if (this.requestMode === 'iframe') {
        this.submit(file)
      } else {
        this.upload(file)
      }
    },
    removeFile (file) {
      this.error.countOverflow = false

      if (this.maxCount === 1) {
        this.fileList = []
        this.$emit('change', null)
      } else {
        if (file.status === 'success' || !file.status) {
          this.pureFileList.splice(this.getIndexInPureList(file), 1)
        }
        this.fileList.splice(this.fileList.indexOf(file), 1)

        this.$emit('change', this.pureFileList)
      }

      this.$emit('remove', file)
    },
    cancelFile (file) {
      if (this.requestMode === 'iframe') {
        this.canceled = true
        this.isSubmiting = false
        this.disabledWhenSubmiting = false
      }

      if (file.xhr) {
        file.xhr.abort()
      }

      this.removeFile(file)
    },
    reset () {
      this.$refs.input.value = ''
      this.$refs.label.appendChild(this.$refs.input)
    },
    convertSizeUnit (size) {
      return bytes(size, {decimalPlaces: 1})
    },
    parseData (data) {
      if (typeof data === 'object') {
        return data
      }

      if (typeof data === 'string') {
        if (this.dataType === 'json') {
          try {
            return JSON.parse(data)
          } catch (error) {
            this.$emit('failure', {error})
            return {status: 'failure'}
          }
        } else if (this.dataType === 'text') {
          return data
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
        if (this.type !== 'text' && isNumber(this.loaded) && isNumber(this.total)) {
          return Math.ceil((this.loaded) / this.total * 100) + '%'
        }
        return ''
      },
      content () {
        switch (this.type) {
          case 'text':
            return this.$slots.default
          case 'number':
            return this.percent
              ? `${this.percent} ${this.convertSizeUnit(this.loaded)}/${this.convertSizeUnit(this.total)}`
              : ''
          case 'bar':
            return ''
        }
      }
    },
    render () {
      let bar = this.type === 'bar'
        ? [<div class="veui-uploader-progress-bar" style={{ width: this.percent || '0%' }}></div>,
          <div class="veui-uploader-progress-bar-full"></div>]
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
