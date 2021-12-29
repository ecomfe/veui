<template>
<article class="veui-transition-demo">
  <h1><code>&lt;veui-transition&gt;</code></h1>
  <section
    v-for="(item, idx) in transitions"
    :key="idx"
  >
    <veui-button @click="exist[item] = !exist[item]">{{ item }}</veui-button>
    <veui-transition
      :name="item"
      appear
      :style="getStyle(item)"
    >
      <div
        v-if="exist[item]"
        class="content"
      />
    </veui-transition>
  </section>
  <section key="99">
    <veui-button
      @click="
        count++
        count %= 4
      "
    >move</veui-button>
    <veui-transition
      name="move"
      appear
      :style="getStyle('move')"
    >
      <div class="content"/>
    </veui-transition>
  </section>
</article>
</template>

<script>
import { Transition, Button } from 'veui'

const transitions = [
  'fade',
  'fade-scale',
  'fade-scale-x',
  'fade-scale-y',
  'translate',
  'fade-translate-scale'
]

export default {
  name: 'demo-transition',
  components: {
    'veui-transition': Transition,
    'veui-button': Button
  },
  data () {
    return {
      transitions,
      count: 0,
      exist: transitions.reduce((acc, val) => {
        acc[val] = true
        return acc
      }, {})
    }
  },
  methods: {
    getStyle (item) {
      if (item === 'move') {
        return {
          '--dls-transition-translate-x': `${50 * this.count}px`,
          '--dls-transition-translate-y': '0px'
        }
      }

      if (item.includes('translate')) {
        return {
          '--dls-transition-translate-from-x': '-150px',
          '--dls-transition-translate-from-y': '-150px',
          '--dls-transition-translate-to-x': '150px',
          '--dls-transition-translate-to-y': '-150px'
        }
      }

      if (item.includes('scale-x')) {
        return {
          'transform-origin': '0 50%'
        }
      }

      if (item.includes('scale-y')) {
        return {
          'transform-origin': '50% 0'
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
section {
  height: 150px;
  display: flex;
  align-items: center;
}

.content {
  background-color: royalblue;
  border-radius: 5%;
  width: 60px;
  height: 60px;
  margin-right: 600px;
  margin-left: auto;
}
</style>
