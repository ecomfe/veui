<template>
  <article>
    <h1><code>&lt;veui-slider&gt;</code></h1>

    <section>
        <veui-slider v-model="value1"></veui-slider>
        <veui-slider v-model="value1" readonly ui="small">
          <div slot="tip" style="position: absolute">&#8203;</div>
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
        <veui-slider ui="micro" disabled v-model="value2" :min="0" :max="100" :step="8" mark></veui-slider>
        <div class="desc">Range: 0~100, Step: 8, Value: {{ value2 }}</div>
    </section>

    <section>
        <veui-slider v-model="value4" :min="0" :max="100"></veui-slider>
        <div class="desc">Range: 0~100, Value: {{ value4 }}</div>
    </section>

    <section>
        <veui-slider v-model="value3" :min="0" :max="360" :step="1" :parse="parseColorHue" :format="formatColorHue">
          <div slot="track" style="width: 100%; height: 20px;" :style="{background: colorGradient}"></div>
          <div slot="thumb" style="margin-top: 6px" slot-scope="{ index }" :key="`thumb_${index}`">
            <div style="width: 16px; height: 12px">
              <svg width="16" height="12" viewBox="0 0 16 12">
                <polygon points="8,0 16,12 0,12"/>
              </svg>
            </div>
          </div>
          <template slot="tip" slot-scope="{ open, activeIndex }">
            <div v-show="open" class="custom-tip" :style="{
              left: `${(activeIndex >= 0 ? parseColorHue(value3[activeIndex]) : 0) / 360 * 100}%`,
              backgroundColor: value3[activeIndex]
            }"></div>
          </template>
        </veui-slider>
        <div class="desc">Range: 0~255, Step: 1, Value: <br> [
          <span v-for="(val, index) in value3" :key="`colorValue${index}`">
            "<span :style="{ color: val }">{{ val }}</span>"
            <span v-if="index < value3.length - 1">,</span>
          </span>
        ]</div>
    </section>

    <section class="video">
        <div class="play-button">▶️</div>
        <veui-slider v-model="videoPlayProgress" :secondary-progress="videoBufferProgress" ui="micro">
          <span slot="tip-label">{{ Math.round(videoPlayProgress * 100) }}%</span>
        </veui-slider>
        <div class="duration">
          <span>{{ formatDuration(videoDuration * videoPlayProgress) }}</span> /
          <span>{{ formatDuration(videoDuration * videoBufferProgress) }}</span> /
          <span>{{ formatDuration(videoDuration) }}</span>
        </div>
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
      value3: (new Array(5)).fill(1).map((_, i) => `hsl(${(i + 1) * 60}, 100%, 50%)`),
      value4: [22, 66],

      videoPlayProgress: 0.11,
      videoBufferProgress: 0.57,
      videoDuration: 200
    }
  },
  computed: {
    colorGradient () {
      let colors = (new Array(7)).fill(1).map(function (_, index) {
        return `hsl(${60 * index}, 100%, 50%) ${100 / 6 * index}%`
      })
      return `linear-gradient(to right, ${colors.join(',')})`
    }
  },
  methods: {
    parseColorHue (val) {
      return parseInt(val.substring(val.indexOf('(') + 1, val.indexOf(',')), 10)
    },
    formatColorHue (val) {
      return `hsl(${val}, 100%, 50%)`
    },
    formatDuration (sec) {
      sec = Math.round(sec)
      return `${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`
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

.video {
  display: flex;
  align-items: center;
  .play-button {
    margin-right: 1em;
  }
  .duration {
    flex: 1 0 150px;
    text-align: right;
  }
}
</style>
