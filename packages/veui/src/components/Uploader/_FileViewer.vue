<template>
<component
  :is="tag"
  :src="realSrc"
/>
</template>

<script>
export default {
  props: {
    tag: String,
    src: process.env.VUE_ENV === 'server' ? String : [String, File]
  },
  data () {
    return {
      realSrc: undefined
    }
  },
  watch: {
    src: {
      immediate: true,
      handler (val, oldVal) {
        if (val === oldVal) {
          return
        }
        if (oldVal && oldVal instanceof File) {
          this.revoke()
        }
        if (val) {
          this.realSrc =
            val instanceof File ? window.URL.createObjectURL(val) : val
        }
      }
    }
  },
  beforeDestroy () {
    this.revoke()
  },
  methods: {
    revoke () {
      if (this.realSrc) {
        window.URL.revokeObjectURL(this.realSrc)
        this.realSrc = undefined
      }
    }
  }
}
</script>
