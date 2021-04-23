import { upperFirst, isString, isPlainObject, reduce, find } from 'lodash'
import { getModelEvent } from '../utils/helper'

let options = {
  methods: {
    isControlled (prop) {
      return isControlled(this, prop)
    },
    // 使用方法而非直接赋值：受控时赋值并未直接生效，而仅仅 emit 事件而已，直接让使用方使用赋值违反直觉
    // commit 可以额外的给事件传递更多的参数
    commit (prop, value, ...args) {
      let def = find(this._controlledProps, i => i.prop === prop)
      if (def) {
        computedSetter(this, value, def, ...args)
        return
      }
      throw new Error(
        `[controllable] Unkown prop key: '${prop}' on committing.`
      )
    }
  }
}

const errorMsg =
  '[controllable] prop config must be either a string, an object or an object array.'

/**
 * 自动将对应的 prop 转换成受控的
 * @param {string|Object|[string|Object]} props - 定义的受控props
 * @return 转换后的 mixin
 */
export default function useControllable (props) {
  if (!props) {
    // expose default methods
    return options
  }

  if (isString(props)) {
    props = [
      {
        prop: props
      }
    ]
  } else if (isPlainObject(props)) {
    props = [props]
  }
  if (!Array.isArray(props)) {
    throw new Error(errorMsg)
  }

  let result = props.reduce(
    (result, def) => {
      if (isString(def)) {
        def = { prop: def }
      } else if (!isPlainObject(def)) {
        console.error(errorMsg)
        return result
      } else if (!def.prop) {
        console.error(
          '[controllable] the `prop` property is required when prop config item is an object.'
        )
        return result
      }

      // store prop definitions
      result.normalized.push(def)

      // { prop, local, computed, event, get, set }
      let { prop, local, get, set } = def

      if (local !== false) {
        result.data[getLocalName(def)] = vm => vm[prop]
      }

      result.computed[getRealName(def)] = {
        get () {
          if (get === false) {
            throw new Error("[controllable] Can't access disabled getter!")
          }
          return computedGetter(this, def)
        },
        set (value) {
          // 一般可以用来禁用 assignment，而强制使用 vm.commit !
          // 对于 v-model/.sync，这个 set 还是有点用处
          if (set === false) {
            throw new Error("[controllable] Can't access disabled setter!")
          }
          return computedSetter(this, value, def)
        }
      }

      return result
    },
    { computed: {}, data: {}, normalized: [] }
  )

  return {
    ...options,
    computed: result.computed,
    beforeCreate () {
      // 比如 Menu 组件在 MenuMixin 和 Menu 里面都用了 controllable，所以要受控 prop 的定义都 merge 起来
      // 后面会通过 prop name 来取
      // 暂时不放 created 里面，因为 immediate watcher 比 created 早
      this._controlledProps = this._controlledProps
        ? [...this._controlledProps, ...result.normalized]
        : result.normalized
    },
    data () {
      return reduce(
        result.data,
        (res, fn, key) => {
          res[key] = fn(this)
          return res
        },
        {}
      )
    }
  }
}

function computedGetter (vm, def) {
  let { get } = def
  return get ? get.call(vm, getReal(vm, def)) : getReal(vm, def)
}

function computedSetter (vm, value, def, ...args) {
  let { set } = def
  // 值不同则更新, 若不更新：不设置 local，不 emit 事件
  let oldReal = getReal(vm, def)
  if (oldReal !== value) {
    return set
      ? set.call(vm, value, val => setReal(vm, val, def, ...args))
      : setReal(vm, value, def, ...args)
  }
}

function getReal (vm, { prop, local } = {}) {
  return vm.isControlled(prop)
    ? vm[prop]
    : local
      ? vm[local]
      : vm[`local${upperFirst(prop)}`]
}

function setReal (vm, value, def = {}, ...args) {
  const { prop, local, event } = def
  // false 则认为忽略对应的操作
  if (local !== false) {
    vm[getLocalName(def)] = value
  }
  if (event !== false) {
    let modelEvent = getModelEvent(vm)

    if (event !== modelEvent) {
      vm.$emit(`update:${prop}`, value, ...args)
    }
    if (event) {
      vm.$emit(event, value, ...args)
    }
  }
}

function getLocalName ({ prop, local } = {}) {
  return local || `local${upperFirst(prop)}`
}

function getRealName ({ prop, computed } = {}) {
  return computed || `real${upperFirst(prop)}`
}

function isControlled (vm, prop) {
  // 受控定义：显式传了 prop 且传的不是 undefined 就认为受控了

  // eslint-disable-next-line no-unused-expressions
  vm[prop] // 为了响应性，因为下面 in propsData 没有响应性
  let propsData = vm.$options.propsData
  return prop in propsData && typeof propsData[prop] !== 'undefined'
}
