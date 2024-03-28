<script>
import { prefixify } from '../mixins/prefix'
import Icon from './Icon'

export default {
  name: 'veui-search-result',
  functional: true,
  props: {
    matches: Array,
    matchClass: [Object, String, Array],
    separatorClass: [Object, String, Array],
    // eslint-disable-next-line vue/require-prop-types
    separator: {},
    themeVariant: String
  },
  render (_, { props }) {
    let { matches, matchClass, separatorClass, separator, themeVariant } = props
    matchClass = [
      prefixify('search-result-item-matched', themeVariant),
      matchClass
    ]
    separatorClass = [
      prefixify('search-result-item-separator', themeVariant),
      separatorClass
    ]
    return (matches || []).reduce((result, { parts }, idx) => {
      const items = parts.map(({ text, matched }, index) =>
        matched ? (
          <mark key={`${idx}-${index}`} class={matchClass}>
            {text}
          </mark>
        ) : (
          <span key={`${idx}-${index}`}>{text}</span>
        )
      )

      const level = [<span key={`label-${idx}`}>{items}</span>]

      if (idx < matches.length - 1) {
        level.push(
          separator ? (
            <Icon key={`sep-${idx}`} class={separatorClass} name={separator} />
          ) : (
            <span key={`sep-${idx}`} class={separatorClass}>
              &gt;
            </span>
          )
        )
      }
      return [...result, ...level]
    }, [])
  }
}
</script>
