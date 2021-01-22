import { parse as parseByte } from 'bytes'
import {
  keys,
  some,
  compact,
  last,
  pick,
  includes,
  endsWith,
  find,
  uniqueId,
  entries,
  identity,
  omit,
  isEmpty,
  forEach
} from 'lodash'
import config from '../../managers/config'

export const STATUS = {
  EMPTY: 'empty',
  PENDING: 'pending',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  FAILURE: 'failure'
}

export const PUBLIC_FILE_PROPS = [
  'name',
  'type',
  'poster',
  'src',
  'alt',
  'size'
]

export const ERRORS = {
  TYPE_INVALID: 'type',
  SIZE_INVALID: 'size',
  TOO_MANY_FILES: 'count',
  CUSTOM_INVALID: 'custom'
}

export function getFileMediaType (file) {
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

export function getValidateFile (options, ctx) {
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
      identity,
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

export class UploaderFile {
  constructor (file, { keyField }) {
    this.keyField = keyField

    this.key = uniqueId('veuiUploaderFile')
    this.status = STATUS.PENDING
    this.message = undefined

    this._file = file
    this.meta = file
      ? {
        ...pick(file, ['name', 'size']),
        type: getFileMediaType(file)
      }
      : {}

    this.loaded = undefined
    this.total = undefined
  }

  get isPending () {
    return this.status === STATUS.PENDING
  }

  get isFailure () {
    return this.status === STATUS.FAILURE
  }

  set isFailure (val) {
    if (val) {
      if (this.isUploading) {
        this.cancel()
      }
      this.status = STATUS.FAILURE
    }
  }

  get isUploading () {
    return this.status === STATUS.UPLOADING
  }

  set isUploading (val) {
    if (val) {
      this.status = STATUS.UPLOADING
    }
  }

  get isSuccess () {
    return this.status === STATUS.SUCCESS
  }

  set isSuccess (val) {
    if (val) {
      if (this.isUploading) {
        this.cancel()
      }
      this.status = STATUS.SUCCESS
    }
  }

  get name () {
    // TODO: eslint 该升级了！
    // return this.result?.name ?? this.meta.name
    return (this.result && this.result.name) || this.meta.name
  }

  get size () {
    return (this.result && this.result.size) || this.meta.size
  }

  get src () {
    return (this.result && this.result.src) || this.meta.src
  }

  get type () {
    return (this.result && this.result.type) || this.meta.type
  }

  set type (val) {
    this.meta.type = val
  }

  get poster () {
    return (this.result && this.result.poster) || this.meta.poster
  }

  get alt () {
    return (this.result && this.result.alt) || this.meta.alt
  }

  get native () {
    return this._file
  }

  get value () {
    return {
      ...omit(this.result, PUBLIC_FILE_PROPS),
      ...this.extra,
      ...pick(this, PUBLIC_FILE_PROPS),
      [this.keyField]: this.key
    }
  }

  set value (val) {
    this.isSuccess = true
    if (val[this.keyField]) {
      this.key = val[this.keyField]
    }
    this.result = pick(val, PUBLIC_FILE_PROPS)
    this.extra = omit(val, [this.keyField, 'status', ...PUBLIC_FILE_PROPS])
  }

  static fromValue (val, options) {
    let file = new UploaderFile(undefined, options)
    file.value = val
    return file
  }

  validate (options, context) {
    const validateFile = getValidateFile(options, context)
    return validateFile(this._file)
  }

  upload (context, callbacks) {
    let local
    const promise = new Promise(function (resolve, reject) {
      local = { onload: resolve, onerror: reject }
    })

    const listeners = ['onload', 'onerror', 'onprogress', 'oncancel'].reduce(
      (ret, key) => {
        ret[key] = (...args) =>
          forEach(
            compact([this[key].bind(this), callbacks[key], local[key]]),
            execute => {
              try {
                execute(...args)
              } catch (err) {
                if (key === 'onload') {
                  // 在 onload 内抛异常就认为出错了，中止onload执行，执行 onerror 逻辑
                  listeners.onerror(err)
                  return false
                }
              }
            }
          )
        return ret
      },
      {}
    )
    // uploadRequest is provided on vm to reduce repetitive creations since it only relates to props
    // otherwise getUploadRequest(options) every upload is called here
    this._cancel = context.uploadRequest(this._file, listeners)
    return promise
  }

  onload (data) {
    if (!data.success) {
      throw new Error(data.message)
    }

    this.status = STATUS.SUCCESS
    this.result = omit(data, ['success', 'message'])

    // 上传完成，有了 src，不需要再 hold 文件对象
    this._file = undefined
  }

  onerror (err) {
    this.status = STATUS.FAILURE
    this.message = err.message
  }

  onprogress (evt) {
    this.loaded = evt.loaded
    this.total = evt.total
  }

  oncancel () {
    this.status = STATUS.PENDING
    this.loaded = 0
  }

  cancel () {
    if (this.status === STATUS.UPLOADING && this._cancel) {
      this._cancel()
      this._cancel = undefined
    }
  }
}

export function getUploadRequest (options) {
  const { requestMode, action, upload } = options
  if (requestMode === 'xhr' && action) {
    return getXhrUploadRequest(options)
  } else if (requestMode === 'iframe' && action) {
    return getIframeUploadRequest(options)
  } else if (requestMode === 'custom' && upload) {
    return getCustomUploadRequest(options)
  }
  throw new Error(
    '`action` is required for `xhr` or `iframe` mode and `upload` is requried for `custom` mode'
  )
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
    // input.files setter支持 FileList，但是 FileList 没有 slice 或者构造函数来实现从多文件 FileList 得到单文件 FileList
    // 所以上面 pickFile 逻辑里保证了 iframe 情况下只能选单文件，并把 FileList 关联到 File._rawFileList 上
    // 这样这里就能从这个字段拿到原始的 FileList 。如果是调用 addFiles 插入的 File，如果要走 iframe 上传，也应该实现这个逻辑
    if (!file._rawFileList) {
      throw new Error('Fail to upload with iframe: no `_rawFileList` on File')
    }
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
      delete window[callbackNamespace][callbackFuncName]
      if (isEmpty(window[callbackNamespace])) {
        delete window[callbackNamespace]
      }
    }
  }

  return function iframeUploadRequest (file, { onload, onprogress }) {
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

    onprogress({
      loaded: -1,
      total: file.size
    }) // IE 的 ProgressEvent 不支持 constructor，所以这里只能抛个 plain object

    form.submit()

    return clean
  }
}

function getXhrUploadRequest (options) {
  const parseResponse = getResonpseParse(options)
  const { name, action, headers, payload, withCredentials } = options
  return function xhrUploadRequest (file, { onload, onerror, onprogress }) {
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
