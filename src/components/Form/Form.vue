<template>
  <form class="veui-form" @submit.prevent="handleSubmit">
    <slot></slot>
  </form>
</template>

<script>
import { isBoolean, isFunction, includes, assign, zipObject, find } from 'lodash'
import { promiseAllSettled, getCustomModelProp, splitToArray } from '../../utils/helper'
import cloneDeep from '../../managers/cloneDeep'
import Validator from '../../utils/validators'
import Vue from 'vue'

export default {
  name: 'veui-form',
  uiTypes: ['form', 'formContainer'],

  props: {
    data: Object,
    validators: Array,
    hideError: Boolean,
    beforeValidate: Function,
    afterValidate: Function,
    submitBtn: String
  },

  data () {
    return {
      // 存 formValue 的
      items: [],
      handlersStore: {}
    }
  },

  computed: {
    // submitBtnRef () {
    //   return this.submitBtn ? this.$vnode.context.$refs[this.submitBtn] : null
    // }
    interactiveValidators () {
      return this.validators
        ? this.validators.filter(validator => {
          let fn = validator.handler
          let triggers = validator.triggers
          if (!isFunction(fn) || !validator.fields || !triggers) {
            return false
          }

          triggers = splitToArray(triggers).filter(event => event !== 'submit')
          // 去掉都是submit的
          return triggers.length
        })
        : null
    }
  },

  watch: {
    interactiveValidators (newVal, oldVal) {
      let added = newVal || []
      if (oldVal && oldVal.length) {
        let diff = Validator.diffRules(newVal, oldVal)
        diff.removed.forEach(validator => {
          let triggers = splitToArray(validator.trigger)
          let fields = splitToArray(validator.fields)
          let justified = fields.map((field, index) => ({field, event: triggers[index]}))
          justified.forEach((field, event) => {
            find(this.items, item => item.name === field).input.$off(event, this.handlersStore[`${fields.join(',')}-${field}-${event}`])
          })
        })
        added = diff.added
      }
      this.bindInteractiveValidators(added)
    }
  },

  methods: {
    handleSubmit (e) {
      // if (this.submitBtnRef) {
      //   this.submitBtnRef.loading = true
      // }
      let data = this.data || this.getFormData()
      return new Promise((resolve, reject) =>
        isFunction(this.beforeValidate)
          ? resolve(this.beforeValidate.call(this.$vnode.context, data))
          : resolve()
      )
      .then(this.validate.bind(this))
      .then(
        () => new Promise((resolve, reject) =>
          isFunction(this.afterValidate)
            ? resolve(this.afterValidate.call(this.$vnode.context, data))
            : resolve()
        )
      )
      .then(
        this.$emit.bind(this, 'submit', data, e),
        err => {
          this.$emit('invalid', err)
        }
      )
    },

    bindInteractiveValidators (validators) {
      validators && validators.forEach(validator => {
        let triggers = splitToArray(validator.triggers)
        let fields = splitToArray(validator.fields)
        let justified = fields.map((field, index) => ({field, trigger: triggers[index]}))
        let targets = fields.map(name => find(this.items, item => name === item.input.name))
        justified.forEach(({field, trigger}) => {
          // TODO: dirty
          assign(this.handlersStore, {
            [`${fields.join(',')}-${field}-${trigger}`]: e => {
              Vue.nextTick(() => validator.handler(
                zipObject(fields, targets.map(target => target.input[getCustomModelProp(target.input)])),
                zipObject(fields, targets),
                this.$vnode.context
              ))
            }
          })
          find(targets, target => target.input.name === field).input.$on(trigger, this.handlersStore[`${fields.join(',')}-${field}-${trigger}`])
        })
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
      let items = this.items || []
      let validators = this.validators || []
      if (Array.isArray(names) && names.length) {
        items = items.filter(item => includes(names, item.input.name))
        validators = validators.filter(validator => includes(names, validator.fields))
      }

      return promiseAllSettled(
        [
          ...items.map(item => {
            let itemRes = item.validate()
            // utils/Validator 是同步的，检查一下不是 true 就好，返回其他的都当成错误信息
            if (!isBoolean(itemRes) || !itemRes) {
              // 没有name的无法描述，invalid的时候就不抛了
              return Promise.reject(item.input.name ? { [item.input.name]: itemRes } : undefined)
            }
            return Promise.resolve(true)
          }),

          ...validators.map(validator => {
            let fn = validator.handler
            if (isFunction(fn) && validator.fields) {
              let fields = splitToArray(validator.fields)
              let targets = fields.map(name => find(items, item => name === item.input.name))
              let itemRes = fn.apply(
                this,
                [
                  zipObject(fields, targets.map(item => {
                    let input = item.input
                    let prop = getCustomModelProp(input)
                    return input[prop]
                  })),
                  zipObject(fields, targets),
                  this.$vnode.context
                ]
              )
              // 异步校验交给返回的 Promise，对于同步校验，true 代表校验通过
              if (itemRes && isFunction(itemRes.then)) {
                return itemRes.then(
                  val => ({ val }),
                  err => {
                    return Promise.reject({ [fields]: err })
                  }
                )
              }
              return itemRes ? Promise.resolve(itemRes) : Promise.reject({ [fields]: itemRes })
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
    this.interactiveValidators && this.bindInteractiveValidators(this.interactiveValidators)
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
