<template>
<article>
  <h1><code>&lt;veui-tree&gt;</code></h1>
  <section>
    <h4>Expanded items</h4>
    {{ expanded }}
  </section>
  <section>
    <h4>item-label slot was override</h4>
    <veui-tree
      :datasource="coffees"
      :expanded.sync="expanded"
    />
  </section>
  <section>
    <h4>item slot was override</h4>
    <veui-tree
      :datasource="coffees"
      :expanded.sync="expanded"
    >
      <template
        slot="item"
        slot-scope="item"
      >
        {{ item.label }}
      </template>
    </veui-tree>
  </section>
  <section>
    <h4>Checkable item</h4>
    <veui-tree
      v-model="checked"
      :datasource="coffees"
      :expanded.sync="expanded"
      checkable
    />
  </section>
  <section>
    <h4>Checkable & Selectable item</h4>
    checkStrategy：
    <veui-radio-group
      v-model="strategy"
      class="check-strategy"
      :items="strategies"
    />
    <veui-tree
      v-model="checked2"
      :datasource="coffees"
      :expanded.sync="expanded2"
      :selected.sync="selected"
      :merge-checked="
        strategy === 'include-indeterminate' ? 'keep-all' : strategy
      "
      :include-indeterminate="strategy === 'include-indeterminate'"
      checkable
      selectable
    />
  </section>
  <section>
    <h4>Checked items</h4>
    {{ checked2 }}
  </section>
  <section>
    <h4>Selected items</h4>
    {{ selected }}
  </section>
  <section>
    <h4>Checkable & Selectable item(存在父节点无value)</h4>
    mergeChecked：
    <veui-radio-group
      v-model="strategy3"
      class="check-strategy"
      :items="strategies"
    />
    <veui-tree
      v-model="checked3"
      :datasource="coffeesWithoutGroupValue"
      :expanded.sync="expanded3"
      :selected.sync="selected3"
      :merge-checked="strategy3"
      checkable
      selectable
    />
    <h4>Checked items</h4>
    {{ checked3 }}
    <h4>Selected items</h4>
    {{ selected3 }}
  </section>
</article>
</template>

<script>
import { Tree, RadioGroup } from 'veui'
import { omit } from 'lodash'

export default {
  name: 'tree',
  components: {
    'veui-tree': Tree,
    'veui-radio-group': RadioGroup
  },
  data () {
    return {
      expanded: ['infused', 'brewed'],
      expanded2: [],
      checked: [],
      selected: null,
      checked2: null,
      strategy: 'keep-all',
      expanded3: [],
      selected3: null,
      checked3: null,
      strategy3: 'keep-all',
      strategies: [
        { label: 'keep-all', value: 'keep-all' },
        { label: 'downwards', value: 'downwards' },
        { label: 'upwards', value: 'upwards' },
        { label: 'include-indeterminate', value: 'include-indeterminate' }
      ],
      coffees: [
        {
          label: 'Infused',
          value: 'infused',
          disabled: true,
          children: [
            {
              label: 'Brewed',
              value: 'brewed',
              children: [
                {
                  label: 'Drip brewed',
                  value: 'drip-brewed'
                },
                {
                  label: 'Filtered',
                  value: 'filtered',
                  disabled: true
                },
                {
                  label: 'Pour-over',
                  value: 'pour-over',
                  disabled: true
                },
                {
                  label: 'Immersion brewed',
                  value: 'immersion-brewed'
                }
              ]
            },
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
          label: 'Boiled',
          value: 'boiled',
          disabled: true,
          children: [
            {
              label: 'Percolated',
              value: 'percolated'
            },
            {
              label: 'Turkish',
              value: 'turkish'
            },
            {
              label: 'Moka',
              value: 'moka'
            }
          ]
        },
        {
          label: 'Espresso',
          value: 'espresso',
          children: [
            {
              label: 'Caffè Americano',
              value: 'caffe-americano'
            },
            {
              label: 'Cafe Lungo',
              value: 'cafe-lungo',
              disabled: true
            },
            {
              label: 'Café Cubano',
              value: 'cafe-cubano'
            },
            {
              label: 'Caffè crema',
              value: 'caffe-crema'
            },
            {
              label: 'Cafe Zorro',
              value: 'cafe-zorro',
              disabled: true
            },
            {
              label: 'Doppio',
              value: 'doppio',
              disabled: true
            },
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
          children: [
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
              value: 'cappuccino',
              children: [
                {
                  label: 'Cap1',
                  value: 'cap1'
                },
                {
                  label: 'Cap2',
                  value: 'cap2'
                }
              ]
            },
            {
              label: 'White coffee',
              value: 'white-coffee'
            }
          ]
        }
      ]
    }
  },
  computed: {
    coffeesWithoutGroupValue () {
      return this.omitGroupValue(this.coffees)
    }
  },
  methods: {
    omitGroupValue (original) {
      return original.map(i => {
        if (i.children && i.children.length) {
          if (i.value === 'milk-coffee') {
            i = {
              ...i,
              label: `${i.label}(有value)`
            }
          } else if (i.value === 'cappuccino') {
            i = {
              ...omit(i, 'value'),
              label: `${i.label}(无value无name)`
            }
          } else {
            i = {
              ...omit(i, 'value'),
              label: `${i.label}(无value)`,
              name: i.value
            }
          }
          i.children = this.omitGroupValue(i.children)
        }
        return i
      })
    }
  }
}
</script>

<style scoped>
p {
  margin: 30px;
}
.check-strategy {
  display: inline-flex;
}
</style>
