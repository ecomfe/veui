import { capitalize, isString, isPlainObject, reduce, find } from 'lodash'

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
      throw new Error(`[controllable] Unkown prop key: '${prop}' on committing.`)
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
            throw new Error('[controllable] Can\'t access disabled getter!')
          }
          return computedGetter(this, def)
        },
        set (value) {
          // 一般可以用来禁用 assignment，而强制使用 vm.commit !
          // 对于 v-model/.sync，这个 set 还是有点用处
          if (set === false) {
            throw new Error('[controllable] Can\'t access disabled setter!')
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
    data () {
      // 可能会产生多个 data hook，比如 Menu 组件在 MenuMixin 和 Menu 里面都用了 controllable
      this._controlledProps = this._controlledProps
        ? [...this._controlledProps, ...result.normalized]
        : result.normalized

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
  return get
    ? get.call(vm, getReal(vm, def))
    : getReal(vm, def)
}

function computedSetter (vm, value, def, ...args) {
  let { set } = def
  // 值不同则更新, 若不更新：不设置 local，不 emit 事件
  if (!sameValue(vm, value, def)) {
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
      : vm[`local${capitalize(prop)}`]
}

function setReal (vm, value, def = {}, ...args) {
  const { prop, local, event } = def
  // false 则认为忽略对应的操作
  if (local !== false) {
    vm[getLocalName(def)] = value
  }
  if (event !== false) {
    vm.$emit(event || `update:${prop}`, value, ...args)
  }
}

function getLocalName ({ prop, local } = {}) {
  return local || `local${capitalize(prop)}`
}

function getRealName ({ prop, computed } = {}) {
  return computed || `real${capitalize(prop)}`
}

// 用来控制是否往上触发同步事件，有 prop 则判断是否相等，没有 prop 就用 real
function sameValue (vm, value, def) {
  return isControlled(vm, def.prop)
    ? value === vm[def.prop]
    : value === vm[getRealName(def)]
}

function isControlled (vm, prop) {
  // 排除 default value 的影响
  return prop in vm.$options.propsData && typeof vm[prop] !== 'undefined'
}
