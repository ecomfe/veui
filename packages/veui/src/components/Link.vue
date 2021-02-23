<script>
import { uniq, noop } from 'lodash'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'

const ABS_RE = /^(\w+:)?\/\//

export default {
  name: 'veui-link',
  mixins: [prefix, ui],
  inheritAttrs: false,
  props: {
    to: {
      type: [String, Object],
      default: ''
    },
    replace: Boolean,
    native: Boolean,
    fallback: {
      type: String,
      default: 'span'
    },
    disabled: Boolean,
    rel: String,
    target: String
  },
  computed: {
    klass () {
      return {
        [this.$c('link')]: true,
        [this.$c('disabled')]: this.disabled
      }
    },
    realRel () {
      if (this.target && this.target.toLowerCase() === '_blank') {
        return uniq(
          [...(this.rel || '').split(/\s+/), 'noopener'].filter(t => t)
        ).join(' ')
      }
      return this.rel
    },
    useRouter () {
      return !this.absolute && this.$router && !this.native
    },
    absolute () {
      return typeof this.to === 'string' && ABS_RE.test(this.to)
    }
  },
  methods: {
    handleRedirect (event) {
      if (this.disabled) {
        event.preventDefault()
        return
      }
      if (this.to) {
        this.$emit('click', event)

        if (this.replace && !event.defaultPrevented) {
          event.preventDefault()
          location.replace(this.to)
        }
      } else {
        event.preventDefault()
        this.$emit('click', event)
      }
    },
    handleNativeClick (e) {
      if (this.disabled) {
        return
      }

      /**
       * Modified based on https://github.com/vuejs/vue-router/blob/6ec0ee563898ed513556f589209e8456d54ccd3b/src/components/link.js#L166-L176
       */
      // don't redirect with control keys
      if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
        return
      }
      // don't redirect on right click
      if (e.button !== undefined && e.button !== 0) {
        return
      }
      // don't redirect if `target="_blank"`
      if (e.currentTarget && e.currentTarget.getAttribute) {
        const target = e.currentTarget.getAttribute('target')
        if (/\b_blank\b/i.test(target)) return
      }

      // Click events triggered on <router-link> are always called
      // before we have a chance to deal with. So we are using a fake
      // `preventDefault` so that we can track users' intention.
      // After that restore the old one.
      let prevent = e.preventDefault
      let prevented = false
      e.preventDefault = () => {
        prevented = true
      }
      this.$emit('click', e)

      e.preventDefault = prevent

      if (prevented) {
        return
      }

      // manually navigate so that we are able to stop it
      // when users call `event.preventDefault()`
      this.navigate()
    },
    navigate () {
      let { $route, $router } = this
      let navigate = this.replace ? $router.replace : $router.push
      navigate.call($router, $router.resolve(this.to, $route).location, noop)
    }
  },
  render (h) {
    let component = !this.to
      ? this.fallback
      : this.useRouter
        ? 'router-link'
        : 'a'
    return h(
      component,
      {
        class: this.klass,
        attrs: {
          ui: this.realUi,
          'aria-disabled': this.disabled,
          tabindex: this.disabled ? -1 : null,
          ...(component === 'a'
            ? {
              href: this.to
            }
            : null),
          ...(this.to
            ? {
              rel: this.realRel,
              target: this.target
            }
            : null),
          ...this.$attrs
        },
        props: {
          ...(component === 'router-link'
            ? {
              to: this.to,
              replace: this.replace,
              event: null // prevent vue-link from starting navigation immediately
            }
            : null)
        },
        ...(component === 'router-link'
          ? {
            nativeOn: { click: this.handleNativeClick }
          }
          : { on: { click: this.handleRedirect } })
      },
      this.$slots.default
    )
  }
}
</script>
