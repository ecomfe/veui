<template>
  <div class="veui-select"
    :class="{
      'veui-select-empty': value === null,
      'veui-select-expanded': expanded
    }">
    <veui-button
      :ui="buttonUI"
      :disabled="disabled || readonly"
      @click="expanded = !expanded"
      ref="button">
      <slot name="label" :label="label">
        <span>{{ label }}</span>
      </slot>
      <icon :name="`caret-${expanded ? 'up' : 'down'}`"></icon>
    </veui-button>
    <veui-overlay
      v-if="expanded"
      overlay-class="veui-select-overlay"
      target="button"
      :open="expanded"
      :options="overlay">
      <div class="veui-select-options" v-outside="close">
        <slot>
          <template v-for="option in options">
            <veui-option
              v-if="option.value"
              v-bind="option"
              :selected="option.value === value"
              :key="option.value"
              :icon="optionicon"
              @select="handleSelect">
                <slot name="option" v-bind="option"></slot>
            </veui-option>
            <div v-else-if="option.options" class="veui-select-option-group">
              <slot name="option-label" :label="option.label">
                <div class="veui-select-option-label">
                  <span>{{ option.label }}</span>
                </div>
              </slot>
              <veui-option
                v-for="subOption in option.options"
                v-bind="subOption"
                :selected="subOption.value === value"
                :key="subOption.value"
                :icon="optionicon"
                @select="handleSelect">
                <slot name="option" v-bind="subOption"></slot>
              </veui-option>
            </div>
          </template>
        </slot>
      </div>
    </veui-overlay>
  </div>
</template>

<script>
import Icon from '../Icon'
import Button from '../Button'
import Option from './Option'
import Overlay from '../Overlay'
import input from '../../mixins/input'
import ui from '../../mixins/ui'
import outside from '../../directives/outside'
import { includes } from 'lodash'
import config from '../../managers/config'
import 'vue-awesome/icons/caret-down'
import 'vue-awesome/icons/caret-up'

config.defaults({
  'select.btnUI': 'aux'
})

export default {
  name: 'veui-select',
  mixins: [input, ui],
  model: {
    event: 'change'
  },
  components: {
    Icon,
    'veui-button': Button,
    'veui-option': Option,
    'veui-overlay': Overlay
  },
  directives: { outside },
  props: {
    ui: String,
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    optionicon: {
      type: Boolean,
      default: false
    },
    options: Array
  },
  data () {
    return {
      expanded: false,
      overlay: {
        attachment: 'top left',
        targetAttachment: 'bottom left',
        constraints: [
          {
            to: 'scrollParent',
            attachment: 'together'
          }
        ]
      }
    }
  },
  computed: {
    buttonUI () {
      let props = this.uiProps.filter(prop => {
        return includes(['alt', 'tiny', 'small', 'large'], prop)
      })
      if (!includes(props, 'alt')) {
        props.push('aux')
      }
      return props.join(' ')
    },
    labelMap () {
      return extractOptions(this.options, {})
    },
    label () {
      if (this.value === null) {
        return this.placeholder
      }
      return this.labelMap[this.value]
    }
  },
  methods: {
    handleSelect (val) {
      this.expanded = false
      this.$emit('change', val)
    },
    close () {
      // FIXME: prevent being reversed by button click for now
      setTimeout(() => {
        this.expanded = false
      })
    }
  }
}

function extractOptions (options, map) {
  options.forEach(({ label, value, options }) => {
    map[value] = label
    if (options) {
      extractOptions(options, map)
    }
  })
  return map
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";
.veui-select {
  display: inline-block;
  width: 160px;

  .veui-button {
    width: 100%;
    .padding(_, 12px);
    text-align: left;
    span {
      display: inline-block;
      max-width: ~"calc(100% - 16px)";
      width: 100%;
      .ellipsis();
    }
    .veui-icon {
      float: right;
    }
  }

  &-expanded .veui-button:not(.veui-button-loading) {
    &,
    &:hover {
      color: @veui-theme-color-primary;
    }
  }

  &-options {
    min-width: 160px;
    max-height: 280px;
    overflow-y: auto;
    background-color: #fff;
    .veui-make-overlay(dropdown);
  }

  &-option-group {
    .veui-select-option-label {
      display: inline-block;
      .centered-line(@veui-height-normal);
      padding: 0 10px;
      font-size: @veui-font-size-small;
      color: @veui-gray-color-weak;
    }

    .veui-option {
      padding-left: 20px;
    }
  }
}
</style>
