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
      ref="label"
      :class="{
        [$c('button')]: true,
        [$c('uploader-input-label')]: true,
        [$c('disabled')]:
          realUneditable ||
          (maxCount > 1 && fileList.length >= maxCount) ||
          (requestMode === 'iframe' && submitting)
      }"
      :ui="realUi"
      @click="handleClick"
    >
      <slot name="button-label">
        <veui-icon
          :class="$c('uploader-input-label-icon')"
          :name="icons.upload"
        />{{ t('selectFile') }}
      </slot>
      <input
        :id="inputId"
        ref="input"
        hidden
        type="file"
        :name="name"
        :disabled="
          realUneditable ||
            (maxCount > 1 && fileList.length >= maxCount) ||
            (requestMode === 'iframe' && disabledWhenSubmiting)
        "
        :accept="accept"
        :multiple="
          requestMode !== 'iframe' &&
            (maxCount > 1 || maxCount === undefined) &&
            !isReplacing
        "
        @change="handleNewFiles"
        @click.stop
      >
    </label>
    <span
      v-if="$slots.desc"
      :class="$c('uploader-desc')"
    >
      <slot name="desc"/>
    </span>
  </div>
  <transition-group
    :class="listClass"
    tag="ul"
    :name="$c('uploader-list')"
  >
    <li
      v-for="(file, index) in fileList"
      :key="`${file.name}-${file.src}-${index}`"
      :class="`${listClass}-item`"
    >
      <template
        v-if="
          type === 'file' ||
            (type === 'image' && (!file.status || file.status === 'success'))
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
                :ui="realUi"
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
              >
                {{ file.name }}
              </span>
              <veui-icon
                v-if="file.status === 'success'"
                :name="icons.success"
                :u="realUi"
                :class="$c('uploader-success-icon')"
              />
              <veui-icon
                v-if="file.status === 'failure'"
                :name="icons.failure"
                :u="realUi"
                :class="$c('uploader-failure-icon')"
              />
              <veui-button
                :class="$c('uploader-list-remove')"
                :ui="uiParts.clearFileDone"
                :disabled="realUneditable"
                @click="removeFile(file)"
              >
                <veui-icon :name="icons.clear"/>
              </veui-button>
              <veui-tooltip
                v-if="file.status === 'failure'"
                :target="`fileFailure${index}`"
                position="top"
                :ui="uiParts.messageTooltip"
              >
                {{ file.message }}
              </veui-tooltip>
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
                <veui-button
                  :ui="uiParts.imageAction"
                  @click="preview(file)"
                >
                  <veui-icon :name="icons.preview"/>
                </veui-button>
                <label
                  :for="inputId"
                  :ui="uiParts.imageAction"
                  :class="{
                    [$c('button')]: true,
                    [$c('button-icon-only')]: true,
                    [$c('disabled')]: realUneditable
                  }"
                  @click.stop="replaceFile(file)"
                >
                  <veui-icon :name="icons.upload"/>
                </label>
                <veui-button
                  :ui="uiParts.imageAction"
                  :disabled="realUneditable"
                  :class="`${listClass}-mask-remove`"
                  @click="removeFile(file)"
                >
                  <veui-icon
                    :name="icons.clear"
                    :label="t('remove')"
                  />
                </veui-button>
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
          <div
            :class="`${listClass}-container ${listClass}-container-uploading`"
          >
            <div :class="`${listClass}-container-uploading-text`">
              <slot name="uploading-label">
                {{ t('uploading') }}
              </slot>
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
          <div :class="`${listClass}-container`">
            <label
              :for="inputId"
              :class="{
                [$c('button')]: true,
                [$c('uploader-input-label-image')]: true
              }"
            >
              <veui-icon :name="icons.addImage"/>
            </label>
            <div :class="`${listClass}-mask`">
              <veui-button
                :ui="uiParts.imageAction"
                :class="`${listClass}-mask-remove`"
                @click="removeFile(file)"
              >
                <veui-icon
                  :name="icons.clear"
                  :label="t('remove')"
                />
              </veui-button>
            </div>
          </div>
          <template v-if="file.message">
            <p
              :ref="`fileFailure${index}`"
              :class="`${listClass}-failure-text`"
            >
              <slot
                name="failure-label"
              >{{ t('error') }}<veui-icon
                :name="icons.message"
              /></slot>
            </p>
            <veui-tooltip
              :target="`fileFailure${index}`"
              position="top"
              :ui="uiParts.messageTooltip"
            >
              {{ file.message }}
            </veui-tooltip>
          </template>
          <slot
            name="file-after"
            v-bind="getScopeValue(index, file)"
          />
        </slot>
      </template>
    </li>
    <li
      v-if="type === 'image'"
      v-show="!maxCount || fileList.length < maxCount"
      key="input"
      :class="`${listClass}-item`"
    >
      <div :class="$c('uploader-list-image-container')">
        <label
          ref="label"
          :class="{
            [$c('button')]: true,
            [$c('uploader-input-label-image')]: true,
            [$c('disabled')]:
              realUneditable ||
              (maxCount > 1 && fileList.length >= maxCount) ||
              submitting
          }"
          @click="handleClick"
        >
          <input
            :id="inputId"
            ref="input"
            hidden
            type="file"
            :name="name"
            :disabled="
              realUneditable ||
                (requestMode === 'iframe' && disabledWhenSubmiting)
            "
            :accept="accept"
            :multiple="
              requestMode !== 'iframe' &&
                (maxCount > 1 || maxCount === undefined) &&
                !isReplacing
            "
            @change="handleNewFiles"
            @click.stop
          >
          <veui-icon :name="icons.addImage"/>
        </label>
      </div>
      <slot name="extra-operation"/>
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
import Tooltip from './Tooltip'
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
  findKey
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
  'uploader.callbackNamespace': 'veuiUploadResult'
})

