import { omit, escapeRegExp } from 'lodash'
import warn from '../utils/warn'
import useConfig from './config'
import config from '../managers/config'

function match (item, keyword, { searchKey, keywordRe }) {
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

function filter (item, keyword, { ancestors, offsets }) {
  let matched = toBoolean(offsets)
  return matched || ancestors.some(({ matched }) => matched)
}

function toBoolean (matchResult) {
  return Array.isArray(matchResult) ? !!matchResult.length : matchResult
}

function createKeywordRe (keyword, { flags, literal }) {
  keyword = literal ? escapeRegExp(keyword) : keyword
  try {
    return new RegExp(keyword, flags)
  } catch (e) {
    // keyword is not a valid regexp pattern or flags are invalid.
    warn(`[veui-searchable] ${e.message}`)
    return null
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

function search (datasource, keyword, options, result = []) {
  let {
    valueKey,
    childrenKey,
    matchFn,
    filterFn,
    limit,
    searchKey,
    ancestors
  } = options

  datasource.some(item => {
    // 包下不会怕属性冲突
    let itemWrap = { item }

    // match
    let offsets = matchFn(
      item,
      keyword,
      matchFn === match ? options : { ancestors }
    )
    let isArray = Array.isArray(offsets)
    // 特殊处理下只有一段的匹配
    if (
      isArray &&
      typeof offsets[0] === 'number' &&
      typeof offsets[1] === 'number'
    ) {
      offsets = [offsets]
    }

    let isBool = !isArray && typeof offsets === 'boolean'
    if (!isArray && !isBool) {
      throw new Error(
        'The return value of the `match` function must either be a boolean or an array.'
      )
    }
    itemWrap.matched = toBoolean(offsets, item)

    // filter
    let filtered = filterFn(item, keyword, { ancestors, offsets })
    if (typeof filtered !== 'boolean') {
      throw new Error(
        'The return value of the `filter` function must be a boolean.'
      )
    }
    itemWrap.filtered = filtered

    // 即使没有匹配成功，为了渲染简单，还是生成 parts
    if (item[searchKey]) {
      itemWrap.parts = splitText(item[searchKey], isArray ? offsets : [])
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
        search(
          item[childrenKey],
          keyword,
          { ...options, ancestors: path },
          result
        )
        // update limit after searching children
        return limit && limit <= result.length
      }
    }
    return limited
  })
  return result
}

const call = (val, context) => (typeof val === 'function' ? val(context) : val)

const CONFIG_NAMESPACE = 'searchable'
const CONTEXT_NAME = 'searchable_mixin_config'

// 声明出来，否则不响应式
config.defaults({
  [`${CONFIG_NAMESPACE}.match`]: null,
  [`${CONFIG_NAMESPACE}.filter`]: null
})

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
  limit = 300,
  literal = true,
  exposeProps = false
} = {}) {
  if (exposeProps) {
    matchKey = matchKey || 'match'
    filterKey = filterKey || 'filter'
  }

  return {
    ...(exposeProps && {
      // props 名字不一样，就自己暴露（exposeProps： false）
      props: {
        match: Function,
        filter: Function
      }
    }),
    mixins: [useConfig(CONTEXT_NAME, CONFIG_NAMESPACE)],
    computed: {
      [resultKey] () {
        // 创建 RegExp
        const keyword = this[call(keywordKey, this)]
        if (!keyword) {
          // 没有关键字就不要搜了，搜出来数据结构比较复杂
          return []
        }

        const keywordRe = createKeywordRe(keyword, { flags, literal })
        if (!keywordRe) {
          return []
        }

        return search(this[call(datasourceKey, this)], keyword, {
          valueKey: call(valueKey, this),
          childrenKey: call(childrenKey, this),
          searchKey: call(searchKey, this),
          matchFn: getDefaultMatch(this, matchKey),
          filterFn: getDefaultFilter(this, filterKey),
          limit,
          keywordRe,
          ancestors: []
        })
      }
    }
  }
}

export function getDefaultFilter (vm, impl) {
  return getConfigurable(vm, impl, 'filter') || filter
}

export function getDefaultMatch (vm, impl) {
  return getConfigurable(vm, impl, 'match') || match
}

function getConfigurable (vm, impl, contextKey) {
  if (typeof impl === 'string') {
    impl = vm[impl]
  }

  return typeof impl === 'function'
    ? impl
    : vm[CONTEXT_NAME][`${CONFIG_NAMESPACE}.${contextKey}`]
}
