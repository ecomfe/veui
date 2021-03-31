import { includes, find, filter } from 'lodash'
import {
  walk,
  hasChildren,
  getGroupDescendants,
  getLeaves
} from '../utils/datasource'

const INDETERMINATE = 'include-indeterminate'

const call = (val, context) => (typeof val === 'function' ? val(context) : val)

const methods = {
  /**
   * 向参数 tree 加上 checked 信息
   * @param {Array} tree 数据源
   * @param {Array} checked 选中的 value 数组
   * @return {Array} 返回原 tree，但标记了 checked 信息
   */
  markChecked (tree, checked) {
    let walker = {
      enter: (item, context) => {
        return markAncestorInChecked(
          item,
          checked,
          context,
          this.treeChildrenKey
        )
      },
      exit: (item, context) => {
        let { value, [this.treeChildrenKey]: children } = item
        if (hasChildren(item, this.treeChildrenKey)) {
          item.checked = children.every(({ checked }) => checked)
          item.partialChecked =
            !item.checked &&
            children.some(
              ({ partialChecked, checked }) => !!partialChecked || checked
            )
        } else {
          // 如果中间态不同步进 checked，那么祖先是选中，则下面的所有子孙节点都选中
          let includeIndeterminate = this.strategy === INDETERMINATE
          item.checked =
            includes(checked, value) ||
            (!includeIndeterminate && !!context.ancestorInChecked)
        }
      }
    }
    walk(tree, walker, this.treeChildrenKey)
    return tree
  },

  /**
   * toggle 数据源中某个项目（可能不是叶子节点）的选中状态
   * @param {Array} prevChecked 当前的选中值，比如 [1,2,3], 然后需要 toggle value=3 的项目
   * @param {object} item 被 toggle 的项目，如上面的 value=3 的项目
   * @param {Array} parents 参数 item 的祖先数组，[topMost, 2ndTop]
   * @param {Array} datasource 完整的数据源，用来normalize
   */
  toggleItem (prevChecked, item, parents, datasource) {
    let options = {
      strategy: this.strategy,
      childrenKey: this.treeChildrenKey
    }
    let newChecked = _toggleItem(prevChecked, item, parents, options)
    return getNormalizedCheckedValues(datasource, newChecked, options)
  },

  // 参见上面 toggle，这里是 toggle 中的选中操作，类似 transfer candidate 中选中（不能选中 hidden 的）
  checkItem (prevChecked, item, parents, datasource) {
    let options = {
      strategy: this.strategy,
      childrenKey: this.treeChildrenKey,
      operation: 'check'
    }
    let newChecked = _toggleItem(prevChecked, item, parents, options)
    return getNormalizedCheckedValues(datasource, newChecked, options)
  },

  // 参见上面 toggle，这里是 toggle 中的取消操作，类似 transfer candidatePanel 中取消（不能取消 hidden 的）
  uncheckItem (prevChecked, item, parents, datasource) {
    let options = {
      strategy: this.strategy,
      childrenKey: this.treeChildrenKey,
      operation: 'uncheck'
    }
    let newChecked = _toggleItem(prevChecked, item, parents, options)
    return getNormalizedCheckedValues(datasource, newChecked, options)
  },

  // 参见上面 uncheckItem，不同的是这里忽略 hidden 的影响，类似 transfer selectedPanel 中取消
  clearItem (prevChecked, item, parents, datasource) {
    let options = {
      strategy: this.strategy,
      childrenKey: this.treeChildrenKey,
      operation: 'clear'
    }
    let newChecked = _toggleItem(prevChecked, item, parents, options)
    return getNormalizedCheckedValues(datasource, newChecked, options)
  },

  // transfer candidatePanel 中的全选（不能选中 hidden 的）
  checkAll (prevChecked, wholeTreeWithMarkingHidden) {
    let options = {
      strategy: this.strategy,
      childrenKey: this.treeChildrenKey,
      operation: 'check'
    }
    return batch(
      prevChecked,
      wholeTreeWithMarkingHidden,
      wholeTreeWithMarkingHidden,
      options
    )
  },

  clearAll (prevChecked, itemsToBatch, datasource) {
    let options = {
      strategy: this.strategy,
      childrenKey: this.treeChildrenKey,
      operation: 'clear'
    }
    return batch(prevChecked, itemsToBatch, datasource, options)
  },

  // 用原始 tree 和 checked 选中数据派生出选中的子树
  getCheckedSubTree (tree, checked) {
    const walker = {
      enter: (item, context) => {
        return markAncestorInChecked(
          item,
          checked,
          context,
          this.treeChildrenKey
        )
      },
      exit: (item, context) => {
        if (hasChildren(item, this.treeChildrenKey)) {
          let children = context.childrenResult.filter(i => !!i)
          if (children.length) {
            return {
              ...item,
              [this.treeChildrenKey]: children
            }
          }
        } else {
          let includeIndeterminate = this.strategy === INDETERMINATE
          let isChecked =
            inChecked(checked, item) ||
            (!includeIndeterminate && !!context.ancestorInChecked)
          if (isChecked) {
            return item
          }
        }
      }
    }
    return walk(tree, walker, this.treeChildrenKey).filter(i => !!i)
  }
}

