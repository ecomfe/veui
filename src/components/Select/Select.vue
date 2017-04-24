<template>
  <div class="veui-select" :ui="ui">
    <veui-button
      :ui="ui"
      :class="{'veui-button-empty': value === null}"
      :disabled="disabled || readonly"
      @click="expanded = !expanded"
      v-clickoutside="clickoutside"
      slot="target"
      ref="veui-select-button">
      <slot name="select-target" :label="label">
        <icon :name="`caret-${expanded ? 'up' : 'down'}`"></icon>
        <span>{{ label }}</span>
      </slot>
    </veui-button>
    <veui-overlay
      :overlay-class="{'veui-select-options': true}"
      target="veui-select-button"
      :open="expanded"
      :options="overlay">
      <template v-for="option in options">
        <veui-option
          v-if="option.value"
          v-bind="option"
          :selected="option.value === value"
          :key="option.value"
          :icon="optionicon"
          @select="selectHandler">
            <slot name="select-option" v-bind="option"></slot>
        </veui-option>
        <div v-else-if="option.options" class="veui-select-options-group">
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
            @select="selectHandler">
            <slot name="select-option" v-bind="subOption"></slot>
          </veui-option>
        </div>
      </template>
    </veui-overlay>
  </div>
</template>

<script>
import Icon from '../Icon'
import Button from '../Button'
import Option from './Option'
import Overlay from '../Overlay'
import mixin from '../../mixins/input'
import 'vue-awesome/icons/caret-down'
import 'vue-awesome/icons/caret-up'
import { forEach } from 'lodash'

export default {
  name: 'veui-select',
  mixins: [mixin],
  model: {
    event: 'change'
  },
  components: {
    'icon': Icon,
    'veui-button': Button,
    'veui-option': Option,
    'veui-overlay': Overlay
  },
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
        offset: '-3px 0',
        constraints: [
          {
            to: 'scrollParent',
            attachment: 'together none'
          }
        ]
      }
    }
  },
  computed: {
    labelMap () {
      let mapOptions = {}
      function extract (options) {
        forEach(options, option => {
          if (option.value) {
            mapOptions[option.value] = option.label
          } else if (option.options) {
            extract(option.options)
          }
        })
      }
      extract(this.options)
      return mapOptions
    },
    label () {
      if (this.value === null) {
        return this.placeholder
      }
      return this.labelMap[this.value]
    }
  },
  methods: {
    selectHandler (val) {
      this.$emit('change', val)
    },
    clickoutside () {
      if (this.expanded) {
        this.expanded = !this.expanded
      }
    }
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";
.veui-select {
  .veui-button {
    width: 160px;
    padding: 11px 12px;
    position: relative;
    text-align: left;
    span {
      display: inline-block;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &.veui-button-empty {
      color: @veui-gray-color-weak;
    }
    svg {
      width: 18px;
      height: 18px;
      position: absolute;
      right: 11px;
      top: 9px;
      & + span {
        width: calc(100% - 12px);
      }
    }
  }
}
.veui-select-options {
  min-width: 160px;
  max-height: 280px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid @veui-gray-color-sup-2;
  border-radius: 2px;
  .veui-select-options-group {
    .veui-select-option-label {
      padding: 0 10px;
      height: 36px;
      line-height: 36px;
      font-size: @veui-font-size-small;
      color: @veui-gray-color-weak;
    }
    .veui-option {
      padding-left: 20px;
    }
  }
}
</style>
