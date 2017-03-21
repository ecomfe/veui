<template>
  <article>
    <h1><code>&lt;veui-button&gt;</code></h1>
    <p>
      <veui-button ui="primary small">确定</veui-button>
      <veui-button ui="primary">确定</veui-button>
      <veui-button ui="primary large" disabled>确定</veui-button>
      <veui-button ui="primary" loading>确定</veui-button>
    </p>
    <p>
      <veui-button ui="small">按钮样式</veui-button>
      <veui-button>按钮样式</veui-button>
      <veui-button ui="large" disabled>按钮样式</veui-button>
      <veui-button loading>按钮样式</veui-button>
    </p>
    <p>
      <veui-button ui="aux small">按钮样式</veui-button>
      <veui-button ui="aux">按钮样式</veui-button>
      <veui-button ui="aux large" class="red" disabled>按钮样式</veui-button>
    </p>
    <p>
      <veui-button ui="round primary large"><icon name="thumbs-up"></icon></veui-button>
      <veui-button ui="round"><icon name="thumbs-down"></icon></veui-button>
      <veui-button ui="primary square small"><icon name="gear"></icon></veui-button>
      <veui-button ui="square small"><icon name="flash"></icon></veui-button>
      <veui-button ui="primary square small" @click="load" :loading="loading"><icon name="check"></icon></veui-button>
    </p>
  </article>
</template>

<script>
import bus from './bus'
import Button from '@/components/Button'
import 'vue-awesome/icons/flash'
import 'vue-awesome/icons/thumbs-up'
import 'vue-awesome/icons/thumbs-down'
import 'vue-awesome/icons/gear'
import 'vue-awesome/icons/check'

export default {
  name: 'button',
  components: {
    'veui-button': Button
  },
  data () {
    return {
      timer: null,
      loading: false
    }
  },
  methods: {
    load () {
      this.loading = true
      this.timer = setTimeout(() => {
        this.loading = false
      }, 3000)
    }
  },
  mounted () {
    this.$children.forEach(child => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
  },
  destroyed () {
    clearTimeout(this.timer)
  }
}
</script>
