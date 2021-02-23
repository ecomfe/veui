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
    src: [File, String]
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
        if (oldVal && (oldVal instanceof File)) {
          this.revoke()
        }
        if (val) {
          this.realSrc = (val instanceof File) ? window.URL.createObjectURL(val) : val
        }
      }
    }
  },
  methods: {
    revoke () {
      if (this.realSrc) {
        window.URL.revokeObjectURL(this.realSrc)
        this.realSrc = undefined
      }
    }
  },
  beforeDestroy () {
    this.revoke()
  }
}
</script>
