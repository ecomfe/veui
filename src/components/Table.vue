<template>
<div class="veui-table">
  <colgroup><slot></slot></colgroup>
  <table-head :data="data" :columns="columns"></table-head>
  <table-body :data="data" :columns="columns"></table-body>
  <table-foot v-if="hasFoot" :data="data" :columns="columns"></table-foot>
</div>
</template>

<script>
let instanceCount = 0

function getContentComponent (type) {
  return {
    props: {
      data: Array,
      columns: Array
    },
    render () {
      if (type === 'body') {
        return (
          <tbody>
            {this._l(this.data, (item, index) => (
              <tr>
                {this._l(this.columns, col => (
                  <td>{col.renderBody.call(this._renderProxy, { item, col })}</td>
                ))}
              </tr>
            ))}
          </tbody>
        )
      }

      const ContainerTag = `t${type}`
      return (
        <ContainerTag>
          <tr>
            {this._l(this.columns, col => (
              <th>{col[`render${type === 'head' ? 'Head' : 'Foot'}`].call(this._renderProxy, { col })}</th>
            ))}
          </tr>
        </ContainerTag>
      )
    }
  }
}

export default {
  name: 'veui-table',
  components: {
    'table-body': getContentComponent('body'),
    'table-head': getContentComponent('head'),
    'table-foot': getContentComponent('foot')
  },
  props: {
    ui: String,
    data: Array,
    caption: String
  },
  data () {
    return {
      tableId: ++instanceCount,
      columns: []
    }
  },
  computed: {
    hasFoot () {
      return this.columns.some(col => col.hasFoot)
    }
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-table {
  border-collapse: collapse;

  th,
  td {
    border: 1px solid #ccc;
  }
}
</style>
