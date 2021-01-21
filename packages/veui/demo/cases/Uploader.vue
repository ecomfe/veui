<template>
<article>
  <h1><code>&lt;veui-uploader&gt;</code></h1>

  <fieldset>
    <legend>Options</legend>
    <div>
      Type:
      <veui-radio-button-group
        v-model="type"
        ui="s"
        :items="avaliableTypes"
      />
      <div class="space"/>
      <veui-checkbox v-model="autoupload">autoupload</veui-checkbox>
    </div>
    <div>
      Custom:
      <veui-check-button-group
        v-model="enabledCustoms"
        ui="s"
        :items="availableCustoms"
      />
    </div>
    <div>Accept: <veui-input
      v-model="accept"
      ui="xs"
    /></div>
    <div>
      Action:
      <veui-searchbox
        v-model="action"
        ui="xs"
        :suggestions="availableActions"
        replace-on-select
      />
    </div>
    <div>
      RequestMode:
      <veui-select
        v-model="requestMode"
        ui="xs"
        :options="availableRequestModes"
      />
      <template v-if="requestMode === 'iframe'">
        <br>+ iframeMode:
        <veui-select
          v-model="iframeMode"
          ui="xs"
          :options="availableRequestIframeModes"
        />
      </template>
    </div>
    <div>
      PickerPosition:
      <veui-select
        v-model="pickerPosition"
        ui="xs"
        :options="availablePickerPositions"
      />
    </div>
  </fieldset>

  <fieldset>
    <legend>Uploader</legend>
    <veui-uploader
      ref="uploader"
      v-model="files"
      v-bind="uploaderOptions"
    >
      <template
        v-if="includes(enabledCustoms, '#desc')"
        #desc
      >
        请选择{{ accept }}图片， 大小在{{ maxSize }}以内， 宽、高大于100像素，
        最多上传{{ maxCount }}张图
      </template>
      <template
        v-if="includes(enabledCustoms, '#button-label')"
        #button-label
      >
        <veui-icon name="id-card"/>
      </template>
      <template
        v-if="includes(enabledCustoms, '#file-after')"
        #file-after="{ name }"
      >
        <span>{{ name }}</span>
      </template>
      <template
        v-if="includes(enabledCustoms, '#upload')"
        #upload
      >
        <div class="veui-uploader-list-image-container">
          <veui-button
            @click="$refs.uploader.clickInput()"
          >上传文件</veui-button>
          <veui-button ref="custom-add-image">图库上传</veui-button>
        </div>
        <veui-popover
          target="custom-add-image"
          :open.sync="tooltipOpen"
          trigger="click"
          autofocus
        >
          <form @submit.prevent="handleTooltipImageSubmit">
            <veui-span>图片地址：</veui-span>
            <veui-input
              name="src"
              placeholder="https://"
            />
            <veui-button type="submit">确定</veui-button>
          </form>
        </veui-popover>
      </template>
      <template
        v-if="includes(enabledCustoms, '#uploading')"
        #uploading="{ name, loaded, total }"
      >
        <div class="veui-uploader-list-image-container">
          <p>“{{ name }}”上传中</p>
          <p>
            已完成 <strong>{{ loaded }}</strong>字节，剩余<strong>{{ total - loaded }}</strong>字节
          </p>
        </div>
      </template>
      <template
        v-if="includes(enabledCustoms, '#file')"
        #file="{ name, status }"
      >
        <div class="veui-uploader-list-media-container">
          <p>{{ statusIcons[status] }} {{ status }} {{ name }}</p>
        </div>
      </template>
    </veui-uploader>
  </fieldset>

  <fieldset>
    <legend>Operations</legend>
    <veui-button
      ui="basic s"
      @click="handleShuffleButtonClick"
    >打乱</veui-button>
    <div class="space"/>
    <veui-button
      ui="basic s"
      @click="$refs.uploader.clear()"
    >清除失败文件</veui-button>
  </fieldset>
</article>
</template>
<script>
import { includes, pick, shuffle } from 'lodash'
import {
  Uploader,
  Button,
  Popover,
  Select,
  SearchBox,
  Input,
  Span,
  Icon,
  Checkbox,
  RadioButtonGroup,
  CheckButtonGroup
} from 'veui'
import 'veui-theme-dls-icons/chevron-right'
import 'veui-theme-dls-icons/id-card'

const files = [
  {
    name: 'EXPjUWaWoAQ07Rj.jpg',
    src:
      'https://feed-image.baidu.com/0/pic/f1cc5f2566cba57dedd3357c4aeaf0ef.jpg'
  },
  {
    name:
      'D_REqQiU4AAY9TaD_REqQiU4AAY9TaD_REqQiU4AAY9TaD_REqQiU4AAY9TaD_REqQiU4AAY9Ta.png',
    src:
      'https://feed-image.baidu.com/0/pic/8e1f0412ce0b7104ae33f1e2c2fcd337.png',
    alt: 'A tea store with a cat inside in the shape of a drink box'
  },
  {
    name: '7a1ba2b.mp4',
    src:
      'https://nadvideo2.baidu.com/5dafd8544f4f53b27a5f59b0ab780403_1920_1080.mp4',
    poster:
      'https://feed-image.baidu.com/0/pic/4dced79d185a16e228652b136f653dcc.jpg'
  },
  {
    name: 'c9c23af.mp4',
    src:
      'https://nadvideo2.baidu.com/b45f066cccd13549219cb475ca520cee_1920_1080.mp4',
    extraInfo: '123'
  }
]

