<template>
<article class="veui-searchbox-demo">
  <h1><code>&lt;veui-searchbox&gt;</code></h1>
  <section class="has-margin-right">
    <h2>sizes</h2>
    <p>
      <veui-searchbox
        clearable
        ui="xs"
        replace-on-select
        :name="name"
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
      <veui-searchbox
        clearable
        ui="s"
        replace-on-select
        :name="name"
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
    </p>
    <p>
      <veui-searchbox
        clearable
        ui="m"
        replace-on-select
        :name="name"
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
      <veui-searchbox
        clearable
        ui="l"
        replace-on-select
        :name="name"
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
    </p>
    <p>
      <veui-searchbox
        clearable
        ui="strong xs"
        replace-on-select
        :name="name"
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
      <veui-searchbox
        clearable
        ui="strong s"
        replace-on-select
        :name="name"
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
    </p>
    <p>
      <veui-searchbox
        clearable
        ui="strong m"
        replace-on-select
        :name="name"
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
      <veui-searchbox
        clearable
        ui="strong l"
        replace-on-select
        :name="name"
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
    </p>
  </section>
  <section class="has-margin-right">
    <h2>styles</h2>
    <p>
      <veui-searchbox
        ui="m"
        :name="name"
        :placeholder="placeholder"
        @search="log($event)"
      />
      <veui-searchbox
        ui="m strong"
        :name="name"
        :placeholder="placeholder"
        @search="log($event)"
      />
    </p>
  </section>
  <section class="has-margin-right">
    <h2>disabled</h2>
    <p>
      <veui-searchbox
        :value="value"
        :name="name"
        clearable
        :placeholder="placeholder"
        disabled
        @search="log($event)"
      />
      <veui-searchbox
        ui=" strong"
        disabled
        :name="name"
        :placeholder="placeholder"
        :suggestions="suggestions5"
        @input="handleSuggest('5', $event)"
        @search="log($event)"
      />
    </p>
  </section>
  <section class="has-margin-right">
    <h2>readonly</h2>
    <p>
      <veui-searchbox
        :value="value"
        :name="name"
        clearable
        :placeholder="placeholder"
        readonly
        @search="log($event)"
      />
      <veui-searchbox
        :value="value"
        :name="name"
        clearable
        ui="strong"
        :placeholder="placeholder"
        readonly
        @search="log($event)"
      />
    </p>
  </section>
  <section class="has-margin-right">
    <h2>suggestions</h2>
    <p>
      <veui-searchbox
        v-model="value2"
        clearable
        :name="name"
        :placeholder="placeholder"
        :suggestions="suggestions1"
        suggest-trigger="submit"
        @suggest="asyncHandleSuggest('1', $event)"
        @search="log($event)"
        @select="value2 = $event.label"
      />
      <veui-searchbox
        ui="alt"
        :name="name"
        :placeholder="placeholder"
        :suggestions="suggestions6"
        @input="handleSuggest('6', $event)"
        @search="log($event)"
      >
        <template
          slot="suggestion"
          slot-scope="suggestion"
        >
          <span>{{ suggestion.value }}</span>
          <icon name="eye"/>
        </template>
      </veui-searchbox>
      <veui-searchbox
        :name="name"
        :placeholder="placeholder"
        :suggestions="suggestions7"
        @input="handleSuggest('7', $event)"
        @search="log($event)"
      >
        <template
          slot="suggestions"
          slot-scope="props"
        >
          <div>
            <h3>header</h3>
            <template v-for="(suggestion, index) in props.suggestions">
              <div
                :key="index"
                class="veui-searchbox-suggestion-item"
                @click="props.select(suggestion)"
              >
                <span>{{ suggestion.value }}</span>
                <icon name="eye"/>
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
      value2: null,
      value3: '测试值',
      value4: '测试值',
      valueis: '测试值',
      placeholder: '百度(placeholder)',
      suggestions1: [],
      suggestions2: [],
      suggestions3: [],
      suggestions4: [],
      suggestions5: [],
      suggestions6: [],
      suggestions7: [],
      suggestionsis: []
    }
  },
  methods: {
    handleSuggest (num, value) {
      if (value && num) {
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
      } else {
        this[`suggestions${num}`] = [
          '',
          '百度',
          '百度贴吧',
          '百度MVP',
          '百度指数'
        ]
      }
    },
    asyncHandleSuggest (num, value) {
      setTimeout(() => {
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
        } else {
          this[`suggestions${num}`] = [
            '',
            '百度',
            '百度贴吧',
            '百度MVP',
            '百度指数'
          ]
        }
      }, 1000)
    },
    log (item) {
      bus.$emit('log', item)
    }
  }
}
</script>
<style lang="less">
.veui-searchbox-demo {
  .has-margin-right {
    .veui-searchbox {
      margin-right: 15px;
    }
  }
}
</style>
