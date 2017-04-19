<template>
  <article>
    <h1><code>&lt;veui-pager&gt;</code></h1>
    <div class="pager">
      <h2>五种版式</h2>
      <veui-pager :page-no="pageNo" :page-total="pageTotal" :href-tpl="hrefTpl"></veui-pager>

      <veui-pager :page-no="pageNo" :page-total="pageTotal" :href-tpl="hrefTpl" ui="hetero"></veui-pager>

      <veui-pager :page-no="pageNo" :page-total="pageTotal" :href-tpl="hrefTpl" ui="advanced"></veui-pager>

      <veui-pager :page-no="pageNo" :page-total="pageTotal" :href-tpl="hrefTpl" ui="full"></veui-pager>

      <veui-pager :page-no="pageNo" :page-total="pageTotal" :href-tpl="hrefTpl" ui="slim"></veui-pager>
    </div>

    <div class="pager">
      <h2>目标位置模板</h2>
      <p><small>格式和 &lt;router-link&gt; 的 to prop 一样</small></p>
      <veui-pager :page-no="pageNo" :page-total="pageTotal" ui="advanced"
        :href-tpl="{name: 'Pager', params: { pageNo: ':pageNo'}}"></veui-pager>
    </div>

    <div class="pager">
      <h2>原生跳转</h2>
      <veui-pager :page-no="pageNo" :page-total="pageTotal" :href-tpl="'#' + hrefTpl" ui="advanced" :native="true"></veui-pager>
    </div>

    <div class="pager">
      <h2>事件与阻止跳转</h2>
      <p><small>仅原生跳转可用</small></p>
      <veui-pager :page-no="pageNo" :page-total="pageTotal" :href-tpl="hrefTpl" ui="advanced" :native="true"
        @redirect="handlePageRedirect"></veui-pager>
      <div class="message">{{ fifthPagerMessage }}</div>
    </div>
  </article>
</template>

<script>
import bus from '../bus'
import Pager from '@/components/Pager'

export default {
  name: 'pager',
  components: {
    'veui-pager': Pager
  },
  data () {
    return {
      pageNo: parseInt(this.$route.params.pageNo, 10) || 1,
      pageTotal: 10101,
      hrefTpl: '/pager/:pageNo',
      fifthPagerMessage: ''
    }
  },
  methods: {
    handlePageRedirect ({pageNo, event}) {
      event.preventDefault()
      this.fifthPagerMessage = `已阻止你跳转到第${pageNo}页`
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
    let pageNo = parseInt(params.pageNo, 10)
    this.pageNo = isNaN(pageNo) ? 1 : pageNo
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
