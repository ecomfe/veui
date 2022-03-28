<template>
<article class="veui-transition-demo">
  <h1><code>&lt;veui-transition&gt;</code></h1>
  <section
    v-for="({ name, effect, style }, idx) in transitions"
    :key="idx"
  >
    <veui-button @click="handleClick(effect)">{{ name }}</veui-button>
    <veui-transition
      :name="effect"
      appear
      :style="
        effect !== 'move'
          ? style
          : {
            '--dls-transition-translate-x': `${50 * count}px`,
            '--dls-transition-translate-y': '0px'
          }
      "
      @after-leave="afterOut(effect)"
    >
      <div
        v-if="trigger[effect]"
        class="content"
      />
    </veui-transition>
  </section>
</article>
</template>

<script>
import { Transition, Button } from 'veui'

const transitions = [
  {
    name: '渐现',
    effect: 'fade-in'
  },
  {
    name: '放大渐现',
    effect: 'scale-fade-in'
  },
  {
    name: '移入',
    effect: 'slide-in',
    style: {
      '--dls-transition-translate-from-x': '250px', // ?
      '--dls-transition-translate-from-y': '0px'
    }
  },
  {
    name: '渐现移入',
    effect: 'slide-fade-in',
    style: {
      '--dls-transition-translate-from-x': '250px',
      '--dls-transition-translate-from-y': '0px'
    }
  },
  {
    name: '渐变移入',
    effect: 'slide-scale-fade-in',
    style: {
      '--dls-transition-translate-from-x': '250px',
      '--dls-transition-translate-from-y': '-250px'
    }
  },
  {
    name: '移动',
    effect: 'move'
  },
  {
    name: '渐隐',
    effect: 'fade-out'
  },
  {
    name: '缩小渐隐',
    effect: 'scale-fade-out'
  },
  {
    name: '移出',
    effect: 'slide-out',
    style: {
      '--dls-transition-translate-to-x': '250px',
      '--dls-transition-translate-to-y': '0px'
    }
  },
  {
    name: '渐隐移出',
    effect: 'slide-fade-out',
    style: {
      '--dls-transition-translate-to-x': '250px',
      '--dls-transition-translate-to-y': '0px'
    }
  },
  {
    name: '渐变移出',
    effect: 'slide-scale-fade-out',
    style: {
      '--dls-transition-translate-to-x': '250px',
      '--dls-transition-translate-to-y': '-250px'
    }
  }
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
      trigger: transitions.reduce((acc, { effect }) => {
        acc[effect] = true
        return acc
      }, {})
    }
  },
  methods: {
    afterOut (effect) {
      if (effect.includes('out')) {
        setTimeout(() => {
          this.trigger[effect] = true
        }, 600)
      }
    },
    handleClick (effect) {
      if (effect === 'move') {
        this.count++
        this.count %= 4
        return
      }

      if (effect.includes('in')) {
        this.trigger[effect] = false
        this.$nextTick(() => {
          this.trigger[effect] = true
        })
      } else if (effect.includes('out')) {
        this.trigger[effect] = false
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
