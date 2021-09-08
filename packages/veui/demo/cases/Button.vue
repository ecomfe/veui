<template>
<article>
  <h1>
    <code>&lt;veui-button&gt;</code>
  </h1>
  <section>
    <veui-button
      ui="xs"
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      ui="s"
      @click="handleClick"
    >保存</veui-button>
    <veui-button @click="handleClick">保存</veui-button>
    <veui-button
      ui="l"
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      ui="xl"
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      v-tooltip="'点击保存'"
      disabled
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      loading
      @click="handleClick"
    >保存</veui-button>
  </section>
  <section>
    <veui-button
      ui="basic xs"
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      ui="basic s"
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      ui="basic"
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      ui="basic l"
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      ui="basic xl"
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      ui="basic"
      disabled
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      ui="basic"
      loading
      @click="handleClick"
    >保存</veui-button>
  </section>
  <section>
    <veui-button
      ui="strong xs"
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      ui="strong s"
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      ui="strong"
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      ui="strong l"
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      ui="strong xl"
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      ui="strong"
      disabled
      @click="handleClick"
    >保存</veui-button>
    <veui-button
      ui="strong"
      loading
      @click="handleClick"
    >保存</veui-button>
  </section>
  <section>
    <veui-button
      ui="primary xs"
      @click="handleClick"
    >提交</veui-button>
    <veui-button
      ui="primary s"
      @click="handleClick"
    >提交</veui-button>
    <veui-button
      ui="primary"
      @click="handleClick"
    >提交</veui-button>
    <veui-button
      ui="primary l"
      @click="handleClick"
    >提交</veui-button>
    <veui-button
      ui="primary xl"
      @click="handleClick"
    >提交</veui-button>
    <veui-button
      ui="primary"
      disabled
      @click="handleClick"
    >提交</veui-button>
    <veui-button
      ui="primary"
      loading
      @click="handleClick"
    >提交</veui-button>
  </section>
  <section>
    <veui-button
      ui="xs"
      @click="handleClick"
    >
      <veui-icon name="times"/>取消
    </veui-button>
    <veui-button
      ui="s"
      @click="handleClick"
    >
      <veui-icon name="times"/>取消
    </veui-button>
    <veui-button @click="handleClick">
      <veui-icon name="times"/>取消
    </veui-button>
    <veui-button
      ui="l"
      @click="handleClick"
    >
      <veui-icon name="times"/>取消
    </veui-button>
    <veui-button
      ui="xl"
      @click="handleClick"
    >
      <veui-icon name="times"/>取消
    </veui-button>
    <veui-button
      disabled
      @click="handleClick"
    >
      <veui-icon name="times"/>取消
    </veui-button>
    <veui-button
      loading
      @click="handleClick"
    >
      <veui-icon name="times"/>取消
    </veui-button>
  </section>
  <section>
    <veui-button
      ui="translucent xs"
      @click="handleClick"
    >取消</veui-button>
    <veui-button
      ui="translucent s"
      @click="handleClick"
    >取消</veui-button>
    <veui-button
      ui="translucent"
      @click="handleClick"
    >取消</veui-button>
    <veui-button
      ui="translucent l"
      @click="handleClick"
    >取消</veui-button>
    <veui-button
      ui="translucent xl"
      @click="handleClick"
    >取消</veui-button>
    <veui-button
      ui="translucent"
      disabled
      @click="handleClick"
    >取消</veui-button>
    <veui-button
      ui="translucent"
      loading
      @click="handleClick"
    >取消</veui-button>
  </section>
  <section>
    <veui-button
      ui="text xs"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text s"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text l"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text xl"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text"
      disabled
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text"
      loading
      @click="handleClick"
    >编辑</veui-button>
  </section>
  <section>
    <veui-button
      ui="text strong xs"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text strong s"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text strong"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text strong l"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text strong xl"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text"
      disabled
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text"
      loading
      @click="handleClick"
    >编辑</veui-button>
  </section>
  <section>
    <veui-button
      ui="text aux xs"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text aux s"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text aux"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text aux l"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text aux xl"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text"
      disabled
      @click="handleClick"
    >编辑</veui-button>
    <veui-button
      ui="text"
      loading
      @click="handleClick"
    >编辑</veui-button>
  </section>
  <section>
    <veui-button
      ui="icon xs"
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon s"
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon"
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon l"
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon xl"
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon"
      disabled
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon"
      loading
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
  </section>
  <section>
    <veui-button
      ui="icon strong xs"
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon strong s"
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon strong"
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon strong l"
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon strong xl"
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon strong"
      disabled
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon strong"
      loading
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
  </section>
  <section>
    <veui-button
      ui="icon aux xs"
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon aux s"
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon aux"
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon aux l"
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon aux xl"
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon aux"
      disabled
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon aux"
      loading
      @click="handleClick"
    >
      <veui-icon name="search"/>
    </veui-button>
  </section>
  <section class="block">
    <h4>动态内容</h4>
    <p>
      <veui-button @click="handleClickAndToggle">
        <veui-icon name="times"/>
        <template v-if="text">取消</template>
      </veui-button>
    </p>
  </section>
  <section class="block">
    <h4>方形按钮</h4>
    <p>
      <veui-button
        ui="square"
        @click="handleClick"
      >
        <veui-icon name="search"/>
      </veui-button>
      <veui-button
        ui="square basic"
        @click="handleClick"
      >
        <veui-icon name="search"/>
      </veui-button>
      <veui-button
        ui="square primary"
        @click="handleClick"
      >
        <veui-icon name="search"/>
      </veui-button>
      <veui-button
        ui="square strong"
        @click="handleClick"
      >
        <veui-icon name="search"/>
      </veui-button>
      <veui-button
        ui="square translucent"
        @click="handleClick"
      >
        <veui-icon name="search"/>
      </veui-button>
    </p>
  </section>
  <section class="inline">
    文本 Text
    <veui-button
      ui="text"
      @click="handleClick"
    >
      Text
    </veui-button>
    <veui-button
      ui="icon"
      @click="handleClick"
    >
      <veui-icon name="home"/>
    </veui-button>
    <veui-button
      ui="icon strong"
      @click="handleClick"
    >
      <veui-icon name="home"/>
    </veui-button>
    <veui-button
      ui="icon aux"
      @click="handleClick"
    >
      <veui-icon name="home"/>
    </veui-button>
    <veui-button
      ui="primary square"
      @click="handleClick"
    >
      <veui-icon name="home"/>
    </veui-button>
    <veui-button
      ui="text aux"
      @click="handleClick"
    >编辑</veui-button>
    <veui-button @click="handleClick">保存</veui-button>
  </section>
</article>
</template>

<script>
import bus from '../bus'
import { Button, Icon } from 'veui'
import tooltip from 'veui/directives/tooltip'
import 'veui-theme-dls-icons/check'
import 'veui-theme-dls-icons/edit'
import 'veui-theme-dls-icons/times'
import 'veui-theme-dls-icons/search'
import 'veui-theme-dls-icons/home'

export default {
  name: 'button-demo',
  components: {
    'veui-icon': Icon,
    'veui-button': Button
  },
  directives: {
    tooltip
  },
  data () {
    return {
      text: false
    }
  },
  methods: {
    handleClick (e) {
      bus.$emit('log', e.currentTarget.getAttribute('ui'))
    },
    handleClickAndToggle (e) {
      this.handleClick(e)
      this.text = !this.text
    }
  }
}
</script>

<style scoped>
section {
  user-select: none;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.block {
  display: block;
}

.veui-button {
  margin-right: 10px;
}

.inline {
  display: block;
}
</style>
