<template>
<article>
  <h1>
    <code>&lt;veui-collapse&gt;</code> &amp;
    <code>&lt;veui-accordion&gt;</code>
  </h1>

  <h2>Collapse</h2>

  <section>
    <h3>本地状态</h3>
    <veui-collapse label="点击切换">
      Content
    </veui-collapse>
  </section>

  <section>
    <h3>.sync</h3>
    <veui-checkbox v-model="expanded">展开</veui-checkbox>
    <veui-collapse
      :expanded.sync="expanded"
      label="点击切换"
    >
      Content
    </veui-collapse>
  </section>

  <section>
    <h3>受控</h3>
    <veui-checkbox v-model="expanded2">展开</veui-checkbox>
    <veui-collapse
      :expanded="expanded2"
      label="点击切换"
      @toggle="toggle2"
    >
      Content
    </veui-collapse>
  </section>

  <section>
    <h3>禁用</h3>
    <veui-collapse
      disabled
      label="点击切换"
    >
      Content
    </veui-collapse>
  </section>

  <h2>Accordion</h2>

  <section>
    <h3>本地状态</h3>
    <veui-accordion>
      <veui-collapse label="标题一">
        Content
      </veui-collapse>
      <veui-collapse label="标题二">
        Content
      </veui-collapse>
      <veui-collapse
        label="标题三"
        disabled
      >
        Content
      </veui-collapse>
    </veui-accordion>
  </section>

  <section>
    <h3>.sync & multiple</h3>
    <veui-checkbox-group
      v-model="expanded3"
      :items="items"
    />
    <veui-accordion
      multiple
      :expanded.sync="expanded3"
    >
      <veui-collapse
        label="标题一"
        name="1"
      >
        Content
      </veui-collapse>
      <veui-collapse
        label="标题二"
        name="2"
      >
        Content
      </veui-collapse>
      <veui-collapse
        label="标题三"
        name="3"
      >
        Content
      </veui-collapse>
    </veui-accordion>
    <p>{{ expanded3 }}</p>
  </section>

  <section>
    <h3>受控</h3>
    <veui-accordion
      :expanded="expanded4"
      @toggle="toggle4"
    >
      <veui-collapse
        label="标题一"
        name="1"
      >
        Content
      </veui-collapse>
      <veui-collapse
        label="标题二"
        name="2"
      >
        Content
      </veui-collapse>
      <veui-collapse
        label="标题三"
        name="3"
      >
        Content
      </veui-collapse>
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
              <veui-collapse label="标题一">
                Content
              </veui-collapse>
              <veui-collapse label="标题二">
                Content
              </veui-collapse>
              <veui-collapse label="标题三">
                Content
              </veui-collapse>
            </veui-accordion>
          </veui-collapse>
          <veui-collapse label="标题二">
            Content
          </veui-collapse>
          <veui-collapse label="标题三">
            Content
          </veui-collapse>
        </veui-accordion>
      </veui-collapse>
      <veui-collapse
        label="标题二"
        disabled
      >
        Content
      </veui-collapse>
      <veui-collapse label="标题三">
        Content
      </veui-collapse>
    </veui-accordion>
  </section>
</article>
</template>

<script>
import Vue from 'vue'
import { Checkbox, CheckboxGroup, Collapse, Accordion } from 'veui'
import confirm from 'veui/plugins/confirm'

Vue.use(confirm)

export default {
  name: 'collapse-demo',
  components: {
    'veui-checkbox': Checkbox,
    'veui-checkbox-group': CheckboxGroup,
    'veui-collapse': Collapse,
    'veui-accordion': Accordion
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
      ]
    }
  },
  methods: {
    toggle2 (val) {
      if (!val) {
        this.expanded2 = val
        return
      }
      this.$confirm('要展开吗？').then(confirmed => {
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
      this.$confirm('要展开吗？').then(confirmed => {
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
</style>
