<template>
  <form class="veui-form" @submit.prevent="_handleSubmit">
    <slot></slot>
  </form>
</template>

<script>
import { isBoolean, isFunction, pick, includes, keys, assign, zipObject, find } from 'lodash'
import { promiseAllSettled, getCustomModelProp } from '../../utils/helper'
import cloneDeep from '../../managers/cloneDeep'

export default {
  name: 'veui-form',
  uiTypes: ['form'],

  props: {
    data: Object,
    readonly: Boolean,
    disabled: Boolean,
    noValidationOnSubmit: Boolean,
    validators: Object,
    hideError: Boolean,
    beforeValidate: Function,
    afterValidate: Function,
    submitBtn: String
  },

  data () {
    return {
      // 存 formValue 的
      items: []
    }
  },

  computed: {
    submitBtnRef () {
      return this.submitBtn ? this.$vnode.context.$refs[this.submitBtn] : null
    }
  },

  watch: {
    readonly (newVal) {
      this._setReadOnly(newVal)
    },
    disable (newVal) {
      this._setDisabled(newVal)
    }
  },

  methods: {
    _handleSubmit (e) {
      // if (this.submitBtnRef) {
      //   this.submitBtnRef.loading = true
      // }
      let me = this
      let data = this.data || this.getFormData()
      if (!this.noValidationOnSubmit) {
        return new Promise((resolve, reject) =>
          isFunction(me.beforeValidate)
            ? resolve(me.beforeValidate(data))
            : resolve()
        )
        .then(this.validate.bind(this))
        .then(
          () => new Promise((resolve, reject) =>
            isFunction(me.afterValidate)
              ? resolve(me.afterValidate(data))
              : resolve()
          ),
          err => {
            return this.$emit('invalid', err)
          }
        )
        .then(this.$emit.bind(me, 'submit', data, e))
      } else {
        this.$emit('submit', data, e)
      }
    },

    _setReadOnly (readonly) {
      this.items.forEach(item => {
        item.input.readonly = readonly
      })
    },

    _setDisabled (disabled) {
      this.items.forEach(item => {
        item.input.disabled = disabled
      })
    },

    getFormData (names) {
      let items = this.items
      if (names && (Array.isArray(names) && names.length)) {
        items = items.filter(item => includes(names, item.input.name))
      } else {
        items = items.filter(item => item.input.name)
      }
      return assign({}, ...items.map(item => {
        let input = item.input
        let prop = getCustomModelProp(input)
        return {
          [input.name]: cloneDeep(input[prop])
        }
      }))
    },

    validate (names) {
      let items = this.items
      let validators = this.validators
      if (Array.isArray(names) && names.length) {
        items = items.filter(item => includes(names, item.input.name))
        validators = pick(validators, keys(validators).filter(validatorName => includes(names, validatorName)))
      }

      return promiseAllSettled(
        [
          ...items.map(item => {
            let itemRes = item.validate()
            // utils/Validator 是同步的，检查一下不是 true 就好，返回其他的都当成错误信息
            if (!isBoolean(itemRes) || !itemRes) {
              return Promise.reject({ [item.input.name]: itemRes })
            }
            return Promise.resolve(true)
          }),

          ...keys(validators).map(key => {
            let fn = validators[key]
            if (isFunction(fn)) {
              let keys = key.split(',').map(name => name.trim())
              let targets = keys.map(name => find(items, item => name === item.input.name))
              let itemRes = fn.apply(
                this,
                [
                  zipObject(keys, targets.map(item => {
                    let input = item.input
                    let prop = getCustomModelProp(input)
                    return input[prop]
                  })),
                  zipObject(keys, targets),
                  this.$vnode.context
                ]
              )
              // 异步校验交给返回的 Promise，对于同步校验，true 代表校验通过
              if (itemRes && isFunction(itemRes.then)) {
                return itemRes.then(
                  val => ({ val }),
                  err => {
                    return Promise.reject({ [key]: err })
                  }
                )
              }
              return itemRes ? Promise.resolve(itemRes) : Promise.reject({ [key]: itemRes })
            } else {
              return Promise.resolve(true)
            }
          })
        ]
      )
      .then(
        allRes => {
          if (allRes.every(mixed => {
            return 'val' in mixed
          })) {
            return Promise.resolve()
          }

          return Promise.reject(assign({}, ...allRes.filter(res => 'err' in res).map(res => res.err)))
        }
      )
    },

    reset () {
      this.items.forEach(item => {
        item.resetValue()
      })
    }
  },
  mounted () {
    this._setReadOnly(this.readonly)
    this._setDisabled(this.disabled)
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";

.veui-form[ui~="inline"] {
  .clearfix();

  .veui-form-row {
    margin-bottom: 0;
    float: left;

    .veui-form-key,
    .veui-form-key-empty {
      float: left;
      width: auto;
    }

    & + .veui-form-row {
      margin-left: 15px;
    }
  }

  fieldset {
    margin: 0;
    padding: 0;
    border: none;

    .veui-form-row {
      &:first-child {
        .veui-form-key {
          padding-left: 15px;
          vertical-align: middle;
        }
      }

      [class*="veui"][ui~="alt"] {
        box-shadow: none;
      }
    }

    background-color: @veui-gray-color-sup-3;
    border-color: @veui-gray-color-sup-3;
    color: @veui-text-color-normal;
    .veui-shadow();
  }
}
</style>
