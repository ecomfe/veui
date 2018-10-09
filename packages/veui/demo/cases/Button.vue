<template>
  <article>
    <h1><code>&lt;veui-button&gt;</code></h1>
    <p>
      <veui-button ui="primary micro">提交</veui-button>
      <veui-button ui="primary tiny">提交</veui-button>
      <veui-button ui="primary small">提交</veui-button>
      <veui-button ui="primary">提交</veui-button>
      <veui-button ui="primary large">提交</veui-button>
      <veui-button ui="primary" disabled>提交</veui-button>
      <veui-button ui="primary" loading>提交</veui-button>
    </p>
    <p>
      <veui-button ui="micro">保存</veui-button>
      <veui-button ui="tiny">保存</veui-button>
      <veui-button ui="small">保存</veui-button>
      <veui-button ui="secondary">保存</veui-button>
      <veui-button ui="large">保存</veui-button>
      <veui-button disabled>保存</veui-button>
      <veui-button loading>保存</veui-button>
    </p>
    <p>
      <veui-button ui="micro"><icon name="cross-small"></icon> 取消</veui-button>
      <veui-button ui="tiny"><icon name="cross-small"></icon> 取消</veui-button>
      <veui-button ui="small"><icon name="cross-small"></icon> 取消</veui-button>
      <veui-button><icon name="cross-small"></icon> 取消</veui-button>
      <veui-button ui="large"><icon name="cross-small"></icon> 取消</veui-button>
      <veui-button disabled><icon name="cross-small"></icon> 取消</veui-button>
      <veui-button loading><icon name="cross-small"></icon> 取消</veui-button>
    </p>
    <p>
      <veui-button ui="alt micro">取消</veui-button>
      <veui-button ui="alt tiny">取消</veui-button>
      <veui-button ui="alt small">取消</veui-button>
      <veui-button ui="alt">取消</veui-button>
      <veui-button ui="alt large">取消</veui-button>
      <veui-button ui="alt" disabled>取消</veui-button>
      <veui-button ui="alt" loading>取消</veui-button>
    </p>
    <p>
      <veui-button ui="link primary micro">创建</veui-button>
      <veui-button ui="link primary tiny">创建</veui-button>
      <veui-button ui="link primary small">创建</veui-button>
      <veui-button ui="link primary">创建</veui-button>
      <veui-button ui="link primary large">创建</veui-button>
      <veui-button ui="link primary" disabled>创建</veui-button>
      <veui-button ui="link primary" loading>创建</veui-button>
    </p>
    <p>
      <veui-button ui="link micro">编辑</veui-button>
      <veui-button ui="link tiny">编辑</veui-button>
      <veui-button ui="link small">编辑</veui-button>
      <veui-button ui="link">编辑</veui-button>
      <veui-button ui="link large">编辑</veui-button>
      <veui-button ui="link" disabled>编辑</veui-button>
      <veui-button ui="link" loading>编辑</veui-button>
    </p>
    <p>
      <veui-button ui="round primary micro"><icon name="check"></icon></veui-button>
      <veui-button ui="round primary tiny"><icon name="check"></icon></veui-button>
      <veui-button ui="round primary small"><icon name="check"></icon></veui-button>
      <veui-button ui="round primary"><icon name="check"></icon></veui-button>
      <veui-button ui="round primary large"><icon name="check"></icon></veui-button>
      <veui-button ui="round primary" disabled><icon name="check"></icon></veui-button>
      <veui-button ui="round primary" loading><icon name="check"></icon></veui-button>
    </p>
    <p>
      <veui-button ui="round micro"><icon name="edit"></icon></veui-button>
      <veui-button ui="round tiny"><icon name="edit"></icon></veui-button>
      <veui-button ui="round small"><icon name="edit"></icon></veui-button>
      <veui-button ui="round"><icon name="edit"></icon></veui-button>
      <veui-button ui="round large"><icon name="edit"></icon></veui-button>
      <veui-button ui="round" disabled><icon name="edit"></icon></veui-button>
      <veui-button ui="round" loading><icon name="edit"></icon></veui-button>
    </p>
    <p>
      <veui-button ui="square micro"><icon name="search"></icon></veui-button>
      <veui-button ui="square tiny"><icon name="search"></icon></veui-button>
      <veui-button ui="square small"><icon name="search"></icon></veui-button>
      <veui-button ui="square"><icon name="search"></icon></veui-button>
      <veui-button ui="square large"><icon name="search"></icon></veui-button>
      <veui-button ui="square" disabled><icon name="search"></icon></veui-button>
      <veui-button ui="square" loading><icon name="search"></icon></veui-button>
    </p>
    <p>
      <veui-button ui="alt square micro"><icon name="cross"></icon></veui-button>
      <veui-button ui="alt square tiny"><icon name="cross"></icon></veui-button>
      <veui-button ui="alt square small"><icon name="cross"></icon></veui-button>
      <veui-button ui="alt square"><icon name="cross"></icon></veui-button>
      <veui-button ui="alt square large"><icon name="cross"></icon></veui-button>
      <veui-button ui="alt square" disabled><icon name="cross"></icon></veui-button>
      <veui-button ui="alt square" loading><icon name="cross"></icon></veui-button>
    </p>
    <p>
      <veui-button ui="dark micro">取消</veui-button>
      <veui-button ui="dark tiny">取消</veui-button>
      <veui-button ui="dark small">取消</veui-button>
      <veui-button ui="dark">取消</veui-button>
      <veui-button ui="dark large">取消</veui-button>
      <veui-button ui="dark" disabled>取消</veui-button>
      <veui-button ui="dark" loading>取消</veui-button>
    </p>
    <p>
      <veui-button ui="dark square micro"><icon name="search"></icon></veui-button>
      <veui-button ui="dark square tiny"><icon name="search"></icon></veui-button>
      <veui-button ui="dark square small"><icon name="search"></icon></veui-button>
      <veui-button ui="dark square"><icon name="search"></icon></veui-button>
      <veui-button ui="dark square large"><icon name="search"></icon></veui-button>
      <veui-button ui="dark square" disabled><icon name="search"></icon></veui-button>
      <veui-button ui="dark square" loading><icon name="search"></icon></veui-button>
    </p>
  </article>
</template>

<script>
import bus from '../bus'
import { Button, Icon } from 'veui'
import 'veui-theme-one/icons/cross-small'
import 'veui-theme-one/icons/check'
import 'veui-theme-one/icons/edit'
import 'veui-theme-one/icons/search'
import 'veui-theme-one/icons/cross'

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
