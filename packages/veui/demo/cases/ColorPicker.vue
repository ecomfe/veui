<template>
<article>
  <h1>
    <code>&lt;veui-color-picker&gt;</code>
  </h1>

  <div class="tip">
    当前颜色
  </div>
  <div
    class="color-text"
    :style="{
      color,
      'text-shadow': `1px 1px 1px ${kolor}`
    }"
  >
    {{ color }}
  </div>

  <div class="color-control">
    <label>
      Variant
      <select v-model="variant">
        <option
          v-for="item in variants"
          :key="item"
          :value="item"
        >
          {{ item }}
        </option>
      </select>
    </label>

    <label>
      <input
        v-model="alpha"
        type="checkbox"
      >
      alpha channel
    </label>

    <label>
      <input
        v-model="switchable"
        type="checkbox"
      >
      switchable
    </label>
  </div>

  <h2>色样</h2>
  <section class="color-swatches">
    <veui-color-swatch
      v-model="color"
      ui="small"
      v-bind="{variant, alpha, switchable}"
    />
    <veui-color-swatch
      v-model="color"
      ui="small tip"
      v-bind="{variant, alpha, switchable}"
    />
    <veui-color-swatch
      v-model="color"
      v-bind="{variant, alpha, switchable}"
    />
    <veui-color-swatch
      v-model="color"
      ui="tip"
      v-bind="{variant, alpha, switchable}"
    />
    <veui-color-swatch
      :color="color"
      ui="normal tip"
      :readonly="true"
      v-bind="{variant, alpha, switchable}"
    />
  </section>

  <h2>取色器</h2>
  <p>
    <label>
      <input
        v-model="showPalette"
        type="checkbox"
      >
      附加色板？
    </label>
  </p>

  <section class="color-pickers">
    <section class="color-picker">
      <p>
        <code>ui="small"</code>
      </p>
      <veui-color-picker
        v-model="color"
        ui="small"
        v-bind="{variant, alpha, switchable}"
      >
        <!-- 色板作为 slot 传入 -->
        <veui-color-palette
          v-if="showPalette"
          ui="small"
          :colors="colors"
          @select="handlePaletteColorSelect"
          @remove="handlePaletteColorRemove"
          @add="handlePaletteColorAdd"
        />
      </veui-color-picker>
    </section>

    <section class="color-picker">
      <p>
        <code>ui="swatch tip"</code>
      </p>
      <veui-color-picker
        v-model="color"
        ui="swatch tip"
        v-bind="{variant, alpha, switchable}"
      >
        <!-- 色板作为 slot 传入 -->
        <veui-color-palette
          v-if="showPalette"
          :colors="colors"
          @select="handlePaletteColorSelect"
          @remove="handlePaletteColorRemove"
          @add="handlePaletteColorAdd"
        >
          <div style="margin: 10px 5px 5px 5px;">
            <veui-button
              ui="aux small"
              style="width: 100%"
            >
              高级选项
            </veui-button>
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

const variants = ['hex', 'rgb', 'hsl']

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
      variant: variants[0],
      variants,
      alpha: true,
      switchable: true,

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
      let { r, g, b, a } = tinycolor(this.color).toRgb()
      return tinycolor({
        r: 0xff - r,
        g: 0xff - g,
        b: 0xff - b,
        a: a
      }).toRgbString()
    }
  },
  mounted () {
    this.$children.forEach(child => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
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
.tip {
  margin: 12px 0 2px 0;
  color: #333;
  // font-weight: 100;
  // text-shadow: 1px 1px 1px #333, 0 0 1px #999;
  small {
    &:before {
      content: '(';
    }
    &:after {
      content: ')';
    }
  }
}

.color-control {
  position: fixed;
  right: 30px;
  top: 70px;
  margin: 1.2em 0;

  label {
    margin-right: 2em;
  }
}

.veui-color-swatch {
  margin: 1.2em 0;
}

.color-pickers {
  display: flex;
  flex-wrap: wrap;
}
.color-picker {
  margin: 0 3em 3em 0;
}
</style>
