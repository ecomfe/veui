import { remove, uniqueId, last, findLast, find } from 'lodash'
import Vue from 'vue'

/**
 * 节点，每一个节点会拥有自己的 zIndex 值
 */
class Node {
  /**
   * 父节点
   *
   * @public
   * @type Node
   */
  parent = null

  /**
   * 在前序遍历中的前一个节点
   *
   * @public
   * @type Node
   */
  previousNode = null;

  /**
   * 在前序遍历中的后一个节点
   *
   * @public
   * @type Node
   */
  nextNode = null;

  /**
   * 子节点按照 priority 的分组，结构示例：
   * [
   *   {
   *     priority: 1,
   *     children: [node1, node2, ...]
   *   },
   *   {
   *     priority: 2,
   *     children: [node3, node4, ...]
   *   }
   * ]
   *
   * @private
   * @type Array
   */
  childrenGroup = []

  /**
   * 节点的唯一标识
   *
   * @public
   * @readonly
   * @type string
   */
  id = null

  /**
   * zIndex 值
   *
   * @public
   * @type number
   */
  zIndex = null

  constructor () {
    this.id = uniqueId('overlay-node-id-')
  }

  /**
   * 找到第一个 children 不为空的分组
   *
   * @public
   * @param {boolean} [fromLast] 是否倒着找
   * @param {number} [fromGroupIndex] 从指定索引处开始找
   * @return {Object}
   */
  findFirstNotEmptyGroup (
    fromLast = false,
    fromGroupIndex = fromLast ? this.childrenGroup.length - 1 : 0
  ) {
    let callback = group => {
      if (group.children.length) {
        return true
      }
    }
    return fromLast
      ? findLast(this.childrenGroup, callback, fromGroupIndex)
      : find(this.childrenGroup, callback, fromGroupIndex)
  }

  /**
   * 所有 children 的头部
   *
   * @public
   * @type {Node}
   */
  get head () {
    let group = this.findFirstNotEmptyGroup()
    return group && group.children[0]
  }

  /**
   * 所有 children 的尾部
   *
   * @public
   * @type {Node}
   */
  get tail () {
    let group = this.findFirstNotEmptyGroup(true)
    return group && last(group.children)
  }

  /**
   * 根据 priority 追加子节点。
   *
   * @public
   * @param {Node} child 待追加的子节点
   * @param {number} priority 优先级顺序值，越大，相应的子节点就分配在越靠后的 children group 中。
   * @return {Object} 新插入位置的索引信息
   */
  appendChild (child, priority = 1) {
    let groupIndex = -1
    let isInserted = false
    let childIndex = 0
    find(this.childrenGroup, (group, i) => {
      if (group.priority === priority) {
        group.children.push(child)
        isInserted = true
        childIndex = group.children.length - 1
        groupIndex = i
        return true
      }

      if (group.priority > priority) {
        groupIndex = i
        return true
      }
    })

    if (!isInserted) {
      if (groupIndex === -1) {
        this.childrenGroup.push({
          children: [child],
          priority
        })
        groupIndex = this.childrenGroup.length - 1
      } else {
        this.childrenGroup.splice(groupIndex, 0, {
          children: [child],
          priority
        })
      }
    }

    child.parent = this

    return { groupIndex, childIndex }
  }

  /**
   * 根据节点 id 从当前节点的子级中移除节点
   *
   * @private
   * @param {string} id 节点 id
   * @return {Object} 被移除的节点的索引信息
   */
  removeChildById (id) {
    let groupIndex
    let childIndex

    for (let i = 0, il = this.childrenGroup.length; i < il; i++) {
      let group = this.childrenGroup[i]

      let removedNodes = remove(group.children, (child, index) => {
        if (child.id === id) {
          child.parent = null
          child.previousNode = null

          groupIndex = i
          childIndex = index

          return true
        }
      })

      if (removedNodes.length === 1) {
        break
      }
    }

    return {
      groupIndex,
      childIndex
    }
  }

  /**
   * 从父级节点移除当前节点
   *
   * @public
   * @return {Object} 索引信息
   */
  remove () {
    if (!this.parent) {
      return
    }

    return this.parent.removeChildById(this.id)
  }

  /**
   * 获取当前节点的直接子节点数量
   *
   * @public
   */
  getChildrenCount () {
    return this.childrenGroup.reduce((count, group) => {
      return count + group.children.length
    }, 0)
  }

  /**
   * 获取指定 child 节点的索引信息
   *
   * @param {string} targetChildId child id
   * @return {Object}
   */
  getChildIndex (targetChildId) {
    for (let i = 0, il = this.childrenGroup.length; i < il; i++) {
      let group = this.childrenGroup[i]
      for (let j = 0, jl = group.children.length; j < jl; j++) {
        let child = group.children[j]
        if (child.id === targetChildId) {
          return { groupIndex: i, childIndex: j }
        }
      }
    }
  }
}

/**
 * 用于计算 zIndex 的树
 */
