import { remove, uniqueId, find } from 'lodash'
import Vue from 'vue'

class Node {
  parent = null

  /**
   * 数据结构：
   *
   * [
   *   {
   *     children: [Node1, Node2, ...],
   *     priority: 1
   *   }
   * ]
   *
   * @memberof Node
   */
  childrenGroup = []
  id = null
  zIndex = null

  constructor () {
    this.id = uniqueId('overlay-node-id-')
  }

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
  }

  removeChildById (id) {
    for (let i = 0, il = this.childrenGroup.length; i < il; i++) {
      const group = this.childrenGroup[i]
      remove(group.children, child => child.id === id)
    }
  }

  remove () {
    if (!this.parent) {
      return
    }

    this.parent.removeChildById(this.id)
    this.parent = null
  }

  getChildrenCount () {
    let counter = 0
    this.childrenGroup.forEach((group) => {
      counter += group.children.length
    })
    return counter
  }
}

export class Tree {
  rootNode = new Node()
  nodeMap = {
    [this.rootNode.id]: {
      node: this.rootNode,
      instance: null
    }
  }

  baseZIndex = 100

  setBaseZIndex (zIndex) {
    this.baseZIndex = zIndex
  }

  iterate ({ curNode = this.rootNode, callback } = {}) {
    const result = callback(curNode)
    if (result) {
      return result
    }

    return curNode.iterateChildren(child => this.iterate({ curNode: child, callback }))
  }

  insertNode (parentId, node, priority) {
    const parent = this.nodeMap[parentId]
    if (!parent) {
      return
    }

    const parentNode = parent.node
    parentNode.appendChild(node, priority)
    node.parent = parentNode

    this.generateTreeZIndex(node.id)
  }

  createNode ({ parentId = this.rootNode.id, priority }) {
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

  moveNode (node, parentId, priority) {
    const realParentId = parentId || this.rootNode.id
    const parentNode = this.nodeMap[realParentId].node
    const curParentNode = node.parent
    if (parentNode === curParentNode) {
      return
    }

    node.remove()
    node.parent = parentNode
    this.nodeMap[realParentId].node.appendChild(node, priority)

    this.generateTreeZIndex(node.id)
  }

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
