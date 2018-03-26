
<script>
import Option from './Option'
import Overlay from '../Overlay'
import Icon from '../Icon'
import ui from '../../mixins/ui'
import overlay from '../../mixins/overlay'
import menu from '../../mixins/menu'
import select from '../../mixins/select'
import keySelect from '../../mixins/key-select'
import outside from '../../directives/outside'
import '../../config/uiTypes'
import { walk } from '../../utils/data'
import { pull } from 'lodash'

export default {
  name: 'veui-option-group',
  uiTypes: ['menu'],
  mixins: [ui, menu, select, overlay, keySelect],
  components: {
    'veui-option': Option,
    'veui-overlay': Overlay,
    'veui-icon': Icon
  },
  directives: {
    outside
  },
  props: {
    label: String,
    options: Array,
    position: {
      type: String,
      default: 'inline',
      validator (val) {
        return ['inline', 'popout'].indexOf(val) !== -1
      }
    }
  },
  data () {
    return {
      items: [],
      expanded: false,
      localOverlayOptions: {
        position: 'right-start',
        constraints: [
          {
            to: 'window',
            attachment: 'together'
          }
        ]
      },
      outsideRefs: ['button']
    }
  },
  computed: {
    value () {
      return this.select.value
    },
    itemIds () {
      return this.items.map(({ id }) => id)
    },
    canPopOut () {
      return !!(this.position === 'popout' && this.items && this.items.length && this.label)
    }
  },
  render () {
    let content = this.options
      ? this.options.map((option, i) => {
        return option.options
          ? <veui-option-group
            {...{
              props: {
                ...option,
                ui: this.inheritedUi
              }
            }}
            key={i}
            scopedSlots={
              {
                label: this.$scopedSlots.label
                  ? group => {
                    return this.$scopedSlots.label(group) || group.label
                  }
                  : null,
                option: this.$scopedSlots.option
                  ? option => {
                    return this.$scopedSlots.label(option)
                  }
                  : null,
                'option-label': this.$scopedSlots['option-label']
                  ? option => {
                    return this.$scopedSlots.label(option)
                  }
                  : null
              }
            }>
          </veui-option-group>
          : <veui-option
            {...{
              props: {
                ...option,
                ui: this.inheritedUi
              }
            }}
            key={i}
            slots={
              {
                default: this.$scopedSlots.option,
                label: this.$scopedSlots['option-label'] || option.label
              }
            }>
          </veui-option>
      })
      : this.$slots.default

    let LabelTag = this.canPopOut ? 'button' : 'div'

    return <div
      class={{
        'veui-option-group': true,
        'veui-option-group-unlabelled': !this.label,
        'veui-option-group-expanded': this.expanded
      }}
      ui={this.ui}
      ref="label">
      {
        this.label
          ? <LabelTag
            ref="button"
            class={{
              'veui-option-group-label': true,
              'veui-option-group-button': this.canPopOut
            }}
            {...this.canPopOut
              ? {
                on: {
                  click: () => {
                    this.expanded = true
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
              : {}
            }>
            <span class="veui-option-label">
              {
                this.$scopedSlots.label
                  ? this.$scopedSlots.label({ label: this.label })
                  : this.label
              }
            </span>
            {
              this.canPopOut
                ? <veui-icon class="veui-option-group-expandable" name={this.icons.expandable}/>
                : null
            }
          </LabelTag>
          : null
      }
      {
        this.canPopOut
          ? <veui-overlay
            ref="overlay"
            target="button"
            open={this.expanded}
            options={this.realOverlayOptions}
            overlayClass={this.mergeOverlayClass('veui-option-group-box')}
            autofocus
            modal>
            <div
              ref="box"
              class="veui-select-options"
              tabindex="-1"
              ui={this.ui}
              {...{
                directives: [{
                  name: 'outside',
                  value: {
                    refs: this.outsideRefs,
                    handler: () => {
                      this.expanded = false
                    }
                  }
                }]
              }}
              onKeydown={this.handleKeydown}>
              {content}
            </div>
          </veui-overlay>
          : content
      }
    </div>
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
    }
  },
  methods: {
    add (item) {
      let length = this.items.length
      let index = item.index
      if (index >= length) {
        this.items.push(item)
      } else {
        this.items.splice(index, 0, item)
      }
    },
    removeById (id) {
      this.items.splice(this.itemIds.indexOf(id), 1)
    },
    find (val) {
      return findItemByValue(this.items, val)
    },
    relocate () {
      if (this.canPopOut && this.expanded) {
        this.$refs.overlay.relocate()
      }
    },
    relocateDeep () {
      walk(this, child => {
        if (child.$options.name === this.$options.name) {
          child.relocate()
        }
      }, '$children')
    },
    close () {
      this.expanded = false
    },
    handleKeydown (e) {
      let passive = false
      switch (e.key) {
        case 'Esc':
        case 'Escape':
        case 'Left':
        case 'ArrowLeft':
          this.expanded = false
          break
        case 'Up':
        case 'ArrowUp':
          this.navigate(false)
          break
        case 'Down':
        case 'ArrowDown':
          this.navigate()
          break
        default:
          passive = true
          break
      }
      if (!passive) {
        e.stopPropagation()
        e.preventDefault()
      }
    }
  }
}

function findItemByValue (items, val) {
  if (!items) {
    return null
  }

  let result = null
  items.some(item => {
    if (!item.items) {
      if (item.value === val) {
        result = item
        return true
      }
    }
    let inner = findItemByValue(item.items, val)
    if (inner !== null) {
      result = inner
      return true
    }
  })
  return result
}

</script>
