<template>
<article>
  <h1>
    <code>&lt;veui-autocomplete&gt;</code>
  </h1>
  <section>
    <h2>普通(m)</h2>
    <veui-autocomplete :datasource="suggestions"/>
  </section>
  <section>
    <h2>可清除(s)</h2>
    <veui-autocomplete ui="s" clearable autofocus :datasource="suggestions"/>
  </section>
  <section>
    <h2>强制展开</h2>
    <veui-autocomplete :datasource="[]" expanded/>
  </section>
  <section>
    <h2>展开后NoData生效</h2>
    <veui-autocomplete :datasource="[]">
      <template #no-data>No data</template>
    </veui-autocomplete>
    <veui-autocomplete :datasource="[]" suggest-trigger="focus">
      <template #no-data>No data</template>
    </veui-autocomplete>
  </section>
  <section>
    <h2>禁用(l)</h2>
    <veui-autocomplete
      ui="l"
      :datasource="suggestions"
      :suggest-trigger="['focus', 'input']"
      disabled
    />
  </section>
  <section>
    <h2>只读(xs)</h2>
    <veui-autocomplete
      ui="xs"
      :datasource="suggestions"
      :suggest-trigger="['focus', 'input']"
      readonly
    />
  </section>
  <section>
    <h2>错误</h2>
    <veui-autocomplete
      invalid
      :datasource="suggestions"
      :suggest-trigger="['focus', 'input']"
    />
  </section>
  <section>
    <h2>列表型数据，input 时下拉</h2>
    <veui-autocomplete
      v-model="value"
      :datasource="suggestions"
      placeholder="请输入"
    />
  </section>
  <section>
    <h2>树型数据，focus 时下拉，最多展示4个，必须选搜索结果</h2>
    <veui-autocomplete
      v-model="treeValue"
      :datasource="coffees"
      placeholder="请输入"
      :strict="{ select: true }"
      suggest-on-focus
      :overlay-style="{
        '--dls-dropdown-max-display-items': 4
      }"
    >
      <span slot="no-data">no-data</span>
    </veui-autocomplete>
  </section>
  <section style="margin-top: 160px">
    <h2>strict: 强制不能超过最大长度7</h2>
    <veui-autocomplete
      v-model="treeValue"
      :datasource="
        coffees.concat([{ value: '👩‍👩‍👧‍👧'.slice(0, 5) }, { value: '👩‍👩‍👧‍👧' }])
      "
      placeholder="请输入"
      :suggest-trigger="['focus', 'input']"
      :maxlength="7"
      strict
    />
  </section>
  <section>
    <h2>当成非受控组件使用</h2>
    <veui-autocomplete
      :datasource="suggestions"
      placeholder="请输入"
      suggest-trigger="focus"
      strict
    />
  </section>
</article>
</template>

<script>
import { Autocomplete } from 'veui'

export default {
  name: 'autocomplete-demo',
  components: {
    'veui-autocomplete': Autocomplete
  },
  data () {
    return {
      value: null,
      treeValue: '',
      suggestions: [
        {
          value: 'Moka'
        },
        {
          value: 'Turkish'
        },
        {
          value: 'Latte'
        },
        {
          value: 'Cappuccino'
        }
      ],
      coffees: [
        {
          value: 'Infused',
          options: [
            {
              value: 'French press'
            },
            {
              value: 'Cold brew'
            }
          ]
        },
        {
          value: 'Espresso',
          options: [
            {
              value: 'Espresso Romano'
            },
            {
              value: 'Guillermo'
            },
            {
              value: 'Ristretto'
            }
          ]
        },
        {
          value: 'Milk coffee',
          options: [
            {
              value: 'Latte'
            },
            {
              value: 'Macchiato'
            },
            {
              value: 'Cappuccino'
            },
            {
              value: 'White coffee'
            }
          ]
        }
      ]
    }
  }
}
</script>
