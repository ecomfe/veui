import { uniqueId, remove as lodashRemove } from 'lodash'
import Vue from 'vue'

const tree = []
const treeNodeIndex = {}
let baseZIndex = 100

class TreeNode {
  children = [];
  isTopMost = false;

  constructor ({ id, parentId, isTopMost }) {
    this.id = id
    this.parentId = parentId
  }
}

function iterateTree (tree, iteratee) {
  for (let i = 0, il = tree.length; i < il; ++i) {
    let treeNode = tree[i]

    if (iteratee(treeNode)) {
      return true
    }

    if (iterateTree(treeNode.children, iteratee)) {
      return true
    }
  }
  return false
}

function genUid () {
  return uniqueId('layer-')
}

function addToList (list, treeNode) {
  if (treeNode.isTopMost) {
    list.push(treeNode)
  } else {
    let firstTopMostIndex
    for (let i = 0, il = list.length; i < il; ++i) {
      if (list[i].isTopMost) {
        firstTopMostIndex = i
      }
    }

    if (firstTopMostIndex === undefined) {
      list.push(treeNode)
    } else {
      list.splice(firstTopMostIndex, 0, TreeNode)
    }
  }
}

function add (parentLayerId, isTopMost = false) {
  let uid = genUid()

  let treeNode

  if (parentLayerId) {
    // 找到父节点
    const parentTreeNode = treeNodeIndex[parentLayerId].treeNode

    if (!parentTreeNode) {
      throw new Error('parent layer does not exists!')
    } else {
      treeNode = new TreeNode({ id: uid, parentId: parentTreeNode.id, isTopMost })
      addToList(parentTreeNode.children, treeNode)
    }
  } else {
    treeNode = new TreeNode({ id: uid, isTopMost })
    addToList(tree, treeNode)
  }

  const layerZIndexInstance = new Vue()
  layerZIndexInstance.id = uid
  layerZIndexInstance.toTop = () => toTop(uid)
  layerZIndexInstance.remove = () => remove(uid)
  layerZIndexInstance.refresh = () => refreshZIndex()
  treeNodeIndex[uid] = {
    treeNode,
    layerZIndexInstance
  }

  return layerZIndexInstance
}

function remove (id) {
  if (treeNodeIndex[id] === null) {
    return
  }

  iterateTree(tree, (treeNode) => {
    if (treeNode.id === id) {
      const parentTreeNode = treeNode.parentId && treeNodeIndex[treeNode.parentId].treeNode
      const treeNodeList = parentTreeNode ? parentTreeNode.children : tree
      lodashRemove(treeNodeList, item => item.id === id)
      return true
    }
  })

  treeNodeIndex[id] = null
}

function toTop (id) {
  const treeNode = treeNodeIndex[id].treeNode
  if (treeNode) {
    const parentTreeNode = treeNode.parentId && treeNodeIndex[treeNode.parentId].treeNode
    const treeNodeList = parentTreeNode ? parentTreeNode.children : tree

    const treeNodeIndex = treeNodeList.indexOf(treeNode)
    const treeNodeListLength = treeNodeList.length
    for (let i = treeNodeIndex + 1; i < treeNodeListLength; ++i) {
      const curTreeNode = treeNodeList[i]
      if (curTreeNode.isTopMost) {
        treeNodeList.splice(i - 1, 1, treeNode)
        break
      }

      treeNodeList[i - 1] = curTreeNode
      treeNodeList[i] = null
    }

    // 如果没有topMost的元素，就直接把目标元素放在数组最后面
    if (treeNodeList[treeNodeListLength - 1] === null) {
      treeNodeList[treeNodeListLength - 1] = treeNode
    }
  } else {
    throw new Error('not exists!')
  }

  // 变了位置，自然要刷一遍zindex了
  refreshZIndex()
}

function refreshZIndex () {
  let counter = baseZIndex
  iterateTree(tree, (treeNode) => {
    counter++
    treeNodeIndex[treeNode.id].layerZIndexInstance.$emit('zindexchange', counter)
  })
}

export default {
  install (Vue, { baseZIndex: base } = {}) {
    baseZIndex = base || baseZIndex
    Vue.prototype.$addLayer = add
  }
}
