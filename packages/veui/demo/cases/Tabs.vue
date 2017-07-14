<template>
  <article>
    <h1><code>&lt;veui-tabs&gt;</code></h1>
    <section>
      <h2>默认样式：</h2>
      <p>当前标签 <code>{{active}}</code></p>
      <p>当前序号 <code>{{index0 + 1}}</code></p>
      <veui-tabs ui="default" :active.sync="active" :index.sync="index0">
        <veui-tab label="回答" name="answers"><h1>This is Tab1</h1></veui-tab>
        <veui-tab label="文章" name="articles"><h1>This is Tab2</h1></veui-tab>
        <veui-tab label="分享" name="shares"><h1>This is Tab3</h1></veui-tab>
      </veui-tabs>
    </section>
    <section>
      <h2>路由模式：</h2>
      <veui-tabs ui="default" :active.sync="$route.path">
        <veui-tab label="Button" to="/tabs/button"><router-view></router-view></veui-tab>
        <veui-tab label="Input" to="/tabs/input"><router-view></router-view></veui-tab>
        <veui-tab label="Switch" to="/tabs/switch"><router-view></router-view></veui-tab>
      </veui-tabs>
    </section>
    <section>
      <h2>简单样式：</h2>
      <p>当前序号 <code>{{index1 + 1}}</code></p>
      <veui-tabs ui="simple" :index.sync="index1" >
        <veui-tab label="Tab1">This is Tab1</veui-tab>
        <veui-tab label="Tab2">This is Tab2</veui-tab>
        <veui-tab label="Tab3">This is Tab3</veui-tab>
        <veui-tab label="Tab4">This is Tab4</veui-tab>
      </veui-tabs>
      <!--<div>当前选的 Tab 是：第 {{tabThreeActiveIndex + 1}} 个</div>-->
    </section>
  </article>
</template>

<script>
import { Icon, Tabs, Tab } from 'veui'

export default {
  name: 'tabs-demo',
  components: {
    'veui-tabs': Tabs,
    'veui-tab': Tab,
    'icon': Icon
  },
  data () {
    return {
      active: '',
      index0: 0,
      index1: 0
    }
  }
}
</script>
