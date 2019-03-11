<template>
<div
  class="veui-color-palette"
  :ui="realUi"
>
  <div
    ref="colors"
    class="veui-color-palette-colors"
  >
    <div
      v-for="(color, i) in colors"
      :key="i"
      v-drag
      class="veui-color-palette-color"
      :class="{
        'veui-color-palette-color-outside': i === dragItem.index && dragItem.outside
      }"
      :style="{
        transform: i === dragItem.index
          ? `translate(${dragItem.distanceX}px, ${dragItem.distanceY}px)`
          : ''
      }"
      :data-index="i"
      @click="handleColorClick(i)"
    >
      <div>
        <div
          :style="{
            'background-color': color
          }"
        />
      </div>
    </div>
    <div
      class="veui-color-palette-color"
      @click="$emit('add')"
    >
      <veui-icon name="plus"/>
    </div>
  </div>
  <div class="veui-color-palette-extra">
    <slot/>
  </div>
</div>
</template>

<script>
import Icon from '../Icon'
import { drag } from '../../directives'
import ui from '../../mixins/ui'

const putbackClass = 'veui-color-palette-color-putback'

export default {
  name: 'color-palette',
  components: {
    'veui-icon': Icon
  },
  directives: {
    drag
  },
  mixins: [ui],
  props: {
    colors: {
      type: Array,
      default () {
        return []
      }
    },
    ui: String
  },
  data () {
    return {
      fieldSize: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      },
      dragItem: {
        index: -1,
        top: 0,
        left: 0,
        distanceX: 0,
        distanceY: 0
      }
    }
  },
  mounted () {
    this.$on('dragstart', ({ event: { currentTarget: target } }) => {
      this.mouseupMark = 0
      target.classList.remove(putbackClass)

      let { top: targetTop, left: targetLeft } = target.getBoundingClientRect()
      this.dragItem.top = targetTop
      this.dragItem.left = targetLeft
      this.dragItem.distanceX = 0
      this.dragItem.distanceY = 0

      let {
        top,
        left,
        width,
        height
      } = this.$refs.colors.getBoundingClientRect()
      this.fieldSize.top = top
      this.fieldSize.left = left
      this.fieldSize.width = width
      this.fieldSize.height = height

      this.dragItem.outside = false
      this.dragItem.index = parseInt(target.dataset.index, 10)
      this.dragItemNode = target
    })
    this.$on('dragend', ({ event }) => {
      let removeIndex = this.dragItem.index
      this.dragItem.index = -1
      if (this.dragItem.outside) {
        this.$emit('remove', removeIndex)
      } else if (this.dragItem.distanceX || this.dragItem.distanceY) {
        this.dragItemNode.classList.add(putbackClass)
        this.dragItemNode = null
      }
    })
    this.$on('drag', ({ distanceX, distanceY }) => {
      this.mouseupMark = 1
      this.dragItem.distanceX = distanceX
      this.dragItem.distanceY = distanceY
      this.dragItem.outside = isDragItemOutsideOfField(
        this.dragItem.left + distanceX,
        this.dragItem.top + distanceY,
        this.fieldSize.top,
        this.fieldSize.left,
        this.fieldSize.width,
        this.fieldSize.height
      )
    })
  },
  methods: {
    handleColorClick (i) {
      // 如果没有拖动(drag)，就是点击，否则不处理，防止拖动误判为点击
      if (!this.removable && this.mouseupMark) {
        return
      }
      this.$emit(this.removable ? 'remove' : 'select', i)
    }
  }
}

function isDragItemOutsideOfField (
  itemX,
  itemY,
  fieldTop,
  fieldLeft,
  fieldWidth,
  fieldHeight
) {
  let aroundWidth = 30
  return (
    itemX < fieldLeft - aroundWidth ||
    itemX > fieldLeft + fieldWidth + aroundWidth ||
    itemY < fieldTop - aroundWidth ||
    itemY > fieldTop + fieldHeight + aroundWidth
  )
}
</script>
