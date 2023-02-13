<template>
<article>
  <h1>
    <code>&lt;veui-stack&gt;</code>
  </h1>
  <section>
    <veui-stack gap="xs" align="center">
      <span class="label">Gap</span>
      <veui-radio-button-group
        v-model="gap"
        ui="s"
        :items="spacings"
        :disabled="numeric"
      />
      <veui-checkbox v-model="numeric" ui="s">Numeric</veui-checkbox>
      <veui-slider
        v-model="gapNumeric"
        ui="s"
        :disabled="!numeric"
        :min="0"
        :max="60"
        :step="1"
        style="width: 200px"
      />
    </veui-stack>
  </section>
  <section>
    <veui-stack gap="s" align="center">
      <veui-stack gap="xs">
        <span class="label">Direction</span>
        <veui-radio-button-group
          v-model="direction"
          ui="s"
          :items="directions"
        />
      </veui-stack>
      <veui-checkbox v-model="wrap" ui="s">↩</veui-checkbox>
      <veui-checkbox v-model="outline" ui="s">Outline</veui-checkbox>
      <veui-checkbox v-model="inline" ui="s">Inline</veui-checkbox>
      <veui-checkbox v-model="outerFlex" ui="s">Inside flex</veui-checkbox>
    </veui-stack>
  </section>
  <section>
    <veui-stack gap="s" align="center">
      <veui-stack gap="xs">
        <span class="label">Align</span>
        <veui-radio-button-group v-model="align" ui="s" :items="alignments"/>
      </veui-stack>
      <veui-stack gap="xs">
        <span class="label">Justify</span>
        <veui-radio-button-group
          v-model="justify"
          ui="s"
          :items="justifications"
        />
      </veui-stack>
    </veui-stack>
  </section>
  <section :class="sectionClass">
    <veui-stack
      :class="stackClass"
      :gap="realGap"
      :direction="direction"
      :wrap="wrap"
      :inline="inline"
      :align="align"
      :justify="justify"
    >
      <veui-badge type="success" value="审核中"/>
      <veui-badge type="info" value="审核中"/>
      <veui-badge value="审核中"/>
      <veui-badge type="warning" value="审核中"/>
      <veui-badge type="aux" value="审核中"/>
    </veui-stack>
  </section>
  <section :class="sectionClass">
    <veui-stack
      :class="stackClass"
      :gap="realGap"
      :direction="direction"
      :wrap="wrap"
      :inline="inline"
      :align="align"
      :justify="justify"
    >
      <veui-badge type="success" value="审核中"/>
      <veui-input class="input" ui="m"/>
      <veui-button>OK</veui-button>
      <veui-message>Please write something.</veui-message>
    </veui-stack>
  </section>
  <section :class="sectionClass">
    <veui-stack
      :class="stackClass"
      :gap="realGap"
      :direction="direction"
      :wrap="wrap"
      :inline="inline"
      :align="align"
      :justify="justify"
    >
      <veui-input class="input" ui="xs"/>
      <veui-input class="input" ui="s"/>
      <veui-input class="input" ui="m"/>
      <veui-input class="input" ui="l"/>
    </veui-stack>
  </section>
  <section :class="sectionClass">
    <veui-stack
      :class="stackClass"
      :gap="realGap"
      :direction="direction"
      :wrap="wrap"
      :inline="inline"
      :align="align"
      :justify="justify"
    >
      <div
        v-for="(s, i) of boxSizes"
        :key="`r${i}`"
        class="resizable"
        :style="s"
      />
    </veui-stack>
  </section>
  <section>
    <veui-stack gap="xxl">
      <veui-stack class="stack" align="start">
        <div class="item"/>
        <div class="item"/>
        <div class="item"/>
      </veui-stack>
      <veui-stack class="stack" align="center">
        <div class="item"/>
        <div class="item"/>
        <div class="item"/>
      </veui-stack>
      <veui-stack class="stack" align="end">
        <div class="item"/>
        <div class="item"/>
        <div class="item"/>
      </veui-stack>
      <veui-stack class="stack" align="stretch">
        <div class="item"/>
        <div class="item"/>
        <div class="item"/>
      </veui-stack>
    </veui-stack>
  </section>
</article>
</template>

<script>
import {
  Stack,
  Badge,
  RadioButtonGroup,
  Input,
  Checkbox,
  Message,
  Button,
  Slider
} from 'veui'

export default {
  name: 'stack-demo',
  components: {
    'veui-stack': Stack,
    'veui-badge': Badge,
    'veui-radio-button-group': RadioButtonGroup,
    'veui-input': Input,
    'veui-checkbox': Checkbox,
    'veui-message': Message,
    'veui-button': Button,
    'veui-slider': Slider
  },
  data () {
    return {
      spacings: [
        { label: '0', value: null },
        { label: 'XXS', value: 'xxs' },
        { label: 'XS', value: 'xs' },
        { label: 'S', value: 's' },
        { label: 'M', value: 'm' },
        { label: 'L', value: 'l' },
        { label: 'XL', value: 'xl' },
        { label: 'XXL', value: 'xxl' }
      ],
      directions: [
        { label: '→', value: 'row' },
        { label: '↓', value: 'column' }
      ],
      alignments: [
        { label: '/', value: null },
        { label: 'start', value: 'start' },
        { label: 'center', value: 'center' },
        { label: 'end', value: 'end' },
        { label: 'stretch', value: 'stretch' }
      ],
      justifications: [
        { label: '/', value: null },
        { label: 'start', value: 'start' },
        { label: 'center', value: 'center' },
        { label: 'end', value: 'end' },
        { label: 'space-between', value: 'space-between' }
      ],
      gap: null,
      direction: 'row',
      wrap: false,
      inline: false,
      outerFlex: false,
      align: null,
      justify: null,
      outline: true,
      boxSizes: Array.from({ length: 6 }).map(() => this.getSize()),
      numeric: false,
      gapNumeric: 0
    }
  },
  computed: {
    stackClass () {
      return {
        outline: this.outline
      }
    },
    sectionClass () {
      return {
        section: true,
        fixed: this.wrap,
        [this.direction]: true,
        flex: this.outerFlex
      }
    },
    realGap () {
      return this.numeric ? this.gapNumeric : this.gap
    }
  },
  methods: {
    getSize () {
      return {
        width: `${random(48, 96)}px`,
        height: `${random(48, 96)}px`
      }
    }
  }
}

function random (from, to) {
  return from + Math.round(Math.random() * (to - from))
}
</script>

<style scoped>
section {
  margin-bottom: 40px;
}

.label {
  font-size: 12px;
}

.outline {
  outline: 1px dotted #ababab;
}

.flex {
  display: flex;
  align-items: center;
}

.fixed.row {
  width: 240px;
}

.fixed.column {
  height: 80px;
}

.fixed.column .veui-stack {
  height: 100%;
}

.input {
  width: 120px;
}

.resizable {
  width: 64px;
  height: 64px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background-color: gold;
  resize: both;
  overflow: hidden;
}

.item {
  width: 40px;
  place-items: center;
  background-color: gold;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.item:nth-child(1) {
  min-height: 40px;
}

.item:nth-child(2) {
  min-height: 80px;
}

.item:nth-child(3) {
  min-height: 60px;
}
</style>
