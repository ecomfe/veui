<template>
  <article>
    <h1><code>&lt;veui-pager&gt;</code></h1>
    <div class="pager">
      <h2>四种版式</h2>
      <veui-pager :page="page" :page-total="pageTotal" :to="to"></veui-pager>

      <veui-pager :page="page" :page-total="pageTotal" :to="to" ui="hetero"></veui-pager>

      <veui-pager :page="page" :page-total="pageTotal" :to="to" ui="full"></veui-pager>

      <veui-pager :page="page" :page-total="pageTotal" :to="to" ui="slim"></veui-pager>
    </div>

    <div class="pager">
      <h2>目标位置模板</h2>
      <p><small>格式和 &lt;router-link&gt; 的 to prop 一样</small></p>
      <veui-pager :page="page" :page-total="pageTotal" ui="advanced"
        :to="{name: 'Pager', params: { page: ':page'}}"></veui-pager>
    </div>

    <div class="pager">
      <h2>原生跳转</h2>
      <veui-pager :page="page" :page-total="pageTotal" :to="'#' + to" ui="advanced" :native="true"></veui-pager>
    </div>

    <div class="pager">
      <h2>事件与阻止跳转</h2>
      <p><small>仅原生跳转可用</small></p>
      <veui-pager :page="page" :page-total="pageTotal" :to="to" ui="advanced" :native="true"
        @redirect="handlePageRedirect"></veui-pager>
      <div class="message">{{ fifthPagerMessage }}</div>
    </div>
  </article>
</template>

<script>
import bus from '../bus'
import { Pager } from 'veui'

export default {
  name: 'pager-demo',
  components: {
    'veui-pager': Pager
  },
  data () {
    return {
      page: parseInt(this.$route.params.page, 10) || 1,
      pageTotal: 10101,
      to: '/pager/:page',
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
  destroyed () {

  },
  beforeRouteUpdate ({params}, from, next) {
    let page = parseInt(params.page, 10)
    this.page = isNaN(page) ? 1 : page
    next()
  }
}
</script>

<style lang="less" scoped>
.pager {
  margin-bottom: 4em;
}
.veui-pager {
  margin: 1em 0 4em;
}

.message {
  margin-top: -3em;
}
</style>
