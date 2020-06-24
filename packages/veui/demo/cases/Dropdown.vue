<template>
<article>
  <h1>
    <code>&lt;veui-dropdown&gt;</code>
  </h1>
  <section>
    <h3>基础下拉菜单</h3>
    <div>
      <h4>primary</h4>
      <veui-dropdown
        ui="primary xs"
        label="操作"
        :options="options"
      />
      <veui-dropdown
        ui="primary s"
        label="操作"
        split
        :options="options"
      />
      <veui-dropdown
        ui="primary"
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
      <h4>default</h4>
      <veui-dropdown
        ui="xs"
        label="操作"
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
      <h4>normal</h4>
      <veui-dropdown
        ui="normal xs"
        label="操作"
        :options="options"
      />
      <veui-dropdown
        ui="normal s"
        label="操作"
        split
        :options="options"
      />
      <veui-dropdown
        ui="normal m"
        label="操作"
        split
        :options="options"
      />
      <veui-dropdown
        ui="normal l"
        label="操作"
        split
        :options="options"
      />
      <veui-dropdown
        ui="normal"
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
          >👉 {{ label }}</template>
        </veui-dropdown>
      </div>
    </div>
  </section>
  <section>
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
  </section>
  <section>
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
  </section>
  <section>
    <h3>文字链下拉框菜单</h3>
    <div>
      <veui-dropdown
        ui="text"
        label="操作"
        disabled
        :options="options"
      />
      <veui-dropdown
        ui="text xs"
        label="操作"
      >
        <veui-option-group
          label="提交"
          ui="xs"
        >
          <veui-option @click="log('save')">💾保存</veui-option>
          <veui-option value="publish">✅发布</veui-option>
        </veui-option-group>
        <veui-option-group
          label="操作"
          ui="xs"
        >
          <veui-option value="undo">⬅️撤消</veui-option>
          <veui-option value="redo">➡️重复</veui-option>
        </veui-option-group>
      </veui-dropdown>
    </div>
  </section>
  <section>
    <h3>含搜索的下拉框菜单</h3>
    <veui-dropdown
      ui="text"
      label="操作"
      placeholder="请搜索"
      searchable
      :options="options"
    />
  </section>
  <section>
    <h3>自定义插槽</h3>
    <div>
      <h4>自定义 #trigger</h4>
      <veui-dropdown trigger="hover">
        <veui-option value="undo">⬅️撤消</veui-option>
        <veui-option value="redo">➡️重复</veui-option>
        <template #trigger="{ handlers, props }">
          <veui-button
            ui="icon"
            v-bind="props"
            v-on="handlers"
          >
            <veui-icon name="ellipsis"/>
          </veui-button>
        </template>
      </veui-dropdown>
    </div>
    <div>
      <h4>全部自定义</h4>
      <veui-dropdown>
        <template #default="{ close }">
          <div class="filter">
            筛选：
            <veui-input
              ui="xs"
              class="query"
            />
            <veui-button
              ui="xs primary"
              @click="close"
            >OK</veui-button>
          </div>
        </template>
        <template #trigger="{ handlers, props }">
          <veui-button
            ui="strong xs"
            v-bind="props"
            v-on="handlers"
          >下拉</veui-button>
        </template>
      </veui-dropdown>
    </div>
  </section>
</article>
</template>

<script>
import bus from '../bus'
import { Dropdown, Option, OptionGroup, Button, Icon, Input } from 'veui'
import 'veui-theme-dls-icons/ellipsis'

export default {
  name: 'dropdown-demo',
  components: {
    'veui-dropdown': Dropdown,
    'veui-option-group': OptionGroup,
    'veui-option': Option,
    'veui-button': Button,
    'veui-icon': Icon,
    'veui-input': Input
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
article {
  padding-bottom: 120px;
}

section {
  margin-bottom: 30px;
}

p {
  margin: 10px 0;
}

.veui-dropdown {
  margin-right: 20px;
}

.filter {
  padding: 8px 12px;
  font-size: 12px;
}

.query {
  width: 120px;
  margin-right: 8px;
}
</style>
