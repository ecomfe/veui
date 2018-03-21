<template>
<div
  :class="{
    'veui-option-group': true,
    'veui-option-group-unlabelled': !label
  }"
  :ui="ui">
  <div v-if="label" class="veui-option-group-label">
    <slot name="label" :label="label">{{ label }}</slot>
  </div>
  <template v-if="options">
    <template
      v-for="(option, i) in options">
      <veui-option
        v-if="!option.options"
        v-bind="option"
        :ui="inheritedUi"
        :key="option.value">
        <slot v-if="$scopedSlots.option" name="option" v-bind="option" :selected="option.value === value"/>
        <template v-if="$scopedSlots['option-label']" slot="label">
          <slot name="option-label" v-bind="option" :selected="option.value === value">{{ option.label }}</slot>
        </template>
      </veui-option>
      <veui-option-group
        v-else
        v-bind="option"
        :ui="inheritedUi"
        :key="i">
        <template v-if="$scopedSlots.label" slot="label" slot-scope="group">
          <slot name="label" v-bind="group">{{ group.label }}</slot>
        </template>
        <template v-if="$scopedSlots.option" slot="option" slot-scope="option">
          <slot name="option" v-bind="option"/>
        </template>
        <template v-if="$scopedSlots['option-label']" slot="option-label" slot-scope="option">
          <slot name="option-label" v-bind="option"/>
        </template>
      </veui-option-group>
    </template>
  </template>
  <template v-else>
    <slot/>
  </template>
</div>

</template>

<script>
import Option from './Option'
import ui from '../../mixins/ui'
import menu from '../../mixins/menu'
import select from '../../mixins/select'
import '../../config/uiTypes'

export default {
  name: 'veui-option-group',
  uiTypes: ['menu'],
  mixins: [ui, menu, select],
  components: {
    'veui-option': Option
  },
  props: {
    label: String,
    options: {
      type: Array
    }
  },
  data () {
    return {
      items: []
    }
  },
  computed: {
    value () {
      return this.select.value
    },
    itemIds () {
      return this.items.map(({ id }) => id)
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
