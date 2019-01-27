<template>
<article>
  <h1><code>&lt;veui-pagination&gt;</code></h1>
  <section>
    <h2>四种版式</h2>
    <p>
      <veui-pagination
        :page="page"
        :total="total"
        :to="to"
      />
    </p>

    <p>
      <veui-pagination
        :page="page"
        :total="total"
        :to="to"
        ui="hetero"
      />
    </p>

    <p>
      <veui-pagination
        :page="page"
        :total="total"
        :page-sizes="pageSizes"
        :to="to"
        ui="full"
        :page-size.sync="pageSize"
      />
    </p>
    <p>
      <veui-pagination
        :page="page"
        :total="total"
        :to="to"
        ui="slim"
      />
    </p>
  </section>

  <section>
    <h2>目标位置模板</h2>
    <p><small>格式和 &lt;router-link&gt; 的 to prop 一样</small></p>
    <p>
      <veui-pagination
        :page="page"
        :total="total"
        ui="advanced"
        :to="{ name: 'Pagination', params: { page: ':page'} }"
      />
    </p>
  </section>

  <section>
    <h2>原生跳转</h2>
    <p>
      <veui-pagination
        :page="page"
        :total="total"
        :to="'#' + to"
        ui="advanced"
        native
      />
    </p>
  </section>

  <section>
    <h2>阻止跳转</h2>
    <p><small>仅原生跳转可阻止已配置 <code>to</code> 的跳转</small></p>
    <p>
      <veui-pagination
        :page="page"
        :total="total"
        :to="to"
        ui="advanced"
        native
        @redirect="handlePageRedirect"
      />
    </p>
    <div class="message">
      {{ fifthPaginationMessage }}
    </div>
  </section>

  <section>
    <h2>自定义事件处理</h2>
    <p>
      <veui-pagination
        :page="p"
        :total="total"
        @redirect="handleCustomRedirect"
      />
    </p>
    <div class="message">
      {{ fifthPaginationMessage }}
    </div>
  </section>

  <section>
    <h2>没有数据时</h2>
    <p>
      <veui-pagination
        :page="1"
        :total="0"
        :to="'#' + to"
        ui="full"
        native
      />
    </p>
  </section>
</article>
</template>

<script>
import bus from '../bus'
import { Pagination } from 'veui'

export default {
  name: 'pagination-demo',
  components: {
    'veui-pagination': Pagination
  },
  data () {
    return {
      page: parseInt(this.$route.params.page, 10) || 1,
      total: 10101,
      to: '/pagination/:page',
      pageSize: 30,
      pageSizes: [30, 60, 100, 200],
      fifthPaginationMessage: '',
      p: 1
    }
  },
  mounted () {
    this.$children.forEach(child => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
  },
  methods: {
    handlePageRedirect (page, event) {
      event.preventDefault()
      this.fifthPaginationMessage = `已阻止你跳转到第${page}页`
    },
    handleCustomRedirect (page) {
      this.p = page
    }
  },
  beforeRouteUpdate ({params}, from, next) {
    let page = parseInt(params.page, 10)
    this.page = isNaN(page) ? 1 : page
    next()
  }
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 3em;
}
.veui-pagination {
  margin: 1em 0 3em;
}

.message {
  margin-top: -3em;
}
</style>
