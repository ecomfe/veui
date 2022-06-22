import { find as _find } from 'lodash'

const DEFAULT_CHILDREN_KEY = 'children'

export function walk (
  array,
  callback,
  alias = DEFAULT_CHILDREN_KEY,
  context = {}
) {
  return _walk(
    array,
    callback,
    { ...context, depth: 0, parents: [], parentIndices: [] },
    alias
  )
}

function _walk (array, callback, context, alias = DEFAULT_CHILDREN_KEY) {
  if (!array || !callback) {
    return
  }

  let enter
  let exit
  if (typeof callback === 'function') {
    enter = callback
  } else {
    enter = callback.enter
    exit = callback.exit
  }

  if (!enter && !exit) {
    return
  }

  if (!Array.isArray(array)) {
    array = getChildrenByAlias(array, alias)
    if (!array) {
      return
    }
  }

  let { depth, parents, parentIndices } = context
  let result = []
  array.forEach((item, index) => {
    let skip = false
    let replaced = item
    let settedContext = null
    let selfContext = {
      ...context,
      index,
      skip: (...args) => {
        skip = args.length ? !!args[0] : true
      },
      // 如果被 walk 的对象是可以修改的，可以直接修改
      // 但是比如是 datasource prop，就只能用 replace 了
      replace: (newItem) => {
        replaced = newItem
      },
      setContext: (context) => {
        settedContext = context
      }
    }

    if (typeof enter === 'function') {
      enter(item, selfContext)
    }

    let children = skip ? null : getChildrenByAlias(replaced, alias)
    if (children) {
      selfContext.childrenResult = _walk(
        children,
        callback,
        {
          ...context,
          ...settedContext,
          parents: [...parents, replaced],
          parentIndices: [...parentIndices, index],
          depth: depth + 1
        },
        alias
      )
    }

    if (typeof exit === 'function') {
      // 此时 exit 可以拿到 selfContext.childrenResult
      result.push(exit(replaced, selfContext))
    }
  })
  return result
}

export function find (
  array,
  predicate,
  alias = DEFAULT_CHILDREN_KEY,
  parents = []
) {
  if (!array || typeof predicate !== 'function') {
    return null
  }

  let result = null
  array.some((item) => {
    if (predicate(item, parents)) {
      result = item
      return true
    }
    let children = getChildrenByAlias(item, alias)
    if (!children) {
      return false
    }
    let inner = find(children, predicate, alias, [...parents, item])
    if (inner !== null) {
      result = inner
      return true
    }
  })
  return result
}

export function findParents (
  array,
  predicate,
  { alias = DEFAULT_CHILDREN_KEY, includeSelf = false } = {}
) {
  let parents = []
  let self = find(
    array,
    (item, pts) => {
      let match = !!predicate(item)
      if (match) {
        parents = pts
      }
      return match
    },
    alias
  )

  return self == null ? null : includeSelf ? parents.concat(self) : parents
}

function getChildrenByAlias (obj, alias) {
  let keys = typeof alias === 'string' ? [alias] : alias

  let key = _find(keys, (key) => {
    return Array.isArray(obj[key])
  })

  return key ? obj[key] : null
}

export function mapDatasource (
  datasource,
  callback,
  childrenKey = DEFAULT_CHILDREN_KEY
) {
  const isExit = typeof callback === 'function'
  const enter = isExit ? null : callback.enter
  const exit = isExit ? callback : callback.exit
  return walk(
    datasource,
    {
      ...(enter ? { enter } : null),
      exit: (item, context) => {
        return {
          ...exit(item, context),
          ...(hasChildren(item, childrenKey)
            ? { [childrenKey]: context.childrenResult }
            : {})
        }
      }
    },
    childrenKey
  )
}

export function hasChildren (item, childrenKey = DEFAULT_CHILDREN_KEY) {
  return !!item[childrenKey] && item[childrenKey].length !== 0
}

export function getLeaves (root, childrenKey) {
  return getDescendants(
    root,
    (descendant) => {
      return {
        keep: hasChildren(descendant, childrenKey) ? false : 'value'
      }
    },
    childrenKey
  )
}

export function getGroupDescendants (root, childrenKey) {
  return getDescendants(
    root,
    (descendant) => {
      return {
        keep: hasChildren(descendant, childrenKey) ? 'value' : false
      }
    },
    childrenKey
  )
}

export function getEnabledDescendants (root, childrenKey) {
  return getDescendants(
    root,
    ({ disabled }) => {
      return {
        keep: disabled ? false : 'value',
        skipChildren: disabled
      }
    },
    childrenKey
  )
}

/**
 * 获取后代节点的值
 * @param {object} root 父节点
 * @param {Function} visit 控制如何获取后代节点的值，签名： (root, context) => ({keep, skipChildren})
 *                   keep 为 false 表示不获取该节点的值，为 string 表示值对应的字段名
 *                   skipChildren 为 boolean，表示是否跳过该节点之下的后代
 * @param {string} childrenKey 子项的字段名
 * @return {Array} 获取到的后代节点的值
 */
export function getDescendants (
  root,
  visit,
  childrenKey = DEFAULT_CHILDREN_KEY
) {
  let result = []
  if (typeof visit === 'string') {
    childrenKey = visit
    visit = null
  }

  walk(
    root,
    (child, context) => {
      let { keep = 'value', skipChildren } =
        typeof visit === 'function' ? visit(child, context) : {}
      if (keep && child[keep] !== undefined) {
        result.push(child[keep])
      }
      context.skip(!!skipChildren)
    },
    childrenKey
  )
  return result
}
