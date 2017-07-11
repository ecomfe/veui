<template>
  <article>
    <h1><code>&lt;veui-button&gt;</code></h1>
    <p>
      <veui-button ui="primary tiny">提交</veui-button>
      <veui-button ui="primary small">提交</veui-button>
      <veui-button ui="primary">提交</veui-button>
      <veui-button ui="primary large">提交</veui-button>
      <veui-button ui="primary" disabled>提交</veui-button>
      <veui-button ui="primary" loading>提交</veui-button>
    </p>
    <p>
      <veui-button ui="tiny">保存</veui-button>
      <veui-button ui="small">保存</veui-button>
      <veui-button>保存</veui-button>
      <veui-button ui="large">保存</veui-button>
      <veui-button disabled>保存</veui-button>
      <veui-button loading>保存</veui-button>
    </p>
    <p>
      <veui-button ui="aux tiny">取消</veui-button>
      <veui-button ui="aux small">取消</veui-button>
      <veui-button ui="aux">取消</veui-button>
      <veui-button ui="aux large">取消</veui-button>
      <veui-button ui="aux" disabled>取消</veui-button>
      <veui-button ui="aux" loading>取消</veui-button>
    </p>
    <p>
      <veui-button ui="alt tiny">取消</veui-button>
      <veui-button ui="alt small">取消</veui-button>
      <veui-button ui="alt">取消</veui-button>
      <veui-button ui="alt large">取消</veui-button>
      <veui-button ui="alt" disabled>取消</veui-button>
      <veui-button ui="alt" loading>取消</veui-button>
    </p>
    <p>
      <veui-button ui="link tiny">编辑</veui-button>
      <veui-button ui="link small">编辑</veui-button>
      <veui-button ui="link">编辑</veui-button>
      <veui-button ui="link large">编辑</veui-button>
      <veui-button ui="link" disabled>编辑</veui-button>
      <veui-button ui="link" loading>编辑</veui-button>
    </p>
    <p>
      <veui-button ui="round primary tiny"><icon name="thumbs-up"></icon></veui-button>
      <veui-button ui="round primary small"><icon name="thumbs-up"></icon></veui-button>
      <veui-button ui="round primary"><icon name="thumbs-up"></icon></veui-button>
      <veui-button ui="round primary large"><icon name="thumbs-up"></icon></veui-button>
      <veui-button ui="round primary" disabled><icon name="thumbs-up"></icon></veui-button>
      <veui-button ui="round primary" loading><icon name="thumbs-up"></icon></veui-button>
    </p>
    <p>
      <veui-button ui="round tiny"><icon name="flash"></icon></veui-button>
      <veui-button ui="round small"><icon name="flash"></icon></veui-button>
      <veui-button ui="round"><icon name="flash"></icon></veui-button>
      <veui-button ui="round large"><icon name="flash"></icon></veui-button>
      <veui-button ui="round" disabled><icon name="flash"></icon></veui-button>
      <veui-button ui="round" loading><icon name="flash"></icon></veui-button>
    </p>
    <p>
      <veui-button ui="aux square tiny"><icon name="gear"></icon></veui-button>
      <veui-button ui="aux square small"><icon name="gear"></icon></veui-button>
      <veui-button ui="aux square"><icon name="gear"></icon></veui-button>
      <veui-button ui="aux square large"><icon name="gear"></icon></veui-button>
      <veui-button ui="aux square" disabled><icon name="gear"></icon></veui-button>
      <veui-button ui="aux square" loading><icon name="gear"></icon></veui-button>
    </p>
    <p>
      <veui-button ui="alt square tiny"><icon name="gear"></icon></veui-button>
      <veui-button ui="alt square small"><icon name="gear"></icon></veui-button>
      <veui-button ui="alt square"><icon name="gear"></icon></veui-button>
      <veui-button ui="alt square large"><icon name="gear"></icon></veui-button>
      <veui-button ui="alt square" disabled><icon name="gear"></icon></veui-button>
      <veui-button ui="alt square" loading><icon name="gear"></icon></veui-button>
    </p>
  </article>
</template>

<script>
import bus from '../bus'
import { Button, Icon } from 'veui'
import 'veui/icons'
import 'vue-awesome/icons/thumbs-up'
import 'vue-awesome/icons/flash'
import 'vue-awesome/icons/gear'

export default {
  name: 'button-demo',
  components: {
    Icon,
    'veui-button': Button
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

<style scoped>
p {
  user-select: none;
}

.veui-button {
  margin-right: 10px;
}
</style>
