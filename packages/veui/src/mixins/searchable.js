import { omit } from 'lodash'

function match (item, keywordRE, { searchKey }) {
  let offsets = []
  const searchVal = item[searchKey]
  if (searchVal) {
    let result = keywordRE.exec(searchVal)
    while (result) {
      offsets.push([result.index, result.index + result[0].length])
      result = keywordRE.exec(searchVal)
    }
    keywordRE.lastIndex = 0
  }
  return offsets
}

const metaRE = /[|\\{}()[\]^$+*?.]/g

function createKeywordRe (keyword, { flags, literal }) {
  if (keyword instanceof RegExp) {
    return keyword
  } else {
    keyword = literal ? String(keyword).replace(metaRE, '\\$&') : keyword
    return new RegExp(keyword, flags)
  }
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

function search (
  datasource,
  keyword,
  options,
  matchFn = match,
  result = [],
  ancestors = []
) {
  if (!keyword) {
    return []
  }
  let { valueKey, childrenKey, limit, exactMatch, searchKey } = options
  keyword = createKeywordRe(keyword, options)
  datasource.some(i => {
    let item = {
      item: { ...i },
      parts: [],
      matched: false
    }
    let offsets = matchFn(item.item, keyword, options)
    let isArray = Array.isArray(offsets)
    let isBool = !isArray && typeof offsets === 'boolean'
    if (!isArray && !isBool) {
      throw new Error(
        'The return value of the `match` function must either be a boolean or an array.'
      )
    }
    if (i[searchKey] && isArray) {
      item.parts = splitText(i[searchKey], offsets)
    }
    item.matched = isBool ? offsets : !!offsets.length

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
        search(i[childrenKey], keyword, options, matchFn, result, path)
        // update limit after searching children
        return limit && limit <= result.length
      }
    }
    return limited
  })
  return result
}

const call = (val, context, fallback) =>
  typeof val === 'function' ? val(context) : fallback

/**
 * searchable mixin，产出一个 computed
 *
 * @param {Object} options
 * @param {string} options.datasourceKey 输入的数据源的key
 * @param {string} options.keywordKey 搜索关键字的key
 * @param {string} options.resultKey 产出的 computed 的名称
 * @param {string} options.valueKey 该字段有值，该项才会作为搜索结果
 * @param {string} options.childrenKey children
 * @param {string} options.searchKey 被搜索的字段
 * @param {string} options.matchKey 搜索方法
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
  matchKey = 'match',
  flags = 'ig',
  limit = 100,
  exactMatch = false,
  literal = true
} = {}) {
  return {
    computed: {
      [resultKey] () {
        return search(
          call(datasourceKey, this, this[datasourceKey]),
          call(keywordKey, this, this[keywordKey]),
          {
            valueKey: call(valueKey, this, valueKey),
            childrenKey: call(childrenKey, this, childrenKey),
            searchKey: call(searchKey, this, searchKey),
            limit,
            exactMatch,
            flags,
            literal
          },
          call(matchKey, this, this[matchKey])
        )
      }
    }
  }
}
