<template>
<div
  ref="main"
  :class="{
    [$c('uploader')]: true,
    [$c(`uploader-${isMediaType ? 'media' : type}`)]: true
  }"
  :ui="realUi"
  role="application"
  tabindex="-1"
  :aria-label="t('uploader')"
>
  <input
    ref="input"
    hidden
    type="file"
    :name="name"
    :accept="realAccept"
    :disabled="realUneditable"
    :multiple="
      requestMode !== 'iframe' &&
        (maxCount > 1 || maxCount === undefined) &&
        !isReplacing
    "
    @change="handleNewFiles"
  >

  <component
    :is="`veui-uploader-${isMediaType ? 'media' : 'file'}`"
    :type="type"
    :controls="controls"
    :files="fileList"
    :entries="entries"
    :addable="!canNotAddImage"
    :disabled="realUneditable"
    :picker-position="pickerPosition"
    :request-mode="requestMode"
    @add="handleImageAdd"
    @replace="handleImageReplace"
    @remove="handleImageRemove"
    @preview="handelImagePreview"
  >
    <template
      v-for="(_, name) in $scopedSlots"
      :slot="name"
      slot-scope="slotData"
    ><slot
      :name="name"
      v-bind="slotData"
    /></template>
  </component>

  <veui-lightbox
    :open.sync="previewOpen"
    :datasource="files.filter(file => file.status === 'success')"
    :index.sync="previewIndex"
    v-bind="realPreviewOptions"
  />
</div>
</template>

<script>
import { parse, format } from 'bytes'
import {
  cloneDeep,
  uniqueId,
  assign,
  last,
  pick,
  omit,
  includes,
  isEmpty,
  isFunction,
  partial,
  endsWith,
  find,
  isNumber
} from 'lodash'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import i18n from '../../mixins/i18n'
import config from '../../managers/config'
import toast from '../../managers/toast'
import warn from '../../utils/warn'
import Lightbox from '../Lightbox'
import FileUploader from './_FileUploader'
import MediaUploader from './_MediaUploader'

config.defaults({
  'uploader.requestMode': 'xhr',
  'uploader.iframeMode': 'postmessage',
  'uploader.callbackNamespace': 'veuiUploadResult',
  'uploader.pickerPosition': 'after',
  'uploader.mediaExtensions': {
    image: [
      'apng',
      'avif',
      'bmp',
      'gif',
      'ico',
      'cur',
      'jpg',
      'jpeg',
      'jfif',
      'pjpeg',
      'pjp',
      'png',
      'svg',
      'tif',
      'tiff',
      'webp'
    ],
    video: ['mp4', 'mov', 'wmv', 'flv', 'avi', 'avchd', 'webm', 'mkv']
  }
})

const ERRORS = {
  TYPE_INVALID: 'type',
  SIZE_INVALID: 'size',
  TOO_MANY_FILES: 'count',
  CUSTOM_INVALID: 'custom'
}

const PUBLIC_FILE_PROPS = ['name', 'src', 'type', 'poster']

