<template>
<article>
  <h1><code>&lt;veui-tabs&gt;</code></h1>
  <section>
    <h2>默认样式：</h2>
    <p>
      当前标签 <code>{{ active0 }}</code>
    </p>
    <veui-tabs
      ui="l"
      :active.sync="active0"
    >
      <veui-tab
        label="回答问题"
        name="answers"
      />
      <veui-tab
        label="文章评论"
        name="articles"
      />
      <veui-tab
        label="分享朋友圈"
        name="shares"
      />
      <veui-button
        slot="tabs-extra"
        ui="primary"
      >覆盖 extra</veui-button>
    </veui-tabs>

    <veui-tabs :active.sync="active0">
      <veui-tab
        label="回答问题"
        name="answers"
      />
      <veui-tab
        label="文章评论"
        name="articles"
      />
      <veui-tab
        label="分享朋友圈"
        name="shares"
      />
    </veui-tabs>

    <veui-tabs
      ui="s"
      :active.sync="active0"
    >
      <veui-tab
        label="回答问题"
        name="answers"
      />
      <veui-tab
        label="文章评论"
        name="articles"
      />
      <veui-tab
        label="分享朋友圈"
        name="shares"
        status="success"
      />
    </veui-tabs>
  </section>
  <section>
    <h2>边框样式：</h2>
    <veui-tabs :active.sync="active0">
      <veui-tab
        label="回答问题"
        name="answers"
      />
      <veui-tab
        label="文章评论"
        name="articles"
        status="error"
      />
      <veui-tab
        label="分享朋友圈"
        name="shares"
      />
    </veui-tabs>
    <veui-tabs
      ui="l"
      :active.sync="active0"
    >
      <veui-tab
        label="回答问题"
        name="answers"
        status="warning"
      />
      <veui-tab
        label="文章评论"
        name="articles"
      />
      <veui-tab
        label="分享朋友圈"
        name="shares"
      />
    </veui-tabs>
  </section>
  <section>
    <h2>溢出样式：</h2>
    <veui-tabs>
      <veui-tab
        v-for="n in 30"
        :key="n"
        :label="
          n === 2 ? 'This is Tab2 with long long long long text' : `Tab${n}`
        "
      />
    </veui-tabs>
    <veui-tabs>
      <veui-tab
        v-for="n in 30"
        :key="n"
        :label="
          n === 2 ? 'This is Tab2 with long long long long text' : `Tab${n}`
        "
      />
    </veui-tabs>
  </section>
  <section>
    <h2>禁用样式：</h2>
    <veui-tabs>
      <veui-tab label="Tab1">
        <p>This is Tab1</p>
      </veui-tab>
      <veui-tab
        label="Tab2"
        disabled
      >
        <p>This is Tab2</p>
      </veui-tab>
      <veui-tab label="Tab3">
        <p>This is Tab3</p>
      </veui-tab>
      <veui-tab label="Tab4">
        <p>This is Tab4</p>
      </veui-tab>
    </veui-tabs>
    <veui-tabs>
      <veui-tab label="Tab1">
        <p>This is Tab1</p>
      </veui-tab>
      <veui-tab
        label="Tab2"
        disabled
      >
        <p>This is Tab2</p>
      </veui-tab>
      <veui-tab label="Tab3">
        <p>This is Tab3</p>
      </veui-tab>
      <veui-tab label="Tab4">
        <p>This is Tab4</p>
      </veui-tab>
    </veui-tabs>
  </section>
  <section>
    <h2>路由模式：</h2>
    <veui-tabs :matches="(current, to) => current.path === to.path">
      <veui-tab
        label="Button"
        to="/tabs/button"
      />
      <veui-tab
        label="Input"
        to="input"
      />
      <veui-tab
        label="Progress"
        to="/tabs/progress"
      />
      <veui-tab label="内联内容">
        <b>Hello world.</b>
      </veui-tab>
      <veui-tab
        label="跳转到 Progress"
        to="/progress"
      />
      <router-view slot="panel"/>
    </veui-tabs>
  </section>
  <section class="inner-ui">
    <h2>增删模式1（内部 UI）：</h2>
    <veui-tabs
      ui="l"
      :active.sync="active1"
      addable
      :max="totalTabs0"
      @add="addTab0"
      @remove="removeTab0"
    >
      <veui-tab
        v-for="tab in tabs0"
        :key="tab.name"
        removable
        :label="tab.label"
        :name="tab.name"
        :status="tab.status"
      >
        <p>Tab {{ tab.name }}</p>
      </veui-tab>
    </veui-tabs>
    <veui-tabs
      ui="l"
      class="large-block-demo"
      :active.sync="active2"
      addable
      :max="totalTabs1"
      :tip="`还可新建 ${totalTabs1 - tabs1.length} 条`"
      @add="addTab1"
      @remove="removeTab1"
    >
      <veui-tab
        v-for="tab in tabs1"
        :key="tab.name"
        removable
        :label="tab.label"
        :name="tab.name"
        :status="tab.status"
      >
        <p>Tab {{ tab.name }}</p>
      </veui-tab>
    </veui-tabs>
  </section>
  <section>
    <h2>增删模式2（完全外部控制）：</h2>
    <veui-button
      class="add-btn"
      @click="addTab2"
    >
      添加 TAB
    </veui-button>
    <veui-tabs :active.sync="active3">
      <template
        v-if="props.removable && tabs2.length > 1"
        slot="tab-item-extra"
        slot-scope="props"
      >
        <button
          type="button"
          class="veui-tabs-item-remove"
          @click="removeTab2(props)"
        >
          <icon name="times"/>
        </button>
      </template>
      <veui-tab
        v-for="tab in tabs2"
        :key="tab.name"
        removable
        :label="tab.label"
        :name="tab.name"
        :status="tab.status"
      >
        <p>Tab {{ tab.name }}</p>
      </veui-tab>
    </veui-tabs>
    <veui-button
      class="add-btn"
      @click="addTab3"
    >
      添加 TAB
    </veui-button>
    <veui-tabs :active.sync="active4">
      <template
        slot="tab-item-extra"
        slot-scope="props"
      >
        <button
          v-if="props.removable && tabs3.length > 1"
          type="button"
          class="veui-tabs-item-remove"
          @click="removeTab3(props)"
        >
          <icon name="times"/>
        </button>
      </template>
      <veui-tab
        v-for="tab in tabs3"
        :key="tab.name"
        removable
        :label="tab.label"
        :name="tab.name"
        :status="tab.status"
      >
        <p v-if="tab.label === '弄一个很长的在中间试试'">
          弄一个很高的在中间试试
          <br
            v-for="n in 10"
            :key="n"
          >
        </p>
        <p v-else>Tab {{ tab.name }}</p>
      </veui-tab>
    </veui-tabs>
  </section>
  <section>
    <h2>增删模式3（v-if 等 dom 上控制）：</h2>
    <p>
      当前标签 <code>{{ active5 }}</code>
    </p>
    <veui-button
      :disabled="tabIfRemoving"
      @click="insertVisiable = !insertVisiable"
    >
      {{ insertVisiable ? '隐藏' : '显示' }}中间一个可切换 TAB
    </veui-button>
    <veui-tabs
      ui="l"
      :active.sync="active5"
    >
      <veui-tab
        label="DuerOS"
        name="os"
      >
        <p>os</p>
      </veui-tab>
      <veui-tab
        label="无人车"
        name="car"
      >
        <p>car</p>
      </veui-tab>
      <veui-tab
        v-if="insertVisiable"
        label="人脸识别"
        name="face"
      >
        <p>face</p>
      </veui-tab>
      <veui-tab
        label="语音识别"
        name="sound"
      >
        <p>sound</p>
      </veui-tab>
    </veui-tabs>
    <veui-tabs
      ui="l"
      :active.sync="active5"
    >
      <veui-tab
        label="DuerOS"
        name="os"
      >
        <p>os</p>
      </veui-tab>
      <veui-tab
        label="无人车"
        name="car"
      >
        <p>car</p>
      </veui-tab>
      <veui-tab
        v-if="insertVisiable"
        label="人脸识别"
        name="face"
      >
        <p>face</p>
      </veui-tab>
      <veui-tab
        label="语音识别"
        name="sound"
      >
        <p>sound</p>
      </veui-tab>
    </veui-tabs>
  </section>
