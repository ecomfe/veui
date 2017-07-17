<template>
  <article>
    <h1><code>&lt;veui-search-box&gt;</code></h1>
    <section>
      <h2>普通</h2>
      <p>
        <veui-search-box
          :name="name"
          :placeholder="placeholder"
          @search="log($event)"></veui-search-box>
      </p>
    </section>
    <section>
      <h2>禁用</h2>
      <p>
        <veui-search-box
          :value="value"
          :name="name"
          :placeholder="placeholder"
          :disabled="true"
          @search="log($event)"></veui-search-box>
      </p>
    </section>
    <section>
      <h2>Suggestion</h2>
      <p>
        <veui-search-box
          v-model="value2"
          :name="name"
          :placeholder="placeholder"
          :suggestions="suggestions1"
          @input="handleInput('1', $event)"
          @search="log($event)"></veui-search-box>
      </p>
    </section>
    <section>
      <h2>小ui模式</h2>
      <p>
        <veui-search-box
          ui="small"
          :name="name"
          :placeholder="placeholder"
          :suggestions="suggestions2"
          @input="handleInput('2', $event)"
          @search="log($event)"></veui-search-box>
      </p>
    </section>
    <section>
      <h2>大ui模式</h2>
      <p>
        <veui-search-box
          ui="large"
          :name="name"
          :placeholder="placeholder"
          :suggestions="suggestions3"
          @input="handleInput('3', $event)"
          @search="log($event)"></veui-search-box>
      </p>
    </section>
    <section>
      <h2>全局搜索框</h2>
      <p>
        <veui-search-box
          ui="alt"
          :name="name"
          :placeholder="placeholder"
          :suggestions="suggestions4"
          @input="handleInput('4', $event)"
          @search="log($event)"></veui-search-box>
      </p>
    </section>
    <section>
      <h2>禁用全局搜索框</h2>
      <p>
        <veui-search-box
          ui="alt"
          :disabled="true"
          :name="name"
          :placeholder="placeholder"
          :suggestions="suggestions5"
          @input="handleInput('5', $event)"
          @search="log($event)"></veui-search-box>
      </p>
    </section>
    <section>
      <h2>自定义Suggestion样式1</h2>
      <p>
        <veui-search-box
          ui="alt"
          :name="name"
          :placeholder="placeholder"
          :suggestions="suggestions6"
          @input="handleInput('6', $event)"
          @search="log($event)">
          <template slot="item" scope="item">
            <span>{{ item.value }}</span>
            <icon name="eye"></icon>
          </template>
        </veui-search-box>
      </p>
    </section>
  </article>
</template>

<script>
import bus from '../bus'
import { SearchBox, Icon } from 'veui'

export default {
  name: 'demo-search-box',
  components: {
    'veui-search-box': SearchBox,
    Icon
  },
  data () {
    return {
      name: 'name',
      value: '测试值',
      value2: '测试值',
      placeholder: '百度(placeholder)',
      suggestions1: [],
      suggestions2: [],
      suggestions3: [],
      suggestions4: [],
      suggestions5: [],
      suggestions6: []
    }
  },
  methods: {
    handleInput (num, value) {
      if (value) {
        this[`suggestions${num}`] = [
          {
            value
          },
          {
            value: '百度'
          },
          {
            value: '百度贴吧'
          },
          {
            value: '百度MVP'
          }
        ]
      } else {
        this[`suggestions${num}`] = null
      }
    },
    log (item) {
      bus.$emit('log', item)
    }
  }
}
</script>

<style>

</style>
