<template>
<article>
  <h1>
    <code>v-drag.sort</code>
  </h1>
  <section>
    <label> <input
      v-model="debug"
      type="checkbox"
    > 显示debug层 </label>
  </section>
  <section ref="itemGroup">
    <h2>Axis: X</h2>
    <div class="items">
      <div
        v-for="item in items"
        :key="item"
        v-drag.sort.x="{
          name: 'mySortableButton',
          containment: 'itemGroup',
          callback: handleSortCallback,
          debug
        }"
        class="item"
      >
        {{ item }}
      </div>
    </div>
  </section>
  <section>
    <h2>Axis: Y</h2>
    <ol class="list">
      <li
        v-for="item in items2"
        :key="item"
        v-drag.sort.x="{
          name: 'otherSortableButton',
          callback: handleSortCallback2,
          debug
        }"
        class="item"
      >
        {{ item }}
      </li>
    </ol>
  </section>
</article>
</template>

<script>
import drag from 'veui/directives/drag'

export default {
  name: 'v-drag-sort-demo',
  directives: {
    drag
  },
  data () {
    return {
      debug: false,
      items: [
        '须菩提',
        '菩萨亦如是',
        '若作是言',
        '我当灭度无量众生',
        '即不名菩萨',
        '🍎🍎',
        '🍋',
        '🍉🍉🍉',
        '🍓🍓',
        '何以故',
        '须菩提',
        '无有法名为菩萨',
        '是故佛说',
        '一切法无我',
        '无人',
        '无众生',
        '无寿者'
      ].map((item, i) => `${i}. ${item}`),
      items2: [
        '须菩提',
        '若菩萨作是言',
        '我当庄严佛土',
        '是不名菩萨',
        '何以故',
        '如来说',
        '庄严佛土者',
        '即非庄严',
        '是名庄严',
        '须菩提',
        '若菩萨通达无我法者',
        '如来说名真是菩萨'
      ].map((item, i) => `${i}${item}`)
    }
  },
  methods: {
    handleSortCallback (toIndex, fromIndex) {
      if (toIndex === fromIndex) {
        return
      }
      this.moveItem(this.items, fromIndex, toIndex)
    },
    handleSortCallback2 (toIndex, fromIndex) {
      if (toIndex === fromIndex) {
        return
      }
      this.moveItem(this.items2, fromIndex, toIndex)
    },
    moveItem (items, fromIndex, toIndex) {
      let item = items[fromIndex]
      items.splice(fromIndex, 1)
      if (toIndex > fromIndex) {
        toIndex--
      }
      items.splice(toIndex, 0, item)
    }
  }
}
</script>

<style scoped lang="less">
section {
  margin-bottom: 20px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.item {
  border: 1px solid pink;
  border-radius: 3px;
  margin: 0 10px 8px 0;
  padding: 1px 2px;

  &:nth-child(3n) {
    font-size: 1.2em;
  }

  &[data-dragging-ghost] {
    &,
    * {
      color: transparent !important;
      background: transparent !important;
      border-color: transparent !important;
    }
    outline: 1px dashed gray;
    outline-offset: -1px;
  }
}

.list {
  padding: 0;
  list-style-position: inside;

  .item {
    border-color: peachpuff;
  }
}
</style>
