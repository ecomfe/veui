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

function filter (matchResult, item, ancestors) {
  let matched = toBoolean(matchResult)
  return matched || ancestors.some(({ matched }) => matched)
}

function toBoolean (matchResult) {
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
    searchKey,
    keywordRe
  } = options

  // 放 options 里面缓存下，保留原来 keyword 变量传给自定义的 matchFn
  if (!keywordRe) {
    keywordRe = options.keywordRe = createKeywordRe(keyword, options)
  }

  datasource.some(item => {
    // 包下不会怕属性冲突
    let itemWrap = {
      item
    }

    // match
    let offsets =
      typeof matchFn === 'function'
        ? matchFn(item, keyword, ancestors)
        : match(item, keywordRe, options)
    let isArray = Array.isArray(offsets)
    let isBool = !isArray && typeof offsets === 'boolean'
    if (!isArray && !isBool) {
      throw new Error(
        'The return value of the `match` function must either be a boolean or an array.'
      )
    }
    itemWrap.matched = toBoolean(offsets, item)

    // filter
    let filtered =
      typeof filterFn === 'function'
        ? filterFn(offsets, item, ancestors)
        : filter(offsets, item, ancestors)
    if (typeof filtered !== 'boolean') {
      throw new Error(
        'The return value of the `filter` function must be a boolean.'
      )
    }
    itemWrap.filtered = filtered

    // 即使没有匹配成功，为了渲染简单，还是生成 parts
    if (item[searchKey]) {
      itemWrap.parts = splitText(item[searchKey], offsets || [])
    }

    let path = [...ancestors, itemWrap]
    let limited = limit && limit <= result.length
    if (!limited) {
      if (item[valueKey] && itemWrap.filtered) {
        result.push({
          matches: path,
          ...omit(item, childrenKey) // for flat optionGroup
        })
      }
      if (item[childrenKey]) {
        search(item[childrenKey], keyword, options, result, path)
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
 * @param {string} options.filterKey 过滤方法（影响匹配过程，比如将父匹配结果改为false，那么后代如果自己不匹配就不会在结果集中）
 * @param {string} options.valueKey 该字段有值，该项才会作为搜索结果
 * @param {string} options.childrenKey children
 * @param {string} options.searchKey 被搜索的字段
 * @param {number} options.limit 限制结果的数量，0 表示不限制
 * @param {string} options.flags 正则的模式
 * @param {boolean} options.literal 默认把 keyword 中的正则特殊字段当成普通字符匹配，如 \d 就是匹配`\d`
 */
export default function useSearchable ({
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
            flags,
            literal
          }
        )
      }
    }
  }
}
