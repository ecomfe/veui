<script>
import CandidatePanel from './_CandidatePanel'
import SelectedPanel from './_SelectedPanel'
import { includes, isString } from 'lodash'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import useControllable from '../../mixins/controllable'
import useTree from '../../mixins/tree'
import { focusIn } from '../../utils/dom'
import { isEqualSet } from '../../utils/lang'
import { renderSlot, forwardSlots } from '../../utils/helper'

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
    }),
    useTree()
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
      return this.getCheckedSubTree(this.datasource, this.realSelected)
    }
  },
  methods: {
    focus () {
      focusIn(this.$el)
    }
  },
  render (h) {
    let slotsForCandidate = forwardSlots(
      {
        'candidate-head': 'head',
        'candidate-title': 'title',
        'candidate-no-data': 'no-data',
        'candidate-item': 'item',
        'candidate-item-label': 'item-label'
      },
      this
    )

    let slotsForSelected = forwardSlots(
      {
        'selected-head': 'head',
        'selected-title': 'title',
        'selected-no-data': 'no-data',
        'selected-item': 'item',
        'selected-item-label': 'item-label'
      },
      this
    )

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
        renderSlot(this, 'candidate', { datasource: this.datasource }) || h(
          CandidatePanel,
          {
            props: {
              datasource: this.datasource,
              searchable: this.searchable,
              filter: this.filter,
              placeholder: this.candidatePlaceholder,
              isSelectable: this.isSelectable,
              selected: this.realSelected,
              mergeChecked: this.mergeChecked,
              includeIndeterminate: this.includeIndeterminate,
              uiParts: this.uiParts,
              ui: this.realUi
            },
            on: {
              select: value => {
                this.commit('selected', value)
              },
              selectall: filtered => {
                if (filtered && filtered.length) {
                  let selected = this.checkAll(this.realSelected, filtered)
                  if (!isEqualSet(selected, this.realSelected)) {
                    this.commit('selected', selected)
                  }
                }
              }
            },
            scopedSlots: slotsForCandidate.scopedSlots,
            ref: 'candidatePanel'
          },
          slotsForCandidate.slots
        ),
        renderSlot(this, 'selected', { datasource: this.selectedItems }) || h(
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
                let selected = this.clearItem(
                  this.realSelected,
                  item,
                  parents,
                  this.datasource
                )
                if (!isEqualSet(selected, this.realSelected)) {
                  this.commit('selected', selected)
                }
              },
              removeall: () => {
                if (this.datasource && this.datasource.length) {
                  let selected = this.clearAll(
                    this.realSelected,
                    this.selectedItems,
                    this.datasource
                  )
                  if (!isEqualSet(selected, this.realSelected)) {
                    this.commit('selected', selected)
                  }
                }
              }
            },
            scopedSlots: slotsForSelected.scopedSlots
          },
          slotsForSelected.slots
        )
      ]
    )
  }
}
</script>
