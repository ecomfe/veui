import Vue from 'vue'
import { assign } from 'lodash'
import Tooltip from '../components/Tooltip'
import { prefixify } from '../mixins/prefix'
import config from './config'

config.defaults(
  {
    warmup: 800,
    cooldown: 800
  },
  'tooltip'
)

export function createTooltipManager ({ warmup, cooldown = warmup } = {}) {
  let component = null
  let timer = null

  function destroy () {
    clearTimeout(timer)

    if (component) {
      component.$destroy()

      const { $el } = component
      if ($el && $el.parentNode) {
        $el.parentNode.removeChild($el)
      }

      component = null
    }
  }

  function enter (target, options) {
    if (timer !== null) {
      // cooldown timer
      clearTimeout(timer)
      timer = null
      open(target, options)

      return
    }

    timer = setTimeout(
      () => {
        timer = null
        open(target, options)
      },
      warmup == null ? config.get('tooltip.warmup') : warmup
    )
  }

  function leave () {
    close()
    if (timer !== null) {
      // warmup timer
      clearTimeout(timer)
      timer = null

      return
    }

    // warmup complete and being active
    timer = setTimeout(
      () => {
        timer = null
        destroy()
      },
      cooldown == null ? config.get('tooltip.cooldown') : cooldown
    )
  }

  function open (target, { position, content }) {
    if (!component) {
      component = createComponent()
    }

    if (!target || !content) {
      return
    }

    assign(component, {
      target,
      content,
      position,
      open: true
    })
  }

  function close () {
    if (component) {
      component.open = false
    }
  }

  return {
    enter,
    leave,
    destroy
  }
}

function createComponent () {
  const el = document.createElement('div')
  document.body.appendChild(el)

  const component = new Vue({
    data () {
      return {
        open: false,
        target: null,
        content: null,
        position: null
      }
    },
    render (h) {
      return h(
        Tooltip,
        {
          props: {
            open: this.open,
            target: this.target,
            position: this.position,
            trigger: 'custom',
            overlayClass: prefixify('global-tooltip')
          }
        },
        [h('template', { slot: 'default' }, this.content)]
      )
    }
  })
  component.$mount(el)

  return component
}

export default createTooltipManager()
