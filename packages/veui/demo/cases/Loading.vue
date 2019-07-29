<template>
<article>
  <h1><code>&lt;veui-loading&gt;</code></h1>
  <veui-form>
    <section>
      <h3>基础加载</h3>
      <veui-field label="大尺寸：">
        <veui-span>
          <veui-loading
            :loading="true"
            ui="l"
          />
        </veui-span>
      </veui-field>
      <veui-field label="中等尺寸：">
        <veui-span>
          <veui-loading
            :loading="true"
            ui="m"
          />
        </veui-span>
      </veui-field>
      <veui-field label="小尺寸：">
        <veui-span>
          <veui-loading
            :loading="true"
            ui="s"
          />
        </veui-span>
      </veui-field>
      <veui-field label="普通效果：">
        <veui-span>
          <veui-loading
            :loading="true"
            ui="normal"
          />
        </veui-span>
      </veui-field>
      <veui-field label="加强效果：">
        <veui-span>
          <veui-loading
            :loading="true"
            ui="strong"
          />
        </veui-span>
      </veui-field>
      <veui-field
        label="反白效果："
        class="reverse"
      >
        <veui-span>
          <veui-loading
            :loading="true"
            ui="reverse"
          />
        </veui-span>
      </veui-field>
    </section>
    <section>
      <h3>含辅助文案加载</h3>
      <veui-field label="大尺寸：">
        <veui-span>
          <veui-loading
            :loading="true"
            ui="l"
          >
            加载中...
          </veui-loading>
        </veui-span>
      </veui-field>
      <veui-field label="中等尺寸：">
        <veui-span>
          <veui-loading
            :loading="true"
            ui="m"
          >
            加载中...
          </veui-loading>
        </veui-span>
      </veui-field>
      <veui-field label="小尺寸：">
        <veui-span>
          <veui-loading
            :loading="true"
            ui="s"
          >
            加载中...
          </veui-loading>
        </veui-span>
      </veui-field>
      <veui-field label="普通效果：">
        <veui-span>
          <veui-loading
            :loading="true"
            ui="normal"
          >
            加载中...
          </veui-loading>
        </veui-span>
      </veui-field>
      <veui-field label="加强效果：">
        <veui-span>
          <veui-loading
            :loading="true"
            ui="strong"
          >
            加载中...
          </veui-loading>
        </veui-span>
      </veui-field>
      <veui-field
        class="reverse"
        label="反白效果："
      >
        <veui-span>
          <veui-loading
            :loading="true"
            ui="reverse"
          >
            加载中...
          </veui-loading>
        </veui-span>
      </veui-field>
      <veui-field
        class="reverse"
        label="文字垂直显示："
      >
        <veui-span>
          <veui-loading
            :loading="true"
            ui="reverse vertical"
          >
            加载中...
          </veui-loading>
        </veui-span>
      </veui-field>
    </section>
    <section>
      <h3>自定义加载图标</h3>
      <veui-field label="自定义图标-星星">
        <veui-loading :loading="true">
          <template slot="spinner">
            <veui-icon
              spin
              name="star"
            />
          </template>
          loading...
        </veui-loading>
      </veui-field>
      <veui-field label="自定义图标-太阳">
        <veui-loading :loading="true">
          <template slot="spinner">
            <veui-icon
              spin
              name="sun"
            />
          </template>
        </veui-loading>
      </veui-field>
    </section>
    <section>
      <h3>简单示例</h3>
      <veui-field label="MVP选票数：">
        <veui-loading :loading="loading">实时MVP选票数加载中...</veui-loading>
        <template v-if="!loading">
          <veui-span>{{ voteAccount }}</veui-span>
          <veui-button
            ui="primary"
            @click="handleClick"
          >获取实时投票数</veui-button>
        </template>
      </veui-field>
    </section>
  </veui-form>
</article>
</template>
<script>
import { Form, Field, Span, Loading, Button, Icon } from 'veui'
export default {
  name: 'loading',
  components: {
    'veui-span': Span,
    'veui-form': Form,
    'veui-field': Field,
    'veui-loading': Loading,
    'veui-button': Button,
    'veui-icon': Icon
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
.reverse {
  background: #ccc;
}
</style>
