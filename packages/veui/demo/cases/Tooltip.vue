<template>
<article>
  <h1>
    <code>&lt;veui-tooltip&gt;</code>
  </h1>
  <section>
    <veui-checkbox
      v-model="ui"
      true-value="reverse"
      false-value
    >反色皮肤</veui-checkbox>
    <veui-checkbox
      v-model="aimCenter"
      style="margin-left: 20px"
    >对准中心</veui-checkbox>
  </section>
  <section>
    <div class="demo-wrap">
      <div style="margin-bottom: 10px">hover事件</div>
      <div class="box">
        <div class="top">
          <veui-button
            ref="topLeftHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'top-start',
                target: 'topLeftHover'
              })
            "
          >上左</veui-button>
          <veui-button
            ref="topCenterHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'top',
                target: 'topCenterHover'
              })
            "
          >上边</veui-button>
          <veui-button
            ref="topRightHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'top-end',
                target: 'topRightHover'
              })
            "
          >上右</veui-button>
        </div>
        <div class="left">
          <veui-button
            ref="leftTopHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'left-start',
                target: 'leftTopHover'
              })
            "
          >左上</veui-button>
          <veui-button
            ref="leftCenterHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'left',
                target: 'leftCenterHover'
              })
            "
          >左边</veui-button>
          <veui-button
            ref="leftBottomHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'left-end',
                target: 'leftBottomHover'
              })
            "
          >左下</veui-button>
        </div>
        <div class="right">
          <veui-button
            ref="rightTopHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'right-start',
                target: 'rightTopHover'
              })
            "
          >右上</veui-button>
          <veui-button
            ref="rightCenterHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'right',
                target: 'rightCenterHover'
              })
            "
          >右边</veui-button>
          <veui-button
            ref="rightBottomHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'right-end',
                target: 'rightBottomHover'
              })
            "
          >右下</veui-button>
        </div>
        <div class="bottom">
          <veui-button
            ref="BottomLeftHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'bottom-start',
                target: 'BottomLeftHover'
              })
            "
          >下左</veui-button>
          <veui-button
            ref="BottomCenterHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'bottom',
                target: 'BottomCenterHover'
              })
            "
          >下边</veui-button>
          <veui-button
            ref="BottomRightHover"
            ui="aux"
            @mouseenter.native="
              show({
                position: 'bottom-end',
                target: 'BottomRightHover'
              })
            "
          >下右</veui-button>
        </div>
      </div>
    </div>
    <veui-tooltip
      :position="position"
      :ui="ui"
      :target="target"
      :open.sync="open"
      :overlay-options="overlayOptions"
      :aim-center="aimCenter"
      trigger="hover"
    >当前是hover事件</veui-tooltip>
  </section>
  <section>
    <div class="demo-wrap">
      <div style="margin-bottom: 10px">click事件</div>
      <div class="box">
        <div class="top">
          <veui-button
            ref="topLeftClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'top-start',
                clickTarget: 'topLeftClick'
              })
            "
          >上左</veui-button>
          <veui-button
            ref="topCenterClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'top',
                clickTarget: 'topCenterClick'
              })
            "
          >上边</veui-button>
          <veui-button
            ref="topRightClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'top-end',
                clickTarget: 'topRightClick'
              })
            "
          >上右</veui-button>
        </div>
        <div class="left">
          <veui-button
            ref="leftTopClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'left-start',
                clickTarget: 'leftTopClick'
              })
            "
          >左上</veui-button>
          <veui-button
            ref="leftCenterClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'left',
                clickTarget: 'leftCenterClick'
              })
            "
          >左边</veui-button>
          <veui-button
            ref="leftBottomClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'left-end',
                clickTarget: 'leftBottomClick'
              })
            "
          >左下</veui-button>
        </div>
        <div class="right">
          <veui-button
            ref="rightTopClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'right-start',
                clickTarget: 'rightTopClick'
              })
            "
          >右上</veui-button>
          <veui-button
            ref="rightCenterClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'right',
                clickTarget: 'rightCenterClick'
              })
            "
          >右边</veui-button>
          <veui-button
            ref="rightBottomClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'right-end',
                clickTarget: 'rightBottomClick'
              })
            "
          >右下</veui-button>
        </div>
        <div class="bottom">
          <veui-button
            ref="BottomLeftClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'bottom-start',
                clickTarget: 'BottomLeftClick'
              })
            "
          >下左</veui-button>
          <veui-button
            ref="BottomCenterClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'bottom',
                clickTarget: 'BottomCenterClick'
              })
            "
          >下边</veui-button>
          <veui-button
            ref="BottomRightClick"
            ui="aux"
            @click.native="
              clickShow({
                clickPosition: 'bottom-end',
                clickTarget: 'BottomRightClick'
              })
            "
          >下右</veui-button>
        </div>
      </div>
    </div>
    <veui-tooltip
      :position="clickPosition"
      :ui="ui"
      :target="clickTarget"
      :open.sync="clickOpen"
      :aim-center="aimCenter"
      trigger="click"
    >当前是click事件</veui-tooltip>
  </section>
  <section>
    <div style="margin-bottom: 10px">自定义事件</div>
    <veui-input
      ref="number"
      v-model="number"
      ui="big"
      composition
      @change="log('change')"
      @focus="numberOpen = true"
      @blur="numberOpen = false"
    />
    <veui-tooltip
      position="top"
      :ui="ui"
      target="number"
      trigger="custom"
      :overlay-style="{
        '--dls-dropdown-max-display-items': 8
      }"
      :open.sync="numberOpen"
      :aim-center="aimCenter"
    >你focus到了</veui-tooltip>
  </section>

  <section>
    <div style="margin-bottom: 10px">排除自己</div>
    <veui-button ref="exclude">target</veui-button>
    <veui-tooltip
      position="top"
      target="exclude"
      trigger="hover"
      :interactive="false"
      :hide-delay="0"
      :aim-center="aimCenter"
    >你focus到了</veui-tooltip>
  </section>
  <section>
    <h3>
      <code>v-tooltip</code>
    </h3>
    <section class="group">
      <mark
        v-tooltip="{
          content: descA,
          disabled: !showDesc
        }"
      >[A]</mark>
      <mark
        v-tooltip="{
          content: descB,
          disabled: !showDesc
        }"
      >[B]</mark>
      <veui-button
        v-tooltip.bottom-start="'Change content of A and B'"
        @click="changeDesc"
      >Change</veui-button>
      <veui-button
        v-tooltip="'Toggle content of A and B'"
        @click="showDesc = !showDesc"
      >{{ showDesc ? 'Disable' : 'Enable' }}</veui-button>
    </section>
  </section>
  <section>
    <h3>
      <code>v-tooltip.overflow</code>
    </h3>
    <section class="group overflow">
      <p
        v-tooltip.overflow="{
          content: descA,
          disabled: !showDesc
        }"
        class="ellipsis"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
        nisi suscipit saepe ipsum enim mollitia voluptates, blanditiis aperiam
        vel facere assumenda hic libero iusto, at soluta magni cum in
        voluptatibus?
      </p>
      <p
        v-tooltip.overflow="{
          content: descA,
          disabled: !showDesc
        }"
        class="ellipsis"
      >
        Lorem ipsum.
      </p>
      <p
        v-tooltip.overflow="{
          content: descB,
          disabled: !showDesc
        }"
        class="line-clamp"
      >
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae
        quia modi, architecto sunt dolorem provident? Hic similique, at
        corrupti dolorem, tempore libero magni accusantium aut repellat cum
        fuga quidem et.
      </p>
      <p v-tooltip.overflow class="line-clamp">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae
        quia modi, architecto sunt dolorem provident? Hic similique, at
        corrupti dolorem, tempore libero magni accusantium aut repellat cum
        fuga quidem et.
      </p>
    </section>
  </section>
