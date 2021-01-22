<template>
<div>
  <div :class="$c('uploader-button-container')">
    <veui-button
      :ui="realUi"
      :disabled="!addable"
      @click="handleUploadButtonClick"
    >
      <slot name="button-label">
        <veui-icon :name="icons.upload"/>
        <span>{{ t('@uploader.selectFile') }}</span>
      </slot>
    </veui-button>
    <span
      v-if="$scopedSlots.desc"
      :class="$c('uploader-desc')"
    >
      <slot name="desc"/>
    </span>
  </div>

  <ul :class="$c('uploader-list')">
    <li
      v-for="(file, index) in files"
      :key="`${file.name}-${file.src}`"
      :class="{
        [$c('uploader-list-item')]: true,
        [$c('uploader-list-item-failure')]: file.isFailure
      }"
    >
      <slot
        name="file"
        v-bind="getScopeValue(index)"
      >
        <slot
          name="file-before"
          v-bind="getScopeValue(index)"
        />

        <div :class="$c('uploader-list-container')">
          <veui-icon
            :name="icons.file"
            :class="{
              [$c('uploader-list-file-icon')]: true,
              [$c('uploader-list-file-icon-failure')]: file.isFailure
            }"
          />

          <span
            :ref="`fileMeta${index}`"
            :class="{
              [$c('uploader-list-name')]: true,
              [$c('uploader-list-name-success')]: file.isSuccess,
              [$c('uploader-list-name-failure')]: file.isFailure
            }"
            :title="file.name"
          >{{ file.name }}</span>

          <veui-icon
            v-if="file.isSuccess"
            :name="icons.success"
            :class="$c('uploader-success-icon')"
          />
          <veui-icon
            v-if="file.isFailure"
            :name="icons.failure"
            :class="$c('uploader-failure-icon')"
          />

          <veui-button
            :class="$c('uploader-list-remove')"
            :ui="uiParts.remove"
            :disabled="disabled"
            @click="handleItemRemove(index)"
          >
            <veui-icon :name="icons.clear"/>
          </veui-button>

          <veui-popover
            v-if="file.isFailure"
            :target="`fileMeta${index}`"
            position="top"
          >{{ file.message || t('@uploader.uploadFailure') }}</veui-popover>
        </div>

        <slot
          name="file-after"
          v-bind="getScopeValue(index)"
        />

        <veui-progress
          v-if="file.isUploading"
          :ui="uiParts.progress"
          :indeterminate="isIndeterminate(file)"
          :value="isIndeterminate(file) ? 0 : file.loaded / file.total"
        />
      </slot>
    </li>
  </ul>
</div>
</template>

<script>
import prefix from '../../mixins/prefix'
import upload from '../../mixins/upload'
import i18n from '../../mixins/i18n'
import Button from '../Button'
import Icon from '../Icon'
import Popover from '../Popover'
import Progress from '../Progress'

export default {
  name: 'veui-uploader-file',
  components: {
    'veui-icon': Icon,
    'veui-button': Button,
    'veui-progress': Progress,
    'veui-popover': Popover
  },
  mixins: [prefix, upload, i18n],
  methods: {
    handleItemRemove (index) {
      this.$emit('remove', index)
    },
    handleUploadButtonClick () {
      this.$emit('add')
    }
  }
}
</script>
