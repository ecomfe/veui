<template>
<div :class="$c('uploader-media')">
  <transition-group
    tag="ul"
    :name="$c('uploader-list-media')"
    :class="{
      [listClass]: true,
      [`${listClass}-picker-${pickerPosition}`]: true
    }"
  >
    <li
      v-for="(file, index) in files"
      :key="file.key"
      v-drag.sort.x="dragSortOptions"
      :class="{
        [`${listClass}-item`]: true,
        [`${listClass}-item-failure`]: file.isFailure,
        [`${listClass}-help-${helpPosition}`]: !multiple && $scopedSlots.desc,
        [`${listClass}-item-dropdown-open`]: expandedControlDropdowns[index]
      }"
      :style="{
        order: index + 1
      }"
    >
      <div :class="`${listClass}-container-wrap`">
        <template v-if="file.isUploading">
          <slot name="uploading" v-bind="getScopeValue(index)">
            <slot name="file-before" v-bind="getScopeValue(index)"/>
            <div
              :class="`${listClass}-container ${listClass}-container-uploading`"
            >
              <div :class="`${listClass}-container-uploading-text`">
                <slot name="uploading-label">
                  {{ t('@uploader.uploading') }}
                </slot>
              </div>
              <veui-progress
                :ui="uiParts.progress"
                :indeterminate="isIndeterminate(file)"
                :value="isIndeterminate(file) ? 0 : file.loaded / file.total"
              />
            </div>
            <slot name="file-after" v-bind="getScopeValue(index)"/>
          </slot>
        </template>
        <template v-else-if="file.isFailure">
          <slot name="failure" v-bind="getScopeValue(index)">
            <slot name="file-before" v-bind="getScopeValue(index)"/>
            <div
              :ref="`fileItem${index}`"
              :class="`${listClass}-container ${listClass}-container-failure`"
            >
              <div
                :class="{
                  [$c('uploader-input-label-media')]: true
                }"
                :ui="uiParts.media"
                tabindex="0"
              >
                <slot name="button-label" v-bind="getScopeValue(index)">
                  <veui-icon
                    v-if="uiProps.size !== 's'"
                    :name="getIconName(type)"
                  />
                  <span :class="`${listClass}-file-name`" :title="file.name">
                    {{ file.name }}
                  </span>
                </slot>
              </div>
              <veui-uploader-controls
                :class="`${listClass}-mask`"
                :items="getMediaControls(file)"
                :expanded.sync="expandedControlDropdowns[index]"
                :disabled="disabled"
                @click="handleMediaAction(index, $event)"
              />
            </div>
            <slot name="file-after" v-bind="getScopeValue(index)"/>
            <veui-message
              v-if="validityDisplay === 'inline'"
              :class="$c('uploader-validities')"
              :ui="uiParts.message"
              status="error"
              display="simple"
            >{{
              file.message || t('@uploader.uploadFailure')
            }}</veui-message>
            <veui-popover v-else :target="`fileItem${index}`" position="top">
              {{ file.message || t('@uploader.uploadFailure') }}
            </veui-popover>
          </slot>
        </template>
        <template v-else>
          <slot name="file" v-bind="getScopeValue(index)">
            <slot name="file-before" v-bind="getScopeValue(index)"/>
            <div
              :class="`${listClass}-container ${listClass}-container-file`"
            >
              <template v-if="file.type === 'image'">
                <veui-uploader-file-viewer
                  tag="img"
                  :src="file.src || file.native"
                  :alt="file.alt"
                  :class="$c('uploader-list-media-container-media')"
                  :draggable="!sortable"
                />
              </template>
              <template v-else-if="file.type === 'video'">
                <img
                  v-if="file.poster"
                  :src="file.poster"
                  :alt="file.alt"
                  :class="$c('uploader-list-media-container-media')"
                  :draggable="!sortable"
                >
                <veui-uploader-file-viewer
                  v-else
                  tag="video"
                  :src="file.src || file.native"
                  :class="$c('uploader-list-media-container-media')"
                  :draggable="!sortable"
                />
              </template>

              <veui-uploader-controls
                :class="`${listClass}-mask`"
                :items="getMediaControls(file)"
                :expanded.sync="expandedControlDropdowns[index]"
                :disabled="disabled"
                @click="handleMediaAction(index, $event)"
              />
            </div>
            <slot name="file-after" v-bind="getScopeValue(index)"/>
          </slot>
        </template>
      </div>
      <span
        v-if="!multiple && ($scopedSlots.desc || $scopedSlots.help)"
        :class="$c('uploader-help')"
      >
        <slot name="desc"/>
        <slot name="help"/>
      </span>
    </li>
    <!-- 继续上传按钮 -->
    <li
      v-if="pickerPosition !== 'none'"
      key="input"
      :class="{
        [`${listClass}-item`]: true,
        [`${listClass}-item-upload`]: true,
        [`${listClass}-help-${helpPosition}`]: true,
        [`${listClass}-item-disabled`]: pickerStatus.disabled,
        [`${listClass}-item-hidden`]: pickerStatus.hidden
      }"
    >
      <slot name="upload">
        <div
          :class="{
            [$c('uploader-list-media-container')]: true,
            [$c('uploader-list-media-container-upload')]: true,
            [$c('uploader-list-media-item-entry-dropdown-open')]:
              expandedEntryDropdown
          }"
        >
          <label
            :class="{
              [$c('button')]: true,
              [$c('uploader-input-label-media')]: true,
              [$c('disabled')]: pickerStatus.disabled
            }"
            :tabindex="disabled ? null : 0"
            :ui="uiParts.media"
            @keydown.enter.space.prevent="handleEnter"
            @click="$emit('add')"
          >
            <slot name="button-label">
              <veui-icon :name="getIconName(type)"/>
              <span :class="$c('uploader-media-button-text')">{{
                getIconText(type)
              }}</span>
            </slot>
          </label>
          <div
            v-if="uiProps.size === 'm' && getMediaEntries().length > 1"
            :class="{ [$c('uploader-entries-container')]: true }"
          >
            <veui-uploader-controls
              :items="getMediaEntries()"
              :expanded.sync="expandedEntryDropdown"
              :disabled="pickerStatus.disabled"
              show-label
              is-entry
              @click="handleMediaEntry"
            />
          </div>
        </div>
        <span
          v-if="addable && ($scopedSlots.desc || $scopedSlots.help)"
          :class="$c('uploader-help')"
        >
          <slot name="desc"/>
          <slot name="help"/>
        </span>
      </slot>
    </li>
  </transition-group>
