<template>
  <article>
    <h1><code>&lt;veui-tooltip&gt;</code></h1>
    <section>
      <veui-button ui="primary" @click="ui = ui ? '' : 'alt'">切换皮肤</veui-button>
    </section>
    <section>
      <div class="demo-wrap">
        <div style="margin-bottom:10px;">hover事件</div>
        <div class="box">
          <div class="top">
            <veui-button ui="aux" ref="topLeftHover" @mouseenter.native="show({
              position: 'top left',
              target: 'topLeftHover'})">上左</veui-button>
            <veui-button ui="aux" ref="topCenterHover" @mouseenter.native="show({
              position: 'top',
              target: 'topCenterHover'})">上边</veui-button>
            <veui-button ui="aux" ref="topRightHover" @mouseenter.native="show({
              position: 'top right',
              target: 'topRightHover'})">上右</veui-button>
          </div>
          <div class="left">
            <veui-button ui="aux" ref="leftTopHover" @mouseenter.native="show({
              position: 'left top',
              target: 'leftTopHover'})">左上</veui-button>
            <veui-button ui="aux" ref="leftCenterHover" @mouseenter.native="show({
              position: 'left',
              target: 'leftCenterHover'})">左边</veui-button>
            <veui-button ui="aux" ref="leftBottomHover" @mouseenter.native="show({
              position: 'left bottom',
              target: 'leftBottomHover'})">左下</veui-button>
          </div>
          <div class="right">
            <veui-button ui="aux" ref="rightTopHover" @mouseenter.native="show({
              position: 'right top',
              target: 'rightTopHover'})">右上</veui-button>
            <veui-button ui="aux" ref="rightCenterHover" @mouseenter.native="show({
              position: 'right',
              target: 'rightCenterHover'})">右边</veui-button>
            <veui-button ui="aux" ref="rightBottomHover" @mouseenter.native="show({
              position: 'right bottom',
              target: 'rightBottomHover'})">右下</veui-button>
          </div>
          <div class="bottom">
            <veui-button ui="aux" ref="BottomLeftHover" @mouseenter.native="show({
              position: 'bottom left',
              target: 'BottomLeftHover'})">下左</veui-button>
            <veui-button ui="aux" ref="BottomCenterHover" @mouseenter.native="show({
              position: 'bottom',
              target: 'BottomCenterHover'})">下边</veui-button>
            <veui-button ui="aux" ref="BottomRightHover" @mouseenter.native="show({
              position: 'bottom right',
              target: 'BottomRightHover'})">下右</veui-button>
          </div>
        </div>
      </div>
      <veui-tooltip :position="position" :ui="ui" :target="target" :open.sync="open" :overlay-options="overlayOptions" trigger="hover">当前是hover事件</veui-tooltip>
    </section>
    <section>
      <div class="demo-wrap">
        <div style="margin-bottom:10px;">click事件</div>
        <div class="box">
          <div class="top">
            <veui-button ui="aux" ref="topLeftClick" @click.native="clickShow({
              clickPosition: 'top left',
              clickTarget: 'topLeftClick'})">上左</veui-button>
            <veui-button ui="aux" ref="topCenterClick" @click.native="clickShow({
              clickPosition: 'top',
              clickTarget: 'topCenterClick'})">上边</veui-button>
            <veui-button ui="aux" ref="topRightClick" @click.native="clickShow({
              clickPosition: 'top right',
              clickTarget: 'topRightClick'})">上右</veui-button>
          </div>
          <div class="left">
            <veui-button ui="aux" ref="leftTopClick" @click.native="clickShow({
              clickPosition: 'left top',
              clickTarget: 'leftTopClick'})">左上</veui-button>
            <veui-button ui="aux" ref="leftCenterClick" @click.native="clickShow({
              clickPosition: 'left',
              clickTarget: 'leftCenterClick'})">左边</veui-button>
            <veui-button ui="aux" ref="leftBottomClick" @click.native="clickShow({
              clickPosition: 'left bottom',
              clickTarget: 'leftBottomClick'})">左下</veui-button>
          </div>
          <div class="right">
            <veui-button ui="aux" ref="rightTopClick" @click.native="clickShow({
              clickPosition: 'right top',
              clickTarget: 'rightTopClick'})">右上</veui-button>
            <veui-button ui="aux" ref="rightCenterClick" @click.native="clickShow({
              clickPosition: 'right',
              clickTarget: 'rightCenterClick'})">右边</veui-button>
            <veui-button ui="aux" ref="rightBottomClick" @click.native="clickShow({
              clickPosition: 'right bottom',
              clickTarget: 'rightBottomClick'})">右下</veui-button>
          </div>
          <div class="bottom">
            <veui-button ui="aux" ref="BottomLeftClick" @click.native="clickShow({
              clickPosition: 'bottom left',
              clickTarget: 'BottomLeftClick'})">下左</veui-button>
            <veui-button ui="aux" ref="BottomCenterClick" @click.native="clickShow({
              clickPosition: 'bottom',
              clickTarget: 'BottomCenterClick'})">下边</veui-button>
            <veui-button ui="aux" ref="BottomRightClick" @click.native="clickShow({
              clickPosition: 'bottom right',
              clickTarget: 'BottomRightClick'})">下右</veui-button>
          </div>
        </div>
      </div>
      <veui-tooltip :position="clickPosition" :ui="ui" :target="clickTarget" :open.sync="clickOpen" trigger="click">当前是click事件</veui-tooltip>
    </section>
    <section>
      <div style="margin-bottom:10px;">自定义事件</div>
      <veui-input ui="big" v-model="number" composition @change="log('change')" ref="number" @focus.native="numberOpen = true" @blur.native="numberOpen = false"></veui-input>
      <veui-tooltip position="top" :ui="ui" target="number" trigger="custom" :open.sync="numberOpen">你focus到了</veui-tooltip>
    </section>

    <section>
      <div style="margin-bottom:10px;">排除自己</div>
      <veui-button ref="exclude">target</veui-button>
      <veui-tooltip position="top" target="exclude" trigger="hover" :interactive="false" :hide-delay="0">你focus到了</veui-tooltip>
    </section>
  </article>
</template>

<script>
import bus from '../bus'
import { Tooltip, Button, Input } from 'veui'

export default {
  name: 'tooltip-demo',
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
      overlayOptions: {}
    }
  },
  components: {
    'veui-button': Button,
    'veui-tooltip': Tooltip,
    'veui-input': Input
  },
  mounted () {
    this.$children.forEach(child => {
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
</style>
