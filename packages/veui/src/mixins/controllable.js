import { capitalize, isString, isPlainObject, reduce } from 'lodash'

let options = {
  methods: {
    hasProp (name) {
      return name in this.$options.propsData && this[name] !== undefined
    },
    getReal ({ prop, local } = {}) {
      return this.hasProp(prop)
        ? this[prop]
        : local
          ? this[local]
          : this[`local${capitalize(prop)}`]
    },
    setReal (value, { prop, local, event } = {}) {
      // TODO forceUpdate
      // '' 则认为忽略对应的操作
      if (local !== null) {
        local = local || `local${capitalize(prop)}`
        this[local] = value
      }
      if (event !== null) {
        event = event || `update:${prop}`
        this.$emit(event, value)
      }
    }
  }
}

export default function makeControllable (props) {
  if (props && isString(props)) {
    props = [props]
  }
  // 'value'
  // ['value1', ...]
  // { value: 'value' | { prop, local, computed, event, get, set }, ...}
  if (props) {
    let result = reduce(
      props,
      (result, def, key) => {
        if (isString(def)) {
          def = { prop: def }
        } else if (isPlainObject(def)) {
          def = {
            ...def,
            prop: key
          }
        } else {
          throw new Error('prop config must be a string or a object')
        }
        // { prop, local, computed, event, get, set }
        let { prop, local, computed, get, set } = def
        if (local !== null) {
          result.data[local || `local${capitalize(prop)}`] = vm => vm[prop]
        }
        let name = computed || `real${capitalize(prop)}`
        let hasGet = get !== false
        result.computed[name] = {
          get () {
            if (hasGet) {
              return get ? get.call(this, def) : this.getReal(def)
            }
          },
          set (value) {
            if (
              set !== false &&
              ((hasGet && value !== this[name]) || !hasGet)
            ) {
              return set ? set.call(this, value, def) : this.setReal(value, def)
            }
          }
        }

        return result
      },
      { computed: {}, data: {} }
    )
    return {
      ...options,
      computed: result.computed,
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
  return options
}
