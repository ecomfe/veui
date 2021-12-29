<template>
<transition
  :name="name"
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  @before-leave="beforeLeave"
  @leave="leave"
  @after-leave="afterLeave"
>
  <slot/>
</transition>
</template>

<script>
export default {
  name: 'veui-expand-transition',
  abstract: true,
  uiTypes: ['abstract'],
  props: {
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    // 一旦覆盖 hook 了，是不是就没必要用这个组件了？
    beforeEnter (el) {
      el.style.height = '0'
      this.$emit('before-enter', el)
    },
    enter (el) {
      if (el.scrollHeight) {
        el.style.height = `${el.scrollHeight}px`
      }
      this.$emit('enter', el)
    },
    afterEnter (el) {
      el.style.height = ''
      this.$emit('after-enter', el)
    },
    beforeLeave (el) {
      el.style.height = `${el.scrollHeight}px`
      this.$emit('before-leave', el)
    },
    leave (el) {
      if (el.scrollHeight) {
        el.style.height = '0'
      }
      this.$emit('leave', el)
    },
    afterLeave (el) {
      el.style.height = ''
      this.$emit('after-leave', el)
    }
  }
}
</script>
