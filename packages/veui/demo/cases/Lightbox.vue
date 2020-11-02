<template>
<article>
  <h1><code>&lt;veui-lightbox></code></h1>
  <section>
    <veui-lightbox
      :open.sync="open"
      :datasource="items"
      :index.sync="index"
      indicator="number"
      wrap
    />
  </section>
</article>
</template>

<script>
import { Lightbox } from 'veui'

export default {
  name: 'lightbox-demo',
  components: {
    'veui-lightbox': Lightbox
  },
  data () {
    return {
      index: 0,
      items: [
        {
          src:
            'https://cms-image.cdn.bcebos.com/1919965741%2C177922360.jpg',
          alt: 'A cute kitty looking at you with its greenish eyes.',
          name: '猫',
          type: 'image',
          desc: 'hahahahahhahaha'.repeat(10)
        },
        {
          src:
            'https://cms-image.cdn.bcebos.com/3349723427%2C2625224597.jpg',
          alt: 'A common kingfisher flying above river.',
          name: '翠鸟',
          type: 'image',
          desc: 'hahahahahhahaha1'
        },
        {
          src:
            'https://cms-image.cdn.bcebos.com/1214177510%2C515504630.jpg',
          alt: 'A white and gray dolphin in blue water.',
          name: '海豚',
          type: 'image',
          desc: 'hahahahahhahaha2'.repeat(10)
        },
        {
          src: 'https://cms-image.cdn.bcebos.com/2608100595%2C1414551417.jpg',
          alt: 'Baidu logo.',
          name: '百度',
          type: 'image',
          desc: 'hahahahahhahaha3'
        },
        {
          src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
          alt: 'Tesla logo.',
          name: '特斯拉',
          type: 'video',
          desc: 'hahahahahhahaha4'.repeat(10)
        }
      ],
      open: true,
      indicator: 'none'
    }
  }
}
</script>
