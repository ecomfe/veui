<template>
<article>
  <h1><code>&lt;veui-tree&gt;</code></h1>
  <section>
    <h4>Item click</h4>
    <veui-radio-group
      v-model="mode"
      :items="modes"
    />
  </section>
  <section>
    <h4>Expanded items</h4>
    {{ expanded }}
  </section>
  <section>
    <h4>item-label slot was override</h4>
    <veui-tree
      :datasource="coffees"
      :item-click="mode"
      :expanded.sync="expanded"
    >
      <template slot-scope="props" slot="item-label">{{ props.item.label }}</template>
    </veui-tree>
  </section>
  <section>
    <h4>item slot was override</h4>
    <veui-tree
      :datasource="coffees"
      :item-click="mode"
      :expanded.sync="expanded"
    >
      <template slot-scope="props" slot="item">{{ props.item.label }}</template>
    </veui-tree>
  </section>
</article>
</template>

<script>
import { RadioGroup, Tree } from 'veui'

export default {
  name: 'tree',
  components: {
    'veui-radio-group': RadioGroup,
    'veui-tree': Tree
  },
  data () {
    return {
      modes: [
        { label: 'none', value: 'none' },
        { label: 'toggle', value: 'toggle' }
      ],
      mode: 'toggle',
      expanded: ['infused', 'brewed'],
      coffees: [
        {
          label: 'Infused',
          value: 'infused',
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
                  value: 'filtered'
                },
                {
                  label: 'Pour-over',
                  value: 'pour-over'
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
              value: 'cafe-lungo'
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
              value: 'cafe-zorro'
            },
            {
              label: 'Doppio',
              value: 'doppio'
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
              label: 'Flat white',
              value: 'flat-white'
            },
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
            },
            {
              label: 'Flat white',
              value: 'flat-white'
            },
            {
              label: 'Flat white',
              value: 'flat-white'
            }
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>
p {
  margin: 30px;
}
</style>
