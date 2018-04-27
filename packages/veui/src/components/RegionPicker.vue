<template>
<div
  class="veui-region-picker"
  :ui="ui"
  role="application"
  aria-label="地域选择，按 Tab 键在同一层级内导航，按左右箭头键切换层级">
  <div
    v-for="(section, si) in localDatasource"
    class="veui-region-picker-section"
    :key="si">
    <div class="veui-region-picker-section-title">
      <veui-checkbox
        :checked="section.selected"
        :indeterminate="section.indeterminate"
        :readonly="realReadonly"
        :disabled="realDisabled || section.disabled"
        @change="checked => toggleNode(section, checked)">
        <slot name="label" v-bind="section" :level="0">{{ section.label }}</slot>
      </veui-checkbox>
    </div>
    <div
      v-if="section.children"
      class="veui-region-picker-section-content">
      <div
        v-for="(branch, bi) in section.children"
        class="veui-region-picker-branch"
        :key="bi">
        <div class="veui-region-picker-branch-title">
          <veui-checkbox
            :checked="branch.selected"
            :indeterminate="branch.indeterminate"
            :readonly="realReadonly"
            :disabled="realDisabled || branch.disabled"
            @change="checked => toggleNode(branch, checked)">
            <slot name="label" v-bind="branch" :level="1">{{ branch.label }}</slot>
          </veui-checkbox>
        </div>
        <div
          v-if="branch.children"
          class="veui-region-picker-branch-content">
          <div
            v-for="(group, gi) in branch.children"
            class="veui-region-picker-group"
            :key="gi">
            <div class="veui-region-picker-group-title">
              <veui-checkbox
                :ref="`group-${si}-${bi}-${gi}`"
                :checked="group.selected"
                :readonly="realReadonly"
                :disabled="realDisabled || group.disabled"
                :indeterminate="group.indeterminate"
                @change="checked => toggleNode(group, checked)"
                @mouseenter.native="toggleActive(group, true)">
                <slot name="label" v-bind="group" :level="2">{{ group.label }}</slot>
              </veui-checkbox>
              <veui-overlay
                v-if="group.children && group.active"
                :open.sync="group.active"
                :overlay-class="overlayClass"
                :target="`group-${si}-${bi}-${gi}`"
                :options="{
                  attachment: 'top left',
                  targetAttachment: 'bottom left',
                  constraints
                }">
                <div class="veui-region-picker-units"
                  :ref="`layer-${si}-${bi}-${gi}`"
                  v-outside="{
                    handler: () => { toggleActive(group, false) },
                    refs: [`group-${si}-${bi}-${gi}`, `shadow-${si}-${bi}-${gi}`],
                    trigger: 'hover',
                    delay: 200
                  }">
                  <template v-for="ri in Math.ceil(group.children.length / 3)">
                    <div class="veui-region-picker-unit-row" :key="ri">
                      <div
                        v-for="(unit, ui) in group.children.slice(ri * 3 - 3, ri * 3)"
                        class="veui-region-picker-unit"
                        :key="ui">
                        <veui-checkbox
                          :checked="unit.selected"
                          :indeterminate="unit.indeterminate"
                          :readonly="realReadonly"
                          :disabled="realDisabled || unit.disabled"
                          @change="checked => toggleNode(unit, checked)">
                          <slot name="label" v-bind="unit" :level="3">{{ unit.label }}</slot>
                        </veui-checkbox>
                      </div>
                    </div>
                  </template>
                </div>
              </veui-overlay>
              <veui-overlay
                v-if="group.children && group.active"
                :open.sync="group.active"
                :overlayClass="mergeOverlayClass('veui-region-picker-group-shadow-overlay')"
                :target="`group-${si}-${bi}-${gi}`"
                :options="{
                  attachment: 'top left',
                  targetAttachment: 'top left'
                }">
                <div class="veui-region-picker-group-shadow"
                  :ref="`shadow-${si}-${bi}-${gi}`"
                  v-outside="{
                    handler: () => { toggleActive(group, false) },
                    refs: [`group-${si}-${bi}-${gi}`, `layer-${si}-${bi}-${gi}`],
                    trigger: 'hover',
                    delay: 200
                  }">
                  <veui-checkbox
                    :ref="`shadow-checker-${si}-${bi}-${gi}`"
                    :checked="group.selected"
                    :indeterminate="group.indeterminate"
                    :readonly="realReadonly"
                    :tabindex="focusLevel === 2 ? null : '-1'"
                    @change="checked => toggleNode(group, checked)">
                    <slot name="label" v-bind="group" :overlay="true" :level="2">
                      {{ group.label }}
                      <small v-if="group.children && group.children.length">
                        ({{ group.solidCount }}/{{ group.children.length }})
                      </small>
                    </slot>
                  </veui-checkbox>
                </div>
              </veui-overlay>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Checkbox from './Checkbox'
import Overlay from './Overlay'
import ui from '../mixins/ui'
import input from '../mixins/input'
import overlay from '../mixins/overlay'
import outside from '../directives/outside'
import { cloneDeep, pick } from 'lodash'
import Vue from 'vue'
import warn from '../utils/warn'