export default {
  errors: ERRORS,
  name: 'veui-uploader',
  components: {
    'veui-lightbox': Lightbox,
    'veui-uploader-file': FileUploader,
    'veui-uploader-media': MediaUploader
  },
  mixins: [prefix, ui, input, i18n],
  model: {
    event: 'change'
  },
  props: {
    name: {
      type: String,
      default: 'file'
    },
    value: {
      type: [Array, String, Object]
    },
    type: {
      type: String,
      default: 'file',
      validator (value) {
        return includes(['file', 'media', 'image', 'video'], value)
      }
    },
    action: String,
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
      },
      validator (value) {
        return includes(['xhr', 'iframe', 'custom'], value)
      }
    },
    iframeMode: {
      type: String,
      default () {
        return config.get('uploader.iframeMode')
      }
    },
    convertResponse: {
      default () {
        return config.get('uploader.convertResponse')
      },
      validator (value) {
        return typeof value === 'function'
      }
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
      validator () {
        warn(
          '[veui-uploader] `extensions` is deprecated and will be removed in future versions. Use `accept` instead.',
          this
        )
        return true
      }
    },
    accept: String,
    validator: {
      type: Function
    },
    maxCount: Number,
    maxSize: [Number, String],
    payload: Object,
    autoupload: {
      type: Boolean,
      default: true
    },
    order: {
      type: String,
      validator (value) {
        return includes(['asc', 'desc'], value)
      }
    },
    compat: {
      type: Boolean,
      default: false
    },
    upload: Function,
    controls: Function,
    pickerPosition: {
      type: String,
      default () {
        return config.get('uploader.pickerPosition')
      }
    },
    entries: Function,
    previewOptions: {
      type: Object,
      default () {
        return {
          wrap: true,
          indicator: 'number'
        }
      }
    }
  },
  data () {
    return {
      fileList: this.genFileList(this.value),
      canceled: false,
      callbackFuncName: uniqueId('veuiUploaderCallback'),
      replacingFile: null,
      currentSubmitingFile: null,
      // submitting 控制form与iframe是否存在
      submitting: false,
      previewIndex: 0,
      previewOpen: false,
      expandedControlDropdowns: [],
      expandedEntryDropdown: false
    }
  },
  computed: {
    listClass () {
      return this.$c(`uploader-list${this.isMediaType ? '-media' : ''}`)
    },
    isReplacing () {
      return !!this.replacingFile
    },
    realUneditable () {
      return this.realDisabled || this.realReadonly
    },
    canNotAddImage () {
      return (
        this.realUneditable ||
        (this.maxCount && this.fileList.length >= this.maxCount) ||
        (this.requestMode === 'iframe' && this.submitting)
      )
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
    files () {
      return this.fileList.map(file => {
        return {
          ...pick(file, [
            'name',
            'src',
            'status',
            'toBeUploaded',
            'message',
            'poster'
          ]),
          ...file._extra
        }
      })
    },
    pureFileList () {
      return this.files
        .filter(file => file.status === 'success' && !file.toBeUploaded)
        .map(file => omit(file, ['status', 'toBeUploaded']))
    },
    realOrder () {
      return this.type === 'file' ? this.order || 'desc' : 'asc'
    },
    isMediaType () {
      return ['image', 'video', 'media'].indexOf(this.type) > -1
    },
    realAccept () {
      if (this.extensions) {
        return this.extensions
          .map(extension => {
            if (extension.indexOf('.') !== 0) {
              return `.${extension}`
            }
            return extension
          })
          .join(',')
      }
      if (this.accept) {
        return this.accept
      }
      switch (this.type) {
        case 'media':
          return 'video/*, image/*'
        case 'image':
          return 'image/*'
        case 'video':
          return 'video/*'
      }
      return null
    },
    realPreviewOptions () {
      return omit(this.previewOptions, ['index', 'open'])
    }
  },
  watch: {
    value: {
      handler (val) {
        let temp = this.genFileList(val)

        if (!Array.isArray(val)) {
          this.fileList = cloneDeep(temp)
          return
        }

        let successIndex = 0
        this.fileList = this.fileList
          .map(file => {
            if (file.status === 'success' && !file.toBeUploaded) {
              // 处理外部直接减少文件的情形
              if (successIndex + 1 > temp.length) {
                return null
              }
              return assign(file, temp[successIndex++])
            }
            return file
          })
          .filter(Boolean)
          // 处理外部直接增加文件的情形
          .concat(cloneDeep(temp.slice(successIndex)))
      },
      deep: true
    },
    status (val) {
      if (val) {
        this.$emit('statuschange', val)
      }
    }
  },
  created () {
    if (this.requestMode !== 'custom' && !this.action) {
      warn(
        '[veui-uploader] `action` is required when `request-mode` is not `custom`.',
        this
      )
    }
  },
  mounted () {
    if (this.requestMode === 'iframe') {
      if (this.iframeMode === 'postmessage') {
        this.handlePostmessage = event => {
          if (
            !event.source ||
            !event.source.frameElement ||
            event.source.frameElement.id !== this.iframeId ||
            this.canceled
          ) {
            return
          }

          // 支持action为绝对路径或相对路径，ie9里的location没有origin
          let actionOrigin = /^https?:\/\//.test(this.action)
            ? this.action.match(/^https?:\/\/[^/]*/)[0]
            : location.origin || location.protocol + '//' + location.host

          if (actionOrigin === event.origin) {
            this.uploadCallback(
              this.parseData(event.data),
              this.currentSubmitingFile
            )
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
    }
  },
  beforeDestroy () {
    this.submitting = false
    if (this.requestMode === 'iframe') {
      if (this.iframeMode === 'callback') {
        window[this.callbackNamespace][this.callbackFuncName] = null
      } else if (this.iframeMode === 'postmessage') {
        window.removeEventListener('message', this.handlePostmessage)
      }
    }
  },
  methods: {
    handleClick (e) {
      this.replacingFile = null
      this.reset()
      if (this.canNotAddImage) {
        e.preventDefault()
      }
    },
    handleEnter (e) {
      e.target.click()
    },
    genFileList (value) {
      if (!value) {
        return []
      }

      if (Array.isArray(value)) {
        return value.map(file => this.getNewFile(file))
      }

      if (typeof value === 'string') {
        return [
          assign(this.fileList ? this.fileList[0] : {}, {
            src: value,
            name: value
          })
        ]
      }

      return isEmpty(value) ? [] : [this.getNewFile(value)]
    },
    getNewFile (file) {
      let newFile = {
        status: 'success',
        type: this.getMediaType(file)
      }
      let extra = omit(file, PUBLIC_FILE_PROPS)
      if (!isEmpty(extra)) {
        newFile._extra = cloneDeep(extra)
      }
      return assign(newFile, pick(file, PUBLIC_FILE_PROPS))
    },
    handleNewFiles (files) {
      this.canceled = false

      if (!Array.isArray(files)) {
        files = this.$refs.input.files
      }

      let newFiles = [...files]
      let countFiles = this.fileList.length + newFiles.length
      if (
        !this.isReplacing &&
        this.maxCount !== 1 &&
        countFiles > this.maxCount
      ) {
        toast.error(this.t('tooManyFiles'))
        this.$emit('invalid', {
          errors: [
            {
              type: ERRORS.TOO_MANY_FILES,
              value: countFiles,
              message: this.t('tooManyFiles')
            }
          ]
        })
        return
      }

      Promise.all(newFiles.map(file => this.validateFile(file))).then(
        validationResults => {
          newFiles = newFiles.map((file, index) => {
            if (validationResults[index].valid) {
              file.toBeUploaded = true
              if (this.isMediaType && window.URL) {
                file.src = window.URL.createObjectURL(file)
              }
            } else {
              file.status = 'failure'
              file.message = validationResults[index].message
            }

            return file
          })

          if (this.isReplacing) {
            // mediaType = true 时，点击重新上传进入此分支，替换掉原位置的文件replacingFile
            let newFile = newFiles[0]
            newFile._replacingFile = this.replacingFile

            let replacingIndex = this.fileList.indexOf(this.replacingFile)
            this.$set(this.fileList, replacingIndex, newFile)
            this.$emit('change', this.getValue())
            this.replacingFile = null

            if (newFile.status === 'failure') {
              return
            }

            if (this.autoupload) {
              if (this.requestMode === 'iframe') {
                this.submit(newFile)
              } else {
                this.uploadFile(newFile)
              }
            }
          } else {
            this.fileList =
              this.realOrder === 'desc'
                ? [...newFiles, ...this.fileList]
                : [...this.fileList, ...newFiles]

            if (this.maxCount === 1) {
              this.fileList = this.fileList.slice(-1)
            }

            if (this.autoupload) {
              if (this.requestMode === 'iframe') {
                if (newFiles[0].toBeUploaded) {
                  this.submit(newFiles[0])
                }
              } else {
                this.uploadFiles()
              }
            }
          }
        }
      )
    },
    validateFile (file) {
      let errors = []
      let typeValidity = this.validateType(file.name)
      if (!typeValidity) {
        errors.push({
          type: ERRORS.TYPE_INVALID,
          value: file.name,
          message: this.t('fileTypeInvalid')
        })
      }

      let sizeValidity = this.validateSize(file.size)
      if (!sizeValidity) {
        errors.push({
          type: ERRORS.SIZE_INVALID,
          value: file.size,
          message: this.t('fileSizeInvalid')
        })
      }

      return new Promise(resolve => {
        resolve(this.validator ? this.validator(file) : { valid: true })
      }).then(result => {
        let customValidity = result.valid
        if (!customValidity) {
          errors.push({
            type: ERRORS.CUSTOM_INVALID,
            value: file,
            message: result.message
          })
        }

        if (errors.length) {
          this.$emit('invalid', {
            file,
            errors
          })
        }

        return {
          valid: customValidity && typeValidity && sizeValidity,
          message: errors
            .map(({ message }) => message)
            .join(this.t('separator'))
        }
      })
    },
    validateType (filename) {
      if (!this.realAccept) {
        return true
      }

      let extension = last(filename.split('.')).toLowerCase()

      if (this.extensions) {
        return this.extensions.indexOf(extension) > -1
      }

      return this.realAccept.split(/,\s*/).some(item => {
        let acceptExtention = last(item.split(/[./]/)).toLowerCase()

        if (
          acceptExtention === extension ||
          // 对于类似'application/msword'这样的mimetype与扩展名对不上的情形跳过校验
          (acceptExtention !== '*' && item.indexOf('/') > -1)
        ) {
          return true
        }

        let extensions
        const mediaExtensions = config.get('uploader.mediaExtensions')

        switch (this.type) {
          case 'image':
          case 'video':
            extensions = mediaExtensions[this.type]
            break
          case 'media':
            extensions = mediaExtensions.image.concat(mediaExtensions.video)
            break
          default:
            extensions = []
        }

        return (
          acceptExtention === '*' &&
          item.indexOf('/') > -1 &&
          (extensions.indexOf(extension) > -1 || !extensions.length)
        )
      })
    },
    validateSize (fileSize) {
      return !this.maxSize || !fileSize || fileSize <= parse(this.maxSize)
    },
    uploadFiles () {
      this.fileList.forEach(file => {
        if (file.toBeUploaded) {
          this.uploadFile(file)
        }
      })
    },
    onprogress (file, progress) {
      let index = this.fileList.indexOf(file)
      file.loaded = progress.loaded
      file.total = progress.total
      this.updateFileList(file)

      this.$emit('progress', this.files[index], index, progress || null)
    },
    onload (file, data) {
      this.uploadCallback(data, file)
    },
    oncancel (file) {
      if (file._replacingFile) {
        this.restoreReplacingFile(file)
      } else {
        this.remove(file, true)
      }
    },
    onerror (file, error) {
      let index = this.fileList.indexOf(file)
      this.showFailureResult(error || {}, file)
      this.$emit('failure', this.files[index], index)
    },
    uploadFile (file) {
      file.toBeUploaded = false
      this.updateFileList(file, 'uploading')

      if (this.requestMode === 'xhr' && !this.upload) {
        let xhr = new XMLHttpRequest()
        file.xhr = xhr

        xhr.upload.onprogress = e => this.onprogress(file, e)
        xhr.onload = () => this.onload(file, this.parseData(xhr.responseText))
        xhr.onerror = e => this.onerror(file, e)

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
      } else if (this.requestMode === 'custom' && this.upload) {
        let cancelFn = this.upload.call(null, file, {
          onload: partial(this.onload, file),
          onprogress: partial(this.onprogress, file),
          oncancel: partial(this.oncancel, file),
          onerror: partial(this.onerror, file)
        })

        if (cancelFn && isFunction(cancelFn)) {
          file.cancel = cancelFn
        }
      }
    },
    replaceFile (file) {
      this.replacingFile = file
      this.reset()
    },
    submit (file) {
      this.currentSubmitingFile = file
      this.updateFileList(file, 'uploading')

      this.submitting = true

      this.$nextTick(() => {
        let { form, iframe } = this.$refs

        document.body.appendChild(iframe)
        document.body.appendChild(form)

        form.appendChild(this.$refs.input)
        form.submit()
      })
    },
    uploadCallback (data, file) {
      this.submitting = false
      let index = this.fileList.indexOf(file)

      data = this.convertResponse ? this.convertResponse(data) : data

      delete file.xhr
      delete file.toBeUploaded

      if (data.success) {
        this.showSuccessResult(data, file)
        this.$emit('success', this.files[index], index)
      } else {
        this.showFailureResult(data, file)
        this.$emit('failure', this.files[index], index)
      }
      this.currentSubmitingFile = null
    },
    showSuccessResult (data, file) {
      this.updateFileList(file, 'success', data, true)
    },
    showFailureResult (data, file) {
      file.message = data.message || ''
      this.updateFileList(file, 'failure', data)
    },
    updateFileList (file, status, properties = {}, toEmit = false) {
      if (status !== undefined) {
        file.status = status
      }
      const type = properties.type
      assign(file, properties)
      file._extra = omit(properties, [
        'success',
        'message',
        'name',
        'src',
        'poster',
        'type'
      ])

      /**
       * TODO: this is a hack to cope with the problem that `type` property exists
       * on native File objects, we should move all public/internal metadata onto
       * something like `file._meta` instead.
       */
      Object.defineProperty(file, 'type', {
        writable: true
      })

      file.type =
        type ||
        (file.type && file.type.substring(0, file.type.indexOf('/'))) ||
        this.getMediaType(file)
      this.$set(this.fileList, this.fileList.indexOf(file), file)

      if (toEmit) {
        this.$emit('change', this.getValue(false))
      }
    },
    restoreReplacingFile (file) {
      if (file._replacingFile) {
        this.$set(
          this.fileList,
          this.fileList.indexOf(file),
          file._replacingFile
        )
      }
    },
    remove (file, silent = false) {
      if (file.status === 'uploading') {
        this.cancel(file)
      }

      let index = this.fileList.indexOf(file)
      if (!this.isReplacing && !silent) {
        this.$emit('remove', this.files[index], index)
      }

      if (this.maxCount === 1) {
        this.fileList = []
      } else {
        this.fileList.splice(index, 1)
      }

      if (!file.toBeUploaded && !silent) {
        this.$emit('change', this.getValue(true))
      }
    },
    cancel (file) {
      if (file.cancel) {
        file.cancel()
      } else if (this.requestMode === 'iframe') {
        this.canceled = true
        this.submitting = false
      } else if (file.xhr) {
        file.xhr.abort()
      }
    },
    reset () {
      this.$refs.input.value = ''
      this.$refs.main.appendChild(this.$refs.input)
    },
    convertSizeUnit (size) {
      return format(size, { decimalPlaces: 1 })
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
            this.$emit('failure', { error })
            return { status: 'failure' }
          }
        } else if (this.dataType === 'text') {
          return data
        }
      }
    },
    getValue (isEmptyValue) {
      if (this.maxCount !== 1) {
        return this.pureFileList
      }

      if (isEmptyValue) {
        return null
      }

      return this.compat
        ? this.pureFileList[0].src || this.pureFileList[0].name
        : this.pureFileList[0]
    },
    preview ({ src }, index) {
      this.previewIndex = index
      this.previewOpen = true
    },
    clickInput () {
      this.$refs.input.click()
    },
    clear () {
      this.fileList.forEach(file => {
        if (file.status === 'uploading') {
          this.cancel(file)
        }
      })
      this.fileList = this.fileList.filter(({ status }) => status !== 'failure')
    },
    addFiles (files) {
      this.handleNewFiles(files)
    },
    focus () {
      this.$el.focus()
    },

    getMediaType (file) {
      if (file.type) {
        return file.type
      }
      if (this.type === 'video' || this.type === 'image') {
        return this.type
      }

      const mediaExtensions = config.get('uploader.mediaExtensions')

      return find(Object.keys(mediaExtensions), type => {
        const extensions = mediaExtensions[type]

        return extensions.some(extension => {
          return endsWith(file.name, '.' + extension)
        })
      })
    },

    handleImageAdd () {
      this.clickInput()
    },
    handleImageRemove (index) {
      this.remove(this.fileList[index])
    },
    handleImageReplace (index) {
      this.$refs.input.click()
      this.replaceFile(this.fileList[index])
    },
    handelImagePreview (index) {
      this.preview(this.fileList[index], index)
    }
  }
}
</script>
