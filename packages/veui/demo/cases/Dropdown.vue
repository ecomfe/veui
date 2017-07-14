<template>
  <article>
    <h1><code>&lt;veui-dropdown&gt;</code></h1>
    <p>
      <veui-dropdown
        ui="primary"
        label="操作操作操作操作操作操作"
        :options="options"></veui-dropdown>
    </p>
    <p>
      <veui-dropdown
        ui="primary"
        label="操作操作操作操作操作操作"
        disabled
        :options="options"></veui-dropdown>
    </p>
    <p>
      <veui-dropdown
        ui="link"
        label="操作"
        :options="options"></veui-dropdown>
    </p>
    <p>
      <veui-dropdown
        ui="link"
        label="操作"
        disabled
        :options="options"></veui-dropdown>
    </p>
  </article>
</template>

<script>
import bus from '../bus'
import { Dropdown } from 'veui'

export default {
  name: 'dropdown-demo',
  components: {
    'veui-dropdown': Dropdown
  },
  data () {
    return {
      options: [
        {
          label: '新建新建新建新建新建新建新建'
        },
        {
          label: '编辑',
          disabled: true
        },
        {
          label: '删除'
        }
      ]
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
p {
  margin: 10px 0;
}

</style>
