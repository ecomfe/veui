<template>
  <article>
    <h1><code>&lt;veui-tabs&gt;</code></h1>
    <section>
      <h2>默认样式：</h2>
      <veui-tabs v-bind="attrs" v-model="defaultValue1"></veui-tabs>
      <h2>slot样式：</h2>
      <veui-tabs v-bind="attrs" v-model="defaultValue1">
        <veui-tab label="Tab1" name="tab1"> This is Tab1 </veui-tab>
        <veui-tab label="Tab2" name="tab2"> This is Tab2 </veui-tab>
      </veui-tabs>
    </section>
  </article>
</template>

<script>
import Icon from '@/components/Icon'
// import bus from '../bus'
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
      icon: true,
      defaultValue1: null,
      attrs: {
      }
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
