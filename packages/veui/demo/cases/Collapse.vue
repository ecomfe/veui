<template>
<article>
  <h1>
    <code>&lt;veui-collapse&gt;</code> &amp;
    <code>&lt;veui-accordion&gt;</code>
  </h1>

  <h2>Collapse</h2>

  <section>
    <h3>本地状态</h3>
    <veui-collapse label="点击切换">Content</veui-collapse>
  </section>

  <section>
    <h3>.sync</h3>
    <p class="control-wrap">
      <veui-checkbox v-model="expanded">展开</veui-checkbox>
      <veui-radio-button-group
        v-model="position"
        class="control-item"
        ui="s"
        :items="positions"
      />
      <veui-radio-button-group
        v-model="variant"
        ui="s"
        class="control-item"
        :items="variants"
      />
      <veui-radio-button-group
        v-model="bordered"
        ui="s"
        class="control-item"
        :items="[
          { label: 'default', value: '' },
          { label: 'bordered', value: 'bordered' },
          { label: 'borderless', value: 'borderless' }
        ]"
      />
      <veui-check-button-group
        v-model="dull"
        ui="s"
        class="control-item"
        :items="[{ label: 'dull', value: 'dull' }]"
      />
    </p>
    <veui-collapse
      :expanded.sync="expanded"
      :toggle-position="position"
      :ui="realVariants"
      label="点击切换"
    >
      故事烂俗却没讲完...
      <template #title-after>title-after</template>
    </veui-collapse>
  </section>

  <section>
    <h3>受控 & 小号</h3>
    <veui-checkbox v-model="expanded2">展开</veui-checkbox>
    <veui-collapse
      ui="s"
      :expanded="expanded2"
      label="点击切换"
      @toggle="toggle2"
    >Content</veui-collapse>
  </section>

  <section>
    <h3>禁用</h3>
    <veui-collapse disabled label="点击切换">Content</veui-collapse>
  </section>

  <h2>Accordion</h2>

  <section>
    <h3>本地状态</h3>
    <p class="control-wrap">
      <veui-checkbox v-model="Separate" ui="s">Separate</veui-checkbox>
      <veui-number-input
        v-if="Separate"
        v-model="gutter"
        class="control-item"
        :min="0"
        :max="32"
        ui="s"
      />
    </p>
    <veui-accordion
      :style="{
        '--dls-accordion-gutter': `${gutter}px`
      }"
      :ui="`${realVariants} ${Separate ? 'separate' : ''}`.trim()"
      :toggle-position="position"
    >
      <veui-collapse label="标题一">Content</veui-collapse>
      <veui-collapse label="标题二">Content</veui-collapse>
      <veui-collapse label="标题三" disabled>Content</veui-collapse>
    </veui-accordion>
  </section>

  <section>
    <h3>.sync & multiple</h3>
    <veui-checkbox-group v-model="expanded3" :items="items"/>
    <veui-accordion multiple :expanded.sync="expanded3">
      <veui-collapse label="标题一" name="1">Content</veui-collapse>
      <veui-collapse label="标题二" name="2">Content</veui-collapse>
      <veui-collapse label="标题三" name="3">Content</veui-collapse>
    </veui-accordion>
    <p>{{ expanded3 }}</p>
  </section>

  <section>
    <h3>受控</h3>
    <veui-accordion :expanded="expanded4" @toggle="toggle4">
      <veui-collapse label="标题一" name="1">Content</veui-collapse>
      <veui-collapse label="标题二" name="2">Content</veui-collapse>
      <veui-collapse label="标题三" name="3">Content</veui-collapse>
    </veui-accordion>
    <p>{{ expanded4 }}</p>
  </section>

  <section>
    <h3>嵌套</h3>
    <veui-accordion>
      <veui-collapse label="标题一">
        <veui-accordion>
          <veui-collapse label="标题一">
            <veui-accordion>
              <veui-collapse label="标题一">Content</veui-collapse>
              <veui-collapse label="标题二">Content</veui-collapse>
              <veui-collapse label="标题三">Content</veui-collapse>
            </veui-accordion>
          </veui-collapse>
          <veui-collapse label="标题二">Content</veui-collapse>
          <veui-collapse label="标题三">Content</veui-collapse>
        </veui-accordion>
      </veui-collapse>
      <veui-collapse label="标题二" disabled>Content</veui-collapse>
      <veui-collapse label="标题三">Content</veui-collapse>
    </veui-accordion>
  </section>
</article>
</template>

<script>
import Vue from 'vue'
import {
  Checkbox,
  CheckboxGroup,
  RadioButtonGroup,
  CheckButtonGroup,
  Collapse,
  Accordion,
  NumberInput
} from 'veui'
import confirm from 'veui/plugins/confirm'

Vue.use(confirm)

export default {
  name: 'collapse-demo',
  components: {
    'veui-checkbox': Checkbox,
    'veui-checkbox-group': CheckboxGroup,
    'veui-radio-button-group': RadioButtonGroup,
    'veui-check-button-group': CheckButtonGroup,
    'veui-collapse': Collapse,
    'veui-accordion': Accordion,
    'veui-number-input': NumberInput
  },
  data () {
    return {
      expanded: false,
      expanded2: false,
      expanded3: [],
      expanded4: '3',
      items: [
        { label: '一', value: '1' },
        { label: '二', value: '2' },
        { label: '三', value: '3' }
      ],
      position: 'start',
      positions: [
        { label: 'start', value: 'start' },
        { label: 'end', value: 'end' },
        { label: 'none', value: 'none' }
      ],
      variants: [
        { label: '默认', value: 'normal' },
        { label: '简洁', value: 'simple' },
        { label: '白底', value: 'basic' },
        { label: '灰底', value: 'strong' }
      ],
      variants2: [
        { label: 'bordered', value: 'bordered' },
        { label: 'dull', value: 'dull' }
      ],
      variant: 'normal',
      bordered: '',
      dull: null,
      Separate: false,
      gutter: 16
    }
  },
  computed: {
    realVariants () {
      return [this.variant, this.bordered || '', this.dull || '']
        .join(' ')
        .trim()
    }
  },
  methods: {
    toggle2 (val) {
      if (!val) {
        this.expanded2 = val
        return
      }
      this.$confirm('要展开吗？').then((confirmed) => {
        if (confirmed) {
          this.expanded2 = val
        }
      })
    },
    toggle4 (val, name, expanded) {
      if (!val) {
        this.expanded4 = expanded
        return
      }
      this.$confirm('要展开吗？').then((confirmed) => {
        if (confirmed) {
          this.expanded4 = expanded
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 10px;
}

.control-wrap {
  display: flex;
  align-items: center;

  .control-item {
    margin-left: 12px;
  }
}
</style>