export class Tree {
  /**
   * 数据结构：
   *
   * rootNode: {
   *   parent: null,
   *   previousNode: null,
   *   childrenGroup: [
   *     {
   *        priority: 1,
   *        children: [...]
   *     }
   *   ],
   *   id: 'overlay-node-id-1',
   *   zIndex: 200
   * }
   *
   * @type Node
   */
  rootNode = new Node()

  /**
   * 节点 id 到节点实例和节点句柄的映射，主要方便根据节点 id 获取到节点的详细内容。
   *
   * @private
   * @type Object
   */
  nodeMap = {
    [this.rootNode.id]: {
      node: this.rootNode,
      instance: null
    }
  }

  /**
   * 基准 zIndex
   *
   * @private
   * @type number
   */
  baseZIndex = 100

  /**
   * 设置基准 zIndex
   *
   * @public
   * @param {number} zIndex 基准 zIndex
   */
  setBaseZIndex (zIndex) {
    this.baseZIndex = zIndex
  }

  /**
   * 从指定节点开始按顺序迭代树中的节点，如果迭代回调函数返回真值，就会终止迭代。
   *
   * @private
   * @param {Node} curNode 起始节点
   * @param {Function} callback 迭代回调
   */
  iterate ({ curNode = this.rootNode, callback } = {}) {
    let cur = curNode
    do {
      if (callback(cur)) {
        break
      }
      cur = cur.nextNode
    } while (cur)
  }

  /**
   * 修复指定节点的 previousNode 和 nextNode 信息
   *
   * @private
   * @param {Node} [node] 待修复的节点
   * @param {number} [groupIndex] 待修复节点所在的分组，在父节点的 childrenGroup 中的索引位置
   * @param {number} [childIndex] 待修复节点在自身分组中的索引位置
   * @param {number} [fixDirection] 修复方向，1 -> 只修复 previous ，2 -> 只修复 next ，3 -> 都修复
   */
  fixLink ({ node, groupIndex, childIndex, fixDirection = 3 } = {}) {
    if (fixDirection === 1 || fixDirection === 3) {
      let previousNode = this.findPreviousNode(node, groupIndex, childIndex)
      previousNode.nextNode = node
      node.previousNode = previousNode
    }

    if (fixDirection === 2 || fixDirection === 3) {
      let nextNode = this.findNextNode(node, groupIndex, childIndex)
      if (nextNode) {
        nextNode.previousNode = node
      }
      node.nextNode = nextNode
    }
  }

  /**
   * 包裹一层 Node#appendChild 方法，加上了修复前后节点的功能。
   *
   * @private
   * @param {Node} [parentNode] 父节点
   * @param {Node} [node] 待插入节点
   * @param {number} [priority] priority
   * @return {Object} 插入节点的索引信息
   */
  appendChild (parentNode, node, priority) {
    let { groupIndex, childIndex } = parentNode.appendChild(node, priority)
    this.fixLink({ node, groupIndex, childIndex })

    let tail = node.tail
    if (tail) {
      this.fixLink({
        node: tail,
        groupIndex: node.childrenGroup.length - 1,
        childIndex: last(node.childrenGroup).children.length - 1,
        fixDirection: 2
      })
    }

    return { groupIndex, childIndex }
  }

  /**
   * 包一层 Node#remove ，提供清除前后节点信息的功能
   *
   * @private
   * @param {Node} [node] 待移除节点
   * @return {Object} 索引信息
   */
  remove (node) {
    let previousBrokenNode = node.previousNode
    let nextBrokenNode = node.nextNode

    let { groupIndex, childIndex } = node.remove()

    if (previousBrokenNode) {
      this.fixLink({ node: previousBrokenNode, fixDirection: 2 })
    }
    if (nextBrokenNode) {
      this.fixLink({ node: nextBrokenNode, fixDirection: 1 })
    }

    return { groupIndex, childIndex }
  }

  /**
   * 在指定父级节点中插入子节点
   *
   * @private
   * @param {string} parentId 父节点 id
   * @param {Node} node 待插入子节点
   * @param {number} priority 优先级顺序值
   * @return {Object} “句柄”
   */
  insertNode (parentId, node, priority) {
    let parent = this.nodeMap[parentId]
    if (!parent) {
      return
    }

    let parentNode = parent.node
    this.appendChild(parentNode, node, priority)

    this.generateTreeZIndex(node)
  }

