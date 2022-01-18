<script>
import { prefixify } from '../mixins/prefix'

const BUILTIN_TRANSITIONS = [
  'fade-in',
  'scale-fade-in',
  'slide-in',
  'slide-fade-in',
  'slide-scale-fade-in',
  'move',
  'fade-out',
  'scale-fade-out',
  'slide-out',
  'slide-fade-out',
  'slide-scale-fade-out'
]

const Wrapper = {
  render () {
    return this.$slots.default
  }
}

export default {
  name: 'veui-transition',
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      validator (val) {
        return BUILTIN_TRANSITIONS.indexOf(val) >= 0
      }
    }
  },
  computed: {
    realName () {
      return prefixify(`transition-${this.name}`)
    },
    customListeners () {
      return {
        transitionstart: e => {
          this.$emit('before-move', e.target)
          this.$emit('move', e.target)
        },
        transitionend: e => {
          this.$emit('after-move', e.target)
        },
        transitioncancel: e => {
          this.$emit('move-cancelled', e.target)
        }
      }
    }
  },
  render () {
    if (this.name === 'move') {
      // wrap 目的：加class/style/nativeOn 方便，不用 cloneVnode 了
      return (
        <Wrapper
          class={this.realName}
          {...{
            attrs: { ...this.$attrs },
            nativeOn: this.customListeners
          }}
        >
          {this.$slots.default}
        </Wrapper>
      )
    }

    return (
      <transition
        name={this.realName}
        {...{
          attrs: { ...this.$attrs },
          on: this.$listeners
        }}
      >
        {this.$slots.default}
      </transition>
    )
  }
}
</script>
