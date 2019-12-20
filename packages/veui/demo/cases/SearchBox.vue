<template>
<article class="veui-search-box-demo">
  <h1><code>&lt;veui-search-box&gt;</code></h1>
  <section class="has-margin-right">
    <h2>sizes</h2>
    <section>
      <veui-search-box
        clearable
        ui="xs"
        replace-on-select
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
      <veui-search-box
        clearable
        ui="s"
        replace-on-select
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
    </section>
    <section>
      <veui-search-box
        clearable
        ui="m"
        replace-on-select
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
      <veui-search-box
        clearable
        ui="l"
        replace-on-select
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
    </section>
    <section>
      <veui-search-box
        clearable
        ui="strong xs"
        replace-on-select
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
      <veui-search-box
        clearable
        ui="strong s"
        replace-on-select
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
    </section>
    <section>
      <veui-search-box
        clearable
        ui="strong m"
        replace-on-select
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
      <veui-search-box
        clearable
        ui="strong l"
        replace-on-select
        :placeholder="placeholder"
        :suggestions="suggestions4"
        @input="handleSuggest('4', $event)"
        @search="log($event)"
        @select="log('select', $event)"
      />
    </section>
  </section>
  <section class="has-margin-right">
    <h2>styles</h2>
    <section>
      <veui-search-box
        ui="m"
        :placeholder="placeholder"
        @search="log($event)"
      />
      <veui-search-box
        ui="m strong"
        :placeholder="placeholder"
        @search="log($event)"
      />
    </section>
  </section>
  <section class="has-margin-right">
    <h2>disabled</h2>
    <section>
      <veui-search-box
        :value="value"
        clearable
        :placeholder="placeholder"
        disabled
        @search="log($event)"
      />
      <veui-search-box
        ui=" strong"
        disabled
        :placeholder="placeholder"
        :suggestions="suggestions5"
        @input="handleSuggest('5', $event)"
        @search="log($event)"
      />
    </section>
  </section>
  <section class="has-margin-right">
    <h2>readonly</h2>
    <section>
      <veui-search-box
        :value="value"
        clearable
        :placeholder="placeholder"
        readonly
        @search="log($event)"
      />
      <veui-search-box
        :value="value"
        clearable
        ui="strong"
        :placeholder="placeholder"
        readonly
        @search="log($event)"
      />
    </section>
  </section>
  <section class="has-margin-right">
    <h2>suggestions</h2>
    <section>
      <veui-search-box
        v-model="value2"
        clearable
        :placeholder="placeholder"
        :suggestions="suggestions1"
        suggest-trigger="focus"
        @suggest="asyncHandleSuggest('1', $event)"
        @search="log($event)"
        @select="value2 = $event.label"
      />
      <veui-search-box
        :placeholder="placeholder"
        :suggestions="suggestions8"
        suggest-trigger="focus"
        @search="log($event)"
        @suggest="suggestHandler"
      >
        <template
          slot="suggestion"
          slot-scope="suggestion"
        >
          <span>{{ suggestion.value }}</span>
          <icon name="eye"/>
        </template>
      </veui-search-box>
      <veui-search-box
        :placeholder="placeholder"
        :suggestions="suggestions9"
        replace-on-select
        @input="handleSuggest('7', $event)"
        @search="log($event)"
      >
        <template slot="suggestions-before">
          <h3>header</h3>
        </template>
        <template
          slot="group-label"
          slot-scope="{ label }"
        >
          1👉 {{ label }}
        </template>
        <template
          slot="option-label"
          slot-scope="{ label }"
        >
          2👉 {{ label }}
        </template>
        <template slot="suggestions-after">
          <h3>ender</h3>
        </template>
      </veui-search-box>
    </section>
  </section>
  <section>
    <h2>inline</h2>
    <div>
      <veui-search-box
        clearable
        ui="inline"
        :placeholder="placeholder"
        :suggest-trigger="[]"
        @search="log($event)"
        @select="log('select', $event)"
      />
    </div>
  </section>
</article>
</template>

<script>
import bus from '../bus'
import { includes } from 'lodash'
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
      suggestions8: [
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
      ],
      suggestions9: [
        {
          label: '汽车',
          options: [
            { label: 'camry', value: 'camry' },
            { label: 'carola', value: 'carola' }
          ]
        }
      ],
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
    },
    suggestHandler (value) {
      this.suggestions8 = this.suggestions8.map(item => {
        item.hidden = !(
          includes(item.label, value) || includes(item.value, value)
        )
        return item
      })
    }
  }
}
</script>
<style lang="less">
.veui-search-box-demo {
  padding-bottom: 20px;

  .has-margin-right {
    .veui-search-box {
      margin-right: 15px;
    }
  }
}

section {
  & & {
    margin-bottom: 20px;
  }
}
</style>
