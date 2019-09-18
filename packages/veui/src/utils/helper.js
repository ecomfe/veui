import { includes, camelCase, get, isString, isObject, assign } from 'lodash'
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
    if (direct) {
      break
    }
    current = current.$parent
  }
  return null
}

export function getNonTransparentParent (component) {
  let current = component.$parent
  while (current) {
    if (!isType(current, 'transparent')) {
      return current
    }
    current = current.$parent
  }
  return null
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
 * 检查组件是否是指定type或根的顶级type类型
 *
 * @param {Vue} vm 组件实例
 * @param {string} type 组件uiType
 * @param {string=} scopeType 指定查找的父组件uiTypes范围
 * @return {boolean} 检查结果
 */
export function isTopMostOfType (vm, type, scopeType) {
  let parent = vm.$parent
  while (parent && !isType(parent, type)) {
    if (scopeType && isType(parent, scopeType)) {
      parent = null
      break
    }

    parent = parent.$parent
  }
  return !parent
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
 * 2. 字符串数组
 * 3. object
 * 此处统一将这些形式的 class 转换成 object 形式的
 *
 * @param {string|Array<string>|Object<string, boolean>} klasses
 */
export function normalizeClass (klasses) {
  let klassObj = {}
  if (isString(klasses)) {
    klasses.split(/\s+/).forEach(klass => {
      klassObj[klass] = true
    })
  } else if (Array.isArray(klasses)) {
    klasses.forEach(klass => {
      klassObj[klass] = true
    })
  } else if (isObject(klasses)) {
    assign(klassObj, klasses)
  }
  return klassObj
}

export function mergeClasses (...klasses) {
  return assign({}, ...klasses.map(normalizeClass))
}

export function getConfigKey (name) {
  return name.replace(/^veui|-*/g, '').toLowerCase()
}

const CLASS_PROP_DEF = {
  validator (value) {
    return isObject(value) || isString(value)
  },
  default: null
}

export function getClassPropDef () {
  return { ...CLASS_PROP_DEF }
}

const OPPOSITE = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right'
}

const ALIGN_HORIZONTAL = {
  left: 'left',
  start: 'left',
  right: 'right',
  end: 'right'
}

const ALIGN_VERTICAL = {
  top: 'top',
  start: 'top',
  bottom: 'bottom',
  end: 'bottom'
}

export function resolveOverlayPosition (position) {
  if (!position) {
    return {}
  }

  let [side, align] = position.split(/[-\s]+/)
  side = side === 'auto' ? 'bottom' : side
  let targetAttachment
  let attachment
  if (side === 'top' || side === 'bottom') {
    targetAttachment = `${side} ${ALIGN_HORIZONTAL[align] || 'center'}`
    attachment = `${OPPOSITE[side]} ${ALIGN_HORIZONTAL[align] || 'center'}`
  } else {
    targetAttachment = `${ALIGN_VERTICAL[align] || 'middle'} ${side}`
    attachment = `${ALIGN_VERTICAL[align] || 'middle'} ${OPPOSITE[side]}`
  }
  return {
    targetAttachment,
    attachment
  }
}

const RE_INDEX = /\d+/
export function deepSet (obj, path, val) {
  let segments = path
    .split(/[[\].]/)
    .map(s => {
      return s.match(RE_INDEX) ? Number(s) : s
    })
    .filter(s => s !== '')
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

const RE_NUMBER = /^(?:\d*(?:\.\d+)?|\.\d+)$/
export function normalizeLength (val) {
  if (!val) {
    return null
  }
  if (typeof val === 'number' || RE_NUMBER.test(val)) {
    return Number(val) > 0 ? `${val}px` : null
  }
  return val
}

export function hasClass (vnode, clazz) {
  let { data } = vnode

  if (!data) {
    return false
  }

  return !!(
    (data.class || {})[clazz] ||
    (data.staticClass && includes(data.staticClass.split(/\s+/), clazz))
  )
}

export function resolveOffset (val, base) {
  let isPx = isString(val) && /px$/.test(val)
  let num = isPx ? +val.replace(/px$/, '') : val || 0
  return base == null ? num : isPx ? num : base * num
}
