<template>
  <article>
    <h1><code>&lt;veui-tooltip&gt;</code></h1>
    <p>
      <div class="change-theme"><veui-button ui="primary" @click="changeTheme">切换皮肤</veui-button></div>
      <div class="demo-wrap">
        <div class="box">
          <div class="top">
            <veui-button ui="aux" ref="topLeft" @mouseover.native="show({
              align: 'left',
              position: 'top',
              target: 'topLeft'})" @mouseout.native="open = !open">上左</veui-button>
            <veui-button ui="aux" ref="topCenter" @mouseover.native="show({
              position: 'top',
              target: 'topCenter'})" @mouseout.native="open = !open">上边</veui-button>
            <veui-button ui="aux" ref="topRight" @mouseover.native="show({
              align: 'right',
              position: 'top',
              target: 'topRight'})" @mouseout.native="open = !open">上右</veui-button>
          </div>
          <div class="left">
            <veui-button ui="aux" ref="leftTop" @mouseover.native="show({
              align: 'top',
              position: 'left',
              target: 'leftTop'})" @mouseout.native="open = !open">左上</veui-button>
            <veui-button ui="aux" ref="leftCenter" @mouseover.native="show({
              position: 'left',
              target: 'leftCenter'})" @mouseout.native="open = !open">左边</veui-button>
            <veui-button ui="aux" ref="leftBottom" @mouseover.native="show({
              align: 'bottom',
              position: 'left',
              target: 'leftBottom'})" @mouseout.native="open = !open">左下</veui-button>
          </div>
          <div class="right">
            <veui-button ui="aux" ref="rightTop" @mouseover.native="show({
              align: 'top',
              position: 'right',
              target: 'rightTop'})" @mouseout.native="open = !open">右上</veui-button>
            <veui-button ui="aux" ref="rightCenter" @mouseover.native="show({
              position: 'right',
              target: 'rightCenter'})" @mouseout.native="open = !open">右边</veui-button>
            <veui-button ui="aux" ref="rightBottom" @mouseover.native="show({
              align: 'bottom',
              position: 'right',
              target: 'rightBottom'})" @mouseout.native="open = !open">右下</veui-button>
          </div>
          <div class="bottom">
            <veui-button ui="aux" ref="BottomLeft" @mouseover.native="show({
              align: 'left',
              position: 'bottom',
              target: 'BottomLeft'})" @mouseout.native="open = !open">下左</veui-button>
            <veui-button ui="aux" ref="BottomCenter" @mouseover.native="show({
              position: 'bottom',
              target: 'BottomCenter'})" @mouseout.native="open = !open">下边</veui-button>
            <veui-button ui="aux" ref="BottomRight" @mouseover.native="show({
              align: 'right',
              position: 'bottom',
              target: 'BottomRight'})" @mouseout.native="open = !open">下右</veui-button>
          </div>
        </div>
      </div>
      <veui-tooltip :align="align" :position="position" :ui="ui" :target="target" :open="open" @update="update">提示文字提示文字提示文字</veui-tooltip>
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
      align: '',
      position: '',
      ui: '',
      target: null,
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
      this.align = obj.align
      this.position = obj.position
      this.target = this.$refs[obj.target]
      this.open = !this.open
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
