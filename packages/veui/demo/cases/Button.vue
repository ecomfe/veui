<template>
<article>
  <h1>
    <code>&lt;veui-button&gt;</code>
  </h1>
  <section>
    <h4>普通按钮</h4>
    <section>
      <veui-button
        ui="xs"
        @click="handleClick"
        @mouseenter="handleEnter"
      >保存</veui-button>
      <veui-button
        ui="s"
        @click="handleClick"
        @mouseenter="handleEnter"
      >保存</veui-button>
      <veui-button
        @click="handleClick"
        @mouseenter="handleEnter"
      >保存</veui-button>
      <veui-button
        ui="l"
        @click="handleClick"
        @mouseenter="handleEnter"
      >保存</veui-button>
      <veui-button
        ui="xl"
        @click="handleClick"
        @mouseenter="handleEnter"
      >保存</veui-button>
      <veui-button
        v-tooltip="'点击保存'"
        disabled
        @click="handleClick"
        @mouseenter="handleEnter"
      >保存</veui-button>
      <veui-button
        v-tooltip="'正在保存'"
        loading
        @click="handleClick"
        @mouseenter="handleEnter"
      >保存</veui-button>
    </section>
  </section>
  <section>
    <h4>基础按钮</h4>
    <section>
      <veui-button ui="basic xs" @click="handleClick">保存</veui-button>
      <veui-button ui="basic s" @click="handleClick">保存</veui-button>
      <veui-button ui="basic" @click="handleClick">保存</veui-button>
      <veui-button ui="basic l" @click="handleClick">保存</veui-button>
      <veui-button ui="basic xl" @click="handleClick">保存</veui-button>
      <veui-button ui="basic" disabled @click="handleClick">保存</veui-button>
      <veui-button ui="basic" loading @click="handleClick">保存</veui-button>
    </section>
  </section>
  <section>
    <h4>加强按钮</h4>
    <section>
      <veui-button ui="strong xs" @click="handleClick">保存</veui-button>
      <veui-button ui="strong s" @click="handleClick">保存</veui-button>
      <veui-button ui="strong" @click="handleClick">保存</veui-button>
      <veui-button ui="strong l" @click="handleClick">保存</veui-button>
      <veui-button ui="strong xl" @click="handleClick">保存</veui-button>
      <veui-button
        ui="strong"
        disabled
        @click="handleClick"
      >保存</veui-button>
      <veui-button ui="strong" loading @click="handleClick">保存</veui-button>
    </section>
  </section>
  <section>
    <h4>主要按钮</h4>
    <section>
      <veui-button ui="primary xs" @click="handleClick">提交</veui-button>
      <veui-button ui="primary s" @click="handleClick">提交</veui-button>
      <veui-button ui="primary" @click="handleClick">提交</veui-button>
      <veui-button ui="primary l" @click="handleClick">提交</veui-button>
      <veui-button ui="primary xl" @click="handleClick">提交</veui-button>
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
  </section>
  <section>
    <h4>幽灵按钮</h4>
    <section>
      <veui-button ui="ghost xs" @click="handleClick">保存</veui-button>
      <veui-button ui="ghost s" @click="handleClick">保存</veui-button>
      <veui-button ui="ghost" @click="handleClick">保存</veui-button>
      <veui-button ui="ghost l" @click="handleClick">保存</veui-button>
      <veui-button ui="ghost xl" @click="handleClick">保存</veui-button>
      <veui-button ui="ghost" disabled @click="handleClick">保存</veui-button>
      <veui-button ui="ghost" loading @click="handleClick">保存</veui-button>
    </section>
  </section>
  <section>
    <h4>加强幽灵按钮</h4>
    <section>
      <veui-button
        ui="ghost strong xs"
        @click="handleClick"
      >保存</veui-button>
      <veui-button ui="ghost strong s" @click="handleClick">保存</veui-button>
      <veui-button ui="ghost strong" @click="handleClick">保存</veui-button>
      <veui-button ui="ghost strong l" @click="handleClick">保存</veui-button>
      <veui-button
        ui="ghost strong xl"
        @click="handleClick"
      >保存</veui-button>
      <veui-button
        ui="ghost strong"
        disabled
        @click="handleClick"
      >保存</veui-button>
      <veui-button
        ui="ghost strong"
        loading
        @click="handleClick"
      >保存</veui-button>
    </section>
  </section>
  <section>
    <h4>辅助幽灵按钮</h4>
    <section>
      <veui-button ui="ghost aux xs" @click="handleClick">保存</veui-button>
      <veui-button ui="ghost aux s" @click="handleClick">保存</veui-button>
      <veui-button ui="ghost aux" @click="handleClick">保存</veui-button>
      <veui-button ui="ghost aux l" @click="handleClick">保存</veui-button>
      <veui-button ui="ghost aux xl" @click="handleClick">保存</veui-button>
      <veui-button
        ui="ghost aux"
        disabled
        @click="handleClick"
      >保存</veui-button>
      <veui-button
        ui="ghost aux"
        loading
        @click="handleClick"
      >保存</veui-button>
    </section>
  </section>
  <section>
    <h4>反色幽灵按钮按钮</h4>
    <section class="reverse">
      <veui-button
        ui="ghost reverse xs"
        @click="handleClick"
      >保存</veui-button>
      <veui-button
        ui="ghost reverse s"
        @click="handleClick"
      >保存</veui-button>
      <veui-button ui="ghost reverse" @click="handleClick">保存</veui-button>
      <veui-button
        ui="ghost reverse l"
        @click="handleClick"
      >保存</veui-button>
      <veui-button
        ui="ghost reverse xl"
        @click="handleClick"
      >保存</veui-button>
      <veui-button
        ui="ghost reverse"
        disabled
        @click="handleClick"
      >保存</veui-button>
      <veui-button
        ui="ghost reverse"
        loading
        @click="handleClick"
      >保存</veui-button>
    </section>
  </section>
  <section>
    <h4>带图标按钮</h4>
    <section>
      <veui-button ui="xs" @click="handleClick">
        <veui-icon name="times"/>取消
      </veui-button>
      <veui-button ui="s" @click="handleClick">
        <veui-icon name="times"/>取消
      </veui-button>
      <veui-button @click="handleClick">
        <veui-icon name="times"/>取消
      </veui-button>
      <veui-button ui="l" @click="handleClick">
        <veui-icon name="times"/>取消
      </veui-button>
      <veui-button ui="xl" @click="handleClick">
        <veui-icon name="times"/>取消
      </veui-button>
      <veui-button disabled @click="handleClick">
        <veui-icon name="times"/>取消
      </veui-button>
      <veui-button loading @click="handleClick">
        <veui-icon name="times"/>取消
      </veui-button>
    </section>
  </section>
  <section>
    <h4>半透明按钮</h4>
    <section>
      <veui-button ui="translucent xs" @click="handleClick">取消</veui-button>
      <veui-button ui="translucent s" @click="handleClick">取消</veui-button>
      <veui-button ui="translucent" @click="handleClick">取消</veui-button>
      <veui-button ui="translucent l" @click="handleClick">取消</veui-button>
      <veui-button ui="translucent xl" @click="handleClick">取消</veui-button>
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
  </section>
  <section>
    <h4>文字按钮</h4>
    <section>
      <veui-button ui="text xs" @click="handleClick">编辑</veui-button>
      <veui-button ui="text s" @click="handleClick">编辑</veui-button>
      <veui-button ui="text" @click="handleClick">编辑</veui-button>
      <veui-button ui="text l" @click="handleClick">编辑</veui-button>
      <veui-button ui="text xl" @click="handleClick">编辑</veui-button>
      <veui-button ui="text" disabled @click="handleClick">编辑</veui-button>
      <veui-button ui="text" loading @click="handleClick">编辑</veui-button>
    </section>
  </section>
  <section>
    <h4>加强文字按钮</h4>
    <section>
      <veui-button ui="text strong xs" @click="handleClick">编辑</veui-button>
      <veui-button ui="text strong s" @click="handleClick">编辑</veui-button>
      <veui-button ui="text strong" @click="handleClick">编辑</veui-button>
      <veui-button ui="text strong l" @click="handleClick">编辑</veui-button>
      <veui-button ui="text strong xl" @click="handleClick">编辑</veui-button>
      <veui-button ui="text" disabled @click="handleClick">编辑</veui-button>
      <veui-button ui="text" loading @click="handleClick">编辑</veui-button>
    </section>
  </section>
  <section>
    <h4>辅助文字按钮</h4>
    <section>
      <veui-button ui="text aux xs" @click="handleClick">编辑</veui-button>
      <veui-button ui="text aux s" @click="handleClick">编辑</veui-button>
      <veui-button ui="text aux" @click="handleClick">编辑</veui-button>
      <veui-button ui="text aux l" @click="handleClick">编辑</veui-button>
      <veui-button ui="text aux xl" @click="handleClick">编辑</veui-button>
      <veui-button ui="text" disabled @click="handleClick">编辑</veui-button>
      <veui-button ui="text" loading @click="handleClick">编辑</veui-button>
    </section>
  </section>
  <section>
    <h4>图标按钮</h4>
    <section>
      <veui-button ui="icon xs" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon s" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon l" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon xl" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon" disabled @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon" loading @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
    </section>
  </section>
  <section>
    <h4>加强图标按钮</h4>
    <section>
      <veui-button ui="icon strong xs" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon strong s" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon strong" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon strong l" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon strong xl" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon strong" disabled @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon strong" loading @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
    </section>
  </section>
  <section>
    <h4>辅助图标按钮</h4>
    <section>
      <veui-button ui="icon aux xs" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon aux s" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon aux" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon aux l" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon aux xl" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon aux" disabled @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="icon aux" loading @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
    </section>
  </section>
  <section class="block">
    <h4>动态内容</h4>
    <section>
      <veui-button @click="handleClickAndToggle">
        <veui-icon name="times"/>
        <template v-if="text">取消</template>
      </veui-button>
    </section>
  </section>
  <section class="block">
    <h4>方形按钮</h4>
    <section>
      <veui-button ui="square" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="square basic" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="square primary" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="square strong" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="square translucent" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="square ghost" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="square ghost strong" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <veui-button ui="square ghost aux" @click="handleClick">
        <veui-icon name="search"/>
      </veui-button>
      <section class="reverse">
        <veui-button ui="square ghost reverse" @click="handleClick">
          <veui-icon name="search"/>
        </veui-button>
      </section>
    </section>
  </section>
  <section class="inline">
    文本 Text{{ ' ' }}
    <veui-button ui="text" @click="handleClick">Text</veui-button>
    <veui-button ui="icon" @click="handleClick">
      <veui-icon name="home"/>
    </veui-button>
    <veui-button ui="icon strong" @click="handleClick">
      <veui-icon name="home"/>
    </veui-button>
    <veui-button ui="icon aux" @click="handleClick">
      <veui-icon name="home"/>
    </veui-button>
    <veui-button ui="primary square" @click="handleClick">
      <veui-icon name="home"/>
    </veui-button>
    <veui-button ui="text aux" @click="handleClick">编辑</veui-button>
    <veui-button @click="handleClick">保存</veui-button>
  </section>
  <section>
    <h4>表单内</h4>
    <form @submit.prevent="handleSubmit">
      <veui-button type="submit">Submit</veui-button>
    </form>
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
      bus.$emit('log', ['click', e.currentTarget.getAttribute('ui')])
    },
    handleEnter (e) {
      bus.$emit('log', ['mouseenter', e.currentTarget.getAttribute('ui')])
    },
    handleClickAndToggle (e) {
      this.handleClick(e)
      this.text = !this.text
    },
    handleSubmit () {
      bus.$emit('log', 'submit')
    }
  }
}
</script>

<style lang="less" scoped>
section:not(section > section) {
  margin-bottom: 12px;
}

section > section {
  user-select: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 8px;
}

.block {
  display: block;
}

.inline {
  display: block;

  .veui-button + .veui-button {
    margin-left: 12px;
  }
}

.reverse {
  background-color: #0052cc;
}
</style>
