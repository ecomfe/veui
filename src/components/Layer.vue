<template>
  <div class="veui-layer">
    <slot name="target"></slot>
    <div class="veui-layer-box"
      :class="layerClass"
      :ui="layerUi"
      ref="box"
      :style="{zIndex}"
      v-show="layerVisible"><slot></slot></div>
  </div>
</template>
<script>
  import Tether from 'tether'
  import { includes, omit, isObject, isString } from 'lodash'
  import layerManager from '../plugins/layerManager'
  import Vue from 'vue'

  Vue.use(layerManager)

  const PREFIX = '__veui_layer'
  const ZINDEX_INSTANCE_KEY = `${PREFIX}_zindex_instance`

  export default {
    [PREFIX]: true,
    props: {
      layerVisible: {
        type: Boolean,
        default: false
      },
      layerUi: String,
      mode: {
        validator (value) {
          return includes(['ATTACH', 'NORMAL'], value)
        },
        default: 'ATTACH'
      },
      options: {
        type: Object,
        default () {
          return {}
        }
      },
      layerClass: {
        validator (value) {
          return isObject(value) || isString(value)
        },
        default: null
      }
    },
    data () {
      return {
        zIndex: 0
      }
    },
    watch: {
      layerVisible (value) {
        // 在显示的时候重新定位一下，因为在隐藏状态下计算不了位置
        if (value && this.mode === 'ATTACH') {
          this.$nextTick(() => this.tether.position())
        }
      }
    },
    mounted () {
      if (this.mode === 'ATTACH') {
        this.tether = new Tether({
          element: this.$refs.box,
          target: this.$slots.target[0].elm,
          ...omit(this.options, 'element', 'target')
        })
      } else {
        let box = this.$refs.box
        document.body.appendChild(box)
      }

      this[ZINDEX_INSTANCE_KEY] = this.$addLayer(this.mode === 'ATTACH' ? this.findParentLayerId() : null)
      this[ZINDEX_INSTANCE_KEY].$on(
        'zindexchange',
        (zIndex) => {
          this.zIndex = zIndex
        }
      )
      this[ZINDEX_INSTANCE_KEY].refresh()
    },
    methods: {

      /**
       * 向上找到父级layer组件的layerId
       */
      findParentLayerId () {
        for (let cur = this.$slots.target[0]; cur; cur = cur.parent) {
          if (cur.componentInstance && cur.componentInstance[PREFIX]) {
            return cur.componentInstance[ZINDEX_INSTANCE_KEY].id
          }
        }
      },

      bringToTop () {
        this[ZINDEX_INSTANCE_KEY].toTop()
      }
    },
    beforeDestroy () {
      if (this.mode === 'ATTACH') {
        this.tether.destroy()
        document.body.removeChild(this.tether.element)
      } else {
        document.body.removeChild(this.$refs.box)
      }

      this[ZINDEX_INSTANCE_KEY].$off()
      this[ZINDEX_INSTANCE_KEY].remove()
      this[ZINDEX_INSTANCE_KEY] = null
    }
  }
</script>
<style lang="less">
.veui-layer {
  display: inline-block;
}

.veui-layer-box {
  position: absolute;
}
</style>
