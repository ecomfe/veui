<template>
<article>
  <h1><code>&lt;veui-dropdown&gt;</code></h1>
  <div>
    <h3>基础下拉菜单</h3>
    <div>
      <h4>primary</h4>
      <veui-dropdown
        ui="primary xs"
        label="操作"
        split
        :options="options"
      />
      <veui-dropdown
        ui="primary s"
        label="操作"
        split
        :options="options"
      />
      <veui-dropdown
        ui="primary m"
        label="操作"
        split
        :options="options"
      />
      <veui-dropdown
        ui="primary l"
        label="操作"
        split
        :options="options"
      />
      <veui-dropdown
        ui="primary"
        label="操作"
        split
        disabled
        :options="options"
      />
    </div>
    <div>
      <h4>normal</h4>
      <veui-dropdown
        ui="xs"
        label="操作"
        split
        :options="options"
      />
      <veui-dropdown
        ui="s"
        label="操作"
        split
        :options="options"
      />
      <veui-dropdown
        ui="m"
        label="操作"
        split
        :options="options"
      />
      <veui-dropdown
        ui="l"
        label="操作"
        split
        :options="options"
      />
      <veui-dropdown
        label="操作"
        split
        disabled
        :options="options"
      />
    </div>
    <div>
      <h4>disabled</h4>
      <div>
        <veui-dropdown
          ui="s"
          label="操作操作操作操作操作操作"
          trigger="hover"
          :options="options"
        />
        <veui-dropdown
          ui="s"
          label="操作操作操作操作操作操作"
          disabled
          :options="options"
        />
        <veui-dropdown
          split
          ui="s"
          label="操作操作操作操作操作操作"
          trigger="hover"
          :options="options"
        />
        <veui-dropdown
          split
          disabled
          ui="s"
          label="操作操作操作操作操作操作"
          trigger="hover"
          :options="options"
        />
      </div>
    </div>
    <div>
      <h4>triggers</h4>
      <div>
        <veui-dropdown
          ui="xs"
          label="操作"
          split
          :options="options"
        />
        <veui-dropdown
          ui="xs"
          split
          label="操作操作操作操作操作操作"
          trigger="hover"
          :options="options"
        >
          <template
            slot="option-label"
            slot-scope="{ label }"
          >
            👉 {{ label }}
          </template>
        </veui-dropdown>
      </div>
    </div>
  </div>
  <div>
    <h3>分组下拉框菜单</h3>
    <div>
      <veui-dropdown
        ui="xs"
        split
        label="汽车类型"
        :options="multiLevelOptions"
      />
      <veui-dropdown
        ui="s"
        split
        label="汽车类型"
        :options="multiLevelOptions"
      />
      <veui-dropdown
        ui="m"
        split
        label="汽车类型"
        :options="multiLevelOptions"
      />
      <veui-dropdown
        ui="l"
        split
        label="汽车类型"
        :options="multiLevelOptions"
      />
    </div>
    <div>
      <h4>unlabeled group</h4>
      <veui-dropdown
        ui="xs"
        split
        label="汽车类型"
        :options="multiLevelUnlabeledOptions"
      />
      <veui-dropdown
        ui="s"
        split
        label="汽车类型"
        :options="multiLevelUnlabeledOptions"
      />
      <veui-dropdown
        ui="m"
        split
        label="汽车类型"
        :options="multiLevelUnlabeledOptions"
      />
      <veui-dropdown
        ui="l"
        split
        label="汽车类型"
        :options="multiLevelUnlabeledOptions"
      />
    </div>
  </div>
  <div>
    <h3>多层级下拉框菜单</h3>
    <div>
      <veui-dropdown
        ui="s"
        split
        label="汽车类型"
        trigger="hover"
        :options="multiLevelUnlabeledOptions"
      />
      <veui-dropdown
        ui="s"
        split
        label="汽车类型"
        trigger="click"
        :options="multiLevelUnlabeledOptions"
      />
    </div>
  </div>
  <div>
    <h3>文字链下拉框菜单</h3>
    <div>
      <veui-dropdown
        ui="text"
        label="操作"
        disabled
        :options="options"
      />
      <veui-dropdown
        ui="text m"
        label="操作"
      >
        <veui-option-group label="提交">
          <veui-option
            label="保存"
            @click="log('save')"
          />
          <veui-option
            value="publish"
            label="发布"
          />
        </veui-option-group>
        <veui-option-group label="操作">
          <veui-option
            value="undo"
            label="撤销"
          />
          <veui-option
            value="redo"
            label="重复"
          />
        </veui-option-group>
      </veui-dropdown>
    </div>
  </div>
  <div>
    <h3>含搜索的下拉框菜单</h3>
    待补充
  </div>
</article>
</template>

<script>
import bus from '../bus'
import { Dropdown, Option, OptionGroup } from 'veui'

export default {
  name: 'dropdown-demo',
  components: {
    'veui-dropdown': Dropdown,
    'veui-option-group': OptionGroup,
    'veui-option': Option
  },
  data () {
    return {
      options: [
        {
          label: '新建新建新建新建新建新建新建',
          value: 'create'
        },
        {
          label: '编辑',
          value: 'edit',
          disabled: true
        },
        {
          label: '删除',
          value: 'remove'
        },
        {
          label: '编辑',
          value: 'edit',
          disabled: true
        },
        {
          label: '删除',
          value: 'remove'
        },
        {
          label: '编辑',
          value: 'edit',
          disabled: true
        },
        {
          label: '删除',
          value: 'remove'
        },
        {
          label: '编辑',
          value: 'edit',
          disabled: true
        },
        {
          label: '删除',
          value: 'remove'
        },
        {
          label: '编辑',
          value: 'edit',
          disabled: true
        },
        {
          label: '删除',
          value: 'remove'
        }
      ],
      multiLevelOptions: [
        {
          label: '丰田',
          options: [
            {
              label: '凯美瑞',
              value: 'camry'
            },
            {
              label: '亚洲龙',
              value: 'avalon'
            }
          ]
        },
        {
          label: '大众',
          options: [
            {
              label: '迈腾',
              value: 'magotan'
            },
            {
              label: '高尔夫',
              value: 'golf'
            }
          ]
        }
      ],
      multiLevelUnlabeledOptions: [
        {
          label: '丰田',
          position: 'popup',
          options: [
            {
              label: '凯美瑞',
              value: 'camry'
            },
            {
              label: '亚洲龙',
              value: 'avalon'
            }
          ]
        },
        {
          label: '大众',
          position: 'popup',
          options: [
            {
              label: '迈腾',
              value: 'magotan'
            },
            {
              label: '高尔夫',
              value: 'golf'
            }
          ]
        }
      ]
    }
  },
  mounted () {
    this.$children.forEach(child => {
      child.$on('click', val => {
        bus.$emit('log', val)
      })
    })
  },
  methods: {
    log (val) {
      bus.$emit('log', val)
    }
  }
}
</script>

<style lang="less" scoped>
p {
  margin: 10px 0;
}

.veui-dropdown {
  margin-right: 20px;
}
</style>
