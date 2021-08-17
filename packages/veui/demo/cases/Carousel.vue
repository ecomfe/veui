<template>
<article>
  <h1><code>&lt;veui-carousel&gt;</code></h1>
  <p>
    <code>interval</code>:
    <veui-number-input
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
      v-model="effect"
      :items="effects"
    />
  </p>
  <p>
    <veui-radio-group
      v-model="indicator"
      :items="indicators"
    />
  </p>
  <p>
    <veui-radio-group
      v-model="place1"
      :items="place1s"
    />
  </p>
  <p>
    <veui-radio-group
      v-model="place2"
      :items="place2s"
    />
  </p>
  <p>
    <veui-radio-group
      v-model="control"
      :items="controls"
    />
  </p>
  <p>
    <veui-checkbox v-model="vertical">
      <code>vertical</code>
    </veui-checkbox>
  </p>
  <section class="carousel-section">
    <h4>show 1, step 1</h4>
    <p>
      <code>index</code>:
      <veui-number-input
        v-model="index"
        ui="tiny"
        :min="0"
        :max="items.length - 1"
      />
    </p>
    <veui-carousel
      :datasource="items"
      :index.sync="index"
      :ui="ui"
      :interval="interval"
      :pause-on-hover="pauseOnHover"
      :switch-trigger="trigger"
      :wrap="wrap"
      :indicator="`${indicator} ${place1} ${place2}`"
      :autoplay="autoplay"
      :vertical="vertical"
      :controls="control"
      :effect="effect"
      lazy
    />
  </section>
  <section class="carousel-section">
    <h4>show 2, step 1</h4>
    <p>
      <code>index</code>:
      <veui-number-input
        v-model="index21"
        ui="tiny"
        :min="0"
        :max="items.length - 1"
      />
    </p>
    <veui-carousel
      :datasource="items"
      :index.sync="index21"
      :ui="ui"
      :interval="interval"
      :pause-on-hover="pauseOnHover"
      :switch-trigger="trigger"
      :wrap="wrap"
      :indicator="`${indicator} ${place1} ${place2}`"
      :autoplay="autoplay"
      :vertical="vertical"
      :controls="control"
      :effect="effect"
      :show-count="2"
      :step-count="1"
      lazy
    />
  </section>
  <section class="carousel-section">
    <h4>show 2, step 2</h4>
    <p>
      <code>index</code>:
      <veui-number-input
        v-model="index22"
        ui="tiny"
        :min="0"
        :max="Math.ceil(items.length / 2) - 1"
      />
    </p>
    <veui-carousel
      :datasource="items"
      :index.sync="index22"
      :ui="ui"
      :interval="interval"
      :pause-on-hover="pauseOnHover"
      :switch-trigger="trigger"
      :wrap="wrap"
      :indicator="`${indicator} ${place1} ${place2}`"
      :autoplay="autoplay"
      :vertical="vertical"
      :controls="control"
      :effect="effect"
      :show-count="2"
      :step-count="2"
      lazy
    />
  </section>
  <section class="carousel-section">
    <h4>show 3, step 3</h4>
    <p>
      <code>index</code>:
      <veui-number-input
        v-model="index33"
        ui="tiny"
        :min="0"
        :max="Math.ceil(items.length / 3) - 1"
      />
    </p>
    <veui-carousel
      :datasource="items"
      :index.sync="index33"
      :ui="ui"
      :interval="interval"
      :pause-on-hover="pauseOnHover"
      :switch-trigger="trigger"
      :wrap="wrap"
      :indicator="`${indicator} ${place1} ${place2}`"
      :autoplay="autoplay"
      :vertical="vertical"
      :controls="control"
      :effect="effect"
      :show-count="3"
      :step-count="3"
      lazy
    />
  </section>
  <section class="carousel-section">
    <h4>fade effect with aspect-ratio: `1:1`</h4>
    <p>
      <code>index</code>:
      <veui-number-input
        v-model="index"
        ui="tiny"
        :min="0"
        :max="items.length - 1"
      />
    </p>
    <veui-carousel
      :datasource="items"
      :index.sync="index"
      :ui="ui"
      :interval="interval"
      :pause-on-hover="pauseOnHover"
      :switch-trigger="trigger"
      :wrap="wrap"
      :indicator="`${indicator} ${place1} ${place2}`"
      :autoplay="autoplay"
      :vertical="vertical"
      :controls="control"
      effect="fade"
      aspect-ratio="1:1"
      lazy
    />
  </section>
  <section class="carousel-section">
    <h4>show 2, step 2 , aspect-ratio: `2:1`</h4>
    <p>
      <code>index</code>:
      <veui-number-input
        v-model="index22"
        ui="tiny"
        :min="0"
        :max="Math.ceil(items.length / 2) - 1"
      />
    </p>
    <veui-carousel
      :datasource="items"
      :index.sync="index22"
      :ui="ui"
      :interval="interval"
      :pause-on-hover="pauseOnHover"
      :switch-trigger="trigger"
      :wrap="wrap"
      :indicator="`${indicator} ${place1} ${place2}`"
      :autoplay="autoplay"
      :vertical="vertical"
      :controls="control"
      :effect="effect"
      :show-count="2"
      :step-count="2"
      aspect-ratio="2:1"
      lazy
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
      index21: 0,
      index22: 0,
      index33: 0,
      interval: 3000,
      pauseOnHover: true,
      loose: false,
      autoplay: false,
      wrap: true,
      trigger: 'hover',
      vertical: false,
      place1: 'start',
      place2: 'inside',
      control: 'inside',
      effect: 'slide',
      effects: [
        { value: 'fade', label: 'fade' },
        { value: 'slide', label: 'slide' }
      ],
      triggers: [
        { value: 'hover', label: 'hover' },
        { value: 'click', label: 'click' }
      ],
      place1s: [
        { value: 'start', label: 'start' },
        { value: 'end', label: 'end' }
      ],
      place2s: [
        { value: 'inside', label: 'inside indicator' },
        { value: 'outside', label: 'outside indicator' }
      ],
      controls: [
        { value: 'inside', label: 'inside control' },
        { value: 'outside', label: 'outside control' }
      ],
      indicator: 'radio',
      indicators: [
        { value: 'radio', label: 'radio' },
        { value: 'number', label: 'number' },
        { value: 'dot', label: 'dot' },
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
        },
        {
          src: 'https://www.baidu.com/img/bd_logo1.png',
          alt: 'Baidu logo.',
          label: '百度'
        },
        {
          src:
            'https://ss3.bdstatic.com/yrwDcj7w0QhBkMak8IuT_XF5ehU5bvGh7c50/logopic/1b61ee88fdb4a4b918816ae1cfd84af1_fullsize.jpg',
          alt: 'Tesla logo.',
          label: '特斯拉'
        }
      ]
    }
  },
  computed: {
    ui () {
      return [...(this.loose ? ['loose'] : [])].join(' ')
    }
  }
}
</script>

<style scoped>
.carousel-section {
  margin-bottom: 12px;
}
</style>
