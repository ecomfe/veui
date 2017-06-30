<template>
  <article>
    <h1><code>&lt;veui-tabs&gt;</code></h1>
    <section>
      <h2>默认样式：</h2>
      <veui-tabs ui="default" :active.sync="tabOneActive" >
        <veui-tab label="Tab1" name="tab1"> This is Tab1 </veui-tab>
        <veui-tab label="Tab2" name="tab2"> This is Tab2 </veui-tab>
        <veui-tab label="Tab3" name="tab3"> This is Tab3 </veui-tab>
      </veui-tabs>
      <div>当前选的 Tab 名是：{{tabOneActive}}</div>
    </section>
    <section>
      <h2>简单样式：</h2>
      <veui-tabs ui="simple" :active.sync="tabThreeActive" >
        <veui-tab label="Tab1" name="tab1"> This is Tab1 </veui-tab>
        <veui-tab label="Tab2" name="tab2"> This is Tab2 </veui-tab>
        <veui-tab label="Tab3" name="tab3"> This is Tab3 </veui-tab>
      </veui-tabs>
      <div>当前选的 Tab 名是：{{tabThreeActive}}</div>
    </section>
  </article>
</template>

<script>
import Icon from '@/components/Icon'
import Tabs from '@/components/Tabs/Tabs'
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
      tabOneActive: '',
      tabTwoActive: 1,
      tabThreeActive: 2
    }
  },
  mounted () {
  },
  methods: {
    change (value) {
      // alert('您选中的下拉选项值是' + value)
    }
  }
}
</script>