const mapper = value => ({ label: value, value })
const remoteUploadTarget =
  'https://app.fakejson.com/q/ELymQ7xh?token=AWFkjMICPSAB_bO_z-Lnog'
const localUploadTarget = '/upload/xhr'
const localIframeUploadTarget = '/upload/iframe'
const availableActions = [
  localUploadTarget,
  localIframeUploadTarget,
  remoteUploadTarget
].map(mapper)
const avaliableTypes = ['file', 'video', 'image', 'media'].map(mapper)
const availableCustoms = [
  '#desc',
  '#button-label',
  '#file-after',
  '#file',
  '#uploading',
  '#upload',
  ':controls',
  ':entries'
].map(mapper)
const availableRequestModes = ['xhr', 'iframe', 'custom'].map(mapper)
const availableRequestIframeModes = ['postmessage', 'callback'].map(mapper)
const availablePickerPositions = ['before', 'after'].map(mapper)

const statusIcons = {
  [Uploader.status.PENDING]: '❔',
  [Uploader.status.SUCCESS]: '✅',
  [Uploader.status.FAILURE]: '❌',
  [Uploader.status.UPLOADING]: '〽️'
}

export default {
  name: 'uploader-demo',
  components: {
    'veui-uploader': Uploader,
    'veui-button': Button,
    'veui-popover': Popover,
    'veui-input': Input,
    'veui-span': Span,
    'veui-icon': Icon,
    'veui-select': Select,
    'veui-checkbox': Checkbox,
    'veui-searchbox': SearchBox,
    'veui-radio-button-group': RadioButtonGroup,
    'veui-check-button-group': CheckButtonGroup
  },
  data () {
    return {
      statusIcons,
      avaliableTypes,
      availableCustoms,
      availableActions,
      availableRequestModes,
      availableRequestIframeModes,
      availablePickerPositions,

      enabledCustoms: [],
      tooltipOpen: false,
      localFiles: undefined,

      autoupload: true,
      type: 'file',

      accept: '.jpg,.jpeg,.png',
      maxCount: 5,
      maxSize: '1mb',

      action:
        process.env.NODE_ENV === 'development'
          ? localUploadTarget
          : remoteUploadTarget,
      // action: localIframeUploadTarget,
      requestMode: 'xhr',
      iframeMode: 'postmessage',
      payload: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      },
      pickerPosition: undefined
    }
  },
  computed: {
    files: {
      get () {
        if (this.localFiles) {
          return this.localFiles
        }
        if (['video', 'image'].indexOf(this.type) < 0) {
          return files
        }
        let check = {
          image: item => /\.(jpe?g|png)$/i.test(item.name),
          video: item => /\.mp4$/i.test(item.name)
        }[this.type]
        return files.filter(check)
      },
      set (val) {
        this.localFiles = val
      }
    },
    uploaderOptions () {
      return {
        ...pick(this, [
          'autoupload',
          'type',
          'accept',
          'maxCount',
          'maxSize',
          'action',
          'requestMode',
          'iframeMode',
          'payload',
          'pickerPosition'
        ]),
        upload: this.customUpload,
        controls: includes(this.enabledCustoms, ':controls')
          ? this.customItemControls
          : undefined,
        entries: includes(this.enabledCustoms, ':entries')
          ? this.customUploadEntries
          : undefined,
        convertResponse: this.convertResponse
      }
    }
  },
  watch: {
    type (val) {
      this.localFiles = undefined
    },
    files (val) {
      console.log('Files updated', this.files)
    }
  },
  methods: {
    includes,
    handleTooltipImageSubmit (evt) {
      let url = evt.target.src.value
      if (!/^https?:\/\/.+/i.test(url)) {
        return
      }
      this.files = this.files.concat({ name: url, src: url })
      this.tooltipOpen = false
    },
    handleShuffleButtonClick () {
      this.files = shuffle(this.files)
    },

    convertResponse (data, err) {
      if (!data) {
        return {
          success: false,
          message: `上传失败：${err.message}`
        }
      }

      return this.requestMode === 'iframe'
        ? {
          success: !data.code,
          ...data.result
        }
        : data
    },
    customUploadRequest (file, { onload, onerror, onprogress, oncancel }) {},

    customItemControls (file, defaultControls) {
      if (file.status !== 'success') {
        return defaultControls
      }
      return [
        { name: 'moveright', icon: 'chevron-right', disabled: false },
        {
          name: 'moveright1',
          icon: 'chevron-right',
          disabled: false,
          children: [
            {
              name: 'moveright1-1',
              label: '操作第一'
            },
            {
              name: 'moveright1-2',
              label: '操作第二'
            }
          ]
        },
        ...defaultControls
      ]
    },
    customUploadEntries (defaultEntries) {
      return [
        {
          name: 'add',
          icon: 'upload',
          label: '本地上传'
        },
        {
          name: 'imageLibrary',
          icon: 'star-solid',
          label: '图片库'
        },
        {
          name: 'add',
          icon: 'thumb-up-solid',
          label: '更多',
          children: [
            {
              label: '操作第一',
              name: 'entry1'
            },
            {
              label: '操作第二',
              name: 'entry2'
            },
            {
              label: '操作第三',
              name: 'entry3'
            }
          ]
        }
      ]
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

legend {
  padding: 3px 6px;
}
fieldset {
  margin: 20px 0;
}
fieldset > div {
  margin: 5px 0;
}

.space {
  display: inline-block;
  width: 2em;
}
</style>
