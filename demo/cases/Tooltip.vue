<template>
  <article>
    <h1><code>&lt;veui-tooltip&gt;</code></h1>
    <p>
      <div class="change-theme"><veui-button ui="primary" @click="changeTheme">切换皮肤</veui-button></div>
      <div class="demo-wrap">
        <div class="box">
          <div class="top">
            <veui-button ui="aux" ref="topLeft" @mouseover.native="show({
              placement: 'top left',
              target: 'topLeft'})">上左</veui-button>
            <veui-button ui="aux" ref="topCenter" @mouseover.native="show({
              placement: 'top',
              target: 'topCenter'})">上边</veui-button>
            <veui-button ui="aux" ref="topRight" @mouseover.native="show({
              placement: 'top right',
              target: 'topRight'})">上右</veui-button>
          </div>
          <div class="left">
            <veui-button ui="aux" ref="leftTop" @mouseover.native="show({
              placement: 'left top',
              target: 'leftTop'})">左上</veui-button>
            <veui-button ui="aux" ref="leftCenter" @mouseover.native="show({
              placement: 'left',
              target: 'leftCenter'})">左边</veui-button>
            <veui-button ui="aux" ref="leftBottom" @mouseover.native="show({
              placement: 'left bottom',
              target: 'leftBottom'})">左下</veui-button>
          </div>
          <div class="right">
            <veui-button ui="aux" ref="rightTop" @mouseover.native="show({
              placement: 'right top',
              target: 'rightTop'})">右上</veui-button>
            <veui-button ui="aux" ref="rightCenter" @mouseover.native="show({
              placement: 'right',
              target: 'rightCenter'})">右边</veui-button>
            <veui-button ui="aux" ref="rightBottom" @mouseover.native="show({
              placement: 'right bottom',
              target: 'rightBottom'})">右下</veui-button>
          </div>
          <div class="bottom">
            <veui-button ui="aux" ref="BottomLeft" @mouseover.native="show({
              placement: 'bottom left',
              target: 'BottomLeft'})">下左</veui-button>
            <veui-button ui="aux" ref="BottomCenter" @mouseover.native="show({
              placement: 'bottom',
              target: 'BottomCenter'})">下边</veui-button>
            <veui-button ui="aux" ref="BottomRight" @mouseover.native="show({
              placement: 'bottom right',
              target: 'BottomRight'})">下右</veui-button>
          </div>
        </div>
      </div>
      <veui-tooltip :placement="placement" :ui="ui" :target="target" :open="open" @update:open="update">提示文字提示文字提示文字</veui-tooltip>
    </p>
  </article>
</template>

<script>
import bus from '../bus'
import Tooltip from '@/components/Tooltip'
import Button from '@/components/Button'

export default {
  name: 'tooltip-demo',
  data () {
    return {
      placement: '',
      ui: '',
      target: '',
      open: false
    }
  },
  components: {
    'veui-button': Button,
    'veui-tooltip': Tooltip
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
      this.placement = obj.placement
      this.target = obj.target
      this.open = true
    },
    update (value) {
      this.open = value
    },
    changeTheme () {
      this.ui = this.ui ? '' : 'light'
      alert('已成功切换')
    }
  }
}
</script>

<style scoped>
p {
  user-select: none;
}
.change-theme {
  margin-bottom: 10px;
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
