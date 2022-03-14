import {
  includes,
  camelCase,
  get,
  isString,
  isObject,
  assign,
  reduce
} from 'lodash'
import Vue from 'vue'

export function getTypedAncestorTracker (type, direct = false) {
  return {
    computed: {
      [camelCase(type)] () {
        return getTypedAncestor(this, type, direct)
      }
    }
  }
}

export function getTypedAncestor (component, type, direct) {
  let current = component.$parent
  while (current) {
    if (isType(current, type)) {
      return current
    }
    // direct 是 boolean，那么只往上找一级
    // direct 若是 vm，那么表示在这个 vm 下找
    if (direct === true || current === direct) {
      break
    }
    current = current.$parent
  }
  return null
}

export function findAncestor (component, predicate) {
  let current = component.$parent
  while (current) {
    if (predicate(current)) {
      return current
    }
    current = current.$parent
  }
  return null
}

export function isVueComponent (val) {
  return !!(val && val._isVue)
}

/**
 * 判断组件实例是否是某个类型
 *
 * @param {Vue} vm 组件实例
 * @param {string} type 类型
 * @returns {boolean} 组件实例是否是指定的类型
 */
export function isType (vm, type) {
  return includes(get(vm, '$options.uiTypes', []), type)
}

/**
 * 判断组件实例是否为对 ui 机制透明
 *
 * @param {Vue} vm 组件实例
 */
export function isTransparent (vm) {
  if (isType(vm, 'transparent')) {
    return true
  }
  if (!vm.$vnode) {
    return false
  }
  return isAbstractVNode(vm.$vnode)
}

/**
 * 判断虚拟DOM节点是否是抽象组件（transition/transition-group）
 *
 * @param {VNode} vnode 虚拟DOM节点
 */
export function isAbstractVNode (vnode) {
  let compOptions = vnode.componentOptions
  return (
    compOptions.Ctor.options.abstract || compOptions.tag === 'transition-group'
  )
}

/**
 * 检查组件是否是指定type或根的顶级type类型
 *
 * @param {Vue} vm 组件实例
 * @param {string} type 组件uiType
 * @param {string=} scopeType 指定查找的父组件uiTypes范围
 * @return {boolean} 检查结果
 */
export function isTopMostOfType (vm, type, scopeType) {
  if (!isType(vm, type)) {
    return false
  } else if (scopeType && isType(vm, scopeType)) {
    return true
  }

  let current = vm.$parent
  while (current && !isType(current, type)) {
    if (scopeType && isType(current, scopeType)) {
      current = null
      break
    }

    current = current.$parent
  }
  return !current
}

export function getModelProp (vm) {
  return get(vm, '$options.model.prop', 'value')
}

export function getModelEvent (vm) {
  return get(vm, '$options.model.event', 'input')
}

/**
 * 表单中空输入
 *
 * @param {*} val 输入值
 * @return {boolean} 是否空输入
 */
export function isEmpty (val) {
  return val == null || val === '' || (Array.isArray(val) && !val.length)
}

/**
 * Vue 里面有三种设置 class 的方式：
 * 1. 字符串
 * 2. 字符串
 * 3. object
 * 此处统一将这些形式的 class 转换成 object 形式的
 *
 * @param {string | Array<string | Object> | Object<string, boolean>} klasses
 */
export function normalizeClass (klasses) {
  let klassObj = {}
  if (isString(klasses)) {
    klasses.split(/\s+/).forEach((klass) => {
      klassObj[klass] = true
    })
  } else if (Array.isArray(klasses)) {
    klasses.forEach((klass) => {
      assign(klassObj, normalizeClass(klass))
    })
  } else if (isObject(klasses)) {
    assign(klassObj, klasses)
  }
  return klassObj
}

export function getConfigKey (name) {
  return name.replace(/^veui|-*/gi, '').toLowerCase()
}

/**
 * Just transparently pass to Vue itself
 * we don't need to perform any additional check here
 */
export const LOOSE_PROP_DEF = {
  default: null
}

const RE_INDEX = /\d+/
export function deepSet (obj, path, val) {
  let segments = path
    .split(/[[\].]/)
    .map((s) => {
      return s.match(RE_INDEX) ? Number(s) : s
    })
    .filter((s) => s !== '')
  let context = obj
  segments.forEach((s, index) => {
    if (index === segments.length - 1) {
      Vue.set(context, s, val)
      return
    }
    if (!(s in context)) {
      if (typeof segments[index + 1] === 'number') {
        Vue.set(context, s, [])
      } else {
        Vue.set(context, s, {})
      }
    }
    context = context[s]
  })
}

