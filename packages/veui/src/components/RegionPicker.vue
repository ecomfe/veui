<template>
<div
  :class="$c('region-picker')"
  :ui="realUi"
  role="tree"
  aria-multiselectable="true"
  :aria-label="t('description')"
>
  <div ref="focus" :class="$c('sr-only')" tabindex="0" @focus="initFocus"/>
  <div
    v-for="(section, si) in localDatasource"
    :key="si"
    :class="$c('region-picker-section')"
    role="treeitem"
    aria-level="1"
    :aria-expanded="localDatasource.length > 0"
    :aria-setsize="localDatasource.length"
    :aria-posinset="si + 1"
    :aria-checked="section.indeterminate ? 'mixed' : section.selected"
    :aria-selected="
      section.id != null &&
        section.selected &&
        (includeIndeterminate || !section.indeterminate)
    "
  >
    <div :class="$c('region-picker-section-title')">
      <veui-checkbox
        :ref="`node-${si}`"
        :checked="section.selected"
        :indeterminate="section.indeterminate"
        :readonly="realReadonly"
        :disabled="realDisabled || section.disabled"
        tabindex="-1"
        @keydown.right.prevent="focusDown"
        @keydown.down.prevent="focusStep()"
        @keydown.up.prevent="focusStep(false)"
        @change="(checked) => toggleNode(section, checked)"
      >
        <slot name="label" v-bind="section" :level="0">
          {{ section.label }}
        </slot>
      </veui-checkbox>
    </div>
    <div v-if="section.children" :class="$c('region-picker-section-content')">
      <div
        v-for="(branch, bi) in section.children"
        :key="bi"
        :class="$c('region-picker-branch')"
        role="treeitem"
        aria-level="2"
        :aria-expanded="section.children.length > 0"
        :aria-setsize="section.children.length"
        :aria-posinset="bi + 1"
        :aria-checked="branch.indeterminate ? 'mixed' : branch.selected"
        :aria-selected="
          branch.id != null &&
            branch.selected &&
            (includeIndeterminate || !branch.indeterminate)
        "
      >
        <div :class="$c('region-picker-branch-title')">
          <veui-checkbox
            :ref="`node-${si}-${bi}`"
            :checked="branch.selected"
            :indeterminate="branch.indeterminate"
            :readonly="realReadonly"
            :disabled="realDisabled || branch.disabled"
            tabindex="-1"
            @keydown.left.prevent="focusUp"
            @keydown.right.prevent="focusDown"
            @keydown.down.prevent="focusStep"
            @keydown.up.prevent="focusStep(false)"
            @change="(checked) => toggleNode(branch, checked)"
          >
            <slot name="label" v-bind="branch" :level="1">
              {{ branch.label }}
            </slot>
          </veui-checkbox>
        </div>
        <div
          v-if="branch.children"
          :class="$c('region-picker-branch-content')"
        >
          <div
            v-for="(group, gi) in branch.children"
            :key="gi"
            :class="$c('region-picker-group')"
            role="treeitem"
            aria-level="3"
            :aria-expanded="branch.children.length > 0 && !!group.active"
            :aria-setsize="branch.children.length"
            :aria-posinset="gi + 1"
            :aria-checked="group.indeterminate ? 'mixed' : group.selected"
            :aria-selected="
              group.id != null &&
                group.selected &&
                (includeIndeterminate || !group.indeterminate)
            "
            :aria-owns="`${id}-shadow ${id}-units`"
          >
            <div :class="$c('region-picker-group-title')">
              <veui-checkbox
                :ref="`node-${si}-${bi}-${gi}`"
                :checked="group.selected"
                :readonly="realReadonly"
                :disabled="realDisabled || group.disabled"
                :indeterminate="group.indeterminate"
                tabindex="-1"
                @change="(checked) => toggleNode(group, checked)"
                @mouseenter.native="toggleActive(group, true)"
                @keydown.left.prevent="focusUp"
                @keydown.right.prevent="focusGroup(group, true)"
                @keydown.down.prevent="focusStep"
                @keydown.up.prevent="focusStep(false)"
              >
                <slot name="label" v-bind="group" :level="2">
                  {{ group.label }}
                </slot>
              </veui-checkbox>
              <veui-overlay
                v-if="group.children && group.active"
                :open.sync="group.active"
                :overlay-class="overlayClass"
                :target="`shadow-checker-${si}-${bi}-${gi}`"
                position="bottom-start"
              >
                <div
                  :id="`${id}-units`"
                  :ref="`layer-${si}-${bi}-${gi}`"
                  v-outside="{
                    handler: getHideFn(`${si}-${bi}-${gi}`, group),
                    refs: [`shadow-${si}-${bi}-${gi}`],
                    trigger: 'hover',
                    delay: 200
                  }"
                  :class="$c('region-picker-units')"
                >
                  <template
                    v-for="ri in Math.ceil(group.children.length / 3)"
                  >
                    <div :key="ri" :class="$c('region-picker-unit-row')">
                      <div
                        v-for="(unit, ui) in group.children.slice(
                          ri * 3 - 3,
                          ri * 3
                        )"
                        :key="ui"
                        :class="$c('region-picker-unit')"
                        role="treeitem"
                        aria-level="4"
                        aria-expanded="true"
                        :aria-setsize="group.children.length"
                        :aria-posinset="ri * 3 + ui - 2"
                        :aria-checked="unit.selected"
                        :aria-selected="unit.id != null && unit.selected"
                      >
                        <veui-checkbox
                          :ref="`node-${si}-${bi}-${gi}-${ri * 3 - 3 + ui}`"
                          :checked="unit.selected"
                          :indeterminate="unit.indeterminate"
                          :readonly="realReadonly"
                          :disabled="realDisabled || unit.disabled"
                          tabindex="-1"
                          aria-haspopup="tree"
                          @keydown.left.prevent="focusUp"
                          @keydown.down.prevent="focusStep"
                          @keydown.up.prevent="focusStep(false)"
                          @change="(checked) => toggleNode(unit, checked)"
                        >
                          <slot name="label" v-bind="unit" :level="3">
                            {{ unit.label }}
                          </slot>
                        </veui-checkbox>
                      </div>
                    </div>
                  </template>
                </div>
              </veui-overlay>
              <veui-overlay
                v-if="group.children && group.active"
                :open.sync="group.active"
                :overlay-class="
                  mergeOverlayClass($c('region-picker-group-shadow-overlay'))
                "
                :target="`node-${si}-${bi}-${gi}`"
                position="bottom-start"
              >
                <div
                  :id="`${id}-shadow`"
                  :ref="`shadow-${si}-${bi}-${gi}`"
                  v-outside="{
                    handler: getHideFn(`${si}-${bi}-${gi}`, group),
                    refs: [`layer-${si}-${bi}-${gi}`],
                    trigger: 'hover',
                    delay: 200
                  }"
                  :class="$c('region-picker-group-shadow')"
                  role="treeitem"
                  aria-level="3"
                  :aria-setsize="branch.children.length"
                  :aria-posinset="gi + 1"
                  :aria-checked="
                    group.indeterminate ? 'mixed' : group.selected
                  "
                  :aria-selected="
                    group.id != null &&
                      group.selected &&
                      (includeIndeterminate || !group.indeterminate)
                  "
                  :aria-owns="`${id}-units`"
                >
                  <veui-checkbox
                    :ref="`shadow-checker-${si}-${bi}-${gi}`"
                    :checked="group.selected"
                    :indeterminate="group.indeterminate"
                    :readonly="realReadonly"
                    tabindex="-1"
                    @keydown.left.prevent="focusGroup(group)"
                    @keydown.right.prevent="focusDown"
                    @keydown.down.prevent="focusStep"
                    @keydown.up.prevent="focusStep(false)"
                    @change="(checked) => toggleNode(group, checked)"
                  >
                    <slot name="label" v-bind="group" overlay :level="2">
                      {{ group.label }}
                      <small
                        v-if="group.children && group.children.length"
                      >({{ group.solidCount }}/{{
                        group.children.length
                      }})</small>
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
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import overlay from '../mixins/overlay'
import i18n from '../mixins/i18n'
import outside from '../directives/outside'
import warn from '../utils/warn'
import { contains, focusBefore } from '../utils/dom'
import { uniqueId, get, cloneDeep, pick } from 'lodash'
import Vue from 'vue'
import '../common/global'