</div>
</template>

<script>
import { includes, upperFirst } from 'lodash'
import prefix from '../../mixins/prefix'
import upload from './_mixin'
import i18n from '../../mixins/i18n'
import Icon from '../Icon'
import Progress from '../Progress'
import Popover from '../Popover'
import Message from '../Message'
import Controls from './_Controls'
import FileViewer from './_FileViewer'
import { STATUS } from './_helper'

const INTERNAL_ACTION_EVENTS = ['add', 'preview', 'remove', 'replace']

export default {
  name: 'veui-uploader-media',
  uiTypes: ['transparent'],
  components: {
    'veui-icon': Icon,
    'veui-popover': Popover,
    'veui-progress': Progress,
    'veui-uploader-controls': Controls,
    'veui-uploader-file-viewer': FileViewer,
    'veui-message': Message
  },
  mixins: [prefix, upload, i18n],
  provide () {
    return {
      uiParts: this.uiParts
    }
  },
  data () {
    return {
      expandedControlDropdowns: [],
      expandedEntryDropdown: false
    }
  },
  computed: {
    listClass () {
      return this.$c('uploader-list-media')
    },
    pickerStatus () {
      const isTop = this.pickerPosition === 'top'
      return {
        disabled: this.disabled || (isTop && !this.addable),
        hidden: !this.disabled && !this.addable && !isTop
      }
    }
  },
  methods: {
    getMediaControls (file) {
      let defaultControls
      let remove = {
        name: 'remove',
        icon: this.icons.clear,
        label: this.t('@uploader.remove')
      }
      let replace = {
        name: 'replace',
        icon: this.icons.upload,
        label: this.t('@uploader.replace')
      }
      switch (file.status) {
        case STATUS.SUCCESS:
          defaultControls = [
            {
              name: 'preview',
              icon:
                file.type === 'image'
                  ? this.icons.previewImage
                  : this.icons.previewVideo,
              disabled: false,
              label: this.t('@uploader.preview')
            }
          ]

          if (this.uiProps.size !== 's') {
            defaultControls.push(replace)
          }

          defaultControls.push(remove)
          break
        case STATUS.FAILURE:
          defaultControls = [replace, remove]
          break
        default:
          defaultControls = [remove]
      }
      let controls = this.controls
        ? this.controls({ ...file.value, status: file.status }, defaultControls)
        : defaultControls

      return controls.map((control) => {
        return {
          ...control,
          children: normalizeDropdownDatasource(control.children)
        }
      })
    },
    getMediaEntries () {
      let defaultEntries = []

      let addIcon = this.getIconName(this.type)

      defaultEntries.push({
        name: 'add',
        icon: addIcon,
        label: this.t('@uploader.add')
      })

      let entries = this.entries ? this.entries(defaultEntries) : defaultEntries

      return entries.map((entry) => {
        return {
          ...entry,
          children: normalizeDropdownDatasource(entry.children)
        }
      })
    },
    handleMediaAction (index, actionName) {
      if (includes(INTERNAL_ACTION_EVENTS, actionName)) {
        this.$emit(actionName, index)
      } else {
        this.$emit('custom', actionName, index)
      }
    },
    handleMediaEntry (entryName) {
      if (includes(INTERNAL_ACTION_EVENTS, entryName)) {
        this.$emit(entryName)
      } else {
        this.$emit('custom', entryName)
      }
    },
    getIconName (type) {
      if (this.pickerIcon) {
        return this.pickerIcon
      }
      switch (type) {
        case 'image':
          return this.icons.addImage
        case 'video':
          return this.icons.addVideo
        case 'media':
          return this.icons.addMedia
      }

      return null
    },
    getIconText (type) {
      if (this.pickerLabel) {
        return this.pickerLabel
      }
      return this.t(`@uploader.upload${upperFirst(type)}`)
    }
  }
}

function normalizeDropdownDatasource (items) {
  if (!items) {
    return []
  }
  return items.map((item) => {
    return {
      ...item,
      value: item.name,
      children: normalizeDropdownDatasource(item.children)
    }
  })
}
</script>
