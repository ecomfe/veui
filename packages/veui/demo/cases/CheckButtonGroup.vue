<template>
<article>
  <h1>
    <code>&lt;veui-check-button-group&gt;</code>
  </h1>
  <section>
    <veui-checkbox v-model="disabled">禁用</veui-checkbox>
  </section>
  <section>
    <p>
      <veui-check-button-group
        v-model="picked1"
        :items="data1"
        :disabled="disabled"
      >
        <template #item="props">{{ props.label }}</template>
      </veui-check-button-group>
    </p>
    <p>value: {{ picked1 }}</p>
  </section>
  <section>
    <p>
      <veui-check-button-group
        v-model="picked2"
        :items="data2"
        ui="s"
        :disabled="disabled"
      >
        <template #item="props">{{ props.label }}</template>
        <template #desc>您没有权限！</template>
      </veui-check-button-group>
    </p>
    <p>value: {{ picked2 }}</p>
  </section>
  <section>
    <p>
      <veui-check-button-group
        v-model="picked3"
        :items="data3"
        ui="s"
        :disabled="disabled"
      >
        <template #item="props">
          <veui-icon :name="props.icon"/>
        </template>
      </veui-check-button-group>
    </p>
    <p>value: {{ picked3 }}</p>
  </section>
  <section>
    <h3>有排他性选项</h3>
    <p>
      <veui-check-button-group
        v-model="pickedWithExclusive"
        :items="dataWithExclusive"
        :disabled="disabled"
        ui="s"
      />
    </p>
    <p>value: {{ pickedWithExclusive }}</p>
  </section>
  <section>
    <h3>有 empty-value 的情况（空值选中：Exclusive1）</h3>
    <p>
      <veui-check-button-group
        v-model="pickedWithEmpty"
        :items="dataWithExclusive"
        :disabled="disabled"
        empty-value="Exclusive1"
        ui="s"
      />
    </p>
    <p>value: {{ pickedWithEmpty }}</p>
  </section>
  <section>
    <h3>简单样式（simple）</h3>
    <p>
      <veui-check-button-group
        v-model="pickedWithSimple"
        :items="dataWithExclusive"
        :disabled="disabled"
        ui="simple"
      />
    </p>
    <h3>简单样式（simple s 最小宽度）</h3>
    <p>
      <veui-check-button-group
        v-model="pickedWithSimple"
        :items="dataWithExclusive"
        :disabled="disabled"
        ui="simple s stable"
      />
    </p>
    <p>value: {{ pickedWithSimple }}</p>
  </section>
</article>
</template>

<script>
import { CheckButtonGroup, Checkbox, Icon } from 'veui'
import 'veui-theme-dls-icons/check'
import 'veui-theme-dls-icons/times'
import 'veui-theme-dls-icons/sync'
import 'veui-theme-dls-icons/edit'

export default {
  name: 'check-button-group-demo',
  components: {
    'veui-check-button-group': CheckButtonGroup,
    'veui-checkbox': Checkbox,
    'veui-icon': Icon
  },
  data () {
    return {
      picked1: ['Hirasawa Yui', 'Akiyama Mio'],
      picked2: [],
      picked3: [],
      pickedWithExclusive: [],
      pickedWithEmpty: [],
      pickedWithSimple: [],
      disabled: false,
      data1: [
        {
          value: 'Hirasawa Yui',
          label: 'Hirasawa Yui',
          desc: "You don't have enough permissions"
        },
        {
          value: 'Akiyama Mio',
          label: 'Akiyama Mio',
          desc: 'Oh! no'
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
          exclusive: true,
          tooltip: 'Exclusive2'
        },
        {
          label: 'Steve Rogers',
          value: 'steve',
          tooltip: 'Steve Rogers'
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
      ],
      data3: [
        {
          value: 'check',
          icon: 'check'
        },
        {
          value: 'times',
          icon: 'times'
        },
        {
          value: 'sync',
          icon: 'sync'
        },
        {
          value: 'edit',
          icon: 'edit'
        }
      ]
    }
  }
}
</script>
