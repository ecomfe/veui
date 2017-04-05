<template>
  <article>
    <h1><code>&lt;veui-table&gt;</code></h1>
    <section>
      <veui-table :data="data">
        <veui-table-column field="id" title="ID">
          <template slot="foot" scope="props">Total</template>
        </veui-table-column>
        <veui-table-column field="name" title="Name">
          <template scope="props"><strong>{{ props.item.name }}</strong></template>
          <template slot="head" scope="props"><span style="color: #999;">Name</span></template>
        </veui-table-column>
        <veui-table-column field="role" title="Role">
          <template scope="props"><i>{{ props.item.role }}</i></template>
        </veui-table-column>
        <veui-table-column field="score" title="Score">
          <template slot="foot" scope="props">{{ data.map(item => item.score).reduce((acc, cur) => acc + cur) }}</template>
        </veui-table-column>
        <veui-table-column title="Operation">
          <template scope="props">
            <veui-button ui="small" @click="log(props.item)">Edit</veui-button>
          </template>
        </veui-table-column>
      </veui-table>
    </section>
  </article>
</template>

<script>
import bus from '../bus'
import Button from '@/components/Button'
import Table from '@/components/Table'
import Column from '@/components/TableColumn'

export default {
  name: 'table',
  components: {
    'veui-button': Button,
    'veui-table': Table,
    'veui-table-column': Column
  },
  data () {
    return {
      data: [
        {
          id: '1', name: 'Steve Rogers', role: 'Captain America', score: 90
        },
        {
          id: '2', name: 'Tony Stark', role: 'Ironman', score: 82
        },
        {
          id: '3', name: 'Natasha Romanova', role: 'Black Widow', score: 85
        }
      ]
    }
  },
  methods: {
    log (item) {
      bus.$emit('log', item)
    }
  }
}
</script>

<style lang="less">
th,
td {
  padding: .5em 1.5em !important;
}
</style>
