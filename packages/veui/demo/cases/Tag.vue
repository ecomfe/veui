<template>
<article>
  <h1><code>&lt;veui-tag&gt;</code></h1>
  <section>
    <veui-checkbox v-model="bordered">带边框样式</veui-checkbox>
  </section>
  <section>
    <h2>不同尺寸</h2>
    <div>
      <veui-tag
        v-for="size in sizes"
        :key="size"
        :ui="size + (bordered ? ' bordered' : '')"
      >
        {{ size }}
      </veui-tag>
    </div>
  </section>

  <section>
    <h2>不同样式</h2>
    <div>
      <veui-tag
        v-for="type in types"
        :key="type"
        :type="type"
        :ui="bordered ? 'bordered' : ''"
      >
        {{ type }}
      </veui-tag>
    </div>
  </section>

  <section>
    <h2>可移除标签</h2>
    <div>
      <veui-tag
        v-for="(team, index) in teams2"
        :key="team"
        :type="types[index]"
        :ui="bordered ? 'bordered' : ''"
        removable
        @remove="handleRemove(team)"
      >
        {{ team }}
      </veui-tag>
    </div>
  </section>

  <section>
    <h2>可移除标签（小）</h2>
    <div>
      <veui-tag
        v-for="(team, index) in teams"
        :key="team"
        :type="types[index]"
        removable
        :ui="'s' + (bordered ? ' bordered' : '')"
        @remove="handleRemove(team)"
      >
        {{ team }}
      </veui-tag>
    </div>
  </section>

  <section>
    <h2>可移除标签（受控）</h2>
    <div>
      <veui-tag
        :ui="bordered ? 'bordered' : ''"
        removable
        :removed="controlledRemoved"
        @remove="handleControlledRemove"
      >
        受控可移除标签
      </veui-tag>
    </div>
  </section>

  <section>
    <h2>选择性标签</h2>
    <div>
      <veui-tag
        v-for="type in types"
        :key="type"
        :type="type"
        :selected.sync="selected"
        :ui="bordered ? 'bordered' : ''"
        selectable
      >
        {{ type }}
      </veui-tag>
    </div>
  </section>

  <section>
    <h2>禁用标签</h2>
    <div>
      <veui-tag
        v-for="type in types"
        :key="type"
        :type="type"
        :selected.sync="selected"
        :ui="bordered ? 'bordered' : ''"
        disabled
        selectable
      >
        {{ type }}
      </veui-tag>
    </div>
    <div style="margin-top: 20px">
      <veui-tag
        v-for="type in types"
        :key="type"
        :type="type"
        :ui="bordered ? 'bordered' : ''"
        disabled
        removable
      >
        {{ type }}
      </veui-tag>
    </div>
  </section>
</article>
</template>

<script>
import Vue from 'vue'
import { Tag, Checkbox } from 'veui'
import toast from 'veui/plugins/toast'
import confirm from 'veui/plugins/confirm'

Vue.use(toast)
Vue.use(confirm)

export default {
  name: 'tag-demo',
  components: {
    'veui-tag': Tag,
    'veui-checkbox': Checkbox
  },
  data () {
    return {
      teams: ['湖人', '火箭', '猛龙', '马刺', '勇士'],
      teams2: ['湖人', '火箭', '猛龙', '马刺', '勇士'],
      types: ['default', 'info', 'success', 'warning', 'error'],
      sizes: ['s', 'm', 'default'],
      selected: false,
      bordered: false,
      controlledRemoved: false
    }
  },
  methods: {
    handleRemove (name) {
      this.$toast.success(name + '赢了')
    },
    handleControlledRemove () {
      this.$confirm('要删除吗？').then(confirmed => {
        if (confirmed) {
          this.controlledRemoved = true
        }
      })
    }
  }
}
</script>

<style scoped>
.veui-tag {
  margin-right: 15px;
}
</style>
