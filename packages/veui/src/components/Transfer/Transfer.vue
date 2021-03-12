<script>
import CandidatePanel from './_CandidatePanel'
import SelectedPanel from './_SelectedPanel'
import {
  includes,
  isString,
  clone,
  difference,
  omit,
  remove,
  uniq
} from 'lodash'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import useControllable from '../../mixins/controllable'
import { focusIn } from '../../utils/dom'
import { renderSlot } from '../../utils/helper'

function defaultFilter (type, keyword, item, datasource) {
  return includes(item.label, keyword)
}

export default {
  name: 'veui-transfer',
  mixins: [
    prefix,
    ui,
    input,
    useControllable({
      prop: 'selected',
      event: 'select',
      get (val) {
        return val || []
      }
    })
  ],
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
  computed: {
    isSelectable () {
      return !this.realDisabled && !this.realReadonly
    },
    realKeys () {
      if (isString(this.keys)) {
        return source => source[this.keys]
      }

      return this.keys
    },
    selectedItems () {
      let selected = clone(this.realSelected)
      let walk = datasource => {
        let res = []
        datasource.forEach(source => {
          if (source.children && source.children.length) {
            let selectedChildren = walk(source.children)
            if (selectedChildren.length) {
              let item = omit(source, 'children')
              item.children = selectedChildren
              res.push(item)
            }
          } else if (
            remove(selected, value => value === source.value).length !== 0
          ) {
            res.push(source)
          }
        })
        return res
      }

      return walk(this.datasource)
    }
  },
  methods: {
    handleSelect (val) {
      this.commit('selected', val)
    },

    collectDescendantValue (datasource) {
      let values = []

      let walk = data => {
        data.forEach(({ disabled, value, children }) => {
          if (!disabled) {
            values.push(value)
            if (children && children.length) {
              walk(children)
            }
          }
        })
      }
      walk(datasource)
      return values
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
          : props => null

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
          [this.$c('input-invalid')]: this.realInvalid,
          [this.$c('transfer')]: true,
          [this.$c('transfer-disabled')]: !this.isSelectable
        },
        attrs: {
          ui: this.ui
        }
      },
      [
        renderSlot(this, 'candidate', { datasource: this.datasource }) ||
          h(
            CandidatePanel,
            {
              props: {
                datasource: this.datasource,
                searchable: this.searchable,
                filter: this.filter,
                placeholder: this.candidatePlaceholder,
                isSelectable: this.isSelectable,
                selected: this.realSelected,
                uiParts: this.uiParts,
                ui: this.realUi
              },
              on: {
                select: (...args) => {
                  this.handleSelect(...args)
                },
                selectall: (...args) => {
                  let selected = uniq([
                    ...this.realSelected,
                    ...this.collectDescendantValue(this.datasource)
                  ])
                  this.commit('selected', selected)
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
              placeholder: this.selectedPlaceholder,
              isSelectable: this.isSelectable,
              icons: this.icons,
              uiParts: this.uiParts,
              ui: this.realUi
            },
            on: {
              remove: (item, parents) => {
                let selected = difference(this.realSelected, [
                  ...this.collectDescendantValue([item]),
                  ...parents.map(i => i.value)
                ])
                this.commit('selected', selected)
              },
              removeall: (...args) => {
                let selected = difference(
                  this.realSelected,
                  this.collectDescendantValue(this.selectedItems)
                )
                this.commit('selected', selected)
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
