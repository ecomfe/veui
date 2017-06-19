import { includes, camelCase, get } from 'lodash'

export function getTypedAncestorTracker (name, type) {
  return {
    computed: {
      [camelCase(name)] () {
        let current = this.$parent
        while (current) {
          let { uiTypes } = current.$options
          if (uiTypes && includes(uiTypes, type || name)) {
            return current
          }
          current = current.$parent
        }
        return null
      }
    }
  }
}

/**
 * 检查组件是否是指定type或根的顶级type类型
 *
 * @param  {Component}  vm         组件实例
 * @param  {string}     type       组件uiType
 * @param  {string}     [stopType] 指定停止判断的父组件uiType
 * @return {Boolean}               检查结果
 */
export function isTopMostOfType (vm, type, stopType) {
  let parent = vm.$parent
  while (parent && !includes(get(parent, '$options.uiTypes'), type)) {
    if (stopType && includes(get(parent, '$options.uiTypes'), stopType)) {
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
 * @param  {[type]}  val 输入值
 * @return {Boolean}     是否空输入
 */
export function isEmpty (val) {
  return val == null || val === ''
}
