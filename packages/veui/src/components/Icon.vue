<script>
import FaIcon from 'vue-awesome/components/Icon'
import { prefixify } from '../mixins/prefix'
import '../common/global'

const {
  render,
  props: { name, ...props },
  register,
  icons,
  ...options
} = FaIcon

export default {
  ...options,
  name: 'veui-icon',
  mixins: [
    {
      computed: {
        classes () {
          return {
            [prefixify('icon')]: true,
            [prefixify('icon-spin')]: this.spin
          }
        }
      }
    }
  ],
  props: {
    name: {
      type: [Object, String],
      validator (val) {
        if (val && typeof val.render === 'function') {
          return true
        }
        return name.validator.call(this, val)
      }
    },
    ...props
  },
  mounted () {},
  updated () {},
  render (h) {
    let Icon

    if (!this.name) {
      return h()
    }

    if (typeof this.name === 'string') {
      // Icons registered by VueAwesome's register(iconData)
      if (!icons[this.name] || !icons[this.name].render) {
        return render.call(this, h)
      }
      // Icons registered by VEUI's register(name, icon)
      Icon = icons[this.name]
    } else {
      // <veui-icon :name="IconFlat"/>
      Icon = this.name
    }
    return <Icon class={this.classes} />
  },
  register (name, icon) {
    if (typeof name !== 'string') {
      // fallback to VueAwesome's register
      register(name)
      return
    }

    icons[name] = icon
  },
  icons
}
</script>

<style lang="less">
@veui-prefix: veui;

.@{veui-prefix}-icon {
  @animation-name: ~'@{veui-prefix}-icon-spin';

  &-spin {
    animation: @animation-name 1s linear infinite;
  }

  @keyframes @animation-name {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
