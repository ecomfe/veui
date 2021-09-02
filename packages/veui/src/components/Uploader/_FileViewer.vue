<template>
<component
  :is="tag"
  :src="realSrc"
/>
</template>

<script>
export default {
  uiTypes: ['transparent'],
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
        if (process.env.VUE_ENV === 'server' || val === oldVal) {
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