export default {
  name: 'veui-region-picker',
  components: {
    'veui-checkbox': Checkbox,
    'veui-overlay': Overlay
  },
  directives: { outside },
  mixins: [ui, input, overlay],
  model: {
    prop: 'selected',
    event: 'select'
  },
  props: {
    datasource: Array,
    selected: Array,
    includeIndeterminate: Boolean
  },
  data () {
    return {
      localSelected: [...(this.selected || [])],
      localDatasource: null,
      constraints: [
        {
          to: 'window',
          attachment: 'together'
        }
      ]
    }
  },
  computed: {
    selectedMap () {
      return this.localSelected.reduce((result, current) => {
        result[current] = true
        return result
      }, {})
    }
  },
  watch: {
    selected (val) {
      // change is triggered by toggleNode after user interaction
      // reset the flag and do nothing because UI is already updated
      if (this.fromUI) {
        this.fromUI = false
        return
      }
      this.localSelected = val
      this.init()
    },
    datasource () {
      this.init()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      // { id, label, children, selected, indeterminate, parent }
      let localDatasource = cloneDeep(this.datasource)
      walk(localDatasource, {
        enter: ({ node, parent }) => {
          node.selected = false
          node.solidCount = 0 // deteminately selected child count
          node.softCount = 0 // indeterminately selected child count
          node.indeterminate = false

          if (parent) {
            node.parent = parent
            node.disabled = node.disabled || parent.disabled
          }
        },
        exit: ({ node, parent }) => {
          if (!node.id && !(node.children && node.children.length)) {
            // invalid node
            warn(`[veui-region-picker] Invalid region tree node '${node.label}'. Provide \`id\`, \`children\` or both.`)
            return
          }

          // get select state for self
          if (node.id) {
            // check select state from `selected`
            node.selected = !!this.selectedMap[node.id]
          }

          // infer state from children
          updateNode(node)
        }
      })
      this.localDatasource = localDatasource
    },
    toggleActive (node, show) {
      if (node.disabled) {
        return
      }
      // `active` is not observed yet
      Vue.set(node, 'active', show)
    },
    toggleNode (node, checked) {
      // record previous state first
      let { selected, indeterminate } = node

      // select/unselect all descendents
      walk(node, {
        exit: ({ node }) => {
          if (node.disabled) {
            return
          }
          let hasChildren = node.children && node.children.length
          if (hasChildren) {
            let enabledChildren = node.children.filter(({ disabled }) => !disabled)
            node.softCount = enabledChildren.filter(({ selected }) => selected).length
            node.solidCount = enabledChildren.filter(({ selected, indeterminate }) => selected && !indeterminate).length
            node.selected = node.softCount > 0
            node.indeterminate = node.solidCount !== node.children.length && node.softCount !== 0
          } else {
            node.indeterminate = false
            node.selected = checked
          }
        }
      })

      // inform ancesters
      let parent = node
      let prev
      do {
        prev = prev ? pick(parent, 'selected', 'indeterminate') : { selected, indeterminate }
        updateNode(parent, prev)
        parent = parent.parent
      } while (parent)

      // collect selected result
      let output = []
      let includeIndeterminate = this.includeIndeterminate
      walk(this.localDatasource, {
        enter: ({ node }) => {
          if (!node.id || !node.selected) {
            return
          }

          if (includeIndeterminate || !node.indeterminate) {
            output.push(node.id)
          }
        }
      })
      this.fromUI = true
      this.$emit('select', output)
    }
  }
}

function walk (source, { enter, exit }, parent) {
  if (Array.isArray(source)) {
    source.forEach(node => walk(node, { enter, exit }))
    return
  }

  let { children } = source
  if (typeof enter === 'function') {
    enter({ node: source, parent })
  }
  if (Array.isArray(children)) {
    children.forEach(node => walk(node, { enter, exit }, source))
  }
  if (typeof exit === 'function') {
    exit({ node: source, parent })
  }
}

// update select status after count update
function updateNode (node, prev) {
  let softDiff = 0
  let solidDiff = 0
  if (node.children && node.children.length) {
    // node is selected as long as any child is selected
    // node is indeterminate if some but not all children are selected
    let selected = node.softCount > 0
    node.selected = selected

    // if not all children are determinately selected,
    // the parent is in indeterminate state
    let indeterminate = node.softCount !== 0 && node.solidCount !== node.children.length
    if (prev) {
      if (prev.selected !== selected) {
        softDiff = selected ? 1 : -1
      }

      if (prev.indeterminate !== indeterminate) {
        // [-] -> [ ] =>  0
        // [ ] -> [-] =>  0
        // [-] -> [*] =>  1
        // [*] -> [-] => -1
        if (prev.selected && indeterminate) {
          solidDiff = -1
        } else if (prev.indeterminate && selected) {
          solidDiff = 1
        }
      } else {
        // [ ] -> [*] =>  1
        // [*] -> [ ] => -1
        solidDiff = softDiff
      }
    }
    node.indeterminate = indeterminate
  } else if (prev) {
    softDiff = solidDiff = prev.selected ? -1 : 1
  }

  // update parent status
  let { parent } = node
  if (!parent) {
    return
  }

  // only do increase while initializing, do both while updating
  if (!prev) {
    if (node.selected) {
      parent.softCount++
      if (!node.indeterminate) {
        parent.solidCount++
      }
    }
  } else {
    parent.softCount += softDiff
    parent.solidCount += solidDiff
  }
}
</script>