export default function treeFactory (options = {}) {
  let {
    supportIndeterminate,
    childrenKey = 'children',
    defaultMerge = 'keep-all'
  } = options

  // props
  let props = {
    mergeChecked: {
      type: String,
      default: defaultMerge,
      validator (value) {
        return includes(['keep-all', 'upwards', 'downwards'], value)
      }
    }
  }
  if (supportIndeterminate !== false) {
    props.includeIndeterminate = Boolean
  }

  return {
    props,
    computed: {
      strategy () {
        if (this.mergeChecked === 'keep-all' && this.includeIndeterminate) {
          return INDETERMINATE
        }
        return this.mergeChecked
      },
      treeChildrenKey () {
        return call(childrenKey, this) // 直接应该是 children or options
      }
    },
    methods
  }
}

function getCheckedValues (
  { value, checked, children, partialChecked },
  strategy,
  childrenCheckedValues
) {
  let includeSelf = checked && value != null
  let checkedValues = []
  switch (strategy) {
    case 'keep-all':
      if (includeSelf) {
        checkedValues.push(value)
      }
      checkedValues.push(...childrenCheckedValues)
      break
    case INDETERMINATE:
      if ((partialChecked || checked) && value != null) {
        checkedValues.push(value)
      }
      checkedValues.push(...childrenCheckedValues)
      break
    case 'upwards':
      checkedValues.push(...(includeSelf ? [value] : childrenCheckedValues))
      break
    case 'downwards':
      includeSelf = includeSelf && (!children || !children.length)
      checkedValues.push(...(includeSelf ? [value] : childrenCheckedValues))
      break
  }
  return checkedValues
}

/**
 * 重新生成一份符合当前 strategy 的选中数据
 * @param {Array} datasource 全量数据
 * @param {Array} checked 选中的数据
 * @param {string} options.strategy 选中数据的合并策略
 * @param {string} options.childrenKey 子项的字段名
 * @return {Array} 符合当前 strategy 的选中数据
 */
function getNormalizedCheckedValues (
  datasource,
  checked,
  { strategy, childrenKey }
) {
  let walker = {
    enter (item, context) {
      return markAncestorInChecked(item, checked, context, childrenKey)
    },
    exit (item, context) {
      let { value, [childrenKey]: children } = item
      let itemChecked = false
      let partialChecked = false
      let childrenCheckedValues = []
      if (hasChildren(item, childrenKey)) {
        itemChecked = context.childrenResult.every(i => !!i.checked)
        partialChecked =
          !itemChecked &&
          context.childrenResult.some(
            ({ checked, partialChecked }) => !!partialChecked || !!checked
          )
        childrenCheckedValues = context.childrenResult.reduce(
          (res, { values }) => res.concat(values),
          []
        )
      } else {
        // 如果中间态不同步进 checked，那么祖先是选中，则下面的所有子孙节点都选中
        let includeIndeterminate = strategy === INDETERMINATE
        itemChecked =
          includes(checked, value) ||
          (!includeIndeterminate && !!context.ancestorInChecked)
      }
      let values = getCheckedValues(
        { value, children, checked: itemChecked, partialChecked },
        strategy,
        childrenCheckedValues
      )
      return { checked: itemChecked, partialChecked, values }
    }
  }
  return walk([{ [childrenKey]: datasource }], walker, childrenKey)[0].values
}

