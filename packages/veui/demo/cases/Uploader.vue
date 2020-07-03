<template>
<article>
  <h1><code>&lt;veui-uploader&gt;</code></h1>
  <h2>图片上传模式</h2>
  <veui-uploader
    v-model="files"
    type="image"
    name="file"
    :action="action"
    :max-count="3"
    max-size="100kb"
    accept=".jpg,.jpeg,.gif"
    :payload="payload"
    :validator="validator"
    @success="onSuccess"
    @failure="onFailure"
    @change="handleChange('files')"
    @statuschange="handleStatusChange"
  >
    <template slot="desc">
      请选择jpg,jpeg,gif图片，大小在100kb以内，宽、高大于200像素，最多上传3张图
    </template>
  </veui-uploader>
  <h2>图片上传模式，扩展操作栏</h2>
  <veui-uploader
    ref="multipleUploader"
    v-model="files1"
    type="image"
    request-mode="custom"
    name="file"
    max-size="100kb"
    accept=".jpg,.jpeg,.gif"
    :payload="payload"
    :upload="upload"
    ui="s"
    picker-position="before"
    :controls="imageControls"
    @moveright="handleMoveRight"
    @success="onSuccess"
    @failure="onFailure"
    @change="handleChange('files1')"
    @statuschange="handleStatusChange"
  >
    <template slot="desc">
      请选择jpg,jpeg,gif图片，大小在100kb以内
    </template>
  </veui-uploader>
  <veui-button
    class="clear"
    @click="$refs.multipleUploader.clear()"
  >清除失败文件</veui-button>
  <h2>图片上传模式，自定义上传slot</h2>
  <veui-uploader
    ref="customUploader"
    v-model="customFiles"
    type="image"
    :action="action"
    name="file"
    max-size="10mb"
    accept=".jpg,.jpeg,.gif"
    :payload="payload"
    ui="s"
    @success="onSuccess"
    @failure="onFailure"
    @change="handleChange('files1')"
    @statuschange="handleStatusChange"
  >
    <template slot="desc">
      请选择jpg,jpeg,gif图片，大小在10M以内
    </template>
    <template slot="upload">
      <div class="veui-uploader-list-image-container custom">
        <veui-button
          @click="$refs.customUploader.clickInput()"
        >上传文件</veui-button>
        <veui-button
          ref="add-image"
          @click="openTooltip"
        >图库上传</veui-button>
      </div>
    </template>
  </veui-uploader>
  <veui-popover
    :target="tooltipTarget"
    :open="tooltipOpen"
    trigger="click"
    autofocus
  >
    <div class="extra-url">
      <veui-span>图片地址：</veui-span><veui-input v-model="imageSrc"/>
      <veui-button @click="addImage">
        确定
      </veui-button>
    </div>
  </veui-popover>
  <h2>文件上传模式</h2>
  <veui-uploader
    v-model="files2"
    name="file"
    :action="action"
    :max-count="3"
    max-size="100kb"
    :payload="payload"
    @success="onSuccess"
    @failure="onFailure"
    @change="handleChange('files2')"
    @statuschange="handleStatusChange"
  >
    <template slot="desc">
      请选择文件，大小在10M以内，只能上传3个文件
    </template>
  </veui-uploader>
  <h2>文件上传模式，通过iframe上传</h2>
  <veui-uploader
    v-model="filesIframe"
    name="file"
    action="/uploadiframe"
    request-mode="iframe"
    :max-count="1"
    max-size="10mb"
    accept=".jpg,.jpeg,.gif"
    :payload="payload"
    :convert-response="convertResponse"
    ui="s"
    @success="onSuccess"
    @failure="onFailure"
    @change="handleChange('filesIframe')"
    @statuschange="handleStatusChange"
  >
    <template slot="desc">
      请选择jpg,jpeg,gif图片，大小在10M以内，只能上传1张图
    </template>
  </veui-uploader>
</article>
</template>
<script>
import { Uploader, Button, Popover, Input, Span } from 'veui'
import 'veui-theme-dls-icons/chevron-right'