export default {
  name: 'veui-region-picker',
  components: {
    'veui-checkbox': Checkbox,
    'veui-overlay': Overlay
  },
  directives: { outside },
  mixins: [prefix, ui, input, overlay, i18n],
  model: {
    prop: 'selected',
    event: 'select'
  },
  props: {
    datasource: {
      type: Array,
      required: true
    },
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
      ],
      focusPath: [0],
      id: uniqueId('veui-region-picker-')
    }
  },
  computed: {
    selectedMap () {
      return this.localSelected.reduce((result, current) => {
        result[current] = true
        return result
      }, {})
    },
    nodePath () {
      return this.focusPath.join(',children,').split(',')
    },
    focusNode () {
      return get(this.localDatasource, this.nodePath)
    },
    focusSiblings () {
      let { nodePath } = this
      if (nodePath.length <= 1) {
        return this.localDatasource
      }
      return get(this.localDatasource, this.nodePath.slice(0, -1))
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
    },
    focusPath (val, oldVal) {
      let prefix =
        oldVal.length === 4 && val.length === 3 ? 'shadow-checker' : 'node'
      this.focusByPath(prefix)
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      // { id|value, label, children, selected, indeterminate, parent }
      let localDatasource = cloneDeep(this.datasource)
      walk(localDatasource, {
        enter: ({ node, parent }) => {
          node.selected = false
          node.solidCount = 0 // deteminately selected child count
          node.softCount = 0 // indeterminately selected child count
          node.indeterminate = false

          // make `value` & `id` both acceptable
          if ('value' in node) {
            node.id = node.value
          }

          if (parent) {
            node.parent = parent
            node.disabled = node.disabled || parent.disabled
          }
        },
        exit: ({ node, parent }) => {
          if (!node.id && !(node.children && node.children.length)) {
            // invalid node
            warn(
              `[veui-region-picker] Invalid region tree node '${node.label}'. Provide \`value\`, \`children\` or both.`,
              this
            )
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
    initFocus ({ target, relatedTarget }) {
      if (contains(this.$el, relatedTarget)) {
        setTimeout(() => {
          focusBefore(target)
        })
        return
      }

      if (this.focusPath.length < 4) {
        this.focusByPath()
        return
      }

      let last = this.focusPath.pop()
      setTimeout(() => {
        this.focusPath.push(last)
      })
    },
    focus () {
      this.$refs.focus.focus()
    },
    focusDown () {
      let { children } = this.focusNode
      if (!children || !children.length) {
        return
      }
      this.focusPath.push(0)
    },
    focusUp () {
      let { focusPath } = this
      if (focusPath.length <= 1) {
        return
      }

      if (focusPath.length === 3) {
        this.toggleActive(this.focusNode, false)
      }

      this.focusPath = focusPath.slice(0, -1)
    },
    focusStep (forward = true) {
      if (this.focusPath.length === 3) {
        this.toggleActive(this.focusNode, false)
      }
      let count = this.focusSiblings.length
      let index = this.focusPath[this.focusPath.length - 1]
      this.$set(
        this.focusPath,
        this.focusPath.length - 1,
        (count + index + (forward ? 1 : -1)) % count
      )
    },
    focusByPath (prefix = 'node') {
      setTimeout(() => {
        let box = this.$refs[`${prefix}-${this.focusPath.join('-')}`]
        box = Array.isArray(box) ? box[0] : box
        if (box && typeof box.focus === 'function') {
          box.focus()
        }
      })
    },
    focusGroup (group, shadow = false) {
      this.toggleActive(group, shadow)
      this.focusByPath(shadow ? 'shadow-checker' : 'node')
    },
    toggleActive (node, show) {
      if (node.disabled) {
        return
      }
      // `active` is not observed yet
      Vue.set(node, 'active', show)
    },
    getHideFn (path, group) {
      // cache them so render function won't create inline functions
      // over again thus broke the equals check for directive options
      if (!this.hideFns) {
        this.hideFns = {}
      }
      if (!this.hideFns[path]) {
        this.hideFns[path] = () => {
          this.toggleActive(group, false)
        }
      }
      return this.hideFns[path]
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
            let enabledChildren = node.children.filter(
              ({ disabled }) => !disabled
            )
            node.softCount = enabledChildren.filter(
              ({ selected }) => selected
            ).length
            node.solidCount = enabledChildren.filter(
              ({ selected, indeterminate }) => selected && !indeterminate
            ).length
            node.selected = node.softCount > 0
            node.indeterminate =
              node.solidCount !== node.children.length && node.softCount !== 0
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
        prev = prev
          ? pick(parent, 'selected', 'indeterminate')
          : { selected, indeterminate }
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
    source.forEach((node) => walk(node, { enter, exit }))
    return
  }

  let { children } = source
  if (typeof enter === 'function') {
    enter({ node: source, parent })
  }
  if (Array.isArray(children)) {
    children.forEach((node) => walk(node, { enter, exit }, source))
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
    let indeterminate =
      node.softCount !== 0 && node.solidCount !== node.children.length
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
