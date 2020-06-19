<template>
<article>
  <h1><code>&lt;veui-checkbox&gt;</code></h1>
  <section>
    <veui-checkbox>未绑定数据</veui-checkbox>
  </section>
  <section>
    <veui-checkbox :checked="false">
      受控checked：永远为false
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox :checked="true">
      受控checked：永远为true
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="current"
      true-value="已选"
      false-value="未选"
    >
      当前数据：
    </veui-checkbox>
    {{ current }}
  </section>
  <section>
    <veui-checkbox v-model="checked1">
      正常状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="checked2"
      ui="s"
    >
      正常状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox v-model="checked3">
      选中状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="checked4"
      ui="s"
    >
      选中状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="checked5"
      :indeterminate="indeterminate5"
      @change="indeterminate5 = false"
    >
      部分选中状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="checked6"
      ui="s"
      :indeterminate="indeterminate6"
      @change="indeterminate6 = false"
    >
      部分选中状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="checked7"
      disabled
    >
      选中无效状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="checked8"
      ui="s"
      disabled
    >
      选中无效状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="checked9"
      disabled
    >
      未选无效状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="checked10"
      ui="s"
      disabled
    >
      未选无效状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="checked11"
      disabled
      indeterminate
    >
      部分选中无效状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="checked12"
      ui="s"
      disabled
      indeterminate
    >
      部分选中无效状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      :checked="checked13"
      @change="checked13 = $event"
    >
      外部控制 <code>checked</code>
    </veui-checkbox>
    <veui-button
      ui="tiny"
      @click="checked13 = !checked13"
    >
      Toggle
    </veui-button>
  </section>
  <section>
    <veui-checkbox :checked.sync="checked14">
      <code>:checked.sync</code> 绑定状态：{{ checked14 }}
    </veui-checkbox>
    <veui-button
      ui="tiny"
      @click="checked14 = !checked14"
    >
      Toggle
    </veui-button>
  </section>
  <section>
    <h4>复选框组</h4>
    <p>
      <veui-checkbox
        :checked="group.length > 0"
        :indeterminate="group.length > 0 && group.length < 3"
        @change="group.length ? (group = []) : (group = ['A', 'B', 'C'])"
      >
        全部
      </veui-checkbox>
    </p>
    <p>
      <veui-checkbox
        v-model="group"
        value="A"
      >
        A
      </veui-checkbox>
      <veui-checkbox
        v-model="group"
        value="B"
      >
        B
      </veui-checkbox>
      <veui-checkbox
        v-model="group"
        value="C"
      >
        C
      </veui-checkbox>
    </p>
    <p>{{ group }}</p>
  </section>
</article>
</template>

<script>
import { Checkbox, Button } from 'veui'

export default {
  name: 'checkbox-demo',
  components: {
    'veui-checkbox': Checkbox,
    'veui-button': Button
  },
  data () {
    return {
      current: '已选',
      checked1: false,
      checked2: false,
      checked3: true,
      checked4: true,
      checked5: true,
      indeterminate5: true,
      checked6: false,
      indeterminate6: true,
      checked7: true,
      checked8: true,
      checked9: false,
      checked10: false,
      checked11: false,
      checked12: false,
      checked13: true,
      checked14: false,
      group: []
    }
  }
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 1em;
}

.veui-checkbox + .veui-button,
.veui-checkbox + .veui-checkbox {
  margin-left: 20px;
}
</style>
