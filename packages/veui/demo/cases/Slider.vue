<template>
  <article>
    <h1><code>&lt;veui-slider&gt;</code></h1>

    <section>
        <veui-slider v-model="value1"></veui-slider>
        <div class="desc">Range: 0~1, Value: {{ value1 }}</div>
    </section>

    <section>
        <veui-slider v-model="value2" :min="0" :max="100" :step="8" mark>
          <!-- 没有 tip -->
          <div slot="tip"></div>
        </veui-slider>
        <div class="desc">Range: 0~100, Step: 8, Value: {{ value2 }}</div>
    </section>

    <section>
        <veui-slider v-model="value3" :min="0" :max="255" :step="1">
          <div slot="track" style="width: 100%; height: 20px;
            background: linear-gradient(to right, red 0%, transparent 100%)"></div>
          <div slot="thumb" style="margin-top: 6px">
            <div style="width: 16px; height: 12px">
              <svg width="16" height="12" viewBox="0 0 16 12">
                <polygon points="8,0 16,12 0,12"/>
              </svg>
            </div>
          </div>
          <template slot="tip" slot-scope="{ open }">
            <div v-show="open" class="custom-tip" :style="{
              left: `${value3 / 255 * 100}%`,
              color: `rgb(${255 - value3}, ${255 - value3}, ${255 - value3})`,
              backgroundColor: `rgba(255,0,0,${1 - value3 / 255})`
            }">{{ value3 }}</div>
          </template>
        </veui-slider>
        <div class="desc">Range: 0~255, Step: 1, Value: {{ value3 }}</div>
    </section>

  </article>
</template>

<script>
import { Slider, Tooltip } from 'veui'

export default {
  name: 'slider-demo',
  components: {
    'veui-slider': Slider,
    'veui-tooltip': Tooltip
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
}

.veui-slider {
  background: repeating-linear-gradient(135deg, #fff 0px, #fff 10px, #f7f7f7 11px, #f7f7f7 12px, #fff 13px, #fff 14px);
}

.desc {
  margin-top: 1em;
}

.custom-tip {
  position: absolute;
  top: 3px;
  width: 28px;
  height: 14px;
  margin-left: -14px;
  text-align: center;
  border: 1px solid #fff;
  font-size: 12px;
}
</style>
