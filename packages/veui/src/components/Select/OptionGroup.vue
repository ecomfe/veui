<script>
import Option from './Option'
import Overlay from '../Overlay'
import Icon from '../Icon'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import overlay from '../../mixins/overlay'
import menuItem from '../../mixins/menu-item'
import selectItem from '../../mixins/select-item'
import keySelect from '../../mixins/key-select'
import useControllable from '../../mixins/controllable'
import outside from '../../directives/outside'
import '../../common/uiTypes'
import { walk } from '../../utils/datasource'
import { isType, isTopMostOfType, getTypedAncestor } from '../../utils/helper'
import {
  pull,
  uniqueId,
  includes,
  cloneDeep,
  pick,
  pickBy,
  isEqual,
  isFunction
} from 'lodash'
import { useSelectContext } from '../_Context'

const EVENT_MAP = {
  hover: 'mouseenter',
  click: 'click'
}

const domAttrRe = /^(?:id|role|hidden)$|^(?:aria-|data-)/

const OptionGroup = {
  name: 'veui-option-group',
  uiTypes: ['menu'],
  inheritAttrs: false,
  directives: {
    outside
  },
  mixins: [
    prefix,
    ui,
    menuItem,
    selectItem,
    overlay,
    keySelect,
    useSelectContext('renderForData'),
    useControllable([
      {
        prop: 'expanded',
        event: 'toggle'
      }
    ])
  ],
  props: {
    label: String,
    trigger: {
      type: String,
      default: 'click',
      validator (val) {
        if (!val) {
          return true
        }
        return includes(['hover', 'click'], val)
      }
    },
    options: Array,
    disabled: Boolean,
    expanded: Boolean,
    position: {
      type: String,
      default: 'inline',
      validator (val) {
        return ['inline', 'popup'].indexOf(val) !== -1
      }
    },
    optionTag: {
      type: [Function, String],
      default (option) {
        // label
        if (option.options) {
          return option.position === 'popup' && option.options.length
            ? 'button'
            : 'div'
        }
        // option
        return 'button'
      }
    }
  },
  data () {
    return {
      items: [],
      localOverlayOptions: {
        position: 'right-start'
      },
      outsideRefs: ['button'],
      hasLabelContent: false,
      popupId: uniqueId('veui-option-group-popup-')
    }
  },
  computed: {
    value () {
      return this.select.value
    },
    itemIds () {
      return this.items.map(({ id }) => id)
    },
    componentAttrs () {
      return pickBy(this.$attrs, (_, key) => !domAttrRe.test(key))
    },
    domAttrs () {
      return pickBy(this.$attrs, (_, key) => domAttrRe.test(key))
    },
    realTrigger () {
      // derivable from parent group unless explicitly set
      return this.trigger || (this.menu && this.menu.trigger) || 'click'
    },
    realLocal () {
      if (this.realOverlayOptions.local != null) {
        return !!this.realOverlayOptions.local
      }
      return !!this.select.realOverlayOptions.local
    },
    isInput () {
      return isType(this.select, 'input')
    },
    popupRole () {
      return this.isInput ? 'listbox' : 'menu'
    },
    normalizedOptions () {
      if (this.options) {
        return cloneDeep(this.options)
      }

      return this.items.map(normalizeItem)
    },
    overlayTarget () {
      if (!this.canPopOut) {
        return null
      }

      if (!this.isInput) {
        return 'button'
      }

      let overlay = getTypedAncestor(this, 'overlay')
      return overlay ? overlay.$refs.box : null
    },
    // items -> options 的影响：
    // 应该只在渲染模式下这个属性才有意义，渲染模式下数据数据应该来自 options props 而非 items
    canPopOut () {
      return !!(
        this.position === 'popup' &&
        this.options &&
        this.options.length &&
        this.hasLabelContent
      )
    }
  },
  watch: {
    realExpanded (val) {
      let box = this.$refs.box
      let parent = this.menu || this.select
      while (parent) {
        if (val) {
          parent.outsideRefs.push(box)
        } else {
          pull(parent.outsideRefs, box)
        }
        parent = parent.menu || parent.select
      }
    },
    normalizedOptions: {
      immediate: true,
      handler (val, oldVal) {
        if (!this.options && isTopMostOfType(this, 'menu', 'select')) {
          if (!isEqual(val, oldVal)) {
            this.select.inlineOptions = val
          }
        }
      }
    }
  },
  created () {
    // When being the top-most menu inside a Select,
    // inject own items into consumer Select
    if (!this.options && isTopMostOfType(this, 'menu', 'select')) {
      this.select.inlineOptions = this.normalizedOptions
    }
  },
  methods: {
    add (item) {
      let length = this.items.length
      let index = item.index
      if (index >= length || index === -1) {
        this.items.push(item)
      } else {
        this.items.splice(index, 0, item)
      }
    },
    removeById (id) {
      this.items.splice(this.itemIds.indexOf(id), 1)
    },
    relocate () {
      if (this.canPopOut && this.realExpanded) {
        this.$refs.overlay.relocate()
      }
    },
    relocateDeep () {
      walk(
        this,
        child => {
          if (child.$options.name === this.$options.name) {
            child.relocate()
          }
        },
        '$children'
      )
    },
    close () {
      this.commit('expanded', false)
    },
    closeMenu (i) {
      let menu = this
      while (menu) {
        menu.close()
        menu = menu.menu
      }
    },
    getOptionTag (option) {
      return isFunction(this.optionTag)
        ? this.optionTag(option)
        : this.optionTag
    },
    getLabelContent () {
      if (isTopMostOfType(this, 'menu', 'select')) {
        return null
      }

      return (
        (this.$scopedSlots.label &&
          this.$scopedSlots.label({ label: this.label })) ||
        this.$slots.label ||
        (this.menu &&
          this.menu.$scopedSlots.label &&
          this.menu.$scopedSlots.label({ label: this.label })) ||
        (this.menu && this.menu.$slots.label) ||
        this.label
      )
    },
    handleAfteropen () {
      this.$emit('afteropen')
    }
  },
  render () {
    let content = this.options
      ? this.options.map((opt, i) => {
        let option = {
          ...opt,
          selected: Array.isArray(this.value)
            ? includes(this.value, opt.value)
            : opt.value === this.value
        }
        // group 直接透传
        let optionTag = option.options ? null : this.getOptionTag(option)
        return option.options ? (
          <OptionGroup
            ref="group"
            refInFor
            label={option.label}
            options={option.options}
            position={option.position}
            v-show={!option.hidden}
            hidden={option.hidden}
            aria-hidden={option.hidden}
            disabled={option.disabled}
            overlayClass={this.overlayClass}
            optionTag={this.optionTag}
            labelTag={this.labelTag}
            key={i}
            trigger={option.trigger || this.trigger}
            option={option} // pass raw option
            scopedSlots={{
              label:
                  option.renderLabel ||
                  this.$scopedSlots.label ||
                  (group => group.label),
              option: this.$scopedSlots.option || null,
              'option-label': this.$scopedSlots['option-label'] || null,
              'option-group-label':
                  this.$scopedSlots['option-group-label'] || null
            }}
          >
            {option.renderBefore ? (
              <template slot="before">{option.renderBefore()}</template>
            ) : null}
            {option.renderAfter ? (
              <template slot="after">{option.renderAfter()}</template>
            ) : null}
          </OptionGroup>
        ) : (
          <Option
            id={option.optionId}
            label={option.label}
            value={option.value}
            hidden={option.hidden}
            disabled={this.disabled || option.disabled}
            tag={optionTag}
            key={i}
          >
            {this.$scopedSlots.option
              ? this.$scopedSlots.option(option)
              : null}
            <template slot="label">
              {this.$scopedSlots['option-label']
                ? this.$scopedSlots['option-label'](option)
                : null}
            </template>
          </Option>
        )
      })
      : []

    if (this.renderForData) {
      // default 是内联的标签
      // content 是 options prop 渲染出来的，是不是应该直接把options往上注册即可？
      return (
        <div>
          {this.$slots.default}
          {!this.$slots.default && content}
        </div>
      )
    }

    this.labelContent = this.getLabelContent()
    // hasLabelContent 才是响应的（ boolean 值只要不变就不影响 ），避免 canPopout 无限渲染？
    this.hasLabelContent = !!this.labelContent
    let LabelTag =
      this.hasLabelContent && this.componentAttrs.option
        ? this.getOptionTag(this.componentAttrs.option)
        : 'div'

    return (
      <div
        class={{
          [this.$c('option-group')]: true,
          [this.$c('option-group-unlabelled')]: !this.labelContent,
          [this.$c('option-group-expanded')]: this.realExpanded,
          [this.$c('option-group-popout')]: this.canPopOut
        }}
        {...{ attrs: this.domAttrs }}
        ui={this.realUi}
        ref="label"
      >
        {this.labelContent ? (
          <LabelTag
            ref="button"
            class={{
              [this.$c('option-group-label')]: true,
              [this.$c('option-group-button')]: this.canPopOut,
              [this.$c('option-group-label-disabled')]: this.disabled
            }}
            ui={this.realUi}
            aria-haspopup={this.canPopOut ? this.popupRole : null}
            aria-owns={this.canPopOut ? this.popupId : null}
            role={this.canPopOut ? null : 'group'}
            {...(this.canPopOut
              ? {
                on: {
                  [EVENT_MAP[this.trigger]]: () => {
                    if (!this.disabled) {
                      this.commit('expanded', true)
                    }
                  },
                  keydown: e => {
                    if (e.key === 'Right' || e.key === 'ArrowRight') {
                      this.commit('expanded', true)
                      e.stopPropagation()
                      e.preventDefault()
                    }
                  }
                }
              }
              : {})}
          >
            {this.$scopedSlots['option-group-label'] ? (
              this.$scopedSlots['option-group-label']({
                // pass non-dom attrs
                ...this.componentAttrs,
                label: this.label,
                closeMenu: this.closeMenu
              })
            ) : (
              <span class={this.$c('option-label')}>{this.labelContent}</span>
            )}
            {this.canPopOut ? (
              <Icon
                class={this.$c('option-group-expandable')}
                name={this.icons.expandable}
              />
            ) : null}
          </LabelTag>
        ) : null}
        {this.canPopOut ? (
          <Overlay
            ref="overlay"
            target={this.overlayTarget}
            open={this.realExpanded}
            local={this.realLocal}
            options={this.realOverlayOptions}
            overlayClass={this.mergeOverlayClass(this.$c('option-group-box'))}
            autofocus
            modal
            onAfteropen={this.handleAfteropen}
          >
            <div
              id={this.popupId}
              ref="box"
              class={this.$c('option-group-options')}
              tabindex="-1"
              role={this.popupRole}
              aria-expanded={this.realExpanded}
              ui={this.realUi}
              {...{
                directives: [
                  {
                    name: 'outside',
                    value: {
                      trigger: this.trigger,
                      delay: 100,
                      refs: this.outsideRefs,
                      handler: () => {
                        this.commit('expanded', false)
                      }
                    }
                  }
                ]
              }}
              onKeydown={this.handleKeydown}
            >
              {this.$slots.before}
              {content}
              {this.$slots.default}
              {this.$slots.after}
            </div>
          </Overlay>
        ) : (
          [...content, ...(this.$slots.default || [])]
        )}
      </div>
    )
  }
}

function normalizeItem (item) {
  let options = (item.items || []).map(normalizeItem)
  let isGroup = options.length > 0
  return {
    ...pick(
      item,
      isGroup
        ? [
          'label',
          'position',
          'disabled',
          'trigger',
          'renderLabel',
          'renderBefore',
          'renderAfter'
        ]
        : [
          'label',
          'value',
          'disabled',
          'renderLabel',
          'renderBefore',
          'renderAfter'
        ]
    ),
    ...(isGroup ? { options } : {})
  }
}

export default OptionGroup
</script>