function batch (prevChecked, itemsToBatch, datasource, options) {
  itemsToBatch = filter(
    itemsToBatch,
    ({ hidden, disabled }) => !hidden && !disabled
  )
  let newChecked = itemsToBatch.reduce((prevChecked, item) => {
    return _toggleItem(prevChecked, item, [], options)
  }, prevChecked)

  // 重新生成一份符合当前 strategy 的 checked
  return getNormalizedCheckedValues(datasource, newChecked, options)
}

/**
 * 选中/取消一个 item 后得到 checked 数据（一般就是 emit 出去的 checked prop）
 * @param {Array} prevChecked 之前选中的数据
 * @param {object} item 当前被操作的项目
 * @param {Array} parents 祖先链，从最高的开始
 * @param {string} option.strategy 选中值合并策略
 * @param {string} option.operation toggle/check/uncheck/clear
 *   操作：check（选中参数中的item），uncheck（取消参数中的item），clear清空非disabled，默认是toggle
 * @param {string} option.childrenKey 子项的字段名
 */
function _toggleItem (
  prevChecked,
  item,
  parents,
  { strategy, operation, childrenKey }
) {
  let checked
  let isGroup = hasChildren(item, childrenKey)
  prevChecked = prevChecked || []
  let clear = operation === 'clear'
  operation = clear ? 'uncheck' : operation

  if (isGroup) {
    // 先尝试全部取消（如果有可能取消的叶子节点的话）-> 否则再尝试全部选中
    let leaves
    if (!operation || isUncheck(operation)) {
      leaves = clear
        ? getEnabledLeavesFrom(item, childrenKey)
        : getEnabledCheckedLeavesFrom(item, childrenKey)
      if (!operation && leaves.length) {
        operation = 'uncheck'
      }
    }

    if (!operation || !isUncheck(operation)) {
      leaves = getEnabledUncheckedLeavesFrom(item, childrenKey)
      operation = 'check'
    }
    checked = isUncheck(operation)
      ? uncheckGroup(prevChecked, item, parents, {
        strategy,
        leaves,
        childrenKey
      })
      : checkGroup(prevChecked, leaves)
  } else {
    operation = operation || (item.checked ? 'uncheck' : 'check')
    checked = isUncheck(operation)
      ? uncheckLeaf(prevChecked, item, parents, { strategy, childrenKey })
      : checkLeaf(prevChecked, item)
  }
  return checked
}

function checkLeaf (prevChecked, item) {
  return [...prevChecked, item.value]
}

function uncheckLeaf (prevChecked, item, parents, { strategy, childrenKey }) {
  let includeIndeterminate = strategy === INDETERMINATE
  let parentValues = parents.map(i => i.value).filter(val => val != null)
  let willUncheck = [item.value, ...parentValues] // 可能多删掉中间态的 parent，会在后面的 getNormalizedCheckedValues 中重新推导出来
  let mostTopAncestor = find(parents, ({ value }) =>
    includes(prevChecked, value)
  )
  let realChecked = !includeIndeterminate
    ? [
      ...prevChecked,
      ...(mostTopAncestor ? getLeaves(mostTopAncestor, childrenKey) : [])
    ]
    : prevChecked
  return realChecked.filter(i => !includes(willUncheck, i))
}

function checkGroup (prevChecked, leaves) {
  return [...prevChecked, ...leaves]
}

