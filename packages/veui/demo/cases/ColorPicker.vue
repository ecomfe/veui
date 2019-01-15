<template>
  <article>
    <h1><code>&lt;veui-color-picker&gt;</code></h1>

    <div class="tip">当前颜色</div>
    <div class="color-text" :style="{
      color,
      'text-shadow': `1px 1px 1px ${kolor}`
    }">{{ color }}</div>

    <h2>色样</h2>
    <section class="color-swatches">
      <div class="color-swatche">
        <div class="tip">HEX <small>不带透明度</small></div>
        <veui-color-swatch v-model="color" ui="small hex"></veui-color-swatch>
      </div>
      <div class="color-swatche">
        <div class="tip">HEX</div>
        <veui-color-swatch v-model="color" ui="hex small alpha"></veui-color-swatch>
      </div>
      <div class="color-swatche">
        <div class="tip">HSL</div>
        <veui-color-swatch :color.sync="color" ui="alpha normal hsl"></veui-color-swatch>
      </div>
      <div class="color-swatche">
        <div class="tip">RGB <small>不能修改</small></div>
        <veui-color-swatch :color="color" ui="normal rgb alpha" :readonly="true"></veui-color-swatch>
      </div>
    </section>


    <h2>取色器</h2>
    <p>
      <label>
        <input type="checkbox" v-model="showPalette" /> 附加色板？
      </label>
    </p>

    <section class="color-pickers">
      <section class="color-picker">
        <div class="tip">标准版</div>
        <!-- v-model="color" OR :color.sync OR @update:color="val => color = val" -->
        <veui-color-picker v-model="color">
          <veui-color-palette :colors="colors" ui="small" v-if="showPalette"
            @select="handlePaletteColorSelect"
            @remove="handlePaletteColorRemove"
            @add="handlePaletteColorAdd"
          ></veui-color-palette>
        </veui-color-picker>
      </section>

      <section class="color-picker">
        <div class="tip">复杂版</div>
        <veui-color-picker v-model="color" ui="large">
          <veui-color-palette :colors="colors" v-if="showPalette"
            @select="handlePaletteColorSelect"
            @remove="handlePaletteColorRemove"
            @add="handlePaletteColorAdd"
          ></veui-color-palette>
        </veui-color-picker>
      </section>

      <section class="color-picker">
        <div class="tip">简单版</div>
        <veui-color-picker v-model="color" ui="small">
          <!-- 色板作为 slot 传入 -->
          <veui-color-palette :colors="colors" v-if="showPalette"
            @select="handlePaletteColorSelect"
            @remove="handlePaletteColorRemove"
            @add="handlePaletteColorAdd"
          >
            <div style="margin: 10px 5px 5px 5px;">
              <veui-button ui="aux small" style="width: 100%">高级选项</veui-button>
            </div>
          </veui-color-palette>
        </veui-color-picker>
      </section>

    </section>

  </article>
</template>

<script>
import bus from '../bus'
import tinycolor from 'tinycolor2'
import { ColorSwatch, ColorPicker, ColorPalette, Button } from 'veui'
export default {
  name: 'color-picker-demo',
  components: {
    'veui-button': Button,
    'veui-color-swatch': ColorSwatch,
    'veui-color-picker': ColorPicker,
    'veui-color-palette': ColorPalette
  },
  data () {
    return {
      showPalette: true,
      color: 'hsla(123, 54%, 43%, 0.9)',
      colors: [
        '#D0021B',
        '#F5A623',
        '#F8E71C',
        '#8B572A',
        '#7ED322',
        '#417505',
        '#BD10E0',
        '#9014FE',
        '#4A90E2',
        '#50E3C2',
        '#B8E986'
      ]
    }
  },
  computed: {
    kolor () {
      let {r, g, b, a} = tinycolor(this.color).toRgb()
      return tinycolor({
        r: 0xFF - r,
        g: 0xFF - g,
        b: 0xFF - b,
        a: a
      }).toRgbString()
    }
  },
  methods: {
    handlePaletteColorSelect (i) {
      this.color = this.colors[i]
    },
    handlePaletteColorRemove (i) {
      this.colors.splice(i, 1)
    },
    handlePaletteColorAdd () {
      if (tinycolor.equals(this.color, this.colors[this.colors.length - 1])) {
        return
      }
      this.colors.push(this.color)
    }
  },
  mounted () {
    this.$children.forEach(child => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
  }
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 3em;
}
.color-text {
  font-family: monospace;
  font-size: 1.4em;
}
.color-swatche {
  width: 340px;
}
.tip {
  margin: 12px 0 2px 0;
  color: #fff;
  font-weight: 100;
  text-shadow: 1px 1px 1px #333, 0 0 1px #999;
  small {
    &:before {
      content: '('
    }
    &:after {
      content: ')'
    }
  }
}
.color-pickers {
  display: flex;
  flex-wrap: wrap;
  jusitify-content: space-between;
}
.color-picker {
  margin: 0 3em 3em 0;
}
</style>
