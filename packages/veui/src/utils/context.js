import { isString, isObject, includes, every, isArray, findIndex } from 'lodash'
import { getTypedAncestor } from './helper'

function isVnode (vnode) {
  return isObject(vnode) && vnode.componentOptions
}

/**
 * 判断是否指定值是否能够传入 getNodes 以获取 DOM nodes 。
 *
 * @param {string|Vue|Node|Array<string>|Array<Vue>|Array<Node>} v 待判断的值
 * @return {boolean}
 */
export function isValidNodesResolver (v) {
  function isValid (item) {
    return (
      isString(item) ||
      item.$vnode ||
      includes([1, 3], item.nodeType) ||
      isVnode(item)
    )
  }

  return isValid(v) || (isArray(v) && every(v, isValid))
}

/**
 * 根据ref拿到指定的DOM节点，主要有一下情况：
 * 1、如果ref是字符串，就需要从context下面找指定ref的组件实例或者DOM元素；
 * 2、如果ref直接就是组件实例，那就取ref.$el；
 * 3、如果ref直接就是文本节点或者元素节点，就返回ref。
 * 4、否则返回空数组
 *
 * @param {string|Vue|Node|Array<string>|Array<Vue>|Array<Node>} ref 目标节点标识
 * @param {VueContext=} context 组件上下文，在ref为字符串的时候必传
 * @return {Node}
 */
export function getNodes (ref, context) {
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
      } else if (isVnode(item) || item.nodeType === 1 || item.nodeType === 3) {
        // vnode节点、dom元素节点和文本节点
        return item
      }
    })
  }
  return vnodes || []
}

/**
 * 获取与当前组件最接近的给定类型的祖先组件中，当前组件在其第几个直接子节点的位置
 * @param {Vue} current 查找的组件实例
 * @param {string} parentType 父级类型
 * @returns {number} 该实例所在位置的索引，找不到返回 -1
 */
export function getIndexOfType (current, parentType) {
  let parent = parentType
    ? getTypedAncestor(current, parentType)
    : current.$parent

  if (parentType && !parent) {
    throw new Error(`No ancestor typed as [${parentType}] found.`)
  }

  let parentVnodes = parent.$slots.default

  while (current.$parent !== parent) {
    current = current.$parent
  }

  let currentVnode = getVnodes(current)[0]

  // 只是用于每次渲染时插入到当前位置的顺序
  return findIndex(parentVnodes, vnode => vnode === currentVnode)
}

/**
 * 查找该组件的子孙组件中第一个有某个方法的组件实例，深度优先
 * @param {Vue} context 查找的组件实例，即从 context.$children 开始查找
 * @param {function(Vue): boolean} predicate 判断这个组件是否匹配
 * @returns {?Vue} 找到的组件
 */
export function findComponent (context, predicate) {
  let comp = null
  function walkChildren (children) {
    return children.some(i => {
      let match = predicate(i)
      if (match) {
        comp = i
      } else if (i.$children && i.$children.length) {
        return walkChildren(i.$children)
      }
      return !!match
    })
  }
  walkChildren(context.$children || [])
  return comp
}
