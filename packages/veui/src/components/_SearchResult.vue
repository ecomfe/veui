<script>
import { prefixify } from '../mixins/prefix'
import { mergeClasses } from '../utils/helper'
import Icon from './Icon'

export default {
  name: 'veui-search-result',
  functional: true,
  props: {
    matches: Array,
    matchClass: [Object, String, Array],
    separatorClass: [Object, String, Array],
    // eslint-disable-next-line vue/require-prop-types
    separator: {}
  },
  render (h, { props }) {
    let { matches, matchClass, separatorClass, separator } = props
    matchClass = mergeClasses(
      prefixify('search-result-item-matched'),
      matchClass
    )
    separatorClass = mergeClasses(
      prefixify('search-result-item-separator'),
      separatorClass
    )
    return (matches || []).reduce((result, { parts }, idx) => {
      let items = parts.map(({ text, matched }, index) =>
        matched ? (
          <mark key={`${idx}-${index}`} class={matchClass}>
            {text}
          </mark>
        ) : (
          <span key={`${idx}-${index}`}>{text}</span>
        )
      )
      if (idx < matches.length - 1) {
        items.push(
          separator ? (
            <Icon key={idx} class={separatorClass} name={separator} />
          ) : (
            <span key={idx} class={separatorClass}>
              &gt;
            </span>
          )
        )
      }
      return [...result, ...items]
    }, [])
  }
}
</script>