function uncheckGroup (
  prevChecked,
  item,
  parents,
  { strategy, leaves, childrenKey }
) {
  let includeIndeterminate = strategy === INDETERMINATE
  let parentValues = parents.map(i => i.value).filter(val => val != null)
  let willUncheck = [
    ...leaves,
    ...getGroupDescendants(item, childrenKey),
    ...(item.value != null ? [item.value] : []),
    ...parentValues // 可能多删掉中间态的 parent，会在后面的 getNormalizedCheckedValues 中重新推导出来
  ]

  // replaceCheckedGroupWithLeaves 的原因：
  // 上面会把 item 祖先和后代中是 group 的都删掉了，会导致两个问题：
  //  1. 删除祖先可能在 branch 策略下把所有的都删除了
  //  2. 删除 group 后代了，但是该 group 下可能有 disabled 叶子，在 branch 策略也会导致多删除
  // 所以，需要将所有 group 删掉，但是补上等价的叶子节点，
  // 同时希望最大程度兼容数据缺失但逻辑完整的情况，所以在 all/leaf/branch 策略下 都做了这个补齐
  // 数据缺失但逻辑完整的情况：
  //   在 all/leaf/branch 策略下，父或子节点只要一方数据完整，另一方数据可以推导出来，所以逻辑是完整的
  let realChecked = !includeIndeterminate
    ? [
      ...prevChecked,
      ...replaceCheckedGroupWithLeaves(
        prevChecked,
        parents,
        item,
        childrenKey
      )
    ]
    : prevChecked

  return realChecked.filter(i => !includes(willUncheck, i))
}

function replaceCheckedGroupWithLeaves (
  prevChecked,
  parents,
  self,
  childrenKey
) {
  let mostTopAncestor = find(parents, p => inChecked(prevChecked, p))
  // 祖先有选中的，那么直接替换最高祖先
  if (mostTopAncestor) {
    return getLeaves(mostTopAncestor, childrenKey)
  }

  // 自身是选中，直接替换自身
  if (inChecked(prevChecked, self)) {
    return getLeaves(self, childrenKey)
  }

  // 遍历替换后代选中的 group 节点
  let result = []
  walk(self, item => {
    if (hasChildren(item, childrenKey) && inChecked(prevChecked, item)) {
      result.push(...getLeaves(item, childrenKey))
      // 该节点以下已经替换过了
      return false
    }
  })
  return result
}

function getLeavesByContext (item, initialContext, childrenKey) {
  let result = []
  walk(
    item,
    (child, context) => {
      // 1. 只要 checked 叶子，disabled 或 disabled 父下的不要
      // 2. hidden条件：不是 true 的叶子，或者 leafAncestor 下的叶子
      let { disabled, value } = child
      if (hasChildren(child, childrenKey)) {
        if (context.hidden != null && isLeafAncestor(child, childrenKey)) {
          context = { ...context, hidden: null }
        }
        return disabled ? false : context
      }
      if (
        !disabled &&
        hasEqualField(child, context, 'checked') &&
        hasEqualField(child, context, 'hidden')
      ) {
        result.push(value)
      }
    },
    childrenKey,
    initialContext
  )
  return result
}

// under: 自身不会包含, from 自身如果是叶子会包含在结果中

// 获取已选中的叶子，如果能获取到，那么可以做取消操作
function getEnabledCheckedLeavesFrom (item, childrenKey) {
  return getLeavesByContext(
    [item],
    { checked: true, hidden: false },
    childrenKey
  )
}

// 获取未选中的叶子，如果能获取到，那么可以做选中操作
function getEnabledUncheckedLeavesFrom (item, childrenKey) {
  return getLeavesByContext(
    [item],
    { checked: false, hidden: false },
    childrenKey
  )
}

function getEnabledLeavesFrom (item, childrenKey) {
  return getLeavesByContext(
    [item],
    { checked: null, hidden: null },
    childrenKey
  )
}

function markAncestorInChecked (item, checked, context, childrenKey) {
  if (hasChildren(item, childrenKey)) {
    let isChecked = inChecked(checked, item)
    if (isChecked && !context.ancestorInChecked) {
      context.ancestorInChecked = true
    }
    return context
  }
}

function isUncheck (operation) {
  return operation === 'uncheck'
}

function isLeafAncestor (item, childrenKey) {
  return (
    !item.hidden &&
    hasChildren(item, childrenKey) &&
    item[childrenKey].every(i => !!i.hidden)
  )
}

function hasEqualField (item, context, field) {
  return context[field] == null || context[field] === Boolean(item[field])
}

function inChecked (checked, item) {
  return item.value != null && includes(checked, item.value)
}
