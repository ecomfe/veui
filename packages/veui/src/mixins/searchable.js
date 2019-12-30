import { omit } from 'lodash'

function match (item, keywordRe, { searchKey }) {
  let offsets = []
  const searchVal = item[searchKey]
  if (searchVal) {
    let result = keywordRe.exec(searchVal)
    while (result) {
      offsets.push([result.index, result.index + result[0].length])
      result = keywordRe.exec(searchVal)
    }
    keywordRe.lastIndex = 0
  }
  return offsets.length ? offsets : false
}

function filter (matchResult) {
  return Array.isArray(matchResult) ? !!matchResult.length : matchResult
}

const metaRE = /[|\\{}()[\]^$+*?.]/g
function createKeywordRe (keyword, { flags, literal }) {
  keyword = literal ? String(keyword).replace(metaRE, '\\$&') : keyword
  return new RegExp(keyword, flags)
}

function splitText (text, offsets) {
  let lastIndex = 0
  let result = offsets.reduce((result, offset) => {
    if (lastIndex < offset[0]) {
      result.push({
        text: text.slice(lastIndex, offset[0]),
        matched: false
      })
    }
    result.push({
      text: text.slice(...offset),
      matched: true
    })
    lastIndex = offset[1]
    return result
  }, [])
  let rest = text.slice(lastIndex)
  if (rest) {
    result.push({
      text: rest,
      matched: false
    })
  }
  return result
}

function search (datasource, keyword, options, result = [], ancestors = []) {
  if (!keyword) {
    return []
  }

  let {
    valueKey,
    childrenKey,
    matchFn,
    filterFn,
    limit,
    exactMatch,
    searchKey,
    keywordRe
  } = options

  // 放 options 里面缓存下，保留原来 keyword 变量传给自定义的 matchFn
  if (!keywordRe) {
    keywordRe = options.keywordRe = createKeywordRe(keyword, options)
  }

  datasource.some(i => {
    let item = {
      item: { ...i },
      parts: [],
      matched: false
    }

    // match
    let offsets =
      typeof matchFn === 'function'
        ? matchFn(item, keyword)
        : match(item.item, keywordRe, options)
    let isArray = Array.isArray(offsets)
    let isBool = !isArray && typeof offsets === 'boolean'
    if (!isArray && !isBool) {
      throw new Error(
        'The return value of the `match` function must either be a boolean or an array.'
      )
    }

    // filter
    let filtered =
      typeof filterFn === 'function'
        ? filterFn(offsets, item.item)
        : filter(offsets, item.item)
    if (typeof filtered !== 'boolean') {
      throw new Error(
        'The return value of the `filter` function must be a boolean.'
      )
    }

    // 即使没有匹配成功，为了渲染简单，还是生成 parts
    if (i[searchKey]) {
      item.parts = splitText(i[searchKey], offsets || [])
    }
    item.matched = filtered

    let realMatched = exactMatch
      ? item.matched
      : item.matched || ancestors.some(({ matched }) => matched)
    let path = [...ancestors, item]
    let limited = limit && limit <= result.length
    if (!limited) {
      if (i[valueKey] && realMatched) {
        result.push({
          matches: path,
          ...omit(i, childrenKey) // for flat optionGroup
        })
      }
      if (i[childrenKey]) {
        search(i[childrenKey], keyword, options, result, path)
        // update limit after searching children
        return limit && limit <= result.length
      }
    }
    return limited
  })
  return result
}

const call = (val, context) => (typeof val === 'function' ? val(context) : val)

/**
 * searchable mixin，产出一个 computed
 *
 * @param {Object} options
 * @param {string} options.datasourceKey 输入的数据源的key
 * @param {string} options.keywordKey 搜索关键字的key
 * @param {string} options.resultKey 产出的 computed 的名称
 * @param {string} options.matchKey 搜索方法
 * @param {string} options.filterKey 过滤方法
 * @param {string} options.valueKey 该字段有值，该项才会作为搜索结果
 * @param {string} options.childrenKey children
 * @param {string} options.searchKey 被搜索的字段
 * @param {number} options.limit 限制结果的数量，0 表示不限制
 * @param {boolean} options.exactMatch 该项有valueKey且该项搜索到值才会被认为满足搜索
 * @param {string} options.flags 正则的模式
 * @param {boolean} options.literal 默认把 keyword 中的正则特殊字段当成普通字符匹配，如 \d 就是匹配`\d`
 */
export default function searchable ({
  datasourceKey = 'datasource',
  keywordKey = 'keyword',
  resultKey = 'filteredDatasource',
  valueKey = 'value',
  childrenKey = 'children',
  searchKey = 'label',
  matchKey,
  filterKey,
  flags = 'ig',
  limit = 100,
  exactMatch = false,
  literal = true
} = {}) {
  return {
    computed: {
      [resultKey] () {
        return search(
          this[call(datasourceKey, this)],
          this[call(keywordKey, this)],
          {
            valueKey: call(valueKey, this),
            childrenKey: call(childrenKey, this),
            searchKey: call(searchKey, this),
            matchFn: this[matchKey],
            filterFn: this[filterKey],
            limit,
            exactMatch,
            flags,
            literal
          }
        )
      }
    }
  }
}
