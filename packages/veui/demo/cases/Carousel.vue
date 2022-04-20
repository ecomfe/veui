<template>
<article>
  <h1>
    <code>&lt;veui-carousel&gt;</code>
  </h1>
  <p>
    <code>interval</code>:
    <veui-number-input v-model="interval" ui="tiny" :min="0" :step="1000"/>
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
    <veui-radio-group v-model="trigger" :items="triggers"/>
  </p>
  <p>
    <veui-radio-group v-model="effect" :items="effects"/>
  </p>
  <p>
    <veui-radio-group v-model="indicator" :items="indicators"/>
  </p>
  <p>
    <veui-radio-group v-model="alignment" :items="alignments"/>
  </p>
  <p>
    <veui-radio-group
      v-model="indicatorPosition"
      :items="indicatorPositions"
    />
  </p>
  <p>
    <veui-radio-group v-model="control" :items="controls"/>
  </p>
  <p>
    <veui-checkbox v-model="vertical">
      <code>vertical</code>
    </veui-checkbox>
  </p>
  <p>
    <code>duration</code>:
    <veui-number-input
      v-model="duration"
      ui="tiny"
      :step="0.1"
      :decimal-place="1"
      :min="0"
      :max="5"
    />
  </p>
  <section class="carousel-section">
    <h4>1 per view, 1 per group</h4>
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
      :indicator="indicator"
      :indicator-align="alignment"
      :indicator-position="indicatorPosition"
      :autoplay="autoplay"
      :vertical="vertical"
      :controls="!!control"
      :controls-position="control"
      :effect="effect"
      lazy
      :style="{
        '--dls-carousel-transition-duration': `${duration}s`
      }"
    />
  </section>
  <section class="carousel-section">
    <h4>自定义item</h4>
    <veui-carousel
      :datasource="items"
      :index.sync="index"
      :ui="ui"
      :interval="interval"
      :pause-on-hover="pauseOnHover"
      :switch-trigger="trigger"
      :wrap="wrap"
      :indicator="indicator"
      :indicator-align="alignment"
      :indicator-position="indicatorPosition"
      :autoplay="autoplay"
      :vertical="vertical"
      :controls="!!control"
      :controls-position="control"
      :effect="effect"
      :style="{
        '--dls-carousel-transition-duration': `${duration}s`
      }"
    >
      <template #item="{ label }">
        <div class="demo-carousel-slide">{{ label }}</div>
      </template>
    </veui-carousel>
  </section>
  <section class="carousel-section">
    <h4>2 per view, 1 per group</h4>
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
      :indicator="indicator"
      :indicator-align="alignment"
      :indicator-position="indicatorPosition"
      :autoplay="autoplay"
      :vertical="vertical"
      :controls="!!control"
      :controls-position="control"
      :effect="effect"
      :slides-per-view="2"
      :slides-per-group="1"
      lazy
      :style="{
        '--dls-carousel-transition-duration': `${duration}s`
      }"
    />
  </section>
  <section class="carousel-section">
    <h4>2 per view, 2 per group</h4>
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
      :indicator="indicator"
      :indicator-align="alignment"
      :indicator-position="indicatorPosition"
      :autoplay="autoplay"
      :vertical="vertical"
      :controls="!!control"
      :controls-position="control"
      :effect="effect"
      :slides-per-view="2"
      :slides-per-group="2"
      lazy
    />
  </section>
  <section class="carousel-section">
    <h4>3 per view, 3 per group</h4>
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
      :indicator="indicator"
      :indicator-align="alignment"
      :indicator-position="indicatorPosition"
      :autoplay="autoplay"
      :vertical="vertical"
      :controls="!!control"
      :controls-position="control"
      :effect="effect"
      :slides-per-view="3"
      :slides-per-group="3"
      lazy
    />
  </section>
  <section class="carousel-section">
    <h4>3 per view, 2 per group</h4>
    <p>
      <code>index</code>:
      <veui-number-input
        v-model="index33"
        ui="tiny"
        :min="0"
        :max="Math.ceil(items.length / 2) - 1"
      />
    </p>
    <veui-carousel
      :datasource="items"
      :index.sync="index32"
      :ui="ui"
      :interval="interval"
      :pause-on-hover="pauseOnHover"
      :switch-trigger="trigger"
      :wrap="wrap"
      :indicator="indicator"
      :indicator-align="alignment"
      :indicator-position="indicatorPosition"
      :autoplay="autoplay"
      :vertical="vertical"
      :controls="!!control"
      :controls-position="control"
      :effect="effect"
      :slides-per-view="3"
      :slides-per-group="2"
      lazy
    />
  </section>
  <section class="carousel-section">
    <h4>fade effect with slide-aspect-ratio: `1/1`</h4>
    <p>
      <code>index</code>:
      <veui-number-input
        v-model="index11"
        ui="tiny"
        :min="0"
        :max="items.length - 1"
      />
    </p>
    <veui-carousel
      :datasource="items"
      :index.sync="index11"
      :ui="ui"
      :interval="interval"
      :pause-on-hover="pauseOnHover"
      :switch-trigger="trigger"
      :wrap="wrap"
      :indicator="indicator"
      :indicator-align="alignment"
      :indicator-position="indicatorPosition"
      :autoplay="autoplay"
      :vertical="vertical"
      :controls="!!control"
      :controls-position="control"
      effect="fade"
      :slide-aspect-ratio="1"
      lazy
    />
  </section>
  <section class="carousel-section">
    <h4>2 per view, 2 per group, slide-aspect-ratio: `2/1`</h4>
    <p>
      <code>index</code>:
      <veui-number-input
        v-model="index2221"
        ui="tiny"
        :min="0"
        :max="Math.ceil(items.length / 2) - 1"
      />
    </p>
    <veui-carousel
      :datasource="items"
      :index.sync="index2221"
      :ui="ui"
      :interval="interval"
      :pause-on-hover="pauseOnHover"
      :switch-trigger="trigger"
      :wrap="wrap"
      :indicator="indicator"
      :indicator-align="alignment"
      :indicator-position="indicatorPosition"
      :autoplay="autoplay"
      :vertical="vertical"
      :controls="!!control"
      :controls-position="control"
      :effect="effect"
      :slides-per-view="2"
      :slides-per-group="2"
      slide-aspect-ratio="2/1"
      lazy
    />
  </section>
  <section class="carousel-section">
    <h4>1 per view, 1 per group，only 1 pic</h4>
    <p>
      <code>index</code>:
      <veui-number-input
        v-model="index112"
        ui="tiny"
        :min="0"
        :max="Math.ceil(items.length / 1) - 1"
      />
    </p>
    <veui-carousel
      :datasource="[items[1]]"
      :index.sync="index112"
      :ui="ui"
      :interval="interval"
      :pause-on-hover="pauseOnHover"
      :switch-trigger="trigger"
      :wrap="wrap"
      :indicator="indicator"
      :indicator-align="alignment"
      :indicator-position="indicatorPosition"
      :autoplay="autoplay"
      :vertical="vertical"
      :controls="!!control"
      :controls-position="control"
      :effect="effect"
      :slides-per-view="1"
      :slides-per-group="1"
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
      index32: 0,
      index11: 0,
      index112: 0,
      index2221: 0,
      interval: 3000,
      duration: 0.2,
      pauseOnHover: true,
      loose: false,
      autoplay: false,
      wrap: true,
      trigger: 'hover',
      vertical: false,
      alignment: 'start',
      indicatorPosition: 'inside',
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
      alignments: [
        { value: 'start', label: 'start' },
        { value: 'end', label: 'end' }
      ],
      indicatorPositions: [
        { value: 'inside', label: 'inside indicator' },
        { value: 'outside', label: 'outside indicator' }
      ],
      controls: [
        { value: false, label: 'no controls' },
        { value: 'inside', label: 'inside controls' },
        { value: 'outside', label: 'outside controls' }
      ],
      indicator: 'bar',
      indicators: [
        { value: 'bar', label: 'bar' },
        { value: 'number', label: 'number' },
        { value: 'dot', label: 'dot' },
        { value: 'none', label: 'none' }
      ],
      items: [
        {
          src: 'https://nadvideo2.baidu.com/b45f066cccd13549219cb475ca520cee_1920_1080.mp4',
          alt: 'A 1080p video.',
          label: 'A 1080p video',
          type: 'video'
        },
        {
          src: 'http://ecmb.bdimg.com/public01/one-design/2b77cc4a4c5c906993c0e512f3ddaf03.jpg',
          alt: 'A cute kitty looking at you with its greenish eyes.',
          label: '猫'
        },
        {
          src: 'http://ecmb.bdimg.com/public01/one-design/6fedc62b9221846ce5114c7447622e47.jpeg',
          alt: 'A common kingfisher flying above river.',
          label: '翠鸟'
        },
        {
          src: 'http://ecmb.bdimg.com/public01/one-design/e1b6473c898d9e456452ee79d7533a86.jpeg',
          alt: 'A white and gray dolphin in blue water.',
          label: '海豚'
        },
        {
          src: 'https://www.baidu.com/img/bd_logo1.png',
          alt: 'Baidu logo.',
          label: '百度'
        },
        {
          src: 'https://ss3.bdstatic.com/yrwDcj7w0QhBkMak8IuT_XF5ehU5bvGh7c50/logopic/1b61ee88fdb4a4b918816ae1cfd84af1_fullsize.jpg',
          alt: 'Tesla logo.',
          label: '特斯拉'
        }
        // {
        //   src: 'https://nadvideo2.baidu.com/b45f066cccd13549219cb475ca520cee_1920_1080.mp4',
        //   alt: 'A 1080p video.',
        //   label: 'A 1080p video',
        //   type: 'video'
        // }
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

.demo-carousel-slide {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ccc;
}
</style>
