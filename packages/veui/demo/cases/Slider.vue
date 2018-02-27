<template>
  <article>
    <h1><code>&lt;veui-slider&gt;</code></h1>

    <section>
        <veui-slider v-model="value1"></veui-slider>
        <veui-slider v-model="value1" readonly ui="small">
          <!-- 隐藏 tip -->
          <div slot="tip"></div>
        </veui-slider>
        <veui-slider v-model="value1" disabled ui="tiny">
          <span slot="tip-label">{{ value1.toFixed(2) }}</span>
        </veui-slider>
        <div class="desc">Range: 0~1, Value: {{ value1 }}</div>
    </section>

    <section>
        <veui-slider ui="micro" v-model="value2" :min="0" :max="100" :step="8" mark>
          <span slot="tip-label">{{ value2 }}%</span>
        </veui-slider>
        <div class="desc">Range: 0~100, Step: 8, Value: {{ value2 }}</div>
    </section>

    <section>
        <veui-slider v-model="value3" :min="0" :max="360" :step="1" :parser="parseColorHue" :formatter="formatColorHue">
          <div slot="track" style="width: 100%; height: 20px;
            background: linear-gradient(to right, hsl(0, 100%, 50%) 0%, hsl(60, 100%, 50%) 16.67%, hsl(120, 100%, 50%) 33.33%, hsl(180, 100%, 50%) 50%, hsl(240, 100%, 50%) 66.67%, hsl(300, 100%, 50%) 83.33%, hsl(360, 100%, 50%) 100%)"></div>
          <div slot="thumb" style="margin-top: 6px">
            <div style="width: 16px; height: 12px">
              <svg width="16" height="12" viewBox="0 0 16 12">
                <polygon points="8,0 16,12 0,12"/>
              </svg>
            </div>
          </div>
          <template slot="tip" slot-scope="{ open }">
            <div v-show="open" class="custom-tip" :style="{
              left: `${parseColorHue(value3) / 360 * 100}%`,
              backgroundColor: value3
            }"></div>
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
      value2: 333,
      value3: 'hsl(10, 100%, 100%)'
    }
  },
  methods: {
    parseColorHue (val) {
      return parseInt(val.substring(val.indexOf('(') + 1, val.indexOf(',')), 10)
    },
    formatColorHue (val) {
      return `hsl(${val}, 100%, 50%)`
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
  margin: 10px 0;
  background: repeating-linear-gradient(135deg, #fff 0px, #fff 10px, #f7f7f7 11px, #f7f7f7 12px, #fff 13px, #fff 14px);
}

.desc {
  margin-top: 1em;
}

.custom-tip {
  position: absolute;
  top: -24px;
  width: 24px;
  height: 24px;
  margin-left: -12px;
  text-align: center;
  border: 1px solid #fff;
  font-size: 12px;
}
</style>