export default {
  name: 'uploader-demo',
  components: {
    'veui-uploader': Uploader,
    'veui-button': Button,
    'veui-popover': Popover,
    'veui-input': Input,
    'veui-span': Span
  },
  data () {
    let files = [
      {
        name: 'demo-file111111111111111111111111111111111.jpg',
        src: 'https://www.baidu.com/img/bd_logo1.png',
        extraInfo: 123
      },
      {
        name: 'demo-file2.gif',
        src:
          'https://ss3.bdstatic.com/yrwDcj7w0QhBkMak8IuT_XF5ehU5bvGh7c50/logopic/1b61ee88fdb4a4b918816ae1cfd84af1_fullsize.jpg',
        extraInfo: 128
      }
    ]

    return {
      action:
        'https://app.fakejson.com/q/ELymQ7xh?token=AWFkjMICPSAB_bO_z-Lnog',
      files,
      files1: files.slice(0),
      files2: files.slice(0),
      customFiles: files.slice(0),
      filesIframe: {
        name: 'demo-file.txt',
        src: 'http://www.baidu.com'
      },
      payload: {
        year: '2017',
        month: '4'
      },
      currentImage: null,
      imageSrc: null,
      tooltipTarget: null,
      tooltipOpen: false,
      upload: (file, { onload, onprogress, onerror }) => {
        // onload(file: Object, data: Object)
        // onprogress(file: Object, progress: Object({loaded, total}))
        // onerror(file: Object, error: Object({message}))
        let xhr = new XMLHttpRequest()
        file.xhr = xhr

        xhr.upload.onprogress = e => onprogress(e)
        xhr.onload = () => {
          try {
            onload(JSON.parse(xhr.responseText))
          } catch (e) {
            onload({ success: false, message: e })
          }
        }
        xhr.onerror = e => onerror(e)
        let formData = new FormData()
        formData.append('file', file)

        // xhr.open('POST', this.action, true)
        xhr.open('POST', '/upload', true)
        xhr.send(formData)

        return () => {
          xhr.abort()
        }
      },
      validator (file) {
        return new Promise(resolve => {
          let image = new Image()
          image.src = window.URL.createObjectURL(file)
          image.onload = () => {
            resolve({
              valid: image.height > 200 && image.width > 200,
              message: '图片宽高太小'
            })
          }
        })
      },
      imageControls (file, defaultControls) {
        if (file.status === 'success') {
          return [
            { name: 'moveright', icon: 'chevron-right', disabled: false },
            ...defaultControls
          ]
        }
        return defaultControls
      }
    }
  },
  methods: {
    onSuccess (data) {
      console.log('Success event: ', data)
    },
    onFailure (data) {
      console.log('Failure event: ', data)
    },
    handleChange (name) {
      console.log('Change event: ', this[name])
    },
    handleStatusChange (status) {
      console.log('Total status is: ', status)
    },
    convertResponse (data) {
      return {
        status: data.code ? 'failure' : 'success',
        ...data.result
      }
    },
    openTooltip (file) {
      this.currentImage = file
      this.tooltipOpen = true
      this.tooltipTarget = `add-image${
        file.index !== undefined ? '-' + file.index : ''
      }`
    },
    addImage () {
      if (this.currentImage.index !== undefined) {
        this.$set(this.customFiles, this.currentImage.index, {
          src: this.imageSrc
        })
      } else {
        this.customFiles.push({ src: this.imageSrc })
      }
      this.currentImage = null
      this.imageSrc = null
      this.tooltipOpen = false
    },
    handleMoveRight (file, index) {
      console.log('image action move right: ', file, index)
      if (index < this.files1.length - 1) {
        let temp = { ...this.files1[index] }
        this.$set(this.files1, index, this.files1[index + 1])
        this.$set(this.files1, index + 1, temp)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~veui-theme-dls/lib.less";

h2 {
  font-size: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-top: 40px;
}

.extra-url {
  & > * {
    vertical-align: middle;
  }

  .veui-button {
    margin-left: 5px;
  }
}
.clear {
  margin-top: 20px;
}
.custom {
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
</style>
