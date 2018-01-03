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
   * 迭代本节点的直接子节点
   *
   * @public
   * @param {Function} callback 迭代回调函数，如果返回真值，就会终止迭代
   */
  iterateChildren (callback) {
    for (let i = 0, il = this.childrenGroup.length; i < il; i++) {
      const group = this.childrenGroup[i]
      for (let j = 0, jl = group.children.length; j < jl; j++) {
        const child = group.children[j]
        if (callback(child, j, group)) {
          return child
        }
      }
    }
  }

  /**
   * 根据 priority 追加子节点。
   *
   * @public
   * @param {Node} child 待追加的子节点
   * @param {number} priority 优先级顺序值，越大，相应的子节点就分配在越靠后的 children group 中。
   */
  appendChild (child, priority = 1) {
    let index = null
    let isInserted = false
    find(this.childrenGroup, (group, i) => {
      if (group.priority === priority) {
        group.children.push(child)
        isInserted = true
        return true
      }

      if (group.priority > priority) {
        index = i
        return true
      }
    })

    if (!isInserted) {
      if (index === null) {
        this.childrenGroup.push({
          children: [child],
          priority
        })
      } else {
        this.childrenGroup.splice(index, 0, {
          children: [child],
          priority
        })
      }
    }

    child.parent = this
  }

  /**
   * 根据节点 id 从当前节点的子级中移除节点
   *
   * @private
   * @param {string} id 节点 id
   */
  removeChildById (id) {
    for (let i = 0, il = this.childrenGroup.length; i < il; i++) {
      const group = this.childrenGroup[i]
      remove(group.children, child => {
        if (child.id === id) {
          child.parent = null
          return true
        }
      })
    }
  }

  /**
   * 从父级节点移除当前节点
   *
   * @public
   */
  remove () {
    if (!this.parent) {
      return
    }

    this.parent.removeChildById(this.id)
  }

  /**
   * 获取当前节点的直接子节点数量
   *
   * @public
   */
  getChildrenCount () {
    let counter = 0
    this.childrenGroup.forEach((group) => {
      counter += group.children.length
    })
    return counter
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
    const result = callback(curNode)
    if (result) {
      return result
    }

    return curNode.iterateChildren(child => this.iterate({ curNode: child, callback }))
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

    this.generateTreeZIndex(node.id)
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
    node.zIndex = this.baseZIndex

    const nodeId = node.id
    const instance = new Vue({
      data () {
        return {
          id: nodeId
        }
      },
      methods: {
        remove: () => {
          node.remove()
          this.nodeMap[nodeId] = null
        },
        appendTo: (parentId, priority) => {
          this.nodeMap[node.id] = { node, instance }
          this.moveNode(node, parentId, priority)
        },
        toTop: () => {
          let targetGroup
          let targetIndex
          node.parent.iterateChildren((child, index, group) => {
            if (child === node) {
              targetGroup = group
              targetIndex = index
              return true
            }
          })

          const children = targetGroup.children
          children.push(...children.splice(targetIndex, 1))
          this.generateTreeZIndex(node.id)
        }
      }
    })
    this.nodeMap[nodeId] = { node, instance }
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
    this.nodeMap[realParentId].node.appendChild(node, priority)

    this.generateTreeZIndex(node.id)
  }

  /**
   * 从指定节点开始，刷一遍 zIndex 值
   *
   * @private
   * @param {string} startNodeId 指定节点 id
   */
  generateTreeZIndex (startNodeId) {
    const node = this.nodeMap[startNodeId].node
    const parentNode = node.parent

    let prevNode = parentNode
    let isEncountered = false
    let baseZIndex
    parentNode.iterateChildren((child) => {
      if (!isEncountered && child === node) {
        isEncountered = true
        baseZIndex = (prevNode && prevNode.zIndex
          ? (prevNode.zIndex + 1) : null) || this.baseZIndex
      }

      if (isEncountered) {
        this.iterate({
          curNode: child,
          callback: (curNode) => {
            const instance = this.nodeMap[curNode.id].instance
            curNode.zIndex = baseZIndex++
            instance.$emit('zindexchange', curNode.zIndex)
          }
        })
      }

      if (!isEncountered) {
        prevNode = child
      }
    })
  }
}

export default new Tree()
