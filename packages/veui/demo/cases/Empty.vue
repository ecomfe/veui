<template>
<article>
  <h1>
    <code>&lt;veui-empty&gt;</code>
  </h1>
  <section>
    <h4>默认</h4>
    <veui-empty/>
  </section>
  <section>
    <h4>配置</h4>
    <veui-check-button-group v-model="partValue" :items="parts"/>
    <veui-radio-button-group v-model="ui" :items="uis" class="ml-4"/>
    <veui-empty class="mt-4" :ui="ui" :desc="false" :image="false">
      <template
        v-if="partValue.includes('title')"
        #title
      >找不到该页面</template>
      <template
        v-if="partValue.includes('desc')"
        #desc
      >当前页面无法访问，请检查地址栏中的网址，确保您访问的是正确的网址。</template>
      <template v-if="partValue.includes('image')" #default>
        <illustration-spot-no-access/>
      </template>
      <template v-if="partValue.includes('actions')" #actions>
        <veui-button ui="primary">确定</veui-button>
        <veui-button>取消</veui-button>
      </template>
    </veui-empty>
  </section>
</article>
</template>

<script>
import { Button, Empty, CheckButtonGroup, RadioButtonGroup } from 'veui'
import { IllustrationSpotNoAccess } from 'dls-illustrations-vue'

function genLabel (value) {
  return { label: value, value }
}

export default {
  name: 'empty-demo',
  components: {
    'veui-button': Button,
    'veui-empty': Empty,
    'veui-check-button-group': CheckButtonGroup,
    'veui-radio-button-group': RadioButtonGroup,
    IllustrationSpotNoAccess
  },
  data () {
    return {
      parts: ['image', 'title', 'desc', 'actions'].map(genLabel),
      uis: ['s', 'm'].map(genLabel),
      ui: 'm',
      partValue: ['image', 'title', 'desc', 'actions']
    }
  }
}
</script>

<style scoped>
section {
  margin-bottom: 40px;
}

.ml-4 {
  margin-left: 16px;
}

.mt-4 {
  margin-top: 16px;
}
</style>