export default {
  name: 'veui-uploader',
  components: {
    'veui-icon': Icon,
    'veui-button': Button,
    'veui-tooltip': Tooltip,
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
    progress: {
      type: String,
      default: 'text'
    },
    autoupload: {
      type: Boolean,
      default: true
    },
    order: {
      type: String,
      default: 'asc',
      validator (value) {
        return includes(['asc', 'desc'], value)
      }
    },
    compat: {
      type: Boolean,
      default: false
    },
    upload: Function
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
      // disabledWhenSubmiting 控制input在submit时是否禁用
      disabledWhenSubmiting: false,
      error: {
        sizeInvalid: false,
        typeInvalid: false,
        countOverflow: false,
        customError: false,
        valid: true
      },
      customValidationMessage: '',
      previewImageSrc: null,
      previewDialogOpen: false
    }
  },
  computed: {
    listClass () {
      return this.$c(`uploader-list${this.type === 'image' ? '-image' : ''}`)
    },
    latestFile () {
      return this.fileList[this.fileList.length - 1]
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
    files () {
      return this.fileList.map(file => {
        return {
          ...pick(file, ['name', 'src', 'status', 'toBeUploaded']),
          ...file._extra
        }
      })
    },
    pureFileList () {
      return this.files
        .filter(
          file =>
            (file.status === 'success' || !file.status) && !file.toBeUploaded
        )
        .map(file => omit(file, ['status', 'toBeUploaded']))
    },
    validationMessage () {
      let messageMap = {
        typeInvalid: this.t('fileTypeInvalid'),
        sizeInvalid: this.t('fileSizeInvalid'),
        countOverflow: this.t('tooManyFiles'),
        customError: this.customValidationMessage
      }
      return messageMap[findKey(this.error)]
    }
  },
  watch: {
    value (val) {
      let temp = val
      if (!Array.isArray(val)) {
        temp = this.genFileList(val)
      }

      let successIndex = 0
      this.fileList = this.fileList
        .map(file => {
          if (
            (file.status === 'success' || !file.status) &&
            !file.toBeUploaded
          ) {
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
    handleClick () {
      this.replacingFile = null
      this.reset()
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
      let newFile = {}

      let extra = omit(file, ['name', 'src'])
      if (!isEmpty(extra)) {
        newFile._extra = cloneDeep(extra)
      }
      return assign(newFile, pick(file, ['name', 'src']))
    },
    handleNewFiles () {
      this.canceled = false

      this.error = {
        sizeInvalid: false,
        typeInvalid: false,
        countOverflow: false,
        customError: false,
        valid: true
      }

      let newFiles = [...this.$refs.input.files]
      Promise.all(newFiles.map(file => this.validateFile(file))).then(
        validationResults => {
          this.error.valid = validationResults.every(Boolean)
          if (!this.error.valid) {
            toast.error(this.validationMessage)
          }

          newFiles = newFiles.filter((file, index) => validationResults[index])
          if (!newFiles.length) {
            return
          }

          if (this.isReplacing) {
            // type=image时，点击重新上传进入此分支，替换掉原位置的文件replacingFile
            let newFile = newFiles[0]
            newFile.toBeUploaded = true
            if (this.requestMode !== 'iframe' && window.URL) {
              newFile.src = window.URL.createObjectURL(newFile)
            }

            let replacingIndex = this.fileList.indexOf(this.replacingFile)
            this.$set(this.fileList, replacingIndex, newFile)
            this.$emit('change', this.getValue())

            this.replacingFile = null

            if (this.requestMode === 'iframe' && this.autoupload) {
              this.submit(newFile)
            }
            if (this.requestMode !== 'iframe' && this.autoupload) {
              this.uploadFile(newFile)
            }
          } else {
            if (
              this.maxCount !== 1 &&
              this.fileList.length + newFiles.length > this.maxCount
            ) {
              this.error.countOverflow = true
              toast.error(this.validationMessage)
              return
            }

            let currentFiles = this.fileList.filter(
              file => file.status !== 'failure'
            )

            let needImageSrc =
              this.requestMode !== 'iframe' &&
              this.type === 'image' &&
              window.URL
            newFiles = newFiles.map(file => {
              if (needImageSrc) {
                file.src = window.URL.createObjectURL(file)
              }
              file.toBeUploaded = true
              return file
            })

            this.fileList =
              this.order === 'desc'
                ? [...newFiles, ...currentFiles]
                : [...currentFiles, ...newFiles]

            if (this.maxCount === 1) {
              this.fileList = this.fileList.slice(-1)
            }

            if (this.requestMode === 'iframe' && this.autoupload) {
              this.submit()
            }
            if (this.requestMode !== 'iframe' && this.autoupload) {
              this.uploadFiles()
            }
          }
        }
      )
    },
    validateFile (file) {
      let typeValidation = this.validateFileType(file.name)
      this.error.typeInvalid = !typeValidation || this.error.typeInvalid

      let sizeValidation = this.validateFileSize(file.size)
      this.error.sizeInvalid = !sizeValidation || this.error.sizeInvalid

      return new Promise(resolve => {
        resolve(this.validator ? this.validator(file) : { valid: true })
      }).then(result => {
        let customValidation = result.valid
        if (!customValidation) {
          this.customValidationMessage = result.message
          this.error.customError = true
        }
        return customValidation && typeValidation && sizeValidation
      })
    },
    validateFileType (filename) {
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
    validateFileSize (fileSize) {
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
      switch (this.progress) {
        case 'percent':
        case 'detail':
        case 'bar':
          file.loaded = progress.loaded
          file.total = progress.total
          this.updateFileList(file)
          break
      }
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
        this.upload.call(null, file, {
          onload: this.onload,
          onprogress: this.onprogress,
          onerror: this.onerror
        })
      }
    },
    replaceFile (file) {
      this.replacingFile = file
      this.reset()
    },
    submit (file = this.latestFile) {
      this.currentSubmitingFile = file
      this.updateFileList(file, 'uploading')

      this.submitting = true

      this.$nextTick(() => {
        let { form, iframe } = this.$refs

        document.body.appendChild(iframe)
        document.body.appendChild(form)

        form.appendChild(this.$refs.input)
        form.submit()
        this.disabledWhenSubmiting = true
      })
    },
    uploadCallback (data, file) {
      this.submitting = false
      this.disabledWhenSubmiting = false
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
    removeFile (file) {
      this.error.countOverflow = false

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
    cancelFile (file) {
      if (this.requestMode === 'iframe') {
        this.canceled = true
        this.submitting = false
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
    focus () {
      this.$el.focus()
    }
  }
}
</script>
