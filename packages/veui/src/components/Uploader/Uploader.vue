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
import { parse as parseByte } from 'bytes'
import {
  keys,
  some,
  compact,
  last,
  pick,
  includes,
  isArray,
  isString,
  startsWith,
  endsWith,
  find,
  findIndex,
  uniqueId,
  entries,
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

const UPLOAD_PENDING = 'pending'
const UPLOAD_UPLOADING = 'uploading'
const UPLOAD_SUCCESS = 'success'
const UPLOAD_FAILURE = 'failure'

const PUBLIC_FILE_PROPS = ['name', 'type', 'poster', 'src']

const ERRORS = {
  TYPE_INVALID: 'type',
  SIZE_INVALID: 'size',
  TOO_MANY_FILES: 'count',
  CUSTOM_INVALID: 'custom'
}

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
      return (
        this.realUneditable ||
        (this.maxCount && this.fileList.length >= this.maxCount)
      )
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

        // 剩余的按顺序匹配
        let j = 0
        this.fileList = this.fileList
          .map((file, i) => {
            if (includes(patched, i) || !file.isSuccess) {
              return file
            }
            if (j < rest.length) {
              file.value = rest[j++]
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
                // 是否应该在 File 内部处理这个逻辑？
                file.type = includes(['image', 'video'], this.type)
                  ? this.type
                  : getFileMediaType(file)
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
      this.pickFiles(true).then(files => {
        if (!files.length) {
          return
        }
        this.addFiles(files)
      })
    },
    handleImageRemove (index) {
      this.removeFile(index)
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
                )
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
      this.fileList.splice(index, 1, new UploaderFile(file))
      this.uploadFile(this.fileList[index])
    },
    removeFile (index) {
      let [removed] = this.fileList.splice(index, 1)
      if (removed) {
        removed.cancel()
      }
      this.$emit('remove', removed.value, index)
      if (removed.isSuccess) {
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
    }
  }
}

function addOnceEventListener (el, evt, listener) {
  el.addEventListener(evt, function callback (...args) {
    el.removeEventListener(evt, callback)
    listener(...args)
  })
}

function getFileMediaType (file) {
  const mediaExtensions = config.get('uploader.mediaExtensions')
  return find(keys(mediaExtensions), function (type) {
    return some(mediaExtensions[type], ext => endsWith(file.name, `.${ext}`))
  })
}

function getMediaExtensionsByType (type) {
  const mediaExtensions = config.get('uploader.mediaExtensions')
  switch (type) {
    case 'image':
    case 'video':
      return mediaExtensions[type]
    case 'media':
      return mediaExtensions.image.concat(mediaExtensions.video)
  }
  return []
}

function getValidateFileType ({ accept, extensions, type }) {
  const mediaExtensions = getMediaExtensionsByType(type)

  return function validateFileType (file) {
    if (!accept) {
      return true
    }

    let ext = last(file.name.split('.')).toLowerCase()
    if (extensions) {
      return includes(extensions, ext)
    }

    return accept.split(/,\s*/).some(item => {
      let acceptExtention = last(item.split(/[./]/)).toLowerCase()
      if (
        acceptExtention === ext ||
        // 对于类似'application/msword'这样的mimetype与扩展名对不上的情形跳过校验
        (acceptExtention !== '*' && includes(item, '/'))
      ) {
        return true
      }

      return (
        acceptExtention === '*' &&
        includes(item, '/') &&
        (includes(mediaExtensions, ext) || !mediaExtensions.length)
      )
    })
  }
}

function getValidateFileSize ({ maxSize }) {
  maxSize = maxSize && parseByte(maxSize)
  return function validateFileSize (file) {
    return !maxSize || file.size <= maxSize
  }
}

function getCustomValidate ({ validator }) {
  return function customValidate (file) {
    return validator ? validator(file) : { valid: true }
  }
}

function getValidateFile (options, ctx) {
  const validators = [
    [
      getValidateFileType(options),
      ERRORS.TYPE_INVALID,
      file => file.name,
      identity,
      () => ctx.t('fileTypeInvalid')
    ],
    [
      getValidateFileSize(options),
      ERRORS.SIZE_INVALID,
      file => file.size,
      identity,
      () => ctx.t('fileSizeInvalid')
    ],
    [
      getCustomValidate(options),
      ERRORS.CUSTOM_INVALID,
      file => file,
      result => result.valid,
      result => result.message
    ]
  ].map(function ([validate, type, getValue, getValid, getMessage]) {
    return function (file) {
      return Promise.resolve(validate(file)).then(function (result) {
        if (getValid(result)) {
          return
        }
        return {
          type,
          value: getValue(file),
          message: getMessage(result)
        }
      })
    }
  })

  return function validateFile (file) {
    return Promise.all(validators.map(validate => validate(file))).then(
      function (errors) {
        errors = errors.filter(identity)
        return errors.length ? errors : null
      }
    )
  }
}

class UploaderFile {
  constructor (file) {
    this.key = uniqueId('veuiUploaderFile')
    this.status = UPLOAD_PENDING
    this.message = undefined

    this._file = file
    this.meta = file
      ? {
        name: file.name,
        type: getFileMediaType(file)
      }
      : {}

    this.loaded = undefined
    this.total = undefined
  }

  get isPending () {
    return this.status === UPLOAD_PENDING
  }

  get isFailure () {
    return this.status === UPLOAD_FAILURE
  }

  set isFailure (val) {
    if (val) {
      if (this.isUploading) {
        this.cancel()
      }
      this.status = UPLOAD_FAILURE
    }
  }

  get isUploading () {
    return this.status === UPLOAD_UPLOADING
  }

  set isUploading (val) {
    if (val) {
      this.status = UPLOAD_UPLOADING
    }
  }

  get isSuccess () {
    return this.status === UPLOAD_SUCCESS
  }

  set isSuccess (val) {
    if (val) {
      if (this.isUploading) {
        this.cancel()
      }
      this.status = UPLOAD_SUCCESS
    }
  }

  get name () {
    // TODO: eslint 该升级了！
    // return this.result?.name ?? this.meta.name
    return (this.result && this.result.name) || this.meta.name
  }

  get src () {
    return (this.result && this.result.src) || this.meta.src
  }

  get poster () {
    return (this.result && this.result.poster) || this.meta.poster
  }

  get type () {
    return (this.result && this.result.type) || this.meta.type
  }

  set type (val) {
    this.meta.type = val
  }

  get native () {
    return this._file
  }

  get value () {
    return {
      _key: this.key,
      ...pick(this, PUBLIC_FILE_PROPS),
      ...this.extra
    }
  }

  set value (val) {
    this.isSuccess = true
    if (val._key) {
      this.key = val._key
    }
    this.result = pick(val, PUBLIC_FILE_PROPS)
    this.extra = omit(val, ['_key', ...PUBLIC_FILE_PROPS])
  }

  static fromValue (val) {
    let file = new UploaderFile()
    file.value = val
    return file
  }

  validate (options, context) {
    const validateFile = getValidateFile(options, context)
    return validateFile(this._file)
  }

  upload (context, callbacks) {
    const listeners = ['onload', 'onerror', 'onprogress', 'oncancel'].reduce(
      (ret, key) => {
        ret[key] = (...args) =>
          compact([this[key].bind(this), callbacks[key]]).forEach(execute =>
            execute(...args)
          )
        return ret
      },
      {}
    )
    this._cancel = context.uploadRequest(this._file, listeners)
  }

  onload (data) {
    this.status = data.success ? UPLOAD_SUCCESS : UPLOAD_FAILURE
    this.result = omit(data, ['success'])

    if (data.src) {
      // 上传完成，不需要再 hold 文件对象
      this._file = undefined
    }
  }

  onerror (err) {
    this.message = err.message
    this.status = UPLOAD_FAILURE
  }

  onprogress (evt) {
    this.loaded = evt.loaded
    this.total = evt.total
  }

  oncancel () {}

  cancel () {
    if (this.status === UPLOAD_UPLOADING && this._cancel) {
      this._cancel()
      this._cancel = undefined
    }
  }
}

function getUploadRequest (options) {
  const { requestMode, action, upload } = options
  if (requestMode === 'xhr' && action) {
    return getXhrUploadRequest(options)
  } else if (requestMode === 'iframe' && action) {
    return getIframeUploadRequest(options)
  } else if (requestMode === 'custom' && upload) {
    return getCustomUploadRequest(requestMode)
  }
  throw new Error('no matched upload method')
}

function getIframeUploadRequest (options) {
  const parseResponse = getResonpseParse(options)
  const { name, action, iframeMode, callbackNamespace, payload } = options

  function getForm () {
    const iframeId = uniqueId('veui-uploader-iframe')

    let form = document.createElement('form')
    form.method = 'POST'
    form.action = action
    form.target = iframeId
    form.enctype = 'multipart/form-data'

    let iframe = document.createElement('iframe')
    iframe.name = iframeId
    iframe.id = iframeId
    iframe.hidden = true

    document.body.appendChild(form)
    document.body.appendChild(iframe)

    function clean () {
      document.body.removeChild(form)
      document.body.removeChild(iframe)
    }

    return [form, iframe, clean]
  }

  function attachFileToForm (file, form) {
    let fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.hidden = true
    fileInput.name = name
    // 解耦了视图和上传逻辑，但是提交到 iframe 需要把 pickFile 选到的文件塞回 input
    // files 支持设置 FileList，但是 FileList 没有 slice 或者构造函数来从多文件 FileList 得到单文件 FileList
    // 所以上面 pickFile 逻辑里保证了 iframe 情况下只能选单文件，并把 FileList 关联到 File 上
    fileInput.files = file._rawFileList
    form.appendChild(fileInput)
  }

  function attachObjectToForm (obj, form) {
    entries(obj).forEach(function ([key, val]) {
      let input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = val
      form.appendChild(input)
    })
  }

  function bindPostMessageCallback (iframeId, ondata) {
    function callback (event) {
      if (
        !event.source ||
        !event.source.frameElement ||
        event.source.frameElement.id !== iframeId
      ) {
        return
      }
      // 支持action为绝对路径或相对路径，ie9里的location没有origin
      let actionOrigin = /^https?:\/\//.test(action)
        ? action.match(/^https?:\/\/[^/]*/)[0]
        : location.origin || location.protocol + '//' + location.host
      if (actionOrigin === event.origin) {
        ondata(event.data)
      }
    }
    function cancel () {
      window.removeEventListener('message', callback)
    }
    window.addEventListener('message', callback)
    return cancel
  }

  function bindJsonpCallback (callbackFuncName, ondata) {
    if (!window[callbackNamespace]) {
      window[callbackNamespace] = {}
    }
    window[callbackNamespace][callbackFuncName] = ondata
    return function cancel () {
      window[callbackNamespace][callbackFuncName] = undefined
    }
  }

  return function iframeUploadRequest (
    file,
    { onload, onerror, onprogress, oncancel }
  ) {
    const [form, iframe, cleanDom] = getForm()
    attachFileToForm(file, form)
    attachObjectToForm(payload, form)

    let removeBind
    if (iframeMode === 'postmessage') {
      removeBind = bindPostMessageCallback(iframe.id, ondata)
    } else if (iframeMode === 'callback') {
      const callbackFuncName = uniqueId('veuiUploaderCallback')
      removeBind = bindJsonpCallback(callbackFuncName, ondata)
      attachObjectToForm(
        { callback: `parent.${callbackNamespace}['${callbackFuncName}']` },
        form
      )
    } else {
      throw new Error('no matched iframe mode')
    }

    // TODO: timeout ?
    function ondata (data) {
      clean()
      onprogress({
        loaded: file.size,
        total: file.size
      })
      onload(parseResponse(data))
    }

    function clean () {
      removeBind()
      cleanDom()
    }

    // TODO: fake progress?
    onprogress({
      loaded: 0,
      total: file.size
    }) // IE 的 ProgressEvent 不支持 constructor，所以这里只能抛个 plain object

    form.submit()

    return clean
  }
}

function getXhrUploadRequest (options) {
  const parseResponse = getResonpseParse(options)
  const { name, action, headers, payload, withCredentials } = options
  return function xhrUploadRequest (
    file,
    { onload, onerror, onprogress, oncancel }
  ) {
    let cancelled

    let formData = new FormData()
    formData.append(name, file)
    entries(payload).forEach(function ([key, val]) {
      formData.append(key, val)
    })

    let xhr = new XMLHttpRequest()
    xhr.upload.onprogress = onprogress
    xhr.onload = () => onload(parseResponse(xhr.responseText))
    xhr.onerror = (...args) => !cancelled && onerror(...args)

    xhr.open('POST', action, true)
    entries(headers).forEach(function ([key, val]) {
      xhr.setRequestHeader(key, val)
    })
    xhr.withCredentials = withCredentials
    xhr.send(formData)

    return function cancel () {
      cancelled = true
      xhr.abort()
    }
  }
}

function getCustomUploadRequest ({ upload }) {
  // 之前的实现里自定义上传函数的 context 是 null，这里继续保留
  return upload.bind(null)
}

function getResonpseParse ({ convertResponse = identity, dataType }) {
  return function (data) {
    if (typeof data === 'string' && dataType === 'json') {
      try {
        data = JSON.parse(data)
      } catch (err) {
        return convertResponse(undefined, err)
      }
    }
    return convertResponse(data)
  }
}
</script>
