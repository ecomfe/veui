<template>
  <article>
    <h1><code>&lt;veui-pager&gt;</code></h1>
    <div class="pager">
      <veui-pager :page-no="pageNo" :page-total="pageTotal" :href-tpl="hrefTpl"></veui-pager>
    </div>
    <div class="pager">
      <veui-pager :page-no="pageNo" :page-total="pageTotal" :href-tpl="hrefTpl" ui="hetero"></veui-pager>
    </div>
    <div class="pager">
      <veui-pager :page-no="pageNo" :page-total="pageTotal" :href-tpl="hrefTpl" ui="advanced"></veui-pager>
    </div>
    <div class="pager">
      <veui-pager :page-no="pageNo" :page-total="pageTotal" :href-tpl="hrefTpl" ui="full"></veui-pager>
    </div>
    <div class="pager">
      <veui-pager :page-no="pageNo" :page-total="pageTotal" :href-tpl="hrefTpl" ui="slim"></veui-pager>
    </div>

    <div class="pager">
      <veui-pager :page-no="pageNo" :page-total="pageTotal" :href-tpl="hrefTpl" ui="advanced"
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
      pageNo: 1,
      pageTotal: 10101,
      hrefTpl: '#/pager/$page',

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
  }
}
</script>

<style lang="less" scoped>
.pager {
  margin: 3em 0;
  padding: 1em;
  border-bottom: 1px dotted #FF6969;

  &:last-child {
    border-bottom: none;
  }
}
.message {
  margin-top: 10px;
}
</style>
