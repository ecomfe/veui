<template>
<article>
  <h1><code>&lt;veui-lightbox></code></h1>
  <h2>wrap模式</h2>
  <veui-button @click="handleClick(0)">打开</veui-button>
  <veui-lightbox
    :open.sync="openList[0]"
    :datasource="items"
    :index.sync="index"
    indicator="number"
    wrap
  />
  <h2>非wrap模式</h2>
  <veui-button @click="handleClick(1)">打开</veui-button>
  <veui-lightbox
    :open.sync="openList[1]"
    :datasource="items"
    :index.sync="index"
    indicator="number"
    :wrap="false"
  />
  <h2>没有头部页码</h2>
  <veui-button @click="handleClick(2)">打开</veui-button>
  <veui-lightbox
    :open.sync="openList[2]"
    :datasource="items"
    :index.sync="index"
    indicator="none"
    wrap
  />
</article>
</template>

<script>
import { Lightbox, Button } from 'veui'

export default {
  name: 'lightbox-demo',
  components: {
    'veui-lightbox': Lightbox,
    'veui-button': Button
  },
  data () {
    return {
      index: 0,
      items: [
        {
          src:
            'https://ecmb.bdimg.com/public01/one-design/2b77cc4a4c5c906993c0e512f3ddaf03.jpg',
          alt: 'A cute kitty looking at you with its greenish eyes.',
          name: '猫',
          type: 'image',
          desc: 'hahahahahhahaha'.repeat(10)
        },
        {
          src:
            'https://ecmb.bdimg.com/public01/one-design/6fedc62b9221846ce5114c7447622e47.jpeg',
          alt: 'A common kingfisher flying above river.',
          name: '翠鸟',
          type: 'image',
          desc: 'hahahahahhahaha1'
        },
        {
          src:
            'https://ecmb.bdimg.com/public01/one-design/e1b6473c898d9e456452ee79d7533a86.jpeg',
          alt: 'A white and gray dolphin in blue water.',
          name: '海豚',
          type: 'image',
          desc: 'hahahahahhahaha2'.repeat(10)
        },
        {
          src: 'https://www.baidu.com/img/bd_logo1.png',
          alt: 'Baidu logo.',
          name: '百度',
          type: 'image',
          desc: 'hahahahahhahaha3'
        },
        {
          src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
          alt: 'flower video',
          name: '花',
          type: 'video',
          desc: 'hahahahahhahaha4'.repeat(10)
        }
      ],
      open: true,
      indicator: 'none',
      openList: []
    }
  },
  methods: {
    handleClick (index) {
      this.$set(this.openList, index, true)
    }
  }
}
</script>
