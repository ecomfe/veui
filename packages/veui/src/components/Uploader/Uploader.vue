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
    ref="fileInput"
    type="file"
    :accept="realAccept"
    hidden
  >

  <component
    :is="`veui-uploader-${isMediaType ? 'media' : 'file'}`"
    :files="fileList"
    :addable="!canNotAddImage"
    :disabled="realUneditable"
    :options="childOptions"
    @add="handleImageAdd"
    @replace="handleImageReplace"
    @remove="handleImageRemove"
    @preview="handelImagePreview"
    @custom="handleImageCustomEvent"
  >
    <template
      v-for="(_, slotName) in $scopedSlots"
      :slot="slotName"
      slot-scope="slotData"
    ><slot
      :name="slotName"
      v-bind="slotData"
    /></template>
  </component>

  <veui-lightbox
    :open.sync="previewOpen"
    :datasource="successFiles"
    :index.sync="previewIndex"
    v-bind="realPreviewOptions"
  />
</div>
</template>

<script>
import {
  some,
  pick,
  includes,
  isArray,
  isString,
  startsWith,
  findIndex,
  identity,
  omit,
  isNil
} from 'lodash'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import i18n from '../../mixins/i18n'
import { sharedProps } from '../../mixins/upload'
import config from '../../managers/config'
import toast from '../../managers/toast'
import warn from '../../utils/warn'
import Lightbox from '../Lightbox'
import FileUploader from './_FileUploader'
import MediaUploader from './_MediaUploader'
import {
  UPLOAD_UPLOADING,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
  ERRORS,
  addOnceEventListener,
  getFileMediaType,
  UploaderFile,
  getUploadRequest
} from './_helper'

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
      type: [Array, Object]
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
    maxCount: {
      type: Number,
      default: Infinity
    },
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
    multiple: {
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
      fileList: [],

      previewIndex: 0,
      previewOpen: false
    }
  },
  computed: {
    realUneditable () {
      return this.realDisabled || this.realReadonly
    },
    canNotAddImage () {
      return this.realUneditable || this.fileList.length >= this.maxCount
    },
    status () {
      if (!this.fileList.length) {
        return 'empty'
      }

      if (this.fileList.some(file => file.status === UPLOAD_UPLOADING)) {
        return UPLOAD_UPLOADING
      }

      if (this.fileList.some(file => file.status === UPLOAD_FAILURE)) {
        return UPLOAD_FAILURE
      }

      return UPLOAD_SUCCESS
    },
    files () {
      return this.fileList.map(file => file.value)
    },
    successFiles () {
      return this.fileList
        .filter(file => file.isSuccess)
        .map(file => file.value)
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
          .map(extension =>
            startsWith(extension, '.') ? extension : `.${extension}`
          )
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
    },
    realMultiple () {
      return this.maxCount === 1 ? this.multiple : true
    },
    isIframeRequest () {
      return this.requestMode === 'iframe'
    },

    uploadRequest () {
      const options = pick(this, [
        'name',
        'action',
        'headers',
        'withCredentials',
        'requestMode',
        'iframeMode',
        'callbackNamespace',
        'dataType',
        'convertResponse',
        'payload',
        'upload'
      ])
      return getUploadRequest(options)
    },
    validateOptions () {
      return {
        type: this.type,
        accept: this.realAccept,
        extensions: this.extensions,
        maxSize: this.maxSize,
        validator: this.validator
      }
    },
    childOptions () {
      return pick(this, sharedProps)
    },
    preferType () {
      return includes(['image', 'video'], this.type) ? this.type : undefined
    }
  },
  watch: {
    value: {
      handler (val) {
        let values = isArray(val) ? val : [val]
        if (some(values, val => isString(val))) {
          warn('[veui-uploader] `value` must be object(s).', this)
        }
        if (some(values, val => isNil(val._key))) {
          warn(
            '[veui-uploader] `_key` is required of `value` to ensure correct order.',
            this
          )
        }

        // 根据 key 匹配
        let [rest, patched] = values.reduce(
          ([rest, patched], value) => {
            if (value._key) {
              let i = findIndex(this.fileList, file => file.key === value._key)
              if (i >= 0) {
                this.fileList[i].value = value
                return [rest, patched.concat(i)]
              }
            }
            return [rest.concat(value), patched]
          },
          [[], []]
        )

        const guessType = file => this.preferType || getFileMediaType(file)

        // 剩余的按顺序匹配
        let j = 0
        this.fileList = this.fileList
          .map((file, i) => {
            if (includes(patched, i) || !file.isSuccess) {
              return file
            }
            if (j < rest.length) {
              let val = rest[j++]
              file.value = val
              if (!val.type && guessType(val) !== file.type) {
                file.type = guessType(val)
              }
              return file
            }
            // 处理外部直接减少文件的情形
          })
          .filter(identity)
          .concat(
            // 还有剩的添加到最后（TODO: 需要考虑 order 么？）
            rest.slice(j).map(val => {
              let file = UploaderFile.fromValue(val)
              if (!file.type) {
                file.type = guessType(file)
              }
              return file
            })
          )
      },
      deep: true,
      immediate: true
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
  beforeDestroy () {
    this.cancelAll()
  },
  methods: {
    preview ({ src }, index) {
      this.previewIndex = index
      this.previewOpen = true
    },
    cancelAll () {
      this.fileList.forEach(file => file.cancel())
    },
    clear () {
      this.fileList.forEach((file, index) => {
        if (file.isFailure) {
          this.removeFile(index)
        }
      })
    },
    focus () {
      this.$el.focus()
    },

    pickFiles (multiple) {
      const input = this.$refs.fileInput
      // iframe 上传只能一个个来，原因见 attachFileToForm 里注释
      input.multiple = this.isIframeRequest ? false : multiple

      let promise = new Promise(resolve => {
        addOnceEventListener(input, 'change', ({ target }) => {
          let files = [...target.files]
          if (this.isIframeRequest) {
            files = files.map(file => {
              file._rawFileList = target.files
              return file
            })
          }
          resolve(files)
          input.value = null
        })
      })

      input.click()
      return promise
    },

    handleImageAdd () {
      let restCount = this.maxCount - this.fileList.length
      this.pickFiles(restCount > 1).then(files => {
        if (!files.length) {
          return
        }
        this.addFiles(files)
      })
    },
    handleImageRemove (index) {
      // TBC: 是否需要 恢复 被替换的
      let file = this.fileList[index]
      this.removeFile(index, { restore: file.isFailure })
    },
    handleImageReplace (index) {
      // TODO: pickFiles 异步回调后可能 fileList index 已经变了
      this.pickFiles(false).then(files => {
        this.replaceFile(index, files[0])
      })
    },
    handelImagePreview (index) {
      this.preview(this.fileList[index], index)
    },
    handleImageCustomEvent (name, ...args) {
      this.$emit(name, ...args)
    },

    addFiles (files) {
      const count = this.fileList.length + files.length
      if (count > this.maxCount) {
        const message = this.t('tooManyFiles')
        toast.error(message)
        this.$emit('invalid', {
          errors: [
            {
              type: ERRORS.TOO_MANY_FILES,
              value: count,
              message
            }
          ]
        })
        return
      }

      files = files.map(file => new UploaderFile(file))
      this.fileList =
        this.realOrder === 'desc'
          ? files.concat(this.fileList)
          : this.fileList.concat(files)

      if (this.autoupload) {
        this.triggerUpload()
      }
    },
    triggerUpload () {
      this.fileList.forEach(file => this.uploadFile(file))
    },
    uploadFile (file) {
      if (!file.isPending) {
        return
      }

      file.isUploading = true
      return file
        .validate(this.validateOptions, this)
        .then(errors => {
          if (errors) {
            this.$emit('invalid', { file: file.native, errors })
            throw errors.map(({ message }) => message).join(this.t('separator'))
          }

          return new Promise((resolve, reject) => {
            file.upload(this, {
              onload: resolve,
              onerror: reject,
              onprogress: evt =>
                this.$emit(
                  'progress',
                  file.value,
                  this.fileList.indexOf(file),
                  evt
                ),
              oncancel: () =>
                this.removeFile(this.fileList.indexOf(file), { restore: true })
            })
          })
        })
        .then(() => {
          file.isSuccess = true
          return 'success'
        })
        .catch(err => {
          file.isFailure = true
          file.message = isString(err) ? err : err.message
          return 'failure'
        })
        .then(status => {
          let i = this.fileList.indexOf(file)
          this.$emit(status, this.files[i].value, i)
          if (status === 'success') {
            this.triggerChangeEvent()
          }
        })
    },
    replaceFile (index, file) {
      let newFile = new UploaderFile(file)
      newFile._replacing = this.fileList.splice(index, 1, newFile)[0]
      this.uploadFile(newFile)
    },
    removeFile (index, { restore = false } = {}) {
      if (index < 0 || index >= this.fileList.length) {
        return
      }

      let file = this.fileList[index]
      if (restore && file._replacing) {
        this.fileList.splice(index, 1, file._replacing)
      } else {
        this.fileList.splice(index, 1)
      }

      file.cancel()
      this.$emit('remove', file.value, index)
      if (file.isSuccess || file._replacing) {
        this.triggerChangeEvent()
      }
    },
    triggerChangeEvent () {
      let files = this.realMultiple
        ? this.successFiles
        : this.successFiles[0] || null
      this.$emit('change', files)
    },

    getScopeValue (index) {
      let file = this.fileList[index]
      return {
        ...file.value,
        ...pick(file, ['status', 'loaded', 'total']),
        index
      }
    },

    // legacy api
    clickInput () {
      this.handleImageAdd()
    }
  }
}
</script>