</article>
</template>

<script>
import { Icon, Tabs, Tab, Button } from 'veui'
import { findIndex, uniqueId } from 'lodash'
import 'veui-theme-dls-icons/times'

export default {
  name: 'tabs-demo',
  components: {
    'veui-tabs': Tabs,
    'veui-tab': Tab,
    'veui-button': Button,
    icon: Icon
  },
  data () {
    return {
      totalTabs0: 15,
      totalTabs1: 20,
      tabs0: [
        { label: '弄一个很长的在第一个试试', name: '默认1' },
        { label: '默认2', name: '默认2', status: 'success' },
        { label: '默认3', name: '默认3' }
      ],
      tabs1: [
        { label: '默认1', name: '默认1' },
        { label: '弄一个很长的在中间试试', name: '默认2', status: 'info' },
        { label: '默认3', name: '默认3' }
      ],
      tabs2: [
        { label: '默认1', name: '默认1' },
        { label: '弄一个很长的在中间试试', name: '默认2', status: 'warning' },
        { label: '默认3', name: '默认3' }
      ],
      tabs3: [
        { label: '默认1', name: '默认1', status: 'error' },
        { label: '弄一个很长的在中间试试', name: '默认2', status: 'warning' },
        { label: '默认3', name: '默认3' }
      ],
      active0: '',
      active1: '',
      active2: '',
      active3: '',
      active4: '',
      active5: '',
      insertVisiable: false,
      tabIfRemoving: false
    }
  },
  methods: {
    addTab0 () {
      if (this.tabs0.length >= this.totalTabs0) {
        return
      }

      let label = uniqueId('默认')
      this.tabs0.push({
        label,
        name: label
      })
      this.active1 = label
    },
    addTab1 () {
      if (this.tabs1.length >= this.totalTabs1) {
        return
      }

      let label = uniqueId('每次都增加一些很长的来试试看')
      this.tabs1.push({
        label,
        name: label
      })
    },
    addTab2 () {
      let label = uniqueId('默认')
      this.tabs2.push({
        label,
        name: label
      })
    },
    addTab3 () {
      let label = uniqueId('默认')
      this.tabs3.push({
        label,
        name: label
      })
    },
    removeTab0 ({ name }) {
      let index = findIndex(this.tabs0, tab => tab.name === name)
      if (index !== -1) {
        this.tabs0.splice(index, 1)
      }
    },
    removeTab1 ({ name }) {
      let index = findIndex(this.tabs1, tab => tab.name === name)
      if (index !== -1) {
        this.tabs1.splice(index, 1)
      }
    },
    removeTab2 ({ name }) {
      let index = findIndex(this.tabs2, tab => tab.name === name)
      if (index !== -1) {
        this.tabs2.splice(index, 1)
      }
    },
    removeTab3 ({ name }) {
      let index = findIndex(this.tabs3, tab => tab.name === name)
      if (index !== -1) {
        this.tabs3.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
section + section {
  margin-top: 60px;
}

.veui-tabs {
  & + &[ui~='block'] {
    margin-top: 20px;
  }
}

.large-block-demo .veui-tab {
  border: 1px solid #e7e7e7;
  margin-top: -1px;

  p {
    padding: 0 30px;
  }
}

.add-btn {
  margin-bottom: 10px;
}
</style>
