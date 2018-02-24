<template>
  <article>
    <h1><code>&lt;veui-tabs&gt;</code></h1>
    <section>
      <h2>默认样式：</h2>
      <p>当前标签 <code>{{active0}}</code></p>
      <p>当前序号 <code>{{index0 + 1}}</code></p>
      <veui-tabs ui="large" :active.sync="active0" :index.sync="index0">
        <veui-tab label="回答问题" name="answers"></veui-tab>
        <veui-tab label="文章评论" name="articles"></veui-tab>
        <veui-tab label="分享朋友圈" name="shares"></veui-tab>
      </veui-tabs>

      <veui-tabs :active.sync="active0" :index.sync="index0">
        <veui-tab label="回答问题" name="answers"></veui-tab>
        <veui-tab label="文章评论" name="articles"></veui-tab>
        <veui-tab label="分享朋友圈" name="shares"></veui-tab>
      </veui-tabs>

      <veui-tabs ui="small" :active.sync="active0" :index.sync="index0">
        <veui-tab label="回答问题" name="answers"></veui-tab>
        <veui-tab label="文章评论" name="articles"></veui-tab>
        <veui-tab label="分享朋友圈" name="shares"></veui-tab>
      </veui-tabs>

      <veui-tabs ui="tiny" :active.sync="active0" :index.sync="index0">
        <veui-tab label="回答问题" name="answers"></veui-tab>
        <veui-tab label="文章评论" name="articles"></veui-tab>
        <veui-tab label="分享朋友圈" name="shares"></veui-tab>
      </veui-tabs>
    </section>
    <section>
      <h2>路由模式：</h2>
      <veui-tabs :active="$route.fullPath">
        <veui-tab label="Button" to="/tabs/button"><router-view></router-view></veui-tab>
        <veui-tab label="Input" to="/tabs/input"><router-view></router-view></veui-tab>
        <veui-tab label="Progress" to="/tabs/progress"><router-view></router-view></veui-tab>
      </veui-tabs>
    </section>
    <section>
      <h2>简单样式：</h2>
      <p>当前序号 <code>{{index1 + 1}}</code></p>
      <veui-tabs :index.sync="index1" >
        <veui-tab label="Tab1"><p>This is Tab1</p></veui-tab>
        <veui-tab label="Tab2"><p>This is Tab2</p></veui-tab>
        <veui-tab label="Tab3"><p>This is Tab3</p></veui-tab>
        <veui-tab label="Tab4"><p>This is Tab4</p></veui-tab>
      </veui-tabs>
    </section>
    <section>
      <h2>禁用模式：</h2>
      <p>当前序号 <code>{{index1 + 1}}</code></p>
      <veui-tabs ui="simple" :index.sync="index1" >
        <veui-tab label="Tab1"><p>This is Tab1</p></veui-tab>
        <veui-tab label="Tab2" disabled><p>This is Tab2</p></veui-tab>
        <veui-tab label="Tab3"><p>This is Tab3</p></veui-tab>
        <veui-tab label="Tab4"><p>This is Tab4</p></veui-tab>
      </veui-tabs>
    </section>
    <section>
      <h2>增删模式1（内部 UI）：</h2>
      <p>当前序号 <code>{{index2 != null ? index2 + 1 : '已删光'}}</code></p>
      <veui-tabs ui="large" :active.sync="active1" :index.sync="index2" addable @add="addTab0" @remove="removeTab0">
        <veui-tab :label="tab.label"
          :name="tab.name"
          removable
          :key="tab.name"
          v-for="tab in tabs0"><p>Tab {{ tab.name }}</p>
        </veui-tab>
      </veui-tabs>
    </section>
    <section>
      <h2>增删模式2（完全外部控制）：</h2>
      <p>当前序号 <code>{{index3 != null ? index3 + 1 : '已删光'}}</code></p>
      <veui-button @click="addTab1">添加 TAB</veui-button>
      <veui-tabs :active.sync="active2" :index.sync="index3">
        <template slot="tab-item-extra" slot-scope="props">
          <button type="button" class="veui-tabs-item-remove" @click="removeTab1(props)">
            <icon name="cross-small" v-if="props.removable && tabs1.length > 1"></icon>
          </button>
        </template>
        <veui-tab :label="tab.label"
          :name="tab.name"
          removable
          :key="tab.name"
          v-for="tab in tabs1"><p>Tab {{ tab.name }}</p>
        </veui-tab>
      </veui-tabs>
    </section>
    <section>
      <h2>增删模式3（v-if 等 dom 上控制）：</h2>
      <p>当前标签 <code>{{active3}}</code></p>
      <p>当前序号 <code>{{index4 + 1}}</code></p>
      <veui-button @click="insertVisiable = !insertVisiable">{{ insertVisiable ? '隐藏' : '显示' }}中间一个可切换 TAB</veui-button>
      <veui-tabs ui="large" :active.sync="active3" :index.sync="index4">
        <veui-tab label="DuerOS" name="os"><p>os</p></veui-tab>
        <veui-tab label="无人车" name="car"><p>car</p></veui-tab>
        <veui-tab label="人脸识别" name="face" v-if="insertVisiable"><p>face</p></veui-tab>
        <veui-tab label="语音识别" name="sound"><p>sound</p></veui-tab>
      </veui-tabs>
    </section>
  </article>
</template>

<script>
import { Icon, Tabs, Tab, Button } from 'veui'
import { findIndex, uniqueId } from 'lodash'

export default {
  name: 'tabs-demo',
  components: {
    'veui-tabs': Tabs,
    'veui-tab': Tab,
    'veui-button': Button,
    'icon': Icon
  },
  data () {
    return {
      tabs0: [
        {label: '默认1', name: '默认1'},
        {label: '默认2', name: '默认2'},
        {label: '默认3', name: '默认3'}
      ],
      tabs1: [
        {label: '默认1', name: '默认1'},
        {label: '默认2', name: '默认2'},
        {label: '默认3', name: '默认3'}
      ],
      active0: '',
      active1: '',
      active2: '',
      active3: '',
      index0: 0,
      index1: 0,
      index2: 0,
      index3: 0,
      index4: 0,
      insertVisiable: false
    }
  },
  methods: {
    addTab0 () {
      let label = uniqueId('默认')
      let index = this.tabs0.push({
        label,
        name: label
      })
      this.index2 = index - 1
    },
    addTab1 () {
      let label = uniqueId('默认')
      let index = this.tabs1.push({
        label,
        name: label
      })
      this.index3 = index - 1
    },
    removeTab0 ({name}) {
      this.tabs0.splice(findIndex(this.tabs0, tab => tab.name === name), 1)
    },
    removeTab1 ({name}) {
      this.tabs1.splice(findIndex(this.tabs1, tab => tab.name === name), 1)
    }
  }
}
</script>
