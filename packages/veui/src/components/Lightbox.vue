<template>
<veui-overlay
  :open="realOpen"
  :overlay-class="
    mergeOverlayClass({
      [$c('lightbox')]: true,
      [$c('lightbox-mask')]: true
    })
  "
  autofocus
  :ui="realUi"
  modal
  :priority="priority"
>
  <div :class="$c('lightbox-head')">
    <div
      v-if="indicator === 'number' && count > 1"
      :class="$c('lightbox-indicator-numbers')"
    >
      {{ realIndex + 1 }}/{{ count }}
    </div>
    <div
      :class="$c('sr-only')"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ t('detail', { index: realIndex + 1, total: datasource.length }) }}
    </div>
    <veui-button
      v-if="closable"
      :ui="uiParts.close"
      :class="$c('lightbox-head-close')"
      :aria-label="t('close')"
      @click="cancel"
    >
      <veui-icon :name="icons.close"/>
    </veui-button>
  </div>
  <div
    :class="$c('lightbox-content')"
    v-bind="attrs"
    @keydown.esc="handleEscape"
    @keydown.left="step(-1, true)"
    @keydown.right="step(1, true)"
  >
    <div :class="$c('lightbox-viewport')">
      <veui-button
        v-show="count > 1 && (wrap || realIndex !== 0)"
        :ui="uiParts.control"
        :class="[$c('lightbox-control'), $c('lightbox-control-prev')]"
        @click="step(-1)"
      >
        <veui-icon
          :name="icons.prev"
          :aria-label="t('prev')"
        />
      </veui-button>
      <div
        :class="{
          [$c('lightbox-viewport-content')]: true
        }"
      >
        <transition-group
          :name="$c('lightbox-item')"
          :class="$c('lightbox-items')"
          tag="ol"
        >
          <li
            v-for="(item, i) in datasource"
            v-show="realIndex === i"
            ref="item"
            :key="`i#${item.src}`"
            tabindex="0"
            data-autofocus
            :class="{
              [$c('lightbox-item')]: true,
              [$c('lightbox-item-current')]: realIndex === i
            }"
            @focusin="focusedIndex = i"
            @focusout="focusedIndex = null"
          >
            <div :class="$c('lightbox-item-content-container')">
              <slot
                v-if="realIndex === i || isPreload(i)"
                v-bind="{ ...item, preload: isPreload(i) }"
                :index="i"
              >
                <div :class="$c('lightbox-item-content')">
                  <video
                    v-if="item.type === 'video'"
                    v-bind="options.video"
                    :muted="options.video.autoplay || options.video.muted"
                    :src="item.src"
                  />
                  <img
                    v-else
                    :src="item.src"
                    :alt="item.alt"
                  >
                </div>
              </slot>
              <slot :desc="item">
                <div :class="$c('lightbox-item-desc')">
                  {{ item.desc }}
                </div>
              </slot>
            </div>
          </li>
        </transition-group>
      </div>
      <veui-button
        v-show="count > 1 && (wrap || realIndex !== count - 1)"
        :ui="uiParts.control"
        :class="[$c('lightbox-control'), $c('lightbox-control-next')]"
        @click="step(1)"
      >
        <veui-icon
          :name="icons.next"
          :aria-label="t('next')"
        />
      </veui-button>
    </div>
  </div>
</veui-overlay>
</template>

<script>
import { includes } from 'lodash'
import Button from './Button'
import Icon from './Icon'
import Overlay from './Overlay'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'
import modal from '../managers/modal'
import useControllable from '../mixins/controllable'
import overlay from '../mixins/overlay'
import carousel from '../mixins/carousel'

export default {
  name: 'veui-lightbox',
  components: {
    'veui-button': Button,
    'veui-icon': Icon,
    'veui-overlay': Overlay
  },
  mixins: [
    prefix,
    ui,
    overlay,
    carousel,
    i18n,
    useControllable(['index']),
    useControllable(['open'])
  ],
  inheritAttrs: false,
  props: {
    open: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    },
    escapable: {
      type: Boolean,
      default: true
    },
    beforeClose: Function,
    priority: Number,
    indicator: {
      type: String,
      default: 'number',
      validator (value) {
        return includes(['number', 'none'], value)
      }
    },
    options: {
      type: Object,
      default () {
        return {
          video: {
            muted: true,
            autoplay: true,
            controls: true
          }
        }
      }
    }
  },
  computed: {
    attrs () {
      return {
        role: 'lightbox',
        'aria-modal': true,
        ...this.$attrs
      }
    }
  },
  watch: {
    realOpen (val) {
      if (val) {
        modal.open()
      } else {
        modal.close()
      }
    }
  },
  mounted () {
    if (this.realOpen) {
      modal.open()
    }
  },
  destroyed () {
    if (this.realOpen) {
      modal.close()
    }
  },
  methods: {
    close (type) {
      if (typeof type !== 'string') {
        type = 'cancel'
      }
      if (typeof this.beforeClose === 'function') {
        Promise.resolve(this.beforeClose(type)).then(result => {
          if (result !== false) {
            this.commit('open', false)
          }
        })
      } else {
        this.commit('open', false)
      }
      this.$emit(type)
    },
    cancel () {
      this.close('cancel')
    },
    handleEscape (e) {
      if (this.escapable) {
        e.stopPropagation()
        this.cancel()
      }
    }
  }
}
</script>