</article>
</template>

<script>
import bus from '../bus'
import { Tooltip, Checkbox, Button, Input } from 'veui'
import { tooltip } from 'veui/directives'

export default {
  name: 'tooltip-demo',
  directives: {
    tooltip
  },
  components: {
    'veui-button': Button,
    'veui-checkbox': Checkbox,
    'veui-tooltip': Tooltip,
    'veui-input': Input
  },
  data () {
    return {
      position: '',
      clickPosition: '',
      ui: '',
      target: 'topLeftHover',
      clickTarget: 'topLeftClick',
      open: false,
      clickOpen: false,
      number: '12345678910987654321',
      numberOpen: false,
      overlayOptions: {},
      descA: 1,
      descB: 'B',
      showDesc: true,
      aimCenter: false
    }
  },
  mounted () {
    this.$children.forEach((child) => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
  },
  methods: {
    show (obj) {
      this.position = obj.position
      this.target = obj.target
      this.open = true
    },
    clickShow (obj) {
      this.clickPosition = obj.clickPosition
      this.clickTarget = obj.clickTarget
      this.clickOpen = true
    },
    changeDesc () {
      this.descA++
      this.descB += 'B'
    }
  }
}
</script>

<style scoped>
section {
  user-select: none;
  margin: 30px 0;
}

.demo-wrap {
  width: 500px;
  height: 300px;
  padding: 30px;
  border: 1px solid #ccc;
}

.box {
  position: relative;
}

.top,
.bottom {
  width: 100%;
  clear: both;
  text-align: center;
}

.left {
  width: 100px;
  float: left;
}

.right {
  width: 100px;
  float: right;
}

.top .veui-button,
.bottom .veui-button {
  margin-right: 10px;
}

.left .veui-button,
.right .veui-button {
  margin-bottom: 10px;
}

.group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.group.overflow {
  flex-direction: column;
}

.ellipsis {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp {
  display: -webkit-box;
  width: 200px;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
}
</style>
