<template>
  <div class="veui-overlay-list">
    <veui-alert-box v-for="(alert, index) in realAlerts"
      :key="index"
      :open="alert.open"
      :ui="alert.type"
      @ok="closeAlert(alert)">
      <template slot="title">
        <slot name="alertTitle" :item="alert">{{ alert.title || '警告' }}</slot>
      </template>
      <slot name="alertContent" :item="alert">{{ alert.content || '内容'}}</slot>
    </veui-alert-box>

    <veui-confirm-box v-for="(confirm, index) in realConfirms"
      :key="index"
      :open="confirm.open"
      @ok="handleConfirm(confirm, 'ok')"
      @cancel="handleConfirm(confirm, 'cancel')">
      <template slot="title">
        <slot name="confirmTitle" :item="confirm">{{ confirm.title || '确认' }}</slot>
      </template>
      <slot name="confirmContent" :item="confirm">{{ confirm.content || '内容'}}</slot>
    </veui-confirm-box>

    <veui-toast-list ref="toastComponent"></veui-toast-list>

    <veui-prompt-box v-for="(prompt, index) in realPrompts"
      :key="index"
      :open="prompt.open"
      @ok="handlePrompt(prompt, 'ok')"
      @cancel="handlePrompt(prompt, 'cancel')"
      :title="prompt.title"
      :content="prompt.content"
      v-model="prompt.value">
    </veui-prompt-box>
  </div>
</template>

<script>
import AlertBox from './AlertBox'
import ConfirmBox from './ConfirmBox'
import PromptBox from './PromptBox'
import ToastList from './ToastList'
import { cloneDeep, isFunction, remove, extend } from 'lodash'

export default {
  name: 'veui-overlay-list',
  components: {
    'veui-alert-box': AlertBox,
    'veui-confirm-box': ConfirmBox,
    'veui-prompt-box': PromptBox,
    'veui-toast-list': ToastList
  },
  props: {
    alerts: Array,
    confirms: Array,
    toasts: Array,
    prompts: Array
  },
  data () {
    return {
      realAlerts: this.prepend(this.alerts, []),
      realConfirms: this.prepend(this.confirms, []),
      realPrompts: this.prependPrompts(this.prompts, [])
    }
  },
  watch: {
    alerts (v) {
      this.prepend(v, this.realAlerts)
    },
    confirms (v) {
      this.prepend(v, this.realConfirms)
    },
    toasts (v) {
      if (v) {
        v.forEach(item => {
          const toast = extend({}, item, { ui: item.type })
          this.$refs.toastComponent.add(toast)
        })
      }
    },
    prompts (v) {
      this.prependPrompts(v, this.realPrompts)
    }
  },
  methods: {
    prepend (list, targetList) {
      const realList = cloneDeep(list || []).map(item => extend(item, { open: true }))
      targetList.splice(0, 0, ...realList)
      return targetList
    },
    prependPrompts (list, targetList) {
      const realList = cloneDeep(list || []).map(item => extend(item, { open: true, value: '' }))
      targetList.splice(0, 0, ...realList)
      return targetList
    },
    closeAlert (alert) {
      if (isFunction(alert.ok)) {
        alert.ok()
      }
      this.close(alert, this.realAlerts)
    },
    handleConfirm (confirm, type) {
      const fn = confirm[type]
      if (isFunction(fn)) {
        fn()
      }
      this.close(confirm, this.realConfirms)
    },
    handlePrompt (prompt, type) {
      const fn = prompt[type]
      if (isFunction(fn)) {
        fn(prompt.value)
      }
      this.close(prompt, this.realPrompts)
    },
    close (item, list) {
      list[list.length - 1].open = false
      remove(list, i => i === item)
    },

    popup (type, options) {
      switch (type) {
        case 'alert':
          this.prepend([options], this.realAlerts)
          break
        case 'confirm':
          this.prepend([options], this.realConfirms)
          break
        case 'toast':
          this.$refs.toastComponent.add(options)
          break
        case 'prompt':
          this.prependPrompts([options], this.realPrompts)
          break
      }
    }
  }
}
</script>

<style lang="less">
</style>
