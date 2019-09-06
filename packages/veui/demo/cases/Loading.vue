<template>
<article>
  <h1><code>&lt;veui-loading&gt;</code></h1>
  <div class="veui-loading-demo">
    <section>
      <h3>基础加载</h3>
      <p>
        大尺寸：
        <veui-loading
          loading
          ui="l"
        />
      </p>
      <p>
        中等尺寸：
        <veui-loading
          loading
          ui="m"
        />
      </p>
      <p>
        小尺寸：
        <veui-loading
          loading
          ui="s"
        />
      </p>
      <p>
        普通效果：
        <veui-loading
          loading
          ui="normal"
        />
      </p>
      <p>
        加强效果：
        <veui-loading
          loading
          ui="strong"
        />
      </p>
      <p>
        反白效果：
        <veui-loading
          loading
          ui="reverse"
          class="reverse"
        />
      </p>
    </section>
    <section>
      <h3>含辅助文案加载</h3>
      <p>
        大尺寸：
        <veui-loading
          loading
          ui="l"
        >
          加载中...
        </veui-loading>
      </p>
      <p>
        中等尺寸：
        <veui-loading
          loading
          ui="m"
        >
          加载中...
        </veui-loading>
      </p>
      <p>
        小尺寸：
        <veui-loading
          loading
          ui="s"
        >
          加载中...
        </veui-loading>
      </p>
      <p>
        普通效果：
        <veui-loading
          loading
          ui="normal"
        >
          加载中...
        </veui-loading>
      </p>
      <p>
        加强效果：
        <veui-loading
          loading
          ui="strong"
        >
          加载中...
        </veui-loading>
      </p>
      <p>
        反白效果：
        <veui-loading
          loading
          ui="reverse"
          class="reverse"
        >
          加载中...
        </veui-loading>
      </p>
      <p>
        文字垂直显示：
        <veui-loading
          loading
          class="reverse"
          ui="reverse vertical"
        >
          加载中...
        </veui-loading>
      </p>
    </section>
    <section>
      <h3>自定义加载图标</h3>
      <p>
        自定义图标-星星：
        <veui-loading
          loading
          ui="strong"
        >
          <template slot="spinner">
            <veui-icon
              spin
              name="star"
            />
          </template>
          拼命加载中...
        </veui-loading>
      </p>
      <p>
        自定义图标-太阳：
        <veui-loading loading>
          <template slot="spinner">
            <veui-icon
              spin
              name="sun"
            />
          </template>
          拼命加载中...
        </veui-loading>
      </p>
      <p>
        自定义图标-雨伞：
        <veui-loading
          loading
          ui="reverse"
          class="reverse"
        >
          <template slot="spinner">
            <veui-icon
              spin
              name="umbrella"
            />
          </template>
          拼命加载中...
        </veui-loading>
      </p>
    </section>
    <section>
      <h3>简单示例</h3>
      <p>
        MVP选票数：
        <veui-loading :loading="loading">实时MVP选票数加载中...</veui-loading>
        <template v-if="!loading">
          <veui-span>{{ voteAccount }}</veui-span>
          <veui-button
            ui="primary"
            @click="handleClick"
          >获取实时投票数</veui-button>
        </template>
      </p>
    </section>
  </div>
</article>
</template>
<script>
import 'vue-awesome/icons/star'
import 'vue-awesome/icons/sun'
import 'vue-awesome/icons/umbrella'

import { Loading, Button, Icon, Span } from 'veui'
export default {
  name: 'loading',
  components: {
    'veui-loading': Loading,
    'veui-button': Button,
    'veui-icon': Icon,
    'veui-span': Span
  },
  data () {
    return {
      loading: false,
      voteAccount: 120
    }
  },
  methods: {
    handleClick () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.voteAccount += 100
      }, 1000)
    }
  }
}
</script>
<style lang="less">
.veui-loading-demo {
  .reverse {
    background: #ccc;
    padding: 8px;
  }
  p {
    display: flex;
    line-height: 32px;
  }
  .veui-span {
    margin-right: 15px;
  }
}
</style>
