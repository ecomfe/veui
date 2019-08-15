import { throttle, uniqueId } from 'lodash'
import { toggleClass } from '../utils/dom'
import outside from '../directives/outside'
import overlay from './overlay'
import activatable from './activatable'

const flatDatasource = (datasource, flatKey, childrenKey) => {
  let res = []
  function walk (src, parentValue) {
    src.forEach(item => {
      let children = item[childrenKey]
      let flatValue = parentValue
        ? `${parentValue} > ${item[flatKey]}`
        : item[flatKey]

      if (children) {
        walk(children, flatValue)
      } else {
        res.push({
          ...item,
          [flatKey]: flatValue
        })
      }
    })
  }
  walk(datasource, '')
  return res
}
export default {
  directives: { outside },
  mixins: [overlay, activatable],
  props: {
    filter: Function
  },
  data () {
    return {
      expanded: false,
      localOverlayOptions: {
        position: 'bottom left',
        constraints: [
          {
            to: 'window',
            attachment: 'together'
          }
        ]
      },
      dropdownId: uniqueId('veui-dropdown-')
    }
  },
  computed: {
    realFilter () {
      return this.filter || this.defaultFilter
    },
    suggestionDatasource () {
      return this.options || this.suggestions || []
    },
    flattedDatasource () {
      return flatDatasource(this.suggestionDatasource, 'label', 'options')
    }
  },
  updated () {
    let { box } = this.$refs
    if (!box || !(box instanceof HTMLElement)) {
      return
    }

    if (box.scrollHeight > box.offsetHeight) {
      toggleClass(box, 'veui-dropdown-overflow', true)

      this.__overlay_scroll_handler__ = throttle(this.handleScroll, 200, {
        leading: true
      })

      this.handleScroll()

      box.addEventListener('scroll', this.__overlay_scroll_handler__, false)
    }
  },
  methods: {
    close () {
      this.expanded = false
    },
    activate () {
      if (this.realDisabled || this.realReadonly) {
        return
      }
      this.expanded = true
    },
    handleScroll () {
      let { box } = this.$refs

      if (!box) {
        return
      }

      toggleClass(
        box,
        'veui-dropdown-overflow-scroll-start',
        box.scrollTop === 0
      )

      toggleClass(
        box,
        'veui-dropdown-overflow-scroll-end',
        box.scrollTop + box.offsetHeight >= box.scrollHeight
      )
    },
    defaultFilter (item, searchValue) {
      let regExp = new RegExp(`(${searchValue})+`, 'g')
      let itemLabel = item.label || ''
      let separators = itemLabel.match(regExp)
      if (separators) {
        return itemLabel.split(regExp).map((value, index) => {
          if (index % 2 === 0) {
            return {
              value,
              isSeparator: false
            }
          }
          return {
            value: separators[Math.floor(index / 2)],
            isSeparator: true
          }
        })
      }
      return false
    },
    /**
     * 过滤抹平后的数据源
     *
     * @param {Array<Object>} datasource 数据源
     * @param {String} searchValue 检索词
     * @return {Boolean} 是否含有匹配的项
     */
    filterFlattedDatasource (datasource, searchValue) {
      let groupMatch = false
      this.flattedDatasource.forEach(item => {
        let match = this.realFilter(item, searchValue)
        item.hidden = !match
        item.groups = match || null
        groupMatch = groupMatch || !!match
      })
      return groupMatch
    }
  },
  destroy () {
    if (this.__overlay_scroll_handler__) {
      this.$refs.box.removeEventListener(
        'scroll',
        this.__overlay_scroll_handler__,
        false
      )
    }
  }
}
