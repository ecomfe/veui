<template>
  <article class="veui-uploader-demo">
    <h1><code>&lt;veui-uploader&gt;</code></h1>
    <h2>图片上传模式，上传进度以文字百分比显示</h2>
    <veui-uploader type="image"
      name="file"
      action="/upload"
      v-model="files"
      :max-count="3"
      max-size="10mb"
      accept=".jpg,.jpeg,.gif"
      ui="horizontal"
      :payload="payload"
      progress="number"
      @success="onSuccess"
      @failure="onFailure"
      @change="handleChange('files')"
      @statuschange="handleStatusChange">
      <template slot="desc">请选择jpg,jpeg,gif图片，大小在10M以内，最多上传3张图</template>
    </veui-uploader>
    <h2>图片上传模式，上传进度以进度条显示</h2>
    <veui-uploader type="image"
      name="file"
      action="/upload"
      v-model="files1"
      :max-count="3"
      max-size="10mb"
      accept=".jpg,.jpeg,.gif"
      :payload="payload"
      ui="horizontal"
      progress="bar"
      @success="onSuccess"
      @failure="onFailure"
      @change="handleChange('files1')"
      @statuschange="handleStatusChange">
      <template slot="desc">请选择jpg,jpeg,gif图片，大小在10M以内，最多上传3张图</template>
    </veui-uploader>
    <h2>文件上传模式</h2>
    <veui-uploader
      name="file"
      action="/upload"
      v-model="files2"
      :max-count="3"
      max-size="10mb"
      accept=".jpg,.jpeg,.gif"
      :payload="payload"
      ui="horizontal"
      progress="number"
      @success="onSuccess"
      @failure="onFailure"
      @change="handleChange('files2')"
      @statuschange="handleStatusChange">
      <template slot="desc">请选择jpg,jpeg,gif图片，大小在10M以内，只能上传3张图</template>
    </veui-uploader>
    <h2>文件上传模式，通过iframe上传</h2>
    <veui-uploader ref="iframeUploader"
      name="file"
      action="/uploadiframe"
      request-mode="iframe"
      v-model="filesIframe"
      :max-count="1"
      max-size="10mb"
      accept=".jpg,.jpeg,.gif"
      :payload="payload"
      :convert-response="convertResponse"
      @success="onSuccess"
      @failure="onFailure"
      @change="handleChange('filesIframe')"
      @statuschange="handleStatusChange">
      <template slot="desc">请选择jpg,jpeg,gif图片，大小在10M以内，只能上传1张图</template>
    </veui-uploader>
  </article>
</template>
<script>
import { Uploader } from 'veui'
import ui from 'veui/mixins/ui'
import { assign } from 'lodash'

export default {
  name: 'uploader-demo',
  components: {
    'veui-uploader': Uploader
  },
  data: function () {
    let files = [
      {
        name: 'demo-file1.jpg',
        src: 'https://www.baidu.com/img/bd_logo1.png'
      },
      {
        name: 'demo-file2.gif',
        src: 'http://nodejs.cn/static/images/logo.svg'
      }
    ]

    return {
      files,
      files1: files.slice(0),
      files2: files.slice(0),
      filesIframe: 'http://nodejs.cn/static/images/logo.svg',
      payload: {
        year: '2017',
        month: '4'
      }
    }
  },
  mixins: [ui],
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
      return assign({
        status: data.code ? 'failure' : 'success'
      }, data.result)
    }
  }
}
</script>

<style lang="less">
.veui-uploader-demo {
  padding-bottom: 20px;
  h2 {
    font-size: 16px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-top: 40px;
  }
}
</style>
