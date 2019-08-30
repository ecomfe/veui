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

/**
 * 推荐列表 mixin
 *
 * @param {String} datasourceKey 原数据源字段名称
 * @param {String} labelKey 数据源节点用于显示的字段名称（检索过滤字段名）
 * @param {String} childrenKey 数据源子节点字段名称
 */
const suggestion = ({
  datasourceKey = 'options',
  labelKey = 'label',
  childrenKey = 'options'
}) => ({
  props: {
    filter: Function
  },
  computed: {
    realFilter () {
      return this.filter || this.defaultFilter
    },
    suggestionDatasource () {
      return this[datasourceKey] || []
    },
    flattedDatasource () {
      return flatDatasource(this.suggestionDatasource, labelKey, childrenKey)
    }
  },
  methods: {
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
     * @param {String} searchValue 检索词
     * @return {Boolean} 是否含有匹配的项
     */
    filterFlattedDatasource (searchValue) {
      let groupMatch = false
      this.flattedDatasource.forEach(item => {
        let match = this.realFilter(item, searchValue)
        item.hidden = !match
        item.groups = match || null
        groupMatch = groupMatch || !!match
      })
      return groupMatch
    }
  }
})

export default suggestion({})
export { suggestion }
