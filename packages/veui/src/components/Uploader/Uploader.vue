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
    :addable="canAddImage"
    :disabled="realUneditable"
    :options="childOptions"
    @add="handleItemAdd"
    @replace="handleItemReplace"
    @remove="handleItemRemove"
    @preview="handleItemPreview"
    @custom="handleItemCustomEvent"
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
  isString,
  startsWith,
  findIndex,
  find,
  omit,
  isNil,
  values
} from 'lodash'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import i18n from '../../mixins/i18n'
import { sharedProps } from '../../mixins/upload'
import config from '../../managers/config'
import toast from '../../managers/toast'
import warn from '../../utils/warn'
import { addOnceEventListener } from '../../utils/dom'
import Lightbox from '../Lightbox'
import FileUploader from './_FileUploader'
import MediaUploader from './_MediaUploader'
import {
  STATUS,
  ORDERS,
  ERRORS,
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
  name: 'veui-uploader',
  status: STATUS,
  errors: ERRORS,
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
        return includes(values(ORDERS), value)
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
    },
    keyField: {
      type: String,
      default: 'key'
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
    canAddImage () {
      return !this.realUneditable && this.fileList.length < this.maxCount
    },
    status () {
      if (!this.fileList.length) {
        return STATUS.EMPTY
      }
      let status = find(
        [STATUS.UPLOADING, STATUS.FAILURE, STATUS.PENDING],
        status => this.fileList.some(file => file.status === status)
      )
      return status || STATUS.SUCCESS
    },
    successFiles () {
      return this.fileList
        .filter(file => file.isSuccess)
        .map(file => file.value)
    },
    realOrder () {
      if (this.order) {
        let mapping = {
          [ORDERS.LEGACY_PREPEND]: ORDERS.PREPEND,
          [ORDERS.LEGACY_APPEND]: ORDERS.APPEND
        }
        if (this.order in mapping) {
          warn(
            '[veui-uploader] `desc|asc` are deprecated for `order`. use `prepend|append` instead'
          )
          return mapping[this.order]
        }
        return this.order
      }
      return this.type === 'file' ? ORDERS.PREPEND : ORDERS.APPEND
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
        let values = [].concat(val).filter(Boolean)
        if (some(values, val => isString(val))) {
          warn('[veui-uploader] `value` must be object(s).', this)
        }
        if (some(values, val => isNil(val[this.keyField]))) {
          warn(
            '[veui-uploader] `key-field` is required of `value` to ensure correct order.',
            this
          )
        }

        // 根据 key 匹配
        let [rest, patched] = values.reduce(
          ([rest, patched], value) => {
            if (value[this.keyField]) {
              let i = findIndex(
                this.fileList,
                file => file.key === value[this.keyField]
              )
              if (i >= 0) {
                this.fileList[i].value = value
                return [rest, patched.concat(i)]
              }
            }
            return [rest.concat(value), patched]
          },
          [[], []]
        )

        // 剩余的按顺序匹配
        let j = 0
        this.fileList = this.fileList
          .map((file, i) => {
            if (includes(patched, i) || !file.isSuccess) {
              return file
            }
            if (j < rest.length) {
              return this.createUploaderFile(rest[j++], file)
            }
            // 处理外部直接减少文件的情形
          })
          .filter(Boolean)
          .concat(
            // 还有剩的添加到最后（TODO: 需要考虑 order 么？）
            rest.slice(j).map(val => this.createUploaderFile(val))
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
    preview (index) {
      let successFileIndex = findIndex(
        this.successFiles,
        val => val[this.keyField] === this.fileList[index].key
      )
      this.previewIndex = successFileIndex
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
    prune () {
      this.fileList.forEach((file, index) => this.removeFile(index))
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

    handleItemAdd () {
      this.chooseFiles()
    },
    handleItemRemove (index) {
      this.removeFile(index)
    },
    handleItemReplace (index) {
      // TODO: pickFiles 异步回调后可能 fileList index 已经变了
      this.pickFiles(false).then(files => {
        this.replaceFile(index, files[0])
      })
    },
    handleItemPreview (index) {
      this.preview(index)
    },
    handleItemCustomEvent (name, ...args) {
      this.$emit(name, ...args)
    },

    chooseFiles () {
      let restCount = this.maxCount - this.fileList.length
      this.pickFiles(restCount > 1).then(files => {
        if (!files.length) {
          return
        }
        this.addFiles(files)
      })
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
      files = files.map(file => this.createUploaderFile(file))
      this.fileList =
        this.realOrder === ORDERS.PREPEND
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
      file.loaded = -1
      return file
        .validate(this.validateOptions, this)
        .then(errors => {
          if (!errors) {
            return
          }
          this.$emit('invalid', { file: file.native, errors })
          file.isFailure = true
          file.message = errors
            .map(({ message }) => message)
            .join(this.t('separator'))
          throw new Error('validate failed') // skip to next catch block
        })
        .then(() => {
          // validate success, start to upload
          return file.upload(this, {
            onprogress: evt => {
              if (evt.loaded < 0) {
                return
              }
              this.$emit(
                'progress',
                this.getValueWithStatus(file),
                this.fileList.indexOf(file),
                evt
              )
            },
            oncancel: () =>
              this.removeFile(this.fileList.indexOf(file), { restore: true })
          })
        })
        .then(() => STATUS.SUCCESS)
        .catch(() => STATUS.FAILURE)
        .then(status => {
          let i = this.fileList.indexOf(file)
          this.$emit(status, { ...file.value, status }, i)
          if (status === STATUS.SUCCESS) {
            this.triggerChangeEvent()
          }
        })
    },
    replaceFile (index, file) {
      let newFile = this.createUploaderFile(file)
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
      this.$emit('remove', this.getValueWithStatus(file), index)
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

    getValueWithStatus (file) {
      return { ...file.value, status: file.status }
    },
    guessFileType (val) {
      return this.preferType || getFileMediaType(val)
    },
    createUploaderFile (val, file) {
      const options = { keyField: this.keyField }
      if (val instanceof File) {
        return new UploaderFile(val, options)
      }

      if (file) {
        file.keyField = this.keyField
        file.value = val
      } else {
        file = UploaderFile.fromValue(val, options)
      }
      let guessType = this.guessFileType(val)
      if (!val.type && guessType !== file.type) {
        file.type = guessType
      }
      return file
    },

    // legacy APIs
    clickInput () {
      warn(
        '[veui-uploader] `clickInput` is deprecated. use `chooseFiles` instead',
        this
      )
      this.chooseFiles()
    },
    submit (file) {
      warn(
        '[veui-uploader] `submit` is deprecated. use `triggerUpload` instead',
        this
      )
      let internalFile = find(
        this.fileList,
        item => item[this.keyField] === file[this.keyField]
      )
      if (internalFile) {
        this.uploadFile(internalFile)
      }
    },
    uploadFiles () {
      warn(
        '[veui-uploader] `uploadFiles` is deprecated. use `triggerUpload` instead',
        this
      )
      this.triggerUpload()
    }
  }
}
</script>
