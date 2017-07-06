<template>
  <article>
    <h1><code>&lt;veui-tabs&gt;</code></h1>
    <section>
      <h2>默认样式：</h2>
      <veui-tabs ui="default">
        <veui-tab label="Tab1"> <h1>This is Tab1</h1> </veui-tab>
        <veui-tab label="Tab2"> <h1>This is Tab2</h1> </veui-tab>
        <veui-tab label="Tab3"> <h1>This is Tab3</h1> </veui-tab>
      </veui-tabs>
    </section>
    <section>
      <h2>简单样式：</h2>
      <veui-tabs ui="simple" :index.sync="tabOneIndex" >
        <veui-tab label="Tab1"> This is Tab1 </veui-tab>
        <veui-tab label="Tab2"> This is Tab2 </veui-tab>
        <veui-tab label="Tab3"> This is Tab3 </veui-tab>
        <veui-tab label="Tab4"> This is Tab4 </veui-tab>
      </veui-tabs>
      <!--<div>当前选的 Tab 是：第 {{tabThreeActiveIndex + 1}} 个</div>-->
    </section>
  </article>
</template>

<script>
import Icon from '@/components/Icon'
import Tabs from '@/components/Tabs'
import Tab from '@/components/Tabs/Tab'

export default {
  name: 'tabs-demo',
  components: {
    'veui-tabs': Tabs,
    'veui-tab': Tab,
    'icon': Icon
  },
  data () {
    return {
      tabOneIndex: 1
    }
  }
}
</script>
