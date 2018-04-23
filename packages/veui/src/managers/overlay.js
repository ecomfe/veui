import { remove, uniqueId, find } from 'lodash'
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
   * 前一个节点
   *
   * @public
   * @type Node
   */
  previousSibling = null;

  /**
   * 后一个节点
   *
   * @public
   * @type Node
   */
  nextSibling = null;

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
   * 所有 children 的头部
   *
   * @public
   * @type {Node}
   */
  get head () {
    for (let i = 0, il = this.childrenGroup.length; i < il; i++) {
      const group = this.childrenGroup[i]
      if (group.children.length) {
        return group.children[0]
      }
    }
  }

  /**
   * 所有 children 的尾部
   *
   * @public
   * @type {Node}
   */
  get tail () {
    for (let i = this.childrenGroup.length - 1; i >= 0; i--) {
      const group = this.childrenGroup[i]
      if (group.children.length) {
        return group.children[group.children.length - 1]
      }
    }
  }

  /**
   * 修复 child 节点的“前”兄弟节点信息
   *
   * @private
   * @param {Node} child child
   * @param {number} groupIndex 分组索引
   * @param {=Array} children 分组下所有的 children
   */
  connectToPreviousSibling (child, groupIndex, children) {
    let previousSibling
    if (children && children.length > 1) {
      previousSibling = children[children.length - 2]
    } else if (groupIndex > 0) {
      for (let j = groupIndex - 1; j >= 0; j--) {
        const children = this.childrenGroup[j].children
        if (children.length) {
          previousSibling = children[children.length - 1]
          break
        }
      }
    }

    child.previousSibling = previousSibling
    if (previousSibling) {
      previousSibling.nextSibling = child
    }
  }

  /**
   * 修复 child 节点的“后”兄弟节点信息
   *
   * @param {Node} child child
   * @param {number} groupIndex 分组索引
   */
  connectToNextSibling (child, groupIndex) {
    let nextSibling
    for (let j = groupIndex + 1; j < this.childrenGroup.length; j++) {
      const children = this.childrenGroup[j].children
      if (children.length) {
        nextSibling = children[0]
        break
      }
    }

    child.nextSibling = nextSibling
    if (nextSibling) {
      nextSibling.previousSibling = child
    }
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
        this.connectToPreviousSibling(child, i, group.children)
        this.connectToNextSibling(child, i)
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
        this.connectToPreviousSibling(child, this.childrenGroup.length - 1)
        groupIndex = 0
      } else {
        this.childrenGroup.splice(groupIndex, 0, {
          children: [child],
          priority
        })
        this.connectToNextSibling(child, groupIndex)
        this.connectToPreviousSibling(child, groupIndex)
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
    let previousBrokenNode
    let nextBrokenNode
    let groupIndex
    let childIndex

    for (let i = 0, il = this.childrenGroup.length; i < il; i++) {
      const group = this.childrenGroup[i]

      const removedNodes = remove(group.children, (child, index) => {
        if (child.id === id) {
          child.parent = null
          child.previousSibling = null
          child.nextSibling = null

          // 找到上一个被破坏掉 nextSibling 的节点
          if (index > 0) {
            previousBrokenNode = group.children[index - 1]
          } else {
            for (let j = i - 1; j >= 0; j++) {
              const children = this.childrenGroup[j]
              if (children.length) {
                previousBrokenNode = children[children.length - 1]
                break
              }
            }
          }

          // 找到下一个被破坏掉 previousSibling 的节点
          if (index < group.children.length - 1) {
            nextBrokenNode = group.children[index + 1]
          } else {
            for (let j = i + 1; j < this.childrenGroup.length; j++) {
              const children = this.childrenGroup[j]
              if (children.length) {
                nextBrokenNode = children[0]
                break
              }
            }
          }

          groupIndex = i
          childIndex = index

          return true
        }
      })

      if (removedNodes.length === 1) {
        break
      }
    }

    if (previousBrokenNode) {
      this.connectToNextSibling(previousBrokenNode, groupIndex)
    }

    if (nextBrokenNode) {
      this.connectToPreviousSibling(nextBrokenNode, groupIndex)
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
   * 获取指定 child 节点所在的分组
   *
   * @param {string} targetChildId child id
   * @return {Object}
   */
  getChildGroup (targetChildId) {
    for (let i = 0, il = this.childrenGroup.length; i < il; i++) {
      const group = this.childrenGroup[i]
      for (let j = 0, jl = group.children.length; j < jl; j++) {
        const child = group.children[j]
        if (child.id === targetChildId) {
          return group
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
   *   nextSibling: null,
   *   previousSibling: null,
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
    for (let cur = curNode; cur; cur = cur.nextSibling) {
      if (callback(cur) || cur.head && this.iterate({ curNode: cur.head, callback })) {
        return true
      }
    }
  }

  /**
   * 在指定父级节点中插入子节点
   *
   * @private
   * @param {string} parentId 父节点 id
   * @param {Node} node 待插入子节点
   * @param {number} priority 优先级顺序值
   */
  insertNode (parentId, node, priority) {
    const parent = this.nodeMap[parentId]
    if (!parent) {
      return
    }

    const parentNode = parent.node
    parentNode.appendChild(node, priority)

    this.generateTreeZIndex(node)
  }

  /**
   * 创建一个节点，并将其插入到树种
   *
   * @public
   * @param {string} parentId 父节点 id
   * @param {number} priority 优先级顺序值
   */
  createNode ({ parentId = this.rootNode.id, priority } = {}) {
    const node = new Node()

    const id = node.id
    const instance = new Vue({
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
          const targetGroup = node.parent.getChildGroup(node.id)
          const priority = targetGroup.priority
          const parentNode = node.parent

          const previousNode = this.findPreviousNode(node)
          node.remove()
          parentNode.appendChild(node, priority)

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
    const realParentId = parentId || this.rootNode.id
    const parentNode = this.nodeMap[realParentId].node
    const curParentNode = node.parent
    if (parentNode === curParentNode) {
      return
    }

    node.remove()
    parentNode.appendChild(node, priority)

    // 这里不知道是往前移动了，还是往后移动了，不好做判断，干脆整个跑一遍生成 zindex
    this.generateTreeZIndex(this.rootNode)
  }

  findPreviousNode (node) {
    if (node.previousSibling) {
      // 找到左兄弟节点的最右侧最深的叶子节点
      let cur = node.previousSibling
      let target
      do {
        target = cur
        cur = cur.tail
      } while (cur)
      return target || node.previousSibling
    }

    // 左侧没有兄弟节点了，那么父节点就是遍历时候的上一个节点
    return node.parent
  }

  /**
   * 从指定节点开始，刷一遍 zIndex 值
   *
   * @param {Node} node 当前指定的节点
   * @private
   */
  generateTreeZIndex (node) {
    const previousNode = node ? this.findPreviousNode(node) : this.rootNode
    let baseZIndex = previousNode && previousNode.zIndex ? (previousNode.zIndex + 1) : this.baseZIndex

    this.iterate({
      curNode: node,
      callback: cur => {
        if (cur === this.rootNode) {
          return
        }

        const instance = this.nodeMap[cur.id].instance
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
