<template>
<div class="veui-regionpicker">
  <div v-for="(section, si) in localDatasource" class="veui-regionpicker-section" :key="si">
    <div class="veui-regionpicker-section-title">
      <veui-checkbox :checked="section.selected" :indeterminate="section.indeterminate"
        :readonly="realReadonly" :disabled="realDisabled"
        @change="checked => toggleNode(section, checked)">
        <slot name="label" v-bind="section" :level="0">{{ section.label }}</slot>
      </veui-checkbox>
    </div>
    <div v-if="section.children" class="veui-regionpicker-section-content">
      <div v-for="(branch, bi) in section.children" class="veui-regionpicker-branch" :key="bi">
        <div class="veui-regionpicker-branch-title">
          <veui-checkbox :checked="branch.selected" :indeterminate="branch.indeterminate"
            :readonly="realReadonly" :disabled="realDisabled"
            @change="checked => toggleNode(branch, checked)">
            <slot name="label" v-bind="branch" :level="1">{{ branch.label }}</slot>
          </veui-checkbox>
        </div>
        <div v-if="branch.children" class="veui-regionpicker-branch-content">
          <div v-for="(group, gi) in branch.children" class="veui-regionpicker-group" :key="gi">
            <div class="veui-regionpicker-group-title">
              <veui-checkbox :ref="`group-${si}-${bi}-${gi}`" :checked="group.selected"
                :readonly="realReadonly" :disabled="realDisabled"
                :indeterminate="group.indeterminate" @change="checked => toggleNode(group, checked)"
                @mouseenter.native="toggleActive(group, true)">
                <slot name="label" v-bind="group" :level="2">{{ group.label }}</slot>
              </veui-checkbox>
              <veui-overlay v-if="group.children && group.active" :open.sync="group.active"
                :target="`group-${si}-${bi}-${gi}`" :options="{
                  attachment: 'top left',
                  targetAttachment: 'bottom left',
                  constraints
                }">
                <div class="veui-regionpicker-units"
                  :ref="`layer-${si}-${bi}-${gi}`"
                  v-outside="{
                    handler: () => { toggleActive(group, false) },
                    refs: [`group-${si}-${bi}-${gi}`, `shadow-${si}-${bi}-${gi}`],
                    trigger: 'hover',
                    delay: 200
                  }">
                  <template v-for="ri in Math.ceil(group.children.length / 3)">
                    <div class="veui-regionpicker-unit-row" :key="ri">
                      <div v-for="(unit, ui) in group.children.slice(ri * 3 - 3, ri * 3)" class="veui-regionpicker-unit" :key="ui">
                        <veui-checkbox :checked="unit.selected" :indeterminate="unit.indeterminate"
                          :readonly="realReadonly" :disabled="realDisabled"
                          @change="checked => toggleNode(unit, checked)">
                          <slot name="label" v-bind="unit" :level="3">{{ unit.label }}</slot>
                        </veui-checkbox>
                      </div>
                    </div>
                  </template>
                </div>
              </veui-overlay>
              <veui-overlay v-if="group.children && group.active" :open.sync="group.active"
                overlayClass="veui-regionpicker-group-shadow-overlay"
                :target="`group-${si}-${bi}-${gi}`" :options="{
                  attachment: 'top left',
                  targetAttachment: 'top left'
                }">
                <div class="veui-regionpicker-group-shadow"
                  :ref="`shadow-${si}-${bi}-${gi}`"
                  v-outside="{
                    handler: () => { toggleActive(group, false) },
                    refs: [`group-${si}-${bi}-${gi}`, `layer-${si}-${bi}-${gi}`],
                    trigger: 'hover',
                    delay: 200
                  }">
                  <veui-checkbox :checked="group.selected" :indeterminate="group.indeterminate"
                    :readonly="realReadonly" :disabled="realDisabled"
                    @change="checked => toggleNode(group, checked)">
                    <slot name="label" v-bind="group" :level="2">{{ group.label }}</slot>
                  </veui-checkbox>
                  <small v-if="group.children && group.children.length">
                    ({{ group.solidCount }}/{{ group.children.length }})
                  </small>
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
import { input } from '../mixins'
import { outside } from '../directives'
import { cloneDeep, pick } from 'lodash'
import Vue from 'vue'

export default {
  name: 'veui-regionpicker',
  components: {
    'veui-checkbox': Checkbox,
    'veui-overlay': Overlay
  },
  directives: { outside },
  mixins: [input],
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
    let localSelected = [...(this.selected || [])]
    let selectedMap = localSelected.reduce((result, current) => {
      result[current] = true
      return result
    }, {})

    // { id, label, children, selected, indeterminate, parent }
    let localDatasource = cloneDeep(this.datasource)
    walk(localDatasource, {
      enter ({ node, parent }) {
        node.selected = false
        node.solidCount = 0 // deteminately selected child count
        node.softCount = 0 // indeterminately selected child count
        node.indeterminate = false
        node.parent = parent
      },
      exit ({ node, parent }) {
        if (!node.id && !(node.children && node.children.length)) {
          // invalid node
          Vue.util.warn(`Invalid region tree node '${node.label}'. Provide \`id\`, \`children\` or both.`)
          return
        }

        // get select state for self
        if (node.id) {
          // check select state from `selected`
          node.selected = !!selectedMap[node.id]
        }

        // infer state from children
        updateNode(node)
      }
    })
    return {
      localDatasource,
      localSelected,
      constraints: [
        {
          to: 'scrollParent',
          attachment: 'together'
        },
        {
          to: 'window',
          attachment: 'together'
        }
      ]
    }
  },
  methods: {
    toggleActive (node, show) {
      // `active` is not observed yet
      Vue.set(node, 'active', show)
    },
    toggleNode (node, checked) {
      // record previous state first
      let { selected, indeterminate } = node

      // select/unselect all descendents
      walk(node, {
        exit ({ node }) {
          let hasChildren = node.children && node.children.length
          node.indeterminate = false
          node.selected = checked
          if (hasChildren) {
            node.softCount = node.solidCount = checked ? node.children.length : 0
          }
        }
      })

      // inform ancesters
      let parent = node
      let prev = { selected, indeterminate }
      do {
        updateNode(parent, prev)
        parent = parent.parent
        prev = pick(parent, 'selected', 'indeterminate')
      } while (parent)

      // collect selected result
      let output = []
      let includeIndeterminate = this.includeIndeterminate
      walk(this.localDatasource, {
        enter ({ node }) {
          if (!node.id || !node.selected) {
            return
          }

          if (includeIndeterminate || !node.indeterminate) {
            output.push(node.id)
          }
        }
      })
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
