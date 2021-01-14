<template>
<div>
  <ul
    :class="{
      [listClass]: true,
      [`${listClass}-picker-before`]: pickerPosition === 'before'
    }"
  >
    <li
      v-for="(file, index) in files"
      :key="`${file.name}-${file.src}`"
      :class="{
        [`${listClass}-item`]: true,
        [`${listClass}-item-failure`]: file.status === 'failure',
        [`${listClass}-item-dropdown-open`]: expandedControlDropdowns[index]
      }"
      :style="{
        order: index + 1
      }"
    >
      <template v-if="!file.status || file.status === 'success'">
        <slot
          name="file"
          v-bind="getScopeValue(index, file)"
        >
          <slot
            name="file-before"
            v-bind="getScopeValue(index, file)"
          />
          <div :class="$c('uploader-list-media-container')">
            <img
              v-if="getMediaType(file) === 'image'"
              :src="file.src"
              :alt="file.alt || ''"
              :class="$c('uploader-list-media-container-media')"
            >
            <img
              v-else-if="getMediaType(file) === 'video' && file.poster"
              :src="file.poster"
              :alt="file.alt || ''"
              :class="$c('uploader-list-media-container-media')"
            >
            <video
              v-else-if="getMediaType(file) === 'video'"
              :src="file.src"
              :class="$c('uploader-list-media-container-media')"
            />
            <veui-uploader-controls
              :class="`${listClass}-mask`"
              :items="getMediaControls(file)"
              :expanded.sync="expandedControlDropdowns[index]"
              :disabled="disabled"
              @click="handleMediaAction(file, index, $event)"
            />
          </div>
          <slot
            name="file-after"
            v-bind="getScopeValue(index, file)"
          />
        </slot>
      </template>
      <template v-else-if="file.status === 'uploading'">
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
              <slot name="uploading-label">{{
                t('@uploader.uploading')
              }}</slot>
            </div>
            <veui-progress
              v-if="requestMode !== 'iframe'"
              :value="file.loaded / file.total"
              :ui="$parent.uiParts.progress"
            />
          </div>
          <slot
            name="file-after"
            v-bind="getScopeValue(index, file)"
          />
        </slot>
      </template>
      <template v-else-if="file.status === 'failure'">
        <slot
          name="failure"
          v-bind="getScopeValue(index, file)"
        >
          <slot
            name="file-before"
            v-bind="getScopeValue(index, file)"
          />
          <div
            :ref="`fileItem${index}`"
            :class="`${listClass}-container ${listClass}-container-failure`"
          >
            <div
              :class="{
                [$c('uploader-input-label-media')]: true
              }"
              :ui="$parent.uiParts.media"
              tabindex="0"
            >
              <slot
                name="button-label"
                v-bind="getScopeValue(index, file)"
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
              @click="handleMediaAction(file, index, $event)"
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
            v-bind="getScopeValue(index, file)"
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
            :ui="$parent.uiParts.media"
            @keydown.enter.space.prevent="handleEnter"
            @click="$emit('add')"
          >
            <slot name="button-label">
              <veui-icon :name="getIconName(type)"/>
            </slot>
          </label>
          <div
            v-if="
              $parent.uiProps.size === 'm' && getMediaEntries().length > 1
            "
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
  </ul>

  <span
    v-if="$scopedSlots.desc"
    :class="$c('uploader-desc')"
  >
    <slot name="desc"/>
  </span>
</div>
</template>

<script>
import { endsWith } from 'lodash'
import config from '../../managers/config'
import prefix from '../../mixins/prefix'
import upload from '../../mixins/upload'
import i18n from '../../mixins/i18n'
import Icon from '../Icon'
import Progress from '../Progress'
import Popover from '../Popover'
import Controls from './_Controls'

export default {
  name: 'veui-uploader-media',
  components: {
    'veui-icon': Icon,
    'veui-popover': Popover,
    'veui-progress': Progress,
    'veui-uploader-controls': Controls
  },
  mixins: [prefix, upload, i18n],
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
    handleItemRemove (index) {
      this.$emit('remove', index)
    },
    handleUploadButtonClick () {
      this.$emit('add')
    },

    getMediaControls (file) {
      let defaultControls
      let remove = {
        name: 'remove',
        icon: this.$parent.icons.clear,
        label: this.t('@uploader.remove')
      }
      let replace = {
        name: 'replace',
        icon: this.$parent.icons.upload,
        label: this.t('@uploader.replace')
      }
      switch (file.status) {
        case 'success':
          defaultControls = [
            {
              name: 'preview',
              icon:
                file.type === 'image'
                  ? this.$parent.icons.previewImage
                  : this.$parent.icons.previewVideo,
              disabled: false,
              label: this.t('@uploader.preview')
            }
          ]

          if (this.$parent.uiProps.size !== 's') {
            defaultControls.push(replace)
          }

          defaultControls.push(remove)
          break
        case 'failure':
          defaultControls = [replace, remove]
          break
        default:
          defaultControls = [remove]
      }
      let controls = this.controls
        ? this.controls(file, defaultControls)
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
    handleMediaAction (file, index, actionName) {
      if (actionName === 'preview') {
        this.$emit('preview', index)
      } else if (actionName === 'remove') {
        this.$emit('remove', index)
      } else if (actionName === 'replace') {
        this.$emit('replace', index)
      } else {
        this.$emit(actionName, file, index)
      }
    },
    handleMediaEntry (entryName) {
      this.$emit(entryName)
    },
    getMediaType (file) {
      if (file.type) {
        return file.type
      }
      if (this.type === 'video' || this.type === 'image') {
        return this.type
      }

      const mediaExtensions = config.get('uploader.mediaExtensions')

      return find(Object.keys(mediaExtensions), type => {
        const extensions = mediaExtensions[type]

        return extensions.some(extension => {
          return endsWith(file.name, '.' + extension)
        })
      })
    },
    getIconName (type) {
      switch (type) {
        case 'image':
          return this.$parent.icons.addImage
        case 'video':
          return this.$parent.icons.addVideo
        case 'media':
          return this.$parent.icons.addMedia
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
