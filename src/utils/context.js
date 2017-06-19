import { isString, isObject } from 'lodash'

function isVnode (vnode) {
  return isObject(vnode) && vnode.componentOptions
}

/**
 * 根据ref拿到指定的DOM节点，主要有一下情况：
 * 1、如果ref是字符串，就需要从context下面找指定ref的组件实例或者DOM元素；
 * 2、如果ref直接就是组件实例，那就取ref.$el；
 * 3、如果ref直接就是文本节点或者元素节点，就返回ref。
 * 4、否则返回null
 *
 * @param {string|VueComponent|Node} ref 目标节点标识
 * @param {VueContext=} context 组件上下文，在ref为字符串的时候必传
 * @return {Node}
 */
export function getNodes (ref, context) {
  if (!ref) {
    return []
  }

  let vnodes = getVnodes(ref, context)
  return vnodes.map(item => {
    if (isVnode(item)) {
      return item.elm
    }
    return item
  })
}

export function getVnodes (ref, context) {
  if (!ref) {
    return []
  }
  let vnodes
  if (isString(ref)) {
    vnodes = context.$refs[ref]
    if (!vnodes) {
      vnodes = []
    } else {
      vnodes = Array.isArray(vnodes) ? vnodes : [vnodes]
    }
    vnodes = vnodes.map(item => item.$vnode || item)
  } else {
    ref = Array.isArray(ref) ? ref : [ref]
    vnodes = ref.map(item => {
      if (item.$vnode) {
        return item.$vnode
      } else if (isVnode(item) ||
        item.nodeType === 1 ||
        item.nodeType === 3) {
        // vnode节点、dom元素节点和文本节点
        return item
      }
    })
  }
  return vnodes || []
}
