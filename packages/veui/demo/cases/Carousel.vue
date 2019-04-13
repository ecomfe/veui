<template>
<article>
  <h1><code>&lt;veui-carousel&gt;</code></h1>
  <p>
    <code>index</code>: <veui-number-input
      v-model="index"
      ui="tiny"
      :min="0"
      :max="items.length - 1"
    />
  </p>
  <p>
    <code>interval</code>: <veui-number-input
      v-model="interval"
      ui="tiny"
      :min="0"
      :step="1000"
    />
  </p>
  <p>
    <veui-checkbox v-model="loose">
      <code>ui="loose"</code>
    </veui-checkbox>
  </p>
  <p>
    <veui-checkbox v-model="autoplay">
      <code>autoplay</code>
    </veui-checkbox>
  </p>
  <p>
    <veui-checkbox v-model="wrap">
      <code>wrap</code>
    </veui-checkbox>
  </p>
  <p>
    <veui-checkbox v-model="pauseOnHover">
      <code>pause-on-hover</code>
    </veui-checkbox>
  </p>
  <p>
    <veui-radio-group
      v-model="trigger"
      :items="triggers"
    />
  </p>
  <p>
    <veui-radio-group
      v-model="size"
      :items="sizes"
    />
  </p>
  <p>
    <veui-radio-group
      v-model="indicator"
      :items="indicators"
    />
  </p>
  <section>
    <veui-carousel
      :datasource="items"
      :index.sync="index"
      :ui="ui"
      :interval="interval"
      :pause-on-hover="pauseOnHover"
      :switch-trigger="trigger"
      :wrap="wrap"
      :indicator="indicator"
      :autoplay="autoplay"
    />
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
          src:
            'http://ecmb.bdimg.com/public01/one-design/2b77cc4a4c5c906993c0e512f3ddaf03.jpg',
          alt: 'A cute kitty looking at you with its greenish eyes.',
          label: '猫'
        },
        {
          src:
            'http://ecmb.bdimg.com/public01/one-design/6fedc62b9221846ce5114c7447622e47.jpeg',
          alt: 'A common kingfisher flying above river.',
          label: '翠鸟'
        },
        {
          src:
            'http://ecmb.bdimg.com/public01/one-design/e1b6473c898d9e456452ee79d7533a86.jpeg',
          alt: 'A white and gray dolphin in blue water.',
          label: '海豚'
        }
      ]
    }
  },
  computed: {
    ui () {
      return [
        ...(this.loose ? ['loose'] : []),
        ...(this.size ? [this.size] : [])
      ].join(' ')
    }
  }
}
</script>
