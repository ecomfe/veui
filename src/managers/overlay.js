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

  setZIndex (v) {
    this.zIndex = v
  }

  getZIndex () {
    return this.zIndex
  }

  getId () {
    return this.id
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

  setParent (parent) {
    if (parent && ('instance' in parent)) {
      debugger
    }
    this.parent = parent
  }

  getParent () {
    return this.parent
  }

  pushChild (child, priority = 1) {
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
    for (let i = 0, il = this.childrenGroup; i < il; i++) {
      const group = this.childrenGroup[i]
      remove(group.children, child => child.id === id)
    }
  }

  remove () {
    if (!this.parent) {
      return
    }

    this.parent.removeChildById(this.getId())
    this.setParent(null)
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
    [this.rootNode.getId()]: {
      node: this.rootNode,
      instance: null
    }
  }

  baseZIndex = 100

  constructor () {
    window.rootNode = this.rootNode
    window.nodeMap = this.nodeMap
  }

  setBaseZIndex (zIndex) {
    this.baseZIndex = zIndex
  }

  iterate ({ curNode = this.rootNode, callback } = {}) {
    const result = callback(curNode)
    if (result) {
      return result
    }

    return curNode.iterateChildren(child => this.iterate({ curNode: child }))
  }

  insertNode (parentId, node, priority) {
    const parent = this.nodeMap[parentId]
    if (!parent) {
      return
    }

    const parentNode = parent.node
    parentNode.pushChild(node, priority)
    node.setParent(parentNode)
  }

  createNode ({ parentId = this.rootNode.getId(), priority }) {
    const node = new Node()
    node.setZIndex(this.baseZIndex)
    this.insertNode(parentId, node, priority)

    const nodeId = node.getId()
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
        move: (parentId, priority) => {
          this.moveNode(node, parentId, priority)
        },
        toTop: () => {
          let targetGroup
          let targetIndex
          node.getParent().iterateChildren((child, index, group) => {
            if (child === node) {
              targetGroup = group
              targetIndex = index
              return true
            }
          })

          const children = targetGroup.children
          const lastIndex = children.length - 1
          children[targetIndex] = children[lastIndex]
          children[lastIndex] = node

          const baseZIndexNode = children[lastIndex - 1]
          const baseZIndex = baseZIndexNode && baseZIndexNode.getZIndex()
            ? (baseZIndexNode.getZIndex() + 1) : null
          this.generateTreeZIndex(node.getId(), baseZIndex)
        }
      }
    })
    this.nodeMap[nodeId] = { node, instance }
    Vue.nextTick(() => {
      instance.$emit('zindexchange', node.getZIndex())
    })

    return instance
  }

  moveNode (node, parentId, priority) {
    const realParentId = parentId || this.rootNode.getId()
    const parentNode = this.nodeMap[realParentId].node
    const curParentNode = node.getParent()
    if (parentNode === curParentNode) {
      return
    }

    node.remove()
    node.setParent(parentNode)
    this.nodeMap[realParentId].node.pushChild(node, priority)
  }

  generateTreeZIndex (startNodeId, baseZIndex) {
    const startNode = this.nodeMap[startNodeId].node
    let localBaseZIndex = baseZIndex || this.baseZIndex
    console.log(startNodeId, baseZIndex)
    this.iterate({
      curNode: startNode,
      callback: (curNode) => {
        const instance = this.nodeMap[curNode.getId()].instance
        curNode.setZIndex(localBaseZIndex++)
        instance.$emit('zindexchange', curNode.getZIndex())
      }
    })
  }
}

export default new Tree()
