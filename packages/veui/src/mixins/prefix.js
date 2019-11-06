export function prefixify (name) {
  return `${process.env.VEUI_PREFIX ||
    process.env.VUE_APP_VEUI_PREFIX ||
    'veui'}-${name}`
}

export default {
  methods: {
    $c: prefixify
  }
}
