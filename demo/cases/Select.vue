<template>
  <article>
    <h1><code>&lt;veui-select&gt;</code></h1>
    <p>
      <span>默认样式：</span>
      <veui-select v-bind="attrs" v-model="defaultValue1"></veui-select>
      <span>选择有ICON样式：</span>
      <veui-select v-bind="attrs" :optionicon="icon" v-model="defaultValue2"></veui-select>
    </p>
    <p>
      <span>slot样式：</span>
      <veui-select v-bind="attrs" v-model="defaultValue3">
        <template slot="select-target" scope="props">
          <span>{{ props.label }}</span>
        </template>
      </veui-select>
      <span>slot样式2：</span>
      <veui-select v-bind="attrs" v-model="defaultValue4">
        <template slot="select-option" scope="props">
          <span class="veui-option-label">{{ props.label }}</span>
          <icon name="eye"></icon>
        </template>
      </veui-select>
    </p>
    <p style="margin-top:500px;">
      <span>默认分组样式：</span>
      <veui-select v-bind="optGroupAttrs" v-model="defaultValue5"></veui-select>
      <span>有选择ICON分组样式：</span>
      <veui-select v-bind="optGroupAttrs" :optionicon="icon" v-model="defaultValue6"></veui-select>
    </p>
    <p>
      <span>slot样式1：</span>
      <veui-select v-bind="optGroupAttrs" v-model="defaultValue7">
        <template slot="select-target" scope="props">
          <span>{{ props.label }}</span>
        </template>
      </veui-select>
      <span>slot样式2：</span>
      <veui-select v-bind="optGroupAttrs" v-model="defaultValue8">
        <template slot="select-option" scope="props">
          <span class="veui-option-label">{{ props.label }}</span>
          <icon name="gift"></icon>
        </template>
      </veui-select>
    </p>
  </article>
</template>

<script>
import Icon from '@/components/Icon'
import bus from '../bus'
import Select from '@/components/Select'
import Option from '@/components/Select/Option'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/gift'

export default {
  name: 'select',
  components: {
    'veui-select': Select,
    'veui-option': Option,
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
      attrs: {
        ui: 'aux',
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
p {
  margin: 0 0 30px 0;
  height: 36px;
  clear: both;
  > span {
    width: 80px;
    float: left;
    line-height: 26px;
    margin: 0 10px;
  }
}
.veui-select {
  float: left;
  margin-right: 10px;
}
.veui-option {
  width: 100px;
}
</style>
