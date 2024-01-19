<template>
<article>
  <h1>Plugins</h1>
  <h2>
    <code>this.$confirm()</code>
  </h2>
  <section>
    <button @click="handleToast">toast提示</button>
    <button v-if="!removed" @click="handleRemove">删除我</button>
    <button @click="handleRestore">👈🏻恢复它</button>
    <button @click="handlePromptInput">prompt输入</button>
  </section>
</article>
</template>

<script>
import config from '@/managers/config'

config.set({ theme: 'ai' })

export default {
  name: 'plugins-demo',
  components: {},
  data () {
    return {
      removed: false
    }
  },
  methods: {
    handleToast () {
      this.$toast.info('我是提示', {
        theme: Math.random() > 0.5 ? 'd20' : 'ai'
      })
    },
    async handleRemove () {
      let ok = await this.$confirm('是否确定删除？', '删除确认', {
        okLabel: '删除',
        theme: 'ai'
      })
      if (!ok) {
        return
      }
      this.removed = true
    },
    async handleRestore () {
      await this.$confirm('是否确定恢复它？', '恢复确认', {
        ok: () => {
          let wait = new Promise((resolve) => setTimeout(resolve, 1000))
          return wait.then(() => {
            if (Math.random() > 0.7) {
              this.$toast.error('恢复失败', {
                theme: 'ai'
              })
              return false
            }
            this.removed = false
          })
        },
        okLabel: '恢复它',
        cancelLabel: '不恢复它'
      })
    },
    async handlePromptInput () {
      let input = await this.$prompt('请输入！', 'PROMPT', {
        okLabel: '输入',
        cancelLabel: '不输入',
        value: '初始值',
        theme: 'ai'
      })
      this.$alert(`prompt输入内容为:${input}`, 'title', {
        okLabel: '收到',
        theme: 'ai'
      })
    }
  }
}
</script>
