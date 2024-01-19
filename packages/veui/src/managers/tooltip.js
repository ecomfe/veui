import Vue from 'vue'
import { assign } from 'lodash'
import Tooltip from '../components/Tooltip'
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
  let currentTarget = null

  function destroy () {
    clearTimeout(timer)
    timer = null

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
    currentTarget = target

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
    currentTarget = null

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
        destroy()
      },
      cooldown == null ? config.get('tooltip.cooldown') : cooldown
    )
  }

  function update (target, options) {
    if (!component || currentTarget !== target) {
      return
    }

    let useDefault = typeof options.content === 'undefined'

    if (useDefault) {
      assign(component, {
        ...options,
        content: target.textContent
      })
    } else {
      assign(component, options)
    }
  }

  function open (target, { position, content, theme }) {
    let useDefault = typeof content === 'undefined'

    if (!target || (!content && !useDefault)) {
      return
    }

    if (!component) {
      component = createComponent({ theme })
    }

    assign(component, {
      target,
      content: useDefault ? target.textContent : content,
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
    update,
    destroy
  }
}

function createComponent ({ theme }) {
  const el = document.createElement('div')
  document.body.appendChild(el)

  const component = new Vue({
    data () {
      return {
        open: false,
        target: null,
        content: null,
        position: null,
        theme
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
            theme: this.theme,
            trigger: 'custom',
            overlayClass: 'veui-global-tooltip'
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
