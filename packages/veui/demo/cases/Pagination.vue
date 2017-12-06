<template>
  <article>
    <h1><code>&lt;veui-pagination&gt;</code></h1>
    <section>
      <h2>四种版式</h2>
      <p><veui-pagination :page="page" :total="total" :to="to"></veui-pagination></p>

      <p><veui-pagination :page="page" :total="total" :to="to" ui="hetero"></veui-pagination></p>

      <p><veui-pagination :page="page" :total="total" :page-sizes="pageSizes" :to="to" ui="full" :page-size.sync="pageSize"></veui-pagination></p>
      <p style="margin-top: -4em"><veui-pagination :page="page" :total="total" :page-sizes="pageSizes" :to="to" ui="full" :page-size.sync="pageSize"></veui-pagination></p>
      <p style="margin-top: -4em"><veui-pagination :page="page" :total="total" :page-sizes="pageSizes" :to="to" ui="full" :page-size="30"></veui-pagination></p>

      <p><veui-pagination :page="page" :total="total" :to="to" ui="slim"></veui-pagination></p>
    </section>

    <section>
      <h2>目标位置模板</h2>
      <p><small>格式和 &lt;router-link&gt; 的 to prop 一样</small></p>
      <p><veui-pagination :page="page" :total="total" ui="advanced"
        :to="{name: 'Pager', params: { page: ':page'}}"></veui-pagination></p>
    </section>

    <section>
      <h2>原生跳转</h2>
      <p><veui-pagination :page="page" :total="total" :to="'#' + to" ui="advanced" :native="true"></veui-pagination></p>
    </section>

    <section>
      <h2>事件与阻止跳转</h2>
      <p><small>仅原生跳转可用</small></p>
      <p><veui-pagination :page="page" :total="total" :to="to" ui="advanced" :native="true"
        @redirect="handlePageRedirect"></veui-pagination></p>
      <div class="message">{{ fifthPagerMessage }}</div>
    </section>

    <section>
      <h2>没有数据时</h2>
      <p><veui-pagination :page="1" :total="0" :to="'#' + to" ui="full" :native="true"></veui-pagination></p>
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
      fifthPagerMessage: ''
    }
  },
  methods: {
    handlePageRedirect ({page, event}) {
      event.preventDefault()
      this.fifthPagerMessage = `已阻止你跳转到第${page}页`
    }
  },
  mounted () {
    this.$children.forEach(child => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
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
