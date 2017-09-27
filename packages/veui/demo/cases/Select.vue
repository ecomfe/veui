<template>
  <article>
    <h1><code>&lt;veui-select&gt;</code></h1>
    <section>
      <h2>默认样式：</h2>
      <veui-select v-bind="attrs" v-model="defaultValue1" placeholder="全部" clearable></veui-select>
    </section>
    <section>
      <h2>显示已选图标样式：</h2>
      <veui-select v-bind="attrs" ui="checkmark" v-model="defaultValue2"></veui-select>
    </section>
    <section>
      <h2>禁用样式：</h2>
      <veui-select v-bind="attrs" v-model="defaultValue1" disabled></veui-select>
    </section>
    <section>
      <h2>Slot 样式：</h2>
      <veui-select v-bind="attrs" v-model="defaultValue3" ui="alt">
        <template slot="option" scope="props">
          {{ props.label }}
        </template>
      </veui-select>
    </section>
    <section>
      <h2>Slot 样式 2：</h2>
      <veui-select v-bind="attrs" v-model="defaultValue4">
        <template slot="option" scope="props">
          <span class="veui-option-label-text">{{ props.label }}</span>
          <icon name="eye"></icon>
        </template>
      </veui-select>
    </section>
    <section>
      <h2>Slot 样式 3：</h2>
      <veui-select v-bind="attrs" v-model="defaultValue1">
        <template slot="option" scope="props">
          <radio :checked="props.selected">{{ props.label }}</radio>
        </template>
      </veui-select>
    </section>
    <section style="margin-top:500px;">
      <h2>默认分组样式：</h2>
      <veui-select v-bind="optGroupAttrs" v-model="defaultValue5"></veui-select>
    </section>
    <section>
      <h2>显示已选图标分组样式：</h2>
      <veui-select v-bind="optGroupAttrs" ui="checkmark" v-model="defaultValue6"></veui-select>
    </section>
    <section>
      <h2>Slot 分组样式 1：</h2>
      <veui-select v-bind="optGroupAttrs" v-model="defaultValue7">
        <template slot="option" scope="props">
          {{ props.label }}
        </template>
      </veui-select>
    </section>
    <section>
      <h2>Slot 分组样式 2：</h2>
      <veui-select v-bind="optGroupAttrs" v-model="defaultValue8" :overlay-options="{
          position: 'bottom right'
        }">
        <template slot="option" scope="props">
          <span class="veui-option-label-text">{{ props.label }}</span>
          <icon name="gift"></icon>
        </template>
      </veui-select>
    </section>
    <section>
      <h2>分隔线样式：</h2>
      <veui-select v-bind="optGroupAttrs" :options="groupedOpts" v-model="defaultValue9"></veui-select>
    </section>
  </article>
</template>

<script>
import bus from '../bus'
import { Icon, Select, Option, Radio } from 'veui'
import type from 'veui/managers/type'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/gift'

export default {
  name: 'select-demo',
  components: {
    'veui-select': Select,
    'veui-option': Option,
    'radio': Radio,
    'icon': Icon
  },
  data () {
    return {
      disabled: true,
      selected: true,
      icon: true,
      defaultValue1: null,
      defaultValue2: null,
      defaultValue3: null,
      defaultValue4: null,
      defaultValue5: null,
      defaultValue6: null,
      defaultValue7: null,
      defaultValue8: '1-1',
      defaultValue9: null,
      attrs: {
        name: 'age',
        readonly: false,
        disabled: false,
        selecticon: false,
        options: [
          {
            label: '下拉选项1',
            value: 1
          },
          {
            label: '下拉选项下拉选项下拉选项22',
            value: 2
          },
          {
            label: '下拉选项3',
            value: 3
          },
          {
            label: '下拉选项4',
            value: 4
          }
        ]
      },
      optGroupAttrs: {
        ui: 'aux',
        name: 'name',
        readonly: false,
        disabled: false,
        selecticon: false,
        options: [
          {
            label: '下拉选项1',
            options: [
              {
                label: '子选项1',
                value: '1-1'
              },
              {
                label: '子选项子选项子选项子选项子选项子选项2',
                value: '1-2'
              },
              {
                label: '子选项3',
                value: '1-3'
              }
            ]
          },
          {
            label: '下拉选项下拉选项下拉选项2',
            options: [
              {
                label: '子选项1',
                value: '2-1'
              },
              {
                label: '子选项2',
                value: '2-2'
              },
              {
                label: '子选项子选项子选项子选项子选项子选项3',
                value: '2-3'
              }
            ]
          },
          {
            label: '下拉选项3',
            options: [
              {
                label: '子选项1',
                value: '3-1'
              },
              {
                label: '子选项2',
                value: '3-2'
              },
              {
                label: '子选项子选项子选项子选项子选项子选项3',
                value: '3-3'
              }
            ]
          },
          {
            label: '下拉选项4',
            options: [
              {
                label: '子选项子选项子选项子选项子选项子选项1',
                value: '4-1'
              },
              {
                label: '子选项2',
                value: '4-2'
              },
              {
                label: '子选项3',
                value: '4-3'
              }
            ]
          }
        ]
      }
    }
  },
  computed: {
    groupedOpts () {
      return type.clone(this.optGroupAttrs.options).map(group => {
        delete group.label
        return group
      }).reduce((acc, cur) => {
        acc.push(cur)
        return acc
      }, [])
    }
  },
  mounted () {
    this.$children.forEach(child => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
  },
  methods: {
    change (value) {
      // alert('您选中的下拉选项值是' + value)
    }
  }
}
</script>

<style lang="less" scoped>
.veui-option-label {
  &-text,
  .veui-icon {
    vertical-align: middle;
  }

  .veui-icon {
    margin-left: 5px;
  }
}
</style>
