import { capitalize, isString, isPlainObject, reduce, find } from 'lodash'

let options = {
  methods: {
    isControlled (name) {
      // 排除 default value 的影响
      return name in this.$options.propsData && this[name] !== undefined
    },
    // 使用方法而非直接赋值：受控时赋值并未直接生效，而仅仅 emit 事件而已，直接让使用方使用赋值违反直觉
    setReal (prop, value) {
      let def = find(this._controlledProps, i => i.prop === prop)
      if (def) {
        this[getRealName(def)] = value
        return
      }
      throw new Error(`[controllable] Unkown prop key: '${prop}' on setting computed property.`)
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

      if (local !== null) {
        result.data[getLocalName(def)] = vm => vm[prop]
      }

      result.computed[getRealName(def)] = {
        get () {
          if (get !== false) {
            return get
              ? get.call(this, () => getReal(this, def))
              : getReal(this, def)
          }
        },
        set (value) {
          // 没有禁用 set 且值不同则更新
          if (set !== false && !sameValue(this, value, def)) {
            return set
              ? set.call(this, value, val => setReal(this, val, def))
              : setReal(this, value, def)
          }
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

function getReal (vm, { prop, local } = {}) {
  return vm.isControlled(prop)
    ? vm[prop]
    : local
      ? vm[local]
      : vm[`local${capitalize(prop)}`]
}

function setReal (vm, value, def = {}) {
  const { prop, local, event } = def
  // null 则认为忽略对应的操作
  if (local !== null) {
    vm[getLocalName(def)] = value
  }
  if (event !== null) {
    vm.$emit(event || `update:${prop}`, value)
  }
}

function getLocalName ({ prop, local } = {}) {
  return local || `local${capitalize(prop)}`
}

function getRealName ({ prop, computed } = {}) {
  return computed || `real${capitalize(prop)}`
}

// 有 get 的话，判断下值是否相等，相等则默认不用更新；
// 没有 get 的话，无法判断是否相等，直接更新
function sameValue (vm, value, def) {
  const hasGet = def.get !== false
  return hasGet && value === vm[def.prop]
}
