<template>
<div
  ref="main"
  :class="{
    [$c('uploader')]: true,
    [$c(`uploader-${type}`)]: true
  }"
  :ui="realUi"
  role="application"
  tabindex="-1"
  :aria-label="t('uploader')"
>
  <div
    v-if="type === 'file'"
    :class="$c('uploader-button-container')"
  >
    <label
      :for="inputId"
      :class="{
        [$c('button')]: true,
        [$c('uploader-input-label')]: true,
        [$c('disabled')]: inputDisabled
      }"
      :ui="realUi"
      :tabindex="fileButtonDisabled ? null : 0"
      @click="handleClick"
    >
      <slot name="button-label">
        <veui-icon :name="icons.upload"/>
        <span>{{ t('selectFile') }}</span>
      </slot>
    </label>
    <span
      v-if="$slots.desc"
      :class="$c('uploader-desc')"
    >
      <slot name="desc"/>
    </span>
  </div>
  <input
    :id="inputId"
    ref="input"
    hidden
    type="file"
    :name="name"
    :accept="accept"
    :disabled="realUneditable"
    :multiple="
      requestMode !== 'iframe' &&
        (maxCount > 1 || maxCount === undefined) &&
        !isReplacing
    "
    @change="handleNewFiles"
  >
  <transition-group
    :class="{
      [listClass]: true,
      [`${listClass}-picker-before`]: pickerPosition === 'before'
    }"
    tag="ul"
    :name="listClass"
  >
    <li
      v-for="(file, index) in fileList"
      :key="`${file.name}-${file.src}`"
      :class="`${listClass}-item`"
      :style="{
        order: index + 1
      }"
    >
      <template
        v-if="
          type === 'file' ||
            (type === 'image' && file.status === 'success') ||
            !file.status
        "
      >
        <slot
          name="file"
          v-bind="getScopeValue(index, file)"
        >
          <template v-if="type === 'file'">
            <slot
              name="file-before"
              v-bind="getScopeValue(index, file)"
            />
            <div :class="$c('uploader-list-container')">
              <veui-icon
                v-if="file.status !== 'uploading'"
                :name="icons.file"
                :class="{
                  [$c('uploader-list-file-icon')]: true,
                  [$c('uploader-list-file-icon-failure')]:
                    file.status === 'failure'
                }"
              />
              <veui-icon
                v-if="file.status === 'uploading'"
                :name="icons.loading"
                spin
                :class="$c('uploader-list-loading-icon')"
              />
              <span
                :ref="`fileFailure${index}`"
                :class="{
                  [$c('uploader-list-name')]: true,
                  [$c('uploader-list-name-success')]:
                    file.status === 'success',
                  [$c('uploader-list-name-failure')]:
                    file.status === 'failure'
                }"
                :title="file.name"
              >{{ file.name }}</span>
              <veui-icon
                v-if="file.status === 'success'"
                :name="icons.success"
                :class="$c('uploader-success-icon')"
              />
              <veui-icon
                v-if="file.status === 'failure'"
                :name="icons.failure"
                :class="$c('uploader-failure-icon')"
              />
              <veui-button
                :class="$c('uploader-list-remove')"
                :ui="uiParts.remove"
                :disabled="realUneditable"
                @click="remove(file)"
              >
                <veui-icon :name="icons.clear"/>
              </veui-button>
              <veui-popover
                v-if="file.status === 'failure'"
                :target="`fileFailure${index}`"
                position="top"
              >{{ file.message || t('uploadFailure') }}</veui-popover>
            </div>
            <slot
              name="file-after"
              v-bind="getScopeValue(index, file)"
            />
            <veui-progress
              v-if="file.status === 'uploading' && requestMode !== 'iframe'"
              :value="file.loaded / file.total"
              :ui="uiParts.progress"
            />
          </template>
          <template v-else>
            <slot
              name="file-before"
              v-bind="getScopeValue(index, file)"
            />
            <div :class="$c('uploader-list-image-container')">
              <img
                :src="file.src"
                :alt="file.alt || ''"
                :class="$c('uploader-list-image-container-image')"
              >
              <div :class="`${listClass}-mask`">
                <template v-for="control in getImageControls(file)">
                  <label
                    v-if="control.name === 'replace'"
                    :key="control.name"
                    :for="inputId"
                    :ui="uiParts.control"
                    :class="{
                      [$c('button')]: true,
                      [$c('disabled')]: realUneditable
                    }"
                    :tabindex="realUneditable ? null : 0"
                    :aria-label="control.label"
                    @click.stop="replaceFile(file)"
                  >
                    <veui-icon :name="icons.upload"/>
                  </label>
                  <veui-button
                    v-else
                    :key="control.name"
                    :ui="uiParts.control"
                    :disabled="
                      control.disabled !== undefined
                        ? control.disabled
                        : realUneditable
                    "
                    :aria-label="control.label"
                    @click="handleImageControl(file, index, control.name)"
                  >
                    <veui-icon :name="control.icon"/>
                  </veui-button>
                </template>
              </div>
            </div>
            <slot
              name="file-after"
              v-bind="getScopeValue(index, file)"
            />
          </template>
        </slot>
      </template>
      <template v-else-if="file.status === 'uploading' && type === 'image'">
        <slot
          name="uploading"
          v-bind="getScopeValue(index, file)"
        >
          <slot
            name="file-before"
            v-bind="getScopeValue(index, file)"
          />
          <div :class="`${listClass}-container ${listClass}-container-uploading`">
            <div :class="`${listClass}-container-uploading-text`">
              <slot name="uploading-label">{{ t('uploading') }}</slot>
            </div>
            <veui-progress
              v-if="requestMode !== 'iframe'"
              :value="file.loaded / file.total"
              :ui="uiParts.progress"
            />
          </div>
          <slot
            name="file-after"
            v-bind="getScopeValue(index, file)"
          />
        </slot>
      </template>
      <template v-else-if="file.status === 'failure' && type === 'image'">
        <slot
          name="failure"
          v-bind="getScopeValue(index, file)"
        >
          <slot
            name="file-before"
            v-bind="getScopeValue(index, file)"
          />
          <div
            :ref="`fileFailure${index}`"
            :class="`${listClass}-container ${listClass}-container-failure`"
          >
            <label
              :for="inputId"
              :class="{
                [$c('button')]: true,
                [$c('uploader-input-label-image')]: true
              }"
              :ui="uiParts.image"
              tabindex="0"
              @click="replaceFile(file)"
            >
              <slot
                name="button-label"
                v-bind="getScopeValue(index, file)"
              >
                <veui-icon :name="icons.addImage"/>
              </slot>
              <span
                :class="`${listClass}-file-name`"
                :title="file.name"
              >
                {{
                  file.name
                }}
              </span>
            </label>
            <div :class="`${listClass}-mask`">
              <template v-for="control in getImageControls(file)">
                <veui-button
                  :key="control.name"
                  :ui="uiParts.control"
                  :disabled="
                    control.disabled !== undefined
                      ? control.disabled
                      : realUneditable
                  "
                  :aria-label="control.label"
                  @click="handleImageControl(file, index, control.name)"
                >
                  <veui-icon :name="control.icon"/>
                </veui-button>
              </template>
            </div>
          </div>
          <veui-popover
            :target="`fileFailure${index}`"
            position="top"
          >
            {{
              file.message || t('uploadFailure')
            }}
          </veui-popover>
          <slot
            name="file-after"
            v-bind="getScopeValue(index, file)"
          />
        </slot>
      </template>
    </li>
    <li
      v-if="type === 'image'"
      key="input"
      :class="{
        [`${listClass}-item`]: true,
        [`${listClass}-item-upload`]: true,
        [`${listClass}-item-hidden`]: maxCount && fileList.length >= maxCount
      }"
    >
      <slot name="upload">
        <div
          :class="{
            [$c('uploader-list-image-container')]: true,
            [$c('uploader-list-image-container-upload')]: true
          }"
        >
          <label
            :for="inputId"
            :class="{
              [$c('button')]: true,
              [$c('uploader-input-label-image')]: true,
              [$c('disabled')]: realUneditable || submitting
            }"
            :tabindex="realUneditable || submitting ? null : 0"
            :ui="uiParts.image"
            @click="handleClick"
          >
            <slot name="button-label">
              <veui-icon :name="icons.addImage"/>
            </slot>
          </label>
        </div>
      </slot>
    </li>
  </transition-group>
  <span
    v-if="$slots.desc && type === 'image'"
    :class="$c('uploader-desc')"
  >
    <slot name="desc"/>
  </span>
  <iframe
    v-if="requestMode === 'iframe' && submitting"
    :id="iframeId"
    ref="iframe"
    :name="iframeId"
    :class="$c('uploader-hide')"
  />
  <form
    v-if="requestMode === 'iframe' && submitting"
    ref="form"
    :action="action"
    enctype="multipart/form-data"
    method="POST"
    :target="iframeId"
    :class="$c('uploader-hide')"
  >
    <input
      v-for="(val, key) in payload"
      :key="key"
      :name="key"
      :value="val"
      type="hidden"
    >
    <input
      v-if="iframeMode === 'callback'"
      name="callback"
      :value="`parent.${callbackNamespace}['${callbackFuncName}']`"
      type="hidden"
    >
  </form>

  <veui-dialog
    :open.sync="previewDialogOpen"
    :overlay-class="$c('uploader-preview-dialog')"
    :ui="uiParts.preview"
    footless
    outside-closable
  >
    <img
      :src="previewImageSrc"
      :class="$c('uploader-preview-dialog-image')"
    >
  </veui-dialog>
