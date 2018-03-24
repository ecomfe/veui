
<script>
import Option from './Option'
import Overlay from '../Overlay'
import ui from '../../mixins/ui'
import menu from '../../mixins/menu'
import select from '../../mixins/select'
import '../../config/uiTypes'

export default {
  name: 'veui-option-group',
  uiTypes: ['menu'],
  mixins: [ui, menu, select],
  components: {
    'veui-option': Option,
    'veui-overlay': Overlay
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
      expanded: false
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
      return !!(this.position === 'popout' && this.options && this.options.length && this.label)
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
            v-show={!option.hidden}
            {...{
              props: {
                ...option,
                ui: this.inheritedUi
              }
            }}
            tabindex={option.hidden ? -1 : false}
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

    return <div
      class={{
        'veui-option-group': true,
        'veui-option-group-unlabelled': !this.label
      }}
      ui={this.ui}
      ref="label">
      {
        this.label
          ? <div class="veui-option-group-label">
            {
              this.$scopedSlots.label
                ? this.$scopedSlots.label({ label: this.label })
                : this.label
            }
          </div>
          : null
      }
      {
        this.canPopOut && this.expanded
          ? <veui-overlay
            target="label"
            open={this.expanded}
            options={{
              position: 'right top'
            }}
            autofocus
            modal>
            {content}
          </veui-overlay>
          : content
      }
    </div>
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