const RE_NUMBER = /^-?(?:\d*(?:\.\d+)?|\.\d+)$/
export function normalizeLength (val) {
  if (!val) {
    return null
  }
  if (
    typeof val === 'number' ||
    (typeof val === 'string' && RE_NUMBER.test(val))
  ) {
    return Number(val) !== 0 ? `${val}px` : null
  }
  return val
}

/**
 * 将输入值转化为对应整数，如果值非整数则返回 null
 *
 * @param {string|number} val 输入值
 * @returns {?number} 转换后的整数数值
 */
export function normalizeInt (val) {
  let value = parseInt(val, 10)
  return isNaN(value) ? null : value
}

export function hasClass (vnode, clazz) {
  let { data } = vnode

  if (!data) {
    return false
  }

  return !!(
    normalizeClass(data.class || {})[clazz] ||
    normalizeClass(data.staticClass || {})[clazz]
  )
}

const pxRe = /px$/
const percentRe = /%$/

export function resolveOffset (val, base) {
  if (val == null || typeof base !== 'number' || isNaN(base)) {
    return 0
  }

  let result = val
  if (isString(val)) {
    if (pxRe.test(val)) {
      result = val.replace(pxRe, '')
    } else if (percentRe.test(val)) {
      val = +val.replace(percentRe, '') / 100
      result = base * val
    }
  }

  result = Number(result)
  return isNaN(result) ? 0 : result
}

export function ignoreElements (names) {
  names = [].concat(names)
  names.forEach((name) => {
    if (Vue.config.ignoredElements.indexOf(name) === -1) {
      Vue.config.ignoredElements.push(name)
    }
  })
}

function getScopeAttrs (el) {
  return [...el.attributes]
    .map((attr) => attr.nodeName)
    .filter((name) => name.indexOf('data-v-') === 0)
}

export function inheritScopeAttrs (el, parent) {
  let attrs = getScopeAttrs(parent)
  let patched = []
  attrs.forEach((attr) => {
    if (!el.hasAttribute(attr)) {
      el.setAttribute(attr, '')
      patched.push(attr)
    }
  })

  return function removeInheritedScopeAttrs () {
    patched.forEach((attr) => el.removeAttribute(attr))
  }
}

export function createPortal (el, target) {
  let parent = el.parentNode

  // create a connection to the portal entrance
  // v-outside will honor this connection, so we'd
  // better document this somewhere properly (TODO)
  el.__portal__ = parent

  let restore = inheritScopeAttrs(el, parent)

  target.appendChild(el)

  let removePortal = () => {
    delete el.__portal__
    restore()
    parent.appendChild(el)
  }

  return removePortal
}

export function renderSlot (vm, name, props = {}) {
  return (
    vm.$slots[name] ||
    (vm.$scopedSlots[name] ? vm.$scopedSlots[name](props) : null) ||
    null
  )
}

export const Void = {
  render: (h) => h()
}

export function forwardSlots (slots, vm) {
  let { $scopedSlots, $slots, $createElement: h } = vm
  return reduce(
    slots,
    (result, to, from) => {
      if ($slots[from]) {
        result.slots.push(h('template', { slot: to }, $slots[from]))
      } else if ($scopedSlots[from]) {
        result.scopedSlots[to] = (props) => $scopedSlots[from](props)
      }
      return result
    },
    // JSX 中：
    //   1. scopedSlots 作为 props 传递，数据类型是: { name: props => slotContent }
    //   2. slots 作为 children 传递，数据类型是：[<template slot="name">slotContent</template>, ...]
    { scopedSlots: {}, slots: [] }
  )
}

const LOW_SURROGATE = /[\uD800-\uDBFF]/

export function safeSlice (str, length) {
  if (str.length > length) {
    while (length--) {
      if (!LOW_SURROGATE.test(str[length])) {
        break
      }
    }
    return str.slice(0, length + 1)
  }
  return str
}

// 避免 vue invoke handler 导致的无限递归
export function wrapListeners (listeners) {
  return reduce(
    listeners,
    (acc, listener, key) => {
      acc[key] = Array.isArray(listener) ? listener : [listener]
      return acc
    },
    {}
  )
}

export function resolveInterpolation (message, data, compat) {
  const re = compat ? /\$?\{(\w+)\}/g : /\{(\w+)\}/g
  return String(message).replace(re, (match, key) => {
    if (data[key] != null) {
      return data[key]
    }
    return match
  })
}
