<template>
<label class="veui-checkbox" :ui="ui">
  <input ref="box" type="checkbox" v-bind="attrs" @change="handleChange($event.target.checked)">
  <span class="veui-checkbox-box">
    <icon v-if="checked || localIndeterminate" :name="`${localIndeterminate ? 'minus' : 'check'}-thick`"></icon>
  </span>
  <span><slot></slot></span>
</label>
</template>

<script>
import Icon from './Icon'
import '../icons'
import { input } from '../mixins'
import { pick } from 'lodash'
import { patchIndeterminate } from '../utils/dom'

export default {
  name: 'veui-checkbox',
  components: {
    Icon
  },
  mixins: [input],
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    ui: String,
    trueValue: {
      type: null,
      default: true
    },
    falseValue: {
      type: null,
      default: false
    },
    checked: null,
    indeterminate: Boolean
  },
  data () {
    return {
      localIndeterminate: this.indeterminate
    }
  },
  computed: {
    attrs () {
      let attrs = pick(this.$props, 'checked')
      attrs.name = this.realName
      attrs.disabled = this.realDisabled || this.realReadonly
      return attrs
    }
  },
  methods: {
    handleChange (checked) {
      this.localIndeterminate = false
      this.$emit('update:indeterminate', false)
      this.$emit('change', checked ? this.trueValue : this.falseValue)
    },
    activate () {
      this.handleChange(!this.checked)
    }
  },
  watch: {
    indeterminate (value) {
      this.localIndeterminate = value
      this.$refs.box.indeterminate = value
    }
  },
  mounted () {
    let box = this.$refs.box
    box.indeterminate = this.localIndeterminate
    patchIndeterminate(box)
  }
}
</script>
