<script>
import CandidatePanel from './_CandidatePanel'
import SelectedPanel from './_SelectedPanel'
import { includes, isString, clone } from 'lodash'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import { focusIn } from '../../utils/dom'

function defaultFilter (type, keyword, item, datasource) {
  return includes(item.label, keyword)
}

export default {
  name: 'veui-transfer',
  mixins: [ui, input],
  model: {
    prop: 'selected',
    event: 'select'
  },
  props: {
    datasource: {
      type: Array,
      default () {
        return []
      }
    },
    searchable: {
      type: Boolean,
      default: true
    },
    filter: {
      type: Function,
      default: defaultFilter
    },
    selected: {
      type: Array,
      default () {
        return []
      }
    },
    candidatePlaceholder: String,
    selectedPlaceholder: String,
    selectedShowMode: {
      type: String,
      default: 'tree',
      validator (value) {
        return includes(['tree', 'flat'], value)
      }
    },
    keys: {
      type: [String, Function],
      default: 'value'
    }
  },
  data () {
    return {
      candidateItems: [],
      selectedItems: [],
      rootAllCount: 0,
      rootPartCount: 0,

      localSelected: this.selected ? clone(this.selected) : []
    }
  },
  computed: {
    isSelectable () {
      return !this.realDisabled && !this.realReadonly
    },
    realKeys () {
      if (isString(this.keys)) {
        return source => source[this.keys]
      }

      return this.keys
    }
  },
  watch: {
    selected (v) {
      this.localSelected = v ? clone(v) : []
    }
  },
  mounted () {
    this.candidateTree = this.$refs.candidatePanel.$refs.tree
    this.selectedItems = this.candidateTree.$data.selectedItems
  },
  methods: {
    handleSelect (val) {
      this.localSelected = val
      this.$emit('select', this.localSelected)
    },

    remove (item) {
      this.candidateTree.remove(item)
    },

    focus () {
      focusIn(this.$el)
    }
  },
  render (h) {
    function generateHead (type) {
      let headSlotName = `${type}-head`
      let head = this.$slots[headSlotName]
        ? h('template', { slot: 'head' }, this.$slots[headSlotName])
        : null

      let titleSlotName = `${type}-title`
      let title =
        !head && this.$slots[titleSlotName]
          ? h('template', { slot: 'title' }, this.$slots[titleSlotName])
          : null

      return [head, title]
    }

    function generateItem (type) {
      let itemSlotName = `${type}-item`
      let item = this.$scopedSlots[itemSlotName]
        ? props => this.$scopedSlots[itemSlotName](props)
        : null

      let itemLabelSlotName = `${type}-item-label`
      let itemLabel =
        !item && this.$scopedSlots[itemLabelSlotName]
          ? props => this.$scopedSlots[itemLabelSlotName](props)
          : props =>
            h('span', {
              domProps: {
                innerHTML: props.keyword
                  ? props.item.label.replace(
                    new RegExp(`(${props.keyword})`, 'gi'),
                    '<mark>$1</mark>'
                  )
                  : props.item.label
              }
            })

      return {
        item,
        'item-label': itemLabel
      }
    }

    function generateNoData (type) {
      let slotName = `${type}-no-data`
      return this.$slots[slotName]
        ? h('template', { slot: 'no-data' }, this.$slots[slotName])
        : null
    }

    return h(
      'div',
      {
        class: {
          'veui-input-invalid': this.realInvalid,
          'veui-transfer': true,
          'veui-transfer-disabled': !this.isSelectable
        },
        props: {
          ui: this.ui
        }
      },
      [
        h(
          CandidatePanel,
          {
            props: {
              datasource: this.datasource,
              searchable: this.searchable,
              filter: this.filter,
              placeholder: this.candidatePlaceholder,
              isSelectable: this.isSelectable,
              icons: this.icons,
              selected: this.localSelected
            },
            on: {
              select: (...args) => {
                this.handleSelect(...args)
              },
              selectall: (...args) => {
                this.candidateTree.selectAll(...args)
              }
            },
            scopedSlots: generateItem.call(this, 'candidate'),
            ref: 'candidatePanel'
          },
          [
            ...generateHead.call(this, 'candidate'),
            generateNoData.call(this, 'candidate')
          ]
        ),
        h(
          SelectedPanel,
          {
            props: {
              datasource: this.selectedItems,
              showMode: this.selectedShowMode,
              searchable: this.searchable,
              filter: this.filter,
              placeholder: this.selectedPlaceholder,
              isSelectable: this.isSelectable,
              icons: this.icons
            },
            on: {
              remove: (...args) => {
                this.remove(...args)
              },
              removeall: (...args) => {
                this.candidateTree.removeAll(...args)
              }
            },
            scopedSlots: generateItem.call(this, 'selected')
          },
          [
            ...generateHead.call(this, 'selected'),
            generateNoData.call(this, 'selected')
          ]
        )
      ]
    )
  }
}
</script>
