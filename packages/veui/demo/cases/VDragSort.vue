<template>
<article>
  <h1>
    <code>v-drag.translate</code>
  </h1>
  <div ref="target" v-drag:target.translate class="target">
    <img src="https://via.placeholder.com/720x1020">
  </div>
  <h1>
    <code>v-drag.sort</code>
  </h1>
  <section v-if="hasDebug">
    <label> <input v-model="debug" type="checkbox">显示debug层 </label>

    <span style="margin-left: 2em">插入判定：</span>
    <label>
      <input v-model="align" type="radio" :value="undefined">默认
    </label>
    <label> <input v-model="align" type="radio" value="mouse">指针 </label>
    <label>
      <input v-model="align" type="radio" value="middle">中心点
    </label>
  </section>
  <section ref="itemGroup" style="transform: translate(200px, 0)">
    <h2>Axis: X</h2>
    <transition-group name="list" tag="div" class="items">
      <div
        v-for="item in items"
        :key="item"
        v-drag.sort.x="{
          name: 'mySortableButton',
          containment: 'itemGroup',
          sort: handleSort,
          debug,
          align
        }"
        class="item target"
      >
        {{ item }}
        <img src="https://via.placeholder.com/720x1020">
      </div>
    </transition-group>
  </section>
  <section ref="itemGroup2x">
    <h2>Axis: X 宽度一致</h2>
    <transition-group name="list" tag="div" class="items">
      <div
        v-for="item in items"
        :key="item"
        v-drag.sort.x="{
          name: 'mySortableButton2x',
          containment: 'itemGroup2x',
          sort: handleSort,
          debug,
          align
        }"
        class="item-fixed-width"
      >
        {{ item }}
      </div>
    </transition-group>
  </section>
  <section>
    <h2>Axis: Y</h2>
    <transition-group name="list" tag="ol" class="list">
      <li
        v-for="item in items2"
        :key="item"
        v-drag.sort.y="{
          name: 'otherSortableButton',
          sort: handleSort2,
          handle: `handle-${item}`,
          debug,
          align
        }"
        class="item"
      >
        <span :ref="`handle-${item}`">🤏</span>
        {{ item }}
      </li>
    </transition-group>
  </section>

  <section>
    <h2>Overlay</h2>
    <button @click="dialogOpen = true">open dialog</button>
    <button ref="popoverButton" @click="popoverOpen = true">
      open popover
    </button>

    <veui-dialog :open.sync="dialogOpen" title="In Dialog">
      <div class="dialog-content">
        <div>
          <p>
            尔时，须菩提白佛言：“世尊！善男子、善女人，发阿耨多罗三藐三菩提心，云何应住？云何降伏其心？”佛告须菩提：“善男子、善女人，发阿耨多罗三藐三菩提者，当生如是心，我应灭度一切众生。灭度一切众生已，而无有一众生实灭度者。
          </p>
          <p>
            何以故？须菩提！若菩萨有我相、人相、众生相、寿者相，即非菩萨。
          </p>
          <p>所以者何？须菩提！实无有法发阿耨多罗三藐三菩提者。”</p>
        </div>
        <div ref="dialogContent" class="items">
          <div
            v-for="item in items2"
            :key="item"
            v-drag.sort.x="{
              name: 'buttonInDialog',
              containment: 'dialogContent',
              sort: handleSort2,
              debug,
              align
            }"
            class="item"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </veui-dialog>

    <veui-popover
      :open.sync="popoverOpen"
      target="popoverButton"
      trigger="click"
    >
      <div class="tooltip-content">
        <div>
          <p>
            尔时，须菩提白佛言：“世尊！善男子、善女人，发阿耨多罗三藐三菩提心，云何应住？云何降伏其心？”佛告须菩提：“善男子、善女人，发阿耨多罗三藐三菩提者，当生如是心，我应灭度一切众生。灭度一切众生已，而无有一众生实灭度者。
          </p>
        </div>
        <transition-group
          ref="popoverContent"
          name="list"
          tag="div"
          class="items"
        >
          <div
            v-for="item in items2"
            :key="item"
            v-drag.sort.x="{
              name: 'buttonInPopover',
              containment: 'popoverContent',
              sort: handleSort2,
              debug,
              align
            }"
            class="item"
          >
            {{ item }}
          </div>
        </transition-group>
      </div>
    </veui-popover>
  </section>
</article>
</template>

<script>
import drag from 'veui/directives/drag'
import { Dialog, Popover } from 'veui'

const items = [
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
  '无寿者',
  '须菩提',
  '若菩萨作是言',
  '我当庄严佛土',
  '是不名菩萨',
  '何以故',
  '🦁',
  '🙈🙉🙊',
  '🐷🐶',
  '如来说',
  '庄严佛土者',
  '即非庄严',
  '是名庄严',
  '须菩提',
  '若菩萨通达无我法者',
  '如来说名真是菩萨'
]

export default {
  name: 'v-drag-sort-demo',
  directives: {
    drag
  },
  components: {
    'veui-dialog': Dialog,
    'veui-popover': Popover
  },
  data () {
    return {
      debug: false,
      align: undefined,
      dialogOpen: false,
      popoverOpen: false,

      items: items.slice(0, 17).map((item, i) => `${i}. ${item}`),
      items2: items.slice(17).map((item, i) => `${i}${item}`)
    }
  },
  computed: {
    hasDebug () {
      return process.env.NODE_ENV === 'development'
    }
  },
  methods: {
    handleSort (from, to) {
      this.moveItem(this.items, from, to)
    },
    handleSort2 (from, to) {
      this.moveItem(this.items2, from, to)
    },
    moveItem (items, fromIndex, toIndex) {
      let item = items[fromIndex]
      items.splice(fromIndex, 1)
      items.splice(toIndex, 0, item)
    }
  }
}
</script>

<style scoped lang="less">
article {
  min-height: 250%;
}

section {
  margin-bottom: 20px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.item-fixed-width,
.item {
  background: white;
  border: 1px solid pink;
  border-radius: 3px;
  margin: 0 10px 8px 0;
  padding: 1px 2px;
}

.item:nth-child(3n) {
  font-size: 1.2em;
}

.item-fixed-width {
  display: inline-block;
  width: 200px;
}

.list {
  padding: 0;
  list-style-position: inside;
  display: flex;
  flex-flow: column wrap;
  height: 300px;
  resize: both;
  overflow: scroll;

  .item {
    width: 40%;
    border-color: peachpuff;
  }
}

.list-move {
  // UE 给出的动画曲线是 0.25, 0.1, 0.25, 1，就是 ease
  transition: transform 200ms ease;
}

.dialog-content,
.tooltip-content {
  height: 200px;
}

.target {
  display: inline-block;

  & > img {
    width: 80px;
    height: 80px;
  }
}
</style>
