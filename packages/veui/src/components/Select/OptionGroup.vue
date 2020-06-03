<script>
import Option from './Option'
import Overlay from '../Overlay'
import Icon from '../Icon'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import overlay from '../../mixins/overlay'
import menu from '../../mixins/menu'
import select from '../../mixins/select'
import keySelect from '../../mixins/key-select'
import outside from '../../directives/outside'
import '../../common/uiTypes'
import { walk } from '../../utils/datasource'
import { isType, isTopMostOfType } from '../../utils/helper'
import {
  pull,
  uniqueId,
  includes,
  cloneDeep,
  pick,
  pickBy,
  isEqual
} from 'lodash'

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
  mixins: [prefix, ui, menu, select, overlay, keySelect],
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
    position: {
      type: String,
      default: 'inline',
      validator (val) {
        return ['inline', 'popup'].indexOf(val) !== -1
      }
    },
    optionTag: Option.props.tag
  },
  data () {
    return {
      items: [],
      expanded: false,
      localOverlayOptions: {
        position: 'right-start'
      },
      outsideRefs: ['button'],
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
    labelContent () {
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
    realTrigger () {
      // derivable from parent group unless explicitly set
      return this.trigger || (this.menu && this.menu.trigger) || 'click'
    },
    canPopOut () {
      return !!(
        this.position === 'popup' &&
        this.items &&
        this.items.length &&
        this.labelContent
      )
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
    }
  },
  watch: {
    expanded (val) {
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
      if (this.canPopOut && this.expanded) {
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
      this.expanded = false
    },
    closeMenu (i) {
      let menu = this
      while (menu) {
        menu.close()
        menu = menu.menu
      }
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
            tag={this.optionTag}
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

    let LabelTag =
      this.canPopOut && EVENT_MAP[this.trigger] === 'click' ? 'button' : 'div'

    return (
      <div
        class={{
          [this.$c('option-group')]: true,
          [this.$c('option-group-unlabelled')]: !this.labelContent,
          [this.$c('option-group-expanded')]: this.expanded,
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
                      this.expanded = true
                    }
                  },
                  keydown: e => {
                    if (e.key === 'Right' || e.key === 'ArrowRight') {
                      this.expanded = true
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
            target={
              this.isInput ? this.menu.$refs.box || this.menu.$el : 'button'
            }
            open={this.expanded}
            local={this.realLocal}
            options={this.realOverlayOptions}
            overlayClass={this.mergeOverlayClass(this.$c('option-group-box'))}
            autofocus
            modal
          >
            <div
              id={this.popupId}
              ref="box"
              class={this.$c('option-group-options')}
              tabindex="-1"
              role={this.popupRole}
              aria-expanded={this.expanded}
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
                        this.expanded = false
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
          'trigger',
          'renderLabel',
          'renderBefore',
          'renderAfter'
        ]
        : ['label', 'value', 'renderLabel', 'renderBefore', 'renderAfter']
    ),
    ...(isGroup ? { options } : {})
  }
}

export default OptionGroup
</script>
