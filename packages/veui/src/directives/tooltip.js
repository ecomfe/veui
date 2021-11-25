import { normalize } from 'vue-directive-normalizer'
import tooltip from '../managers/tooltip'
import { flatMap, pick } from 'lodash'
import { isOverflow } from '../utils/dom'

const OPTIONS_SCHEMA = {
  value: 'content',
  modifiers: {
    position: flatMap(['top', 'right', 'bottom', 'left', 'auto'], side => {
      return [side, `${side}-start`, `${side}-end`]
    }),
    overflow: false
  },
  defaults: () => ({
    disabled: false
  })
}

function refresh (el, binding) {
  const options = normalize(binding, OPTIONS_SCHEMA)
  let context = el.__tooltip_context__

  if (context) {
    context.options = options
    tooltip.update(pick(options, 'content', 'position'))
    return
  }

  function handleMouseEnter () {
    const { options } = context
    if (options.disabled) {
      return
    }

    if (!options.overflow || isOverflow(el)) {
      tooltip.enter(this, options)
    }
  }

  function handleMouseLeave () {
    const { options } = context
    if (options.disabled) {
      return
    }
    if (!options.overflow || isOverflow(el)) {
      tooltip.leave()
    }
  }

  context = el.__tooltip_context__ = {
    options,
    handleMouseEnter,
    handleMouseLeave
  }

  el.addEventListener('mouseenter', handleMouseEnter)
  el.addEventListener('mouseleave', handleMouseLeave)
}

function clear (el) {
  const { handleMouseEnter, handleMouseLeave } = el.__tooltip_context__

  tooltip.destroy()
  el.removeEventListener('mouseenter', handleMouseEnter)
  el.removeEventListener('mouseleave', handleMouseLeave)

  el.__tooltip_context__ = null
}

export default {
  bind: refresh,
  componentUpdated: refresh,
  unbind: clear
}
