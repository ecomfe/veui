<template>
  <article>
    <h1><code>&lt;veui-searchbox&gt;</code></h1>
    <section>
      <h2>普通</h2>
      <p>
        <veui-searchbox
          :name="name"
          :placeholder="placeholder"
          @search="log($event)"></veui-searchbox>
      </p>
    </section>
    <section>
      <h2>禁用</h2>
      <p>
        <veui-searchbox
          :value="value"
          :name="name"
          clearable
          :placeholder="placeholder"
          disabled
          @search="log($event)"></veui-searchbox>
      </p>
    </section>
    <section>
      <h2>Suggestion</h2>
      <p>
        <veui-searchbox
          v-model="value2"
          clearable
          :name="name"
          :placeholder="placeholder"
          :suggestions="suggestions1"
          @input="handleInput('1', $event)"
          @search="log($event)"
          @select="log($event)"></veui-searchbox>
      </p>
    </section>
    <section>
      <h2>小ui模式</h2>
      <p>
        <veui-searchbox
          ui="primary small"
          clearable
          :name="name"
          :placeholder="placeholder"
          :suggestions="suggestions2"
          replaceOnSelect
          @input="handleInput('2', $event)"
          @search="log($event)"></veui-searchbox>
      </p>
    </section>
    <section>
      <h2>大ui模式</h2>
      <p>
        <veui-searchbox
          ui="primary large"
          :name="name"
          :placeholder="placeholder"
          :suggestions="suggestions3"
          @input="handleInput('3', $event)"
          @search="log($event)"></veui-searchbox>
      </p>
    </section>
    <section>
      <h2>全局搜索框</h2>
      <p>
        <veui-searchbox
          ui="primary"
          replaceOnSelect
          :name="name"
          :placeholder="placeholder"
          :suggestions="suggestions4"
          @input="handleInput('4', $event)"
          @search="log($event)"
          @select="log('select', $event)"></veui-searchbox>
      </p>
    </section>
    <section>
      <h2>禁用全局搜索框</h2>
      <p>
        <veui-searchbox
          ui="alt primary"
          disabled
          :name="name"
          :placeholder="placeholder"
          :suggestions="suggestions5"
          @input="handleInput('5', $event)"
          @search="log($event)"></veui-searchbox>
      </p>
    </section>
    <section>
      <h2>自定义Suggestion样式1</h2>
      <p>
        <veui-searchbox
          ui="alt"
          :name="name"
          :placeholder="placeholder"
          :suggestions="suggestions6"
          @input="handleInput('6', $event)"
          @search="log($event)">
          <template slot="suggestion" scope="suggestion">
            <span>{{ suggestion.value }}</span>
            <icon name="eye"></icon>
          </template>
        </veui-searchbox>
      </p>
    </section>
    <section>
      <h2>自定义Suggestion样式2</h2>
      <p>
        <veui-searchbox
          :name="name"
          :placeholder="placeholder"
          :suggestions="suggestions7"
          @input="handleInput('7', $event)"
          @search="log($event)">
          <template slot="suggestions" scope="props">
            <div>
              <h3>header</h3>
              <template v-for="(suggestion, index) in props.suggestions">
                <div class="veui-searchbox-suggestion-item"
                  :key="index"
                  @click="props.select(suggestion)">
                  <span>{{ suggestion.value }}</span>
                  <icon name="eye"></icon>
                </div>
              </template>
              <h3>ender</h3>
            </div>
          </template>
        </veui-searchbox>
      </p>
    </section>
  </article>
</template>

<script>
import bus from '../bus'
import { Searchbox, Icon } from 'veui'

export default {
  name: 'demo-searchbox',
  components: {
    'veui-searchbox': Searchbox,
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
      suggestions6: [],
      suggestions7: []
    }
  },
  methods: {
    handleInput (num, value) {
      console.log(num, value)
      if (value && num < 3) {
        this[`suggestions${num}`] = [
          {
            value,
            label: value
          },
          {
            value: '百度',
            label: '百度'
          },
          {
            value: '百度贴吧',
            label: '百度贴吧'
          },
          {
            value: '百度MVP',
            label: '百度MVP'
          }
        ]
      } else if (value) {
        this[`suggestions${num}`] = [
          value,
          '百度',
          '百度贴吧',
          '百度MVP',
          '百度指数'
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
