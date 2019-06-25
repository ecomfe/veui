<template>
<article>
  <h1><code>&lt;veui-tag&gt;</code></h1>
  <section>
    <h2>不同尺寸</h2>
    <div>
      <veui-tag
        v-for="size in sizes"
        :key="size"
        :ui="size"
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
      >
        {{ type }}
      </veui-tag>
    </div>
  </section>

  <section>
    <h2>可移除标签</h2>
    <div>
      <veui-tag
        v-for="(team, index) in teams"
        :key="team"
        :type="types[index]"
        :ui="sizes[Math.round(index / 2)]"
        closable
        @close="handleClose(team)"
      >
        {{ team }}
      </veui-tag>
    </div>
  </section>
</article>
</template>

<script>
import { Tag } from 'veui'
import toastManagers from 'veui/managers/toast'

export default {
  name: 'tag-demo',
  components: {
    'veui-tag': Tag
  },
  data () {
    return {
      teams: ['湖人', '火箭', '猛龙', '马刺', '勇士'],
      types: ['default', 'success', 'error', 'warning', 'info'],
      sizes: ['small', 'default', 'large']
    }
  },
  methods: {
    handleClose (name) {
      toastManagers.success(name + '赢了')
    }
  }
}
</script>

<style scoped>
.veui-tag {
  margin-right: 15px;
}
</style>
