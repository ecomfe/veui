<template>
  <article>
    <h1><code>&lt;veui-button-group&gt;</code></h1>
    <p>
      <veui-button-group :items="items11" :active="active" :mode="modeExclusive"></veui-button-group>
      mode: {{modeExclusive}}
    </p>
    <p>
      <veui-button-group :items="items12" :active="active" :mode="modeExclusive"></veui-button-group>
      mode: {{modeExclusive}}
    </p>
    <p>
      <veui-button-group :items="items1" :active="active" :mode="modeExclusive"></veui-button-group>
    </p>
    <p>
      <veui-button-group :items="items2" :active="active" :mode="modeExclusive"></veui-button-group>
    </p>
    <p>
      <veui-button-group :items="items2" :active="active" :mode="modeMultiple"></veui-button-group>
    </p>

    <p>
      <veui-button-group ui="tiny" :active="active" :items="itemsLink"></veui-button-group>
    </p>
    <p>
      <veui-button-group ui="small" :active="active" :items="itemsLink"></veui-button-group>
    </p>
    <p>
      <veui-button-group :active="active" :items="itemsLink"></veui-button-group>
    </p>
    <p>
      <veui-button-group ui="large" :active="active" :items="itemsLink"></veui-button-group>
    </p>

    <p>
      <veui-button-group ui="tiny aux" :items="itemsLink"></veui-button-group>
    </p>
    <p>
      <veui-button-group ui="aux" :items="itemsLink"></veui-button-group>
    </p>
    <p>
      <veui-button-group ui="small aux" :items="itemsLink"></veui-button-group>
    </p>
    <p>
      <veui-button-group ui="large aux" :items="itemsLink"></veui-button-group>
    </p>

    <p>
      <veui-button-group ui="tiny alt" :items="itemsLink"></veui-button-group>
    </p>
    <p>
      <veui-button-group ui="alt" :items="itemsLink"></veui-button-group>
    </p>
    <p>
      <veui-button-group ui="small alt" :items="itemsLink"></veui-button-group>
    </p>
    <p>
      <veui-button-group ui="large alt" :items="itemsLink"></veui-button-group>
    </p>

    <p>
      <veui-button-group ui="small" :items="itemsLink"></veui-button-group>
    </p>
    <p>
      <veui-button-group :items="itemsLink"></veui-button-group>
    </p>
    <p>
      <veui-button-group ui="large" :items="itemsLink"></veui-button-group>
    </p>

    <p>
      <veui-button-group ui="tiny link" :items="itemsLink"></veui-button-group>
    </p>
    <p>
      <veui-button-group ui="small link" :items="itemsLink"></veui-button-group>
    </p>
    <p>
      <veui-button-group ui="link" :items="itemsLink"></veui-button-group>
    </p>
    <p>
      <veui-button-group ui="large link" :items="itemsLink"></veui-button-group>
    </p>

    <p>
      <veui-button-group :items="items11" :active="active" :mode="modeExclusive" :vertical="vertical"></veui-button-group>
    </p>

    <!-- <p>
      <veui-button-group :items="items3" :active="active" :mode="mode"></veui-button-group>
    </p>
    <p>
      <veui-button-group :items="items1" :vertical="vertical"></veui-button-group>
    </p>
    <p>
      <veui-button-group :items="items1" ui="vertical" :vertical="vertical"></veui-button-group>
    </p>
    <p>
      <veui-button-group :items="items2" :vertical="vertical"></veui-button-group>
    </p>
    <p>
      <veui-button-group :items="items3" :active="active" :vertical="vertical"></veui-button-group>
    </p> -->

  </article>
</template>

<script>
import bus from '../bus'
import ButtonGroup from '@/components/ButtonGroup'
import 'vue-awesome/icons/thumbs-up'
import 'vue-awesome/icons/flash'
import 'vue-awesome/icons/gear'
import 'vue-awesome/icons/code-fork'
import 'vue-awesome/icons/download'

export default {
  name: 'buttonGroup',
  components: {
    'veui-button-group': ButtonGroup
  },
  data () {
    return {
      items1: [
        {
          label: '菜单1',
          icon: 'upload',
          value: 'upload'
        },
        {
          label: '菜单2',
          icon: 'download',
          value: 'download'
        },
        {
          label: '菜单3',
          icon: 'code-fork',
          value: 'codeFork'
        },
        {
          label: '菜单4',
          icon: 'check',
          value: 'check'
        }
      ],
      items11: [
        {
          label: '菜单1',
          value: 'menu1'
        },
        {
          label: '菜单2',
          value: 'menu2'
        },
        {
          label: '菜单3',
          value: 'menu3'
        },
        {
          label: '菜单4',
          value: 'menu4'
        }
      ],
      items12: [
        {
          icon: 'upload',
          value: 1
        },
        {
          icon: 'download',
          value: 2
        },
        {
          icon: 'code-fork',
          value: 3
        },
        {
          icon: 'check',
          value: 4
        }
      ],
      items2: [
        {
          label: 'menu1',
          value: 'DOWNLOAD',
          icon: 'thumbs-up'
        },
        {
          label: 'menu2',
          value: 'UPLOAD',
          icon: 'gear'
        },
        {
          label: 'menu3',
          value: 'FlASH',
          icon: 'flash'
        }
      ],
      items3: [
        {
          label: '垂直菜单1'
        },
        {
          label: '垂直菜单2'
        },
        {
          label: '垂直菜单3'
        },
        {
          label: '垂直菜单4'
        }
      ],
      itemsLink: [
        {
          label: '上传'
        },
        {
          label: '下载'
        },
        {
          label: '更新'
        }
      ],
      active: ['menu2'],
      active1: [0, 1],
      active2: [2],
      vertical: true,
      modeExclusive: 'exclusive',
      modeMultiple: 'multiple'
    }
  },
  mounted () {
    this.$children.forEach((child, value) => {
      child.$on('click', (index) => {
        bus.$emit('log', child.$el.getAttribute('class'))
        this.active = index
      })
    })
  }
}
</script>

<style>
p {
  user-select: none;
}
</style>
