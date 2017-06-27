<template>
  <div class="veui-overlay-list">
    <veui-alert-box v-for="(alert, index) in realAlerts"
      :key="index"
      :open="alert.open"
      :ui="alert.type"
      @ok="closeAlert()">
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
  </div>
</template>

<script>
import AlertBox from './AlertBox'
import ConfirmBox from './ConfirmBox'
import ToastList from './ToastList'
import { cloneDeep, isFunction, remove, extend } from 'lodash'

export default {
  name: 'veui-overlay-list',
  components: {
    'veui-alert-box': AlertBox,
    'veui-confirm-box': ConfirmBox,
    'veui-toast-list': ToastList
  },
  props: {
    alerts: Array,
    confirms: Array,
    toasts: Array
  },
  data () {
    return {
      realAlerts: this.prepend(this.alerts, []),
      realConfirms: this.prepend(this.confirms, [])
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
    }
  },
  methods: {
    prepend (list, targetList) {
      const realList = cloneDeep(list || []).map(item => extend(item, { open: true }))
      targetList.splice(0, 0, ...realList)
      return targetList
    },
    closeAlert () {
      this.realAlerts[this.realAlerts.length - 1].open = false
      this.realAlerts.pop()
    },
    handleConfirm (confirm, type) {
      const fn = confirm[type]
      if (isFunction(fn)) {
        fn({
          close: () => this.closeConfirm(confirm)
        })
      } else {
        this.closeConfirm(confirm)
      }
    },
    closeConfirm (confirm) {
      this.realConfirms[this.realConfirms.length - 1].open = false
      remove(this.realConfirms, item => item === confirm)
    }
  }
}
</script>

<style lang="less">
</style>
