<template>
<article class="anchor-demo">
  <h1><code>&lt;veui-anchor&gt;</code></h1>
  <div class="content-wrapper">
    <div class="line"/>
    <div
      v-for="i in ids"
      :id="i"
      :key="i"
      class="block"
    >
      {{ i }}
    </div>
  </div>
  <h2 class="sticky-header">sticky anchor</h2>
  <veui-anchor
    :container="container"
    class="anchor-one"
    :target-offset="0.1"
    :items="coffees0"
  >
    <span
      slot="item-label"
      slot-scope="{ label }"
    >{{ label }}🤘</span>
  </veui-anchor>
  <h2 class="header-four">sticky anchor (100px)</h2>
  <veui-anchor
    :container="container"
    class="anchor-four"
    :target-offset="0.1"
    sticky-offset="100px"
    :items="coffees0"
  />
  <h2 class="static-header">static small anchor</h2>
  <veui-anchor
    :sticky="false"
    ui="s"
    :target-offset="0.1"
    :container="container"
    class="anchor-two"
    :items="coffees"
  />

  <h2>clipped anchor</h2>
  <div class="anchor-three-wrapper anchor-three-scroll">
    <div
      ref="container"
      class="anchor-three-scroll"
    >
      <div class="long red"/>
      <veui-anchor
        container="container"
        class="anchor-three"
        :items="coffees0"
      />
    </div>
    <div class="long blue"/>
  </div>
</article>
</template>

<script>
import { Anchor } from 'veui'

export default {
  name: 'anchor-demo',
  components: {
    'veui-anchor': Anchor
  },
  data () {
    let coffees0 = [
      {
        label: 'Infused',
        value: '#infused',
        children: [
          {
            label: 'Filtered',
            value: '#filtered'
          },
          {
            label: 'Pour-over',
            value: '#pour-over'
          }
        ]
      },
      {
        label: 'Boiled',
        value: '#boiled',
        children: [
          {
            label: 'Moka',
            value: '#moka'
          }
        ]
      },
      {
        label: 'Espresso',
        value: '#espresso',
        children: [
          {
            label: '外部导航：Breadcrumb',
            value: '/breadcrumb'
          }
        ]
      },
      {
        label: 'Milk coffee',
        value: '#milk-coffee'
      }
    ]

    return {
      container: null,
      coffees0,
      ids: [
        'infused',
        'filtered',
        'pour-over',
        'boiled',
        'moka',
        'espresso',
        'milk-coffee'
      ],
      coffees: [
        {
          label: 'Infused',
          value: '#infused',
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
                  value: '#filtered'
                },
                {
                  label: 'Pour-over',
                  value: '#pour-over'
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
          value: '#boiled',
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
              value: '#moka'
            }
          ]
        },
        {
          label: 'Espresso',
          value: '#espresso',
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
          value: '#milk-coffee',
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
            }
          ]
        }
      ]
    }
  },
  mounted () {
    this.container = document.querySelector('#content')
  }
}
</script>

<style lang="less">
main#content {
  overflow-x: auto;
}
.anchor-demo {
  &-middle {
    position: fixed;
    top: calc(50% - 15px);
    border-top: 1px solid #ccc;
    width: 100%;
  }
  .content-wrapper {
    position: relative;
    &::after {
      display: table;
      content: '';
      clear: both;
    }
    .block {
      float: left;
      clear: both;
      white-space: nowrap;
      border-top: 1px solid #ccc;
      width: 100px;
      height: 180px;
      & + .block {
        margin-top: 20px;
      }
    }
  }
  .anchor-one {
    position: absolute;
    left: 250px;
    top: 200px;
  }
  .sticky-header {
    position: absolute;
    left: 250px;
    top: 100px;
  }

  .anchor-two {
    position: absolute;
    left: 700px;
    top: 200px;
  }
  .header-four {
    position: absolute;
    left: 450px;
    top: 100px;
  }
  .anchor-four {
    position: absolute;
    top: 80px;
    left: 450px;
  }

  .static-header {
    position: absolute;
    left: 700px;
    top: 100px;
  }
  .anchor-three {
    position: absolute;
    top: 70px;
    left: 200px;
  }

  .anchor-three-wrapper {
    clear: both;
    border: 1px solid blue;
    .long {
      height: 500px;
    }
  }
  .anchor-three-scroll {
    overflow: auto;
    height: 300px;
    position: relative;
  }

  :target {
    border-color: red !important;
  }
  .line {
    position: fixed;
    top: ~'calc((100vh - 30px) * 0.1)';
    width: 180px;
    border-top: 1px solid #ccc;
    &::after {
      content: '10%';
      position: absolute;
      right: 0;
      bottom: 0;
      color: red;
      font-size: 12px;
    }
  }
}
</style>
