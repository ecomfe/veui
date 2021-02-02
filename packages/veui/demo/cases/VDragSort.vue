<template>
<article>
  <h1>
    <code>v-drag.sort</code>
  </h1>
  <section v-if="hasDebug">
    <label> <input
      v-model="debug"
      type="checkbox"
    > 显示debug层 </label>

    <span style="margin-left: 2em">插入判定：</span>
    <label><input
      v-model="align"
      type="radio"
      :value="undefined"
    >默认</label>
    <label><input
      v-model="align"
      type="radio"
      value="mouse"
    >指针</label>
    <label><input
      v-model="align"
      type="radio"
      value="middle"
    >中心点</label>
  </section>
  <section ref="itemGroup">
    <h2>Axis: X</h2>
    <transition-group
      ref="transitionGroup"
      name="list"
      tag="div"
      class="items"
    >
      <div
        v-for="item in items"
        :key="item"
        v-drag.sort.x="{
          name: 'mySortableButton',
          containment: 'itemGroup',
          callback: handleAxisXSortCallback,
          debug,
          align
        }"
        class="item"
      >
        {{ item }}
      </div>
    </transition-group>
  </section>
  <section>
    <h2>Axis: Y</h2>
    <transition-group
      ref="transitionGroup2"
      name="list"
      tag="ol"
      class="list"
    >
      <li
        v-for="item in items2"
        :key="item"
        v-drag.sort.y="{
          name: 'otherSortableButton',
          callback: handleAxisYSortCallback,
          debug,
          align
        }"
        class="item"
      >
        {{ item }}
      </li>
    </transition-group>
  </section>

  <section>
    <h2>Overlay</h2>
    <button @click="dialogOpen = true">open dialog</button>
    <button
      ref="popoverButton"
      @click="popoverOpen = true"
    >
      open popover
    </button>

    <veui-dialog
      :open.sync="dialogOpen"
      title="In Dialog"
    >
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
        <div
          ref="dialogContent"
          class="items"
        >
          <div
            v-for="item in items2"
            :key="item"
            v-drag.sort.x="{
              name: 'buttonInDialog',
              containment: 'dialogContent',
              callback: handleSortCallback,
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
          v-move-end
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
              callback: handleTransitionMoveEndSortCallback,
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
import moveEnd from 'veui/directives/transitionGroupMoveEnd'
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
    drag,
    moveEnd
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
    },
    handleAxisXSortCallback () {
      return this.getTransitionSortCallback('items', 'transitionGroup')
    },
    handleAxisYSortCallback () {
      return this.getTransitionSortCallback('items2', 'transitionGroup2')
    },
    handleSortCallback () {
      return this.getTransitionSortCallback('items2')
    }
  },
  methods: {
    getTransitionSortCallback (itemsKey, transitionGroupRefKey) {
      return (toIndex, fromIndex) => {
        if (toIndex === fromIndex) {
          return
        }
        let promise
        if (transitionGroupRefKey) {
          promise = new Promise((resolve, reject) => {
            let el = this.$refs[transitionGroupRefKey].$el
            let handleTransitionEnd = () => {
              el.removeEventListener('transitionend', handleTransitionEnd)
              resolve()
            }
            el.addEventListener('transitionend', handleTransitionEnd)
          })
        }
        this.moveItem(this[itemsKey], fromIndex, toIndex)
        // 动画完了再回调成功
        return promise
      }
    },
    handleTransitionMoveEndSortCallback (toIndex, fromIndex) {
      if (toIndex === fromIndex) {
        return
      }
      this.moveItem(this.items2, fromIndex, toIndex)
      return new Promise(resolve => {
        this.$refs.popoverContent.$once('move-end', resolve)
      })
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

.item {
  background: white;
  border: 1px solid pink;
  border-radius: 3px;
  margin: 0 10px 8px 0;
  padding: 1px 2px;

  &:nth-child(3n) {
    font-size: 1.2em;
  }
}

.list {
  padding: 0;
  list-style-position: inside;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
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
</style>
