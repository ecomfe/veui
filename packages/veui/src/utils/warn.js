import Vue from 'vue'

export default function warn (message, vm) {
  if (process.env.NODE_ENV !== 'production') {
    Vue.util.warn(message, vm)
  }
}

export function getLink (component, name, type = 'prop') {
  if (!component || !name) {
    return null
  }
  return `https://veui.dev/components/${component}#${type}s-${name}`
}