</div>
</template>

<script>
import Button from './Button'
import Icon from './Icon'
import Popover from './Popover'
import Progress from './Progress'
import Dialog from './Dialog'
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
  partial
} from 'lodash'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import i18n from '../mixins/i18n'
import config from '../managers/config'
import toast from '../managers/toast'
import { parse, format } from 'bytes'
import warn from '../utils/warn'

config.defaults({
  'uploader.requestMode': 'xhr',
  'uploader.iframeMode': 'postmessage',
  'uploader.callbackNamespace': 'veuiUploadResult',
  'uploader.pickerPosition': 'after'
})

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
    'veui-icon': Icon,
    'veui-button': Button,
    'veui-popover': Popover,
    'veui-progress': Progress,
    'veui-dialog': Dialog
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
      default: 'file'
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
      default () {
        return [
          'jpg',
          'jpeg',
          'gif',
          'png',
          'bmp',
          'tif',
          'tiff',
          'webp',
          'apng',
          'svg'
        ]
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
    }
  },
  data () {
    return {
      fileList: this.genFileList(this.value),
      canceled: false,
      // inputId用于图片里的重新上传的label的for
      inputId: uniqueId('veui-uploader-input'),
      iframeId: uniqueId('veui-uploader-iframe'),
      callbackFuncName: uniqueId('veuiUploaderCallback'),
      replacingFile: null,
      currentSubmitingFile: null,
      // submitting 控制form与iframe是否存在
      submitting: false,
      previewImageSrc: null,
      previewDialogOpen: false
    }
  },
  computed: {
    fileButtonDisabled () {
      return (
        this.realUneditable ||
        this.fileList.length === this.maxCount ||
        (this.requestMode === 'iframe' && this.submitting)
      )
    },
    listClass () {
      return this.$c(`uploader-list${this.type === 'image' ? '-image' : ''}`)
    },
    isReplacing () {
      return !!this.replacingFile
    },
    realUneditable () {
      return this.realDisabled || this.realReadonly
    },
    inputDisabled () {
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
          ...pick(file, ['name', 'src', 'status', 'toBeUploaded', 'message']),
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
    }
  },
  watch: {
    value (val) {
      let temp = this.genFileList(val)

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
        .filter(file => !!file)
        // 处理外部直接增加文件的情形
        .concat(cloneDeep(temp.slice(successIndex)))
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
      if (this.inputDisabled) {
        e.preventDefault()
      }
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
        status: 'success'
      }

      let extra = omit(file, ['name', 'src'])
      if (!isEmpty(extra)) {
        newFile._extra = cloneDeep(extra)
      }
      return assign(newFile, pick(file, ['name', 'src']))
    },
    handleNewFiles (files) {
      this.canceled = false

      if (!Array.isArray(files)) {
        files = this.$refs.input.files
      }

      let newFiles = [...files]
      let countFiles = this.fileList.length + newFiles.length
      if (this.maxCount !== 1 && countFiles > this.maxCount) {
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
              if (this.type === 'image' && window.URL) {
                file.src = window.URL.createObjectURL(file)
              }
            } else {
              file.status = 'failure'
              file.message = validationResults[index].message
            }

            return file
          })

          if (this.isReplacing) {
            // type=image时，点击重新上传进入此分支，替换掉原位置的文件replacingFile
            let newFile = newFiles[0]

            let replacingIndex = this.fileList.indexOf(this.replacingFile)
            this.$set(this.fileList, replacingIndex, newFile)
            this.$emit('change', this.getValue())

            this.replacingFile = null

            if (newFile.status === 'failure') {
              return
            }

            if (this.requestMode === 'iframe' && this.autoupload) {
              this.submit(newFile)
            }
            if (this.requestMode !== 'iframe' && this.autoupload) {
              this.uploadFile(newFile)
            }
          } else {
            this.fileList =
              this.realOrder === 'desc'
                ? [...newFiles, ...this.fileList]
                : [...this.fileList, ...newFiles]

            if (this.maxCount === 1) {
              this.fileList = this.fileList.slice(-1)
            }

            if (this.requestMode === 'iframe' && this.autoupload) {
              this.submit(newFiles[0])
            }
            if (this.requestMode !== 'iframe' && this.autoupload) {
              this.uploadFiles()
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
      if (!this.accept) {
        return true
      }

      let extension = last(filename.split('.')).toLowerCase()

      return this.accept.split(/,\s*/).some(item => {
        let acceptExtention = last(item.split(/[./]/)).toLowerCase()

        if (
          acceptExtention === extension ||
          // 对于类似'application/msword'这样的mimetype与扩展名对不上的情形跳过校验
          (acceptExtention !== '*' && item.indexOf('/') > -1)
        ) {
          return true
        }

        if (
          acceptExtention === '*' &&
          item.indexOf('/') > -1 &&
          this.extensions.indexOf(extension) > -1
        ) {
          return true
        }
        return false
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

      this.$emit(
        'progress',
        this.files[index],
        index,
        this.requestMode === 'xhr' ? progress : null
      )
    },
    onload (file, data) {
      this.uploadCallback(data, file)
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
    updateFileList (file, status, properties, toEmit = false) {
      if (status !== undefined) {
        file.status = status
      }

      if (properties) {
        assign(file, properties)
        file._extra = omit(properties, ['success', 'message', 'name', 'src'])
      }
      this.$set(this.fileList, this.fileList.indexOf(file), file)

      if (toEmit) {
        this.$emit('change', this.getValue(false))
      }
    },
    remove (file) {
      if (file.status === 'uploading') {
        this.cancel(file)
      }

      let index = this.fileList.indexOf(file)
      if (!this.isReplacing) {
        this.$emit('remove', this.files[index], index)
      }

      if (this.maxCount === 1) {
        this.fileList = []
      } else {
        this.fileList.splice(index, 1)
      }

      if (!file.toBeUploaded) {
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
    getScopeValue (index, file) {
      return { index, ...file }
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
    preview ({ src }) {
      this.previewImageSrc = src
      this.previewDialogOpen = true
    },
    getImageControls (file) {
      let defaultControls
      let remove = {
        name: 'remove',
        icon: this.icons.clear,
        label: this.t('remove')
      }
      switch (file.status) {
        case 'success':
          defaultControls = [
            {
              name: 'preview',
              icon: this.icons.preview,
              disabled: false,
              label: this.t('preview')
            },
            {
              name: 'replace',
              icon: this.icons.upload,
              label: this.t('replace')
            },
            remove
          ]
          break
        case 'failure':
          defaultControls = [remove]
          break
        default:
          defaultControls = [remove]
      }
      return this.controls
        ? this.controls(file, defaultControls)
        : defaultControls
    },
    handleImageControl (file, index, actionName) {
      if (actionName === 'preview' || actionName === 'remove') {
        this[actionName](file)
      } else {
        this.$emit(actionName, file, index)
      }
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
    }
  }
}
</script>
