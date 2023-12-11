<script>
import FaIcon from 'vue-awesome/components/Icon'
import ui from '../mixins/ui'
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
    ui,
    {
      computed: {
        classes () {
          return {
            [this.$c('icon')]: true,
            [this.$c('icon-spin')]: this.spin
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
