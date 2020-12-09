<template>
<article>
  <h1><code>&lt;veui-checkbox-group&gt;</code></h1>
  <p>
    <veui-checkbox-group
      v-model="picked1"
      :items="data1"
    >
      <template #item="props">
        {{ props.label }}
      </template>
    </veui-checkbox-group>
  </p>
  <p>value: {{ picked1 }}</p>
  <p>
    <veui-checkbox-group
      v-model="picked2"
      :items="data2"
      ui="s"
    >
      <template
        slot="item"
        slot-scope="props"
      >
        {{ props.label }}
      </template>
    </veui-checkbox-group>
  </p>
  <p>value: {{ picked2 }}</p>
  <section>
    <h3>有排他性选项</h3>
    <p>
      <veui-checkbox-group
        v-model="pickedWithExclusive"
        :items="dataWithExclusive"
        ui="s"
      />
    </p>
    <p>value: {{ pickedWithExclusive }}</p>
  </section>
  <section>
    <h3>有 empty-value 的情况（空值选中：Exclusive1）</h3>
    <p>
      <veui-checkbox-group
        v-model="pickedWithEmpty"
        :items="dataWithExclusive"
        empty-value="Exclusive1"
        ui="s"
      />
    </p>
    <p>value: {{ pickedWithEmpty }}</p>
  </section>
  <section>
    <h3>多行</h3>
    <p>
      <veui-checkbox-group
        v-model="picked3"
        :items="data3"
      />
    </p>
    <p>value: {{ picked3 }}</p>
  </section>
</article>
</template>

<script>
import { CheckboxGroup } from 'veui'

export default {
  name: 'checkbox-group-demo',
  components: {
    'veui-checkbox-group': CheckboxGroup
  },
  data () {
    return {
      picked1: ['Hirasawa Yui', 'Akiyama Mio'],
      picked2: [],
      picked3: [],
      pickedWithExclusive: [],
      pickedWithEmpty: [],
      data1: [
        {
          value: 'Hirasawa Yui',
          label: 'Hirasawa Yui'
        },
        {
          value: 'Akiyama Mio',
          label: 'Akiyama Mio'
        },
        {
          value: 'Nakano Azusa',
          label: 'Nakano Azusa'
        }
      ],
      data2: [
        {
          value: 'Hirasawa Yui',
          label: 'Hirasawa Yui'
        },
        {
          value: 'Akiyama Mio',
          label: 'Akiyama Mio'
        },
        {
          value: 'Nakano Azusa',
          label: 'Nakano Azusa'
        }
      ],
      dataWithExclusive: [
        {
          value: 'Exclusive1',
          label: 'Exclusive1',
          exclusive: true
        },
        {
          value: 'Exclusive2',
          label: 'Exclusive2',
          exclusive: true
        },
        {
          value: 'Hirasawa Yui',
          label: 'Hirasawa Yui'
        },
        {
          value: 'Akiyama Mio',
          label: 'Akiyama Mio'
        },
        {
          value: 'Nakano Azusa',
          label: 'Nakano Azusa'
        }
      ],
      data3: [
        {
          label: 'Steve Rogers',
          value: 'steve'
        },
        {
          label: 'Tony Stark',
          value: 'tony'
        },
        {
          label: 'Thor',
          value: 'thor'
        },
        {
          label: 'Hulk',
          value: 'hulk'
        },
        {
          label: 'Natasha Romanov',
          value: 'natasha'
        },
        {
          label: 'Stephen Strange',
          value: 'stephen'
        },
        {
          label: 'Peter Parker',
          value: 'peter'
        },
        {
          label: 'Vision',
          value: 'vision'
        },
        {
          label: 'Clint Barton',
          value: 'clint'
        },
        {
          label: 'Carol Danvers',
          value: 'carol'
        }
      ]
    }
  }
}
</script>
