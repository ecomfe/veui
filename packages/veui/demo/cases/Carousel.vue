<template>
  <article>
    <h1><code>&lt;veui-carousel&gt;</code></h1>
    <p><code>index</code>: <veui-number-input ui="tiny" v-model="index" :min="0" :max="items.length - 1"/></p>
    <p><code>interval</code>: <veui-number-input ui="tiny" v-model="interval" :min="0" :step="1000"/></p>
    <p><veui-checkbox v-model="loose"><code>ui="loose"</code></veui-checkbox></p>
    <p><veui-checkbox v-model="autoplay"><code>autoplay</code></veui-checkbox></p>
    <p><veui-checkbox v-model="wrap"><code>wrap</code></veui-checkbox></p>
    <p><veui-checkbox v-model="pauseOnHover"><code>pause-on-hover</code></veui-checkbox></p>
    <p><veui-radio-group v-model="trigger" :items="triggers"></veui-radio-group></p>
    <p><veui-radio-group v-model="size" :items="sizes"></veui-radio-group></p>
    <p><veui-radio-group v-model="indicator" :items="indicators"></veui-radio-group></p>
    <section>
      <veui-carousel :datasource="items" :index.sync="index" :ui="ui" :interval="interval" :pause-on-hover="pauseOnHover"
        :switch-trigger="trigger" :wrap="wrap" :indicator="indicator" :autoplay="autoplay"></veui-carousel>
    </section>
  </article>
</template>

<script>
import { Carousel, Checkbox, RadioGroup, NumberInput } from 'veui'

export default {
  name: 'carousel-demo',
  components: {
    'veui-carousel': Carousel,
    'veui-checkbox': Checkbox,
    'veui-radio-group': RadioGroup,
    'veui-number-input': NumberInput
  },
  data () {
    return {
      index: 0,
      interval: 3000,
      pauseOnHover: true,
      loose: false,
      autoplay: true,
      wrap: true,
      trigger: 'hover',
      triggers: [
        { value: 'hover', label: 'hover' },
        { value: 'click', label: 'click' }
      ],
      size: '',
      sizes: [
        { value: 'small', label: 'small' },
        { value: '', label: 'normal' },
        { value: 'large', label: 'large' }
      ],
      indicator: 'radio',
      indicators: [
        { value: 'radio', label: 'radio' },
        { value: 'number', label: 'number' },
        { value: 'tab', label: 'tab' },
        { value: 'none', label: 'none' }
      ],
      items: [
        {
          src: 'http://image.cc0.cn/uploadfile/2017/0612/thumb_1440_0_20170612110044186.jpg',
          alt: 'Highway'
        },
        {
          src: 'http://image.cc0.cn/uploadfile/2017/0621/thumb_1440_0_20170621121923346.jpg',
          alt: 'City'
        },
        {
          src: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
          alt: 'Baidu logo'
        }
      ]
    }
  },
  computed: {
    ui () {
      return [
        ...this.loose ? ['loose'] : [],
        ...this.size ? [this.size] : []
      ].join(' ')
    }
  }
}
</script>
