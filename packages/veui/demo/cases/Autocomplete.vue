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
    <veui-autocomplete
      ui="s"
      clearable
      :datasource="suggestions"
    />
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
    <h2>树型数据，focus 时下拉，最多展示4个</h2>
    <veui-autocomplete
      v-model="treeValue"
      :datasource="coffees"
      placeholder="请输入"
      suggest-trigger="focus"
      :overlay-style="{
        '--dls-dropdown-max-display-items': 4
      }"
      expanded
    />
  </section>
  <section style="margin-top: 160px">
    <h2>strict: 强制不能超过最大长度7</h2>
    <veui-autocomplete
      v-model="treeValue"
      :datasource="coffees.concat([
        { label: '👩‍👩‍👧‍👧'.slice(0, 5), value: '👩‍👩‍👧‍👧'.slice(0, 5) },
        { label: '👩‍👩‍👧‍👧', value: '👩‍👩‍👧‍👧' }
      ])"
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
          value: 'latte'
        },
        {
          value: 'cappuccino'
        }
      ],
      coffees: [
        {
          label: 'Infused',
          value: 'infused',
          options: [
            {
              label: 'French press',
              value: 'french-press'
            },
            {
              label: 'Cold brew',
              value: 'cold-brew'
            }
          ]
        },
        {
          label: 'Espresso',
          value: 'espresso',
          options: [
            {
              label: 'Espresso Romano',
              value: 'espresso-romano'
            },
            {
              label: 'Guillermo',
              value: 'guillermo'
            },
            {
              label: 'Ristretto',
              value: 'ristretto'
            }
          ]
        },
        {
          label: 'Milk coffee',
          value: 'milk-coffee',
          options: [
            {
              label: 'Latte',
              value: 'latte'
            },
            {
              label: 'Macchiato',
              value: 'macchiato'
            },
            {
              label: 'Cappuccino',
              value: 'cappuccino'
            },
            {
              label: 'White coffee',
              value: 'white-coffee'
            }
          ]
        }
      ]
    }
  }
}
</script>
