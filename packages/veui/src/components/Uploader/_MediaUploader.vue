<template>
<div :class="$c('uploader-media')">
  <transition-group
    ref="transitionGroup"
    v-move-end
    tag="ul"
    :class="{
      [listClass]: true,
      [`${listClass}-picker-before`]: pickerPosition === 'before'
    }"
  >
    <li
      v-for="(file, index) in files"
      :key="file.key"
      v-drag.sort.x="dragSortOptions"
      :class="{
        [`${listClass}-item`]: true,
        [`${listClass}-item-failure`]: file.isFailure,
        [`${listClass}-item-dropdown-open`]: expandedControlDropdowns[index]
      }"
      :style="{
        order: index + 1
      }"
    >
      <template v-if="file.isUploading">
        <slot
          name="uploading"
          v-bind="getScopeValue(index)"
        >
          <slot
            name="file-before"
            v-bind="getScopeValue(index)"
          />
          <div
            :class="`${listClass}-container ${listClass}-container-uploading`"
          >
            <div :class="`${listClass}-container-uploading-text`">
              <slot name="uploading-label">{{
                t('@uploader.uploading')
              }}</slot>
            </div>
            <veui-progress
              :ui="uiParts.progress"
              :indeterminate="isIndeterminate(file)"
              :value="isIndeterminate(file) ? 0 : file.loaded / file.total"
            />
          </div>
          <slot
            name="file-after"
            v-bind="getScopeValue(index)"
          />
        </slot>
      </template>
      <template v-else-if="file.isFailure">
        <slot
          name="failure"
          v-bind="getScopeValue(index)"
        >
          <slot
            name="file-before"
            v-bind="getScopeValue(index)"
          />
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
              <slot
                name="button-label"
                v-bind="getScopeValue(index)"
              >
                <veui-icon :name="getIconName(type)"/>
              </slot>
              <span
                :class="`${listClass}-file-name`"
                :title="file.name"
              >
                {{ file.name }}
              </span>
            </div>
            <veui-uploader-controls
              :class="`${listClass}-mask`"
              :items="getMediaControls(file)"
              :expanded.sync="expandedControlDropdowns[index]"
              :disabled="disabled"
              @click="handleMediaAction(index, $event)"
            />
          </div>
          <veui-popover
            :target="`fileItem${index}`"
            position="top"
          >
            {{ file.message || t('@uploader.uploadFailure') }}
          </veui-popover>
          <slot
            name="file-after"
            v-bind="getScopeValue(index)"
          />
        </slot>
      </template>
      <template v-else>
        <slot
          name="file"
          v-bind="getScopeValue(index)"
        >
          <slot
            name="file-before"
            v-bind="getScopeValue(index)"
          />
          <div :class="$c('uploader-list-media-container')">
            <template v-if="file.type === 'image'">
              <veui-uploader-file-viewer
                tag="img"
                :src="file.src || file.native"
                :alt="file.alt"
                :class="$c('uploader-list-media-container-media')"
              />
            </template>
            <template v-else-if="file.type === 'video'">
              <img
                v-if="file.poster"
                :src="file.poster"
                :alt="file.alt"
                :class="$c('uploader-list-media-container-media')"
              >
              <veui-uploader-file-viewer
                v-else
                tag="video"
                :src="file.src || file.native"
                :class="$c('uploader-list-media-container-media')"
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
          <slot
            name="file-after"
            v-bind="getScopeValue(index)"
          />
        </slot>
      </template>
    </li>
    <li
      key="input"
      :class="{
        [`${listClass}-item`]: true,
        [`${listClass}-item-upload`]: true,
        [`${listClass}-item-hidden`]: !addable
      }"
    >
      <slot name="upload">
        <div
          :class="{
            [$c('uploader-list-media-container')]: true,
            [$c('uploader-list-media-container-upload')]: true,
            [$c(
              'uploader-list-media-item-entry-dropdown-open'
            )]: expandedEntryDropdown
          }"
        >
          <label
            :class="{
              [$c('button')]: true,
              [$c('uploader-input-label-media')]: true,
              [$c('disabled')]: disabled
            }"
            :tabindex="disabled ? null : 0"
            :ui="uiParts.media"
            @keydown.enter.space.prevent="handleEnter"
            @click="$emit('add')"
          >
            <slot name="button-label">
              <veui-icon :name="getIconName(type)"/>
            </slot>
          </label>
          <div
            v-if="uiProps.size === 'm' && getMediaEntries().length > 1"
            :class="{ [$c('uploader-entries-container')]: true }"
          >
            <veui-uploader-controls
              :items="getMediaEntries()"
              :expanded.sync="expandedEntryDropdown"
              :disabled="disabled"
              show-label
              @click="handleMediaEntry"
            />
          </div>
        </div>
      </slot>
    </li>
  </transition-group>

  <span
    v-if="$scopedSlots.desc"
    :class="$c('uploader-desc')"
  >
    <slot name="desc"/>
  </span>
</div>
</template>

<script>
import { includes } from 'lodash'
import prefix from '../../mixins/prefix'
import upload from '../../mixins/upload'
import i18n from '../../mixins/i18n'
import Icon from '../Icon'
import Progress from '../Progress'
import Popover from '../Popover'
import Controls from './_Controls'
import FileViewer from './_FileViewer'
import { STATUS } from './_helper'

const INTERNAL_ACTION_EVENTS = ['add', 'preview', 'remove', 'replace']

export default {
  name: 'veui-uploader-media',
  components: {
    'veui-icon': Icon,
    'veui-popover': Popover,
    'veui-progress': Progress,
    'veui-uploader-controls': Controls,
    'veui-uploader-file-viewer': FileViewer
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

      return controls.map(control => {
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

      return entries.map(entry => {
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
      switch (type) {
        case 'image':
          return this.icons.addImage
        case 'video':
          return this.icons.addVideo
        case 'media':
          return this.icons.addMedia
      }

      return null
    }
  }
}

function normalizeDropdownDatasource (items) {
  if (!items) {
    return []
  }
  return items.map(item => {
    return {
      ...item,
      value: item.name,
      children: normalizeDropdownDatasource(item.children)
    }
  })
}
</script>
