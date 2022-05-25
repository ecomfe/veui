<template>
<div>
  <div
    :class="{
      [$c('uploader-button-container')]: true,
      [$c(`uploader-file-help-${helpPosition}`)]: true
    }"
  >
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
      v-if="$scopedSlots.desc || $scopedSlots.help"
      :class="$c('uploader-help')"
    >
      <slot name="desc"/>
      <slot name="help"/>
    </span>
  </div>

  <transition-group
    tag="ul"
    :name="$c('uploader-list')"
    :class="$c('uploader-list')"
  >
    <li
      v-for="(file, index) in files"
      :key="file.key"
      v-drag.sort.y="dragSortOptions"
      :class="{
        [$c('uploader-list-item')]: true,
        [$c('uploader-list-item-failure')]: file.isFailure
      }"
    >
      <slot name="file" v-bind="getScopeValue(index)">
        <slot name="file-before" v-bind="getScopeValue(index)"/>

        <div :class="$c('uploader-list-container')">
          <div :class="$c('uploader-list-file-content')">
            <veui-icon
              :name="icons.file"
              :class="{
                [$c('uploader-list-file-icon')]: true,
                [$c('uploader-list-file-icon-failure')]: file.isFailure
              }"
            />

            <span
              :class="{
                [$c('uploader-list-name')]: true,
                [$c('uploader-list-name-success')]: file.isSuccess,
                [$c('uploader-list-name-failure')]: file.isFailure
              }"
              :title="file.name"
            >{{ file.name }}</span>

            <div :class="$c('uploader-list-actions')">
              <veui-button
                v-for="action in getFileActions(file)"
                :key="action.name"
                :ui="uiParts.control"
                :disabled="disabled"
                @click="handleItemAction(index, action)"
              >
                <veui-icon :name="action.icon"/>
              </veui-button>
            </div>
          </div>
          <slot name="file-after" v-bind="getScopeValue(index)"/>

          <veui-message
            v-if="file.isFailure"
            :class="$c('uploader-validities')"
            status="error"
            display="simple"
            :ui="uiParts.message"
          >{{ file.message || t('@uploader.uploadFailure') }}</veui-message>
        </div>

        <veui-progress
          v-if="file.isUploading"
          :ui="uiParts.progress"
          :indeterminate="isIndeterminate(file)"
          :value="isIndeterminate(file) ? 0 : file.loaded / file.total"
        />
      </slot>
    </li>
  </transition-group>
</div>
</template>

<script>
import prefix from '../../mixins/prefix'
import upload from './_mixin'
import i18n from '../../mixins/i18n'
import Button from '../Button'
import Icon from '../Icon'
import Progress from '../Progress'
import Message from '../Message'

const INTERNAL_ACTION_EVENTS = ['remove']

export default {
  name: 'veui-uploader-file',
  uiTypes: ['transparent'],
  components: {
    'veui-icon': Icon,
    'veui-button': Button,
    'veui-progress': Progress,
    'veui-message': Message
  },
  mixins: [prefix, upload, i18n],
  methods: {
    handleItemAction (index, { name }) {
      if (INTERNAL_ACTION_EVENTS.indexOf(name) >= 0) {
        this.$emit(name, index)
      } else {
        this.$emit('custom', name, index)
      }
    },
    handleUploadButtonClick () {
      this.$emit('add')
    },
    getFileActions (file) {
      const defaultControls = [
        {
          name: 'remove',
          icon: this.icons.clear,
          label: this.t('@uploader.remove')
        }
      ]
      return this.controls
        ? this.controls({ ...file.value, status: file.status }, defaultControls)
        : defaultControls
    }
  }
}
</script>
