<template>
  <article>
    <h1><code>&lt;veui-slider&gt;</code></h1>
    <section>
        <veui-slider :value.sync="value1"></veui-slider>
        <div class="desc">Range: 0~1, Value: {{ value1 }}</div>
    </section>
    <section>
        <veui-slider :value.sync="value2" :min="0" :max="100" :step="5"></veui-slider>
        <div class="desc">Range: 0~100, Step: 5, Value: {{ value2 }}</div>
    </section>
    <section>
        <veui-slider :value.sync="value3" :min="0" :max="255" :step="1">
          <div slot="track" style="width: 100%; height: 20px;
            background: linear-gradient(to right, red 0%, transparent 100%)"></div>
          <div slot="trigger" style="text-align: center; margin-top: 8px">🖕</div>
        </veui-slider>
        <div class="desc">Range: 0~255, Step: 1, Value: {{ value3 }}</div>
    </section>

  </article>
</template>

<script>
import { Slider } from 'veui'

export default {
  name: 'slider-demo',
  components: {
    'veui-slider': Slider
  },
  data () {
    return {
      value1: 0.2,
      value2: 30,
      value3: 100
    }
  }
}
</script>

<style lang="less" scoped>
section {
  margin: 2em 0;
  padding: 1em;
  background-color: #f7f7f7;

  .desc {
    margin-top: 1em;
  }
}
</style>
