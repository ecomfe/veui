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
    <veui-tree
      v-model="checked"
      :datasource="coffees"
      :expanded.sync="expanded"
      :selected.sync="selected"
      checkable
      selectable
    />
  </section>
  <section>
    <h4>Checked items</h4>
    {{ checked }}
  </section>
  <section>
    <h4>Selected items</h4>
    {{ selected }}
  </section>
</article>
</template>

<script>
import { Tree } from 'veui'

export default {
  name: 'tree',
  components: {
    'veui-tree': Tree
  },
  data () {
    return {
      expanded: ['infused', 'brewed'],
      checked: ['filtered', 'cold-brew'],
      selected: null,
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

<style scoped>
p {
  margin: 30px;
}
</style>
