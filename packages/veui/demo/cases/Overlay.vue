<template>
<article class="demo-overlay">
  <h1><code>&lt;veui-overlay&gt;</code></h1>

  <div class="row">
    <veui-button
      slot="target"
      ref="clickOpen"
      ui="primary"
      @click="overlayVisible = !overlayVisible"
    >
      <template v-if="overlayVisible">
        隐藏overlay
      </template>
      <template v-else>
        展示overlay
      </template>
    </veui-button>

    <veui-overlay
      overlay-class="demo-overlay-box"
      target="clickOpen"
      inline
      :open="overlayVisible"
      :options="{ attachment: 'top right', targetAttachment: 'top left' }"
    >
      点击按钮展开的
    </veui-overlay>
  </div>

  <div class="row">
    <pre>
      {
        attachment: 'top right',
        targetAttachment: 'top left',
        constraints: [
          {
            to: 'scrollParent',
            pin: true
          }
        ]
      }
      </pre>
    <div class="preview">
      <div class="scroll-content">
        <veui-overlay
          overlay-class="demo-overlay-box"
          target="overlay1"
          :open="true"
          :options="{ attachment: 'top right', targetAttachment: 'top left' }"
        >
          提示信息
        </veui-overlay>
        <div
          ref="overlay1"
          class="target"
        />
      </div>
    </div>
  </div>

  <div class="row">
    <pre>
      {
        attachment: 'bottom left',
        targetAttachment: 'top left'
      }
      </pre>
    <div class="preview">
      <div class="scroll-content">
        <div
          ref="overlay2"
          class="target"
        />
        <veui-overlay
          overlay-class="demo-overlay-box"
          target="overlay2"
          :open="true"
          :options="{
            attachment: 'bottom left',
            targetAttachment: 'top left'
          }"
        >
          提示信息
        </veui-overlay>
      </div>
    </div>
  </div>

  <div class="row">
    <veui-button
      ref="overlay3"
      @click="showMultiFirst"
    >
      第一个target
    </veui-button>
    <veui-button
      ref="overlay4"
      @click="showMultiSecond"
    >
      第二个target
    </veui-button>
    <veui-overlay
      overlay-class="demo-overlay-box"
      :target="multiTargetRef"
      :open="multiTargetOpen"
      :options="multiOptions"
    >
      多个target
    </veui-overlay>
  </div>

  <div class="row">
    <veui-button
      v-for="(item, index) in vforItems"
      :ref="`overlay5-${index}`"
      :key="item.name"
      @click="showItem(item, index)"
    >
      {{ item.name }}
    </veui-button>
    <veui-overlay
      overlay-class="demo-overlay-box"
      :target="vforTargetRef"
      :open="vforOpen"
      :options="{ attachment: 'bottom left', targetAttachment: 'top left' }"
    >
      年龄是{{ vforCurrentItem.age }}
    </veui-overlay>
  </div>

  <div class="row">
    <a ref="vnodeTest">
      直接传vnode
    </a>
    <veui-overlay
      overlay-class="demo-overlay-box"
      :target="vnodeTarget"
      :open="true"
      :options="{ attachment: 'bottom left', targetAttachment: 'top left' }"
    >
      好的，一切正常。
    </veui-overlay>
    <veui-overlay
      overlay-class="demo-overlay-box"
      :target="null"
      :open="true"
      :options="{ attachment: 'bottom left', targetAttachment: 'top left' }"
    >
      这个没有飞到左上角去，就说明有bug了。
    </veui-overlay>

    <veui-button ref="vnodeComponentTest">
      组件vnode
    </veui-button>
    <veui-overlay
      overlay-class="demo-overlay-box"
      :target="vnodeComponentTarget"
      :open="true"
      :options="{ attachment: 'bottom left', targetAttachment: 'top left' }"
    >
      组件vnode的overlay
    </veui-overlay>
  </div>
</article>
</template>
<script>
import { Overlay, Button } from 'veui'

export default {
  name: 'overlay-demo',
  components: {
    'veui-overlay': Overlay,
    'veui-button': Button
  },
  data () {
    const items = [
      {
        name: 'John',
        age: 18
      },
      {
        name: 'Joe',
        age: 19
      },
      {
        name: 'Amy',
        age: 20
      }
    ]
    return {
      overlayVisible: false,

      multiTargetRef: 'overlay3',
      multiTargetOpen: false,
      multiOptions: {
        attachment: 'bottom left',
        targetAttachment: 'top left'
      },

      vforItems: items,
      vforOpen: false,
      vforCurrentItem: items[0],
      vforTargetRef: 'overlay5-0',
      vnodeTarget: null,
      vnodeComponentTarget: null
    }
  },
  mounted () {
    this.vnodeTarget = this.$refs.vnodeTest
    this.vnodeComponentTarget = this.$refs.vnodeComponentTest
  },
  methods: {
    showMultiFirst () {
      this.multiTargetOpen = true
      this.multiTargetRef = 'overlay3'
    },
    showMultiSecond () {
      this.multiTargetOpen = true
      this.multiTargetRef = 'overlay4'
    },
    showItem (item, index) {
      this.vforOpen = true
      this.vforCurrentItem = item
      this.vforTargetRef = `overlay5-${index}`
    }
  }
}
</script>

<style lang="less">
@import '~less-plugin-est/src/all.less';

.demo-overlay-box {
  box-shadow: 1px 1px 6px fadeout(#000, 80%);
  padding: 10px 20px;
  background: #fff;
}

.demo-overlay {
  .row {
    background: #f8f8f8;
    padding: 10px 15px 10px 5px;
    margin-bottom: 120px;
    .clearfix();
  }

  pre {
    float: left;
    width: 400px;
    margin: 0;
  }

  .preview {
    margin-left: 400px;
    height: 160px;
    overflow: scroll;
    border: 1px solid #dbdbdb;

    .scroll-content {
      width: 2000px;
      height: 2000px;
    }

    .veui-overlay {
      margin-top: 65px;
      margin-left: 100px;
    }
  }

  .target {
    background: #6c9;
    width: 100px;
    height: 80px;
  }

  .veui-button {
    margin-right: 20px;
  }
}
</style>
