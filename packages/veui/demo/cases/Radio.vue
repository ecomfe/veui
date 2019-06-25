<template>
<article>
  <h1><code>&lt;veui-radio&gt;</code></h1>
  <section>
    <h3><code>v-model</code></h3>
    <p>
      <veui-button
        ui="s"
        @click="size = size === 'm' ? 's' : 'm'"
      >
        Toggle
      </veui-button>
    </p>
    <p>
      <veui-radio
        v-model="size"
        value="m"
        name="size"
      >
        正常状态
      </veui-radio>
      <veui-radio
        v-model="size"
        value="s"
        checked
        ui="s"
        name="size"
      >
        正常状态（小）
      </veui-radio>
    </p>
    <p>Size: {{ size }}</p>
  </section>
  <section>
    <h3><code>:checked.sync</code></h3>
    <p>
      <veui-button
        ui="s"
        @click="checked = !checked"
      >
        Toggle
      </veui-button>
    </p>
    <p>
      <veui-radio :checked.sync="checked">
        绑定状态：{{ checked }}
      </veui-radio>
    </p>
  </section>
  <section>
    <veui-radio
      ui="s"
      checked
    >
      选中状态
    </veui-radio>
  </section>
  <section>
    <veui-radio
      checked
      disabled
    >
      选中禁用状态
    </veui-radio>
  </section>
  <section>
    <veui-radio
      ui="s"
      checked
      disabled
    >
      选中禁用状态
    </veui-radio>
  </section>
  <section>
    <veui-radio disabled>
      未选禁用状态
    </veui-radio>
  </section>
  <section>
    <veui-radio
      ui="s"
      disabled
    >
      未选禁用状态
    </veui-radio>
  </section>
  <section>
    <h3>单选组</h3>
    <p>
      <veui-radio
        v-model="group"
        name="group"
        value="A"
      >
        A
      </veui-radio>
      <veui-radio
        v-model="group"
        name="group"
        value="B"
      >
        B
      </veui-radio>
      <veui-radio
        v-model="group"
        name="group"
        value="C"
      >
        C
      </veui-radio>
    </p>
    <p>{{ group }}</p>
  </section>
</article>
</template>

<script>
import { Radio, Button } from 'veui'

export default {
  name: 'radio-demo',
  components: {
    'veui-radio': Radio,
    'veui-button': Button
  },
  data () {
    return {
      size: null,
      checked: false,
      group: null
    }
  }
}
</script>

<style lang="less" scoped>
.veui-radio {
  margin-right: 10px;
}

section {
  margin-bottom: 60px;
}
</style>