  /**
   * 创建一个节点，并将其插入到树中
   *
   * @public
   * @param {string} parentId 父节点 id
   * @param {number} priority 优先级顺序值
   */
  createNode ({ parentId = this.rootNode.id, priority } = {}) {
    let node = new Node()

    let id = node.id
    let instance = new Vue({
      data () {
        return {
          id
        }
      },
      methods: {
        remove: () => {
          node.remove()
          this.nodeMap[id] = null
        },
        appendTo: (parentId, priority) => {
          this.nodeMap[node.id] = { node, instance }
          this.moveNode(node, parentId, priority)
        },
        toTop: () => {
          let { groupIndex } = node.parent.getChildIndex(node.id)
          let targetGroup = node.parent.childrenGroup[groupIndex]
          let priority = targetGroup.priority
          let parentNode = node.parent

          let previousNode = node.previousNode
          this.remove(node)
          this.appendChild(parentNode, node, priority)

          this.generateTreeZIndex(previousNode)
        }
      }
    })
    this.nodeMap[id] = { node, instance }
    this.insertNode(parentId, node, priority)
    Vue.nextTick(() => {
      instance.$emit('zindexchange', node.zIndex)
    })

    return instance
  }

  /**
   * 将节点移动到树中 `指定父节点下` 的 `指定优先级分组下` 的 children 中的最后一个位置
   *
   * @private
   * @param {Node} node 待移动的节点
   * @param {string} parentId 父节点 id
   * @param {number} priority 优先级顺序值
   */
  moveNode (node, parentId, priority) {
    let realParentId = parentId || this.rootNode.id
    let parentNode = this.nodeMap[realParentId].node
    let curParentNode = node.parent
    if (parentNode === curParentNode) {
      return
    }

    this.remove(node)
    this.appendChild(parentNode, node, priority)

    // 这里不知道是往前移动了，还是往后移动了，不好做判断，干脆整个跑一遍生成 zindex
    this.generateTreeZIndex(this.rootNode)
  }

  /**
   * normalize 一下 index 信息
   *
   * @private
   * @param {Node} node
   * @param {number=} groupIndex
   * @param {number=} childIndex
   * @return {Object}
   */
  normalizeIndex (node, groupIndex, childIndex) {
    if (groupIndex === undefined) {
      ({ groupIndex, childIndex } = node.parent.getChildIndex(node.id))
    }

    let children = node.parent.childrenGroup[groupIndex].children
    if (childIndex === undefined) {
      childIndex = children.indexOf(node)
    }

    return { groupIndex, childIndex }
  }

  /**
   * 找到指定节点的前一个节点
   *
   * @private
   * @param {Node} [node] 当前节点
   * @param {number=} [groupIndex] 当前节点的分组索引
   * @param {number=} [childIndex] 当前节点在分组中的位置
   * @return {Node}
   */
  findPreviousNode (node, groupIndex, childIndex = -1) {
    if (node === this.rootNode) {
      return
    }

    ({ groupIndex, childIndex } = this.normalizeIndex(node, groupIndex, childIndex))

    let targetNode
    if (childIndex > 0) {
      let previousSibling = node.parent.childrenGroup[groupIndex].children[childIndex - 1]
      let curTail = previousSibling
      do {
        targetNode = curTail
        curTail = curTail.tail
      } while (curTail)

      return targetNode
    }

    // 到前面的分组看看
    if (groupIndex > 0) {
      findLast(node.parent.childrenGroup.slice(0, groupIndex), (group) => {
        if (group.children.length) {
          targetNode = last(group.children)
          return true
        }
      })
    }

    return targetNode || node.parent
  }

  /**
   * 找到指定节点的下一个节点
   *
   * @private
   * @param {Node} [node] 当前节点
   * @param {number=} [groupIndex] 当前节点的分组索引
   * @param {number=} [childIndex] 当前节点在分组中的位置
   * @return {Node}
   */
  findNextNode (node, groupIndex, childIndex) {
    let head = node.head
    if (head) {
      return head
    }

    ({ groupIndex, childIndex } = this.normalizeIndex(node, groupIndex, childIndex))

    let children = node.parent.childrenGroup[groupIndex].children
    if (childIndex < children.length - 1) {
      return children[childIndex + 1]
    }

    let cur = node
    while (cur.parent) {
      let { groupIndex, childIndex } = cur.parent.getChildIndex(cur.id)
      let loopChildren = cur.parent.childrenGroup[groupIndex].children
      if (childIndex < loopChildren.length - 1) {
        return loopChildren[childIndex + 1]
      }

      let group = cur.parent.findFirstNotEmptyGroup(false, groupIndex + 1)
      if (group && group.children.length) {
        return group.children[0]
      }

      cur = cur.parent
    }

    return null
  }

  /**
   * 从指定节点开始，刷一遍 zIndex 值
   *
   * @param {Node} node 当前指定的节点
   * @private
   */
  generateTreeZIndex (node) {
    let previousNode = node ? this.findPreviousNode(node) : this.rootNode
    let baseZIndex = previousNode && previousNode.zIndex ? (previousNode.zIndex + 1) : this.baseZIndex

    this.iterate({
      curNode: node,
      callback: cur => {
        if (cur === this.rootNode) {
          return
        }

        let instance = this.nodeMap[cur.id].instance
        let zIndex = baseZIndex++
        let isEqual = cur.zIndex === zIndex
        cur.zIndex = zIndex

        if (!isEqual) {
          instance.$emit('zindexchange', cur.zIndex)
        }
      }
    })
  }
}

export default new Tree()
