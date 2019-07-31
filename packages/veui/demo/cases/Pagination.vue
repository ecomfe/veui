<template>
<article>
  <h1><code>&lt;veui-pagination&gt;</code></h1>
  <section>
    <h2>三种尺寸</h2>
    <section>
      <veui-pagination
        :page="page"
        :total="total"
        :to="to"
        goto
      />
    </section>

    <section>
      <veui-pagination
        :page="page"
        :total="total"
        :to="to"
        goto
        ui="s"
      />
    </section>

    <section>
      <veui-pagination
        :page="page"
        :total="total"
        :page-sizes="pageSizes"
        :to="to"
        goto
        ui="xs"
        :page-size.sync="pageSize"
      />
    </section>
  </section>

  <section>
    <h2>目标位置模板</h2>
    <section>
      <small>格式和 &lt;router-link&gt; 的 to prop 一样</small>
    </section>
    <section>
      <veui-pagination
        :page="page"
        :total="total"
        :to="{ name: 'Pagination', params: { page: ':page' } }"
      />
    </section>
  </section>

  <section>
    <h2>原生跳转</h2>
    <section>
      <veui-pagination
        :page="page"
        :total="total"
        :to="'#' + to"
        native
      />
    </section>
  </section>

  <section>
    <h2>阻止跳转</h2>
    <section>
      <small>仅原生跳转可阻止已配置 <code>to</code> 的跳转</small>
    </section>
    <section>
      <veui-pagination
        :page="page"
        :total="total"
        :to="to"
        native
        @redirect="handlePageRedirect"
      />
    </section>
    <div class="message">
      {{ fifthPaginationMessage }}
    </div>
  </section>

  <section>
    <h2>自定义事件处理</h2>
    <section>
      <veui-pagination
        :page="p"
        :total="total"
        @redirect="handleCustomRedirect"
      />
    </section>
  </section>

  <section>
    <h2>没有数据时</h2>
    <section>
      <veui-pagination
        :page="1"
        :total="0"
        :to="'#' + to"
        native
      />
    </section>
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
  beforeRouteUpdate ({ params }, from, next) {
    let page = parseInt(params.page, 10)
    this.page = isNaN(page) ? 1 : page
    next()
  }
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 3em;

  section {
    margin-bottom: 2em;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
