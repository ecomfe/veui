## 2.13.6 (2023-04-08)

### 💡 主要变更

- [+] `Table` 组件新增的横向滚动条吸底功能。<!-- #Table -->

### 🐞 问题修复

- [^] `Autocomplete` 组件在严格模式下，在失焦时也会根据限制条件修正数据了。<!-- #Autocomplete -->
- [^] 修正了 `ButtonGroup` / `RadioButtonGroup` / `CheckButtonGroup` 组件各按钮的层级，已在不同状态与交互下正确显示。<!-- #ButtonGroup #RadioButtonGroup #CheckButtonGroup -->

## 2.13.5 (2023-03-31)

### 💡 主要变更

- [^] `Input` / `Textarea` / `SearchBox` 组件的 `strict` 属性支持通过 `{ maxlength?: boolean }` 类型配置了。<!-- #Input #Textarea #SearchBox -->
- [^] `TagInput` 组件新增 `strict` 属性，支持分别配置严格限制最大标签个数和最大单个标签长度。<!-- #TagInput -->
- [^] `Autocomplete` 组件的 `strict` 属性支持通过 `{ maxlength?: boolean, select?: boolean }` 类型分别配置严格限制文本最大长度和限制填写内容必须完全匹配数据源中某项了。<!-- #Autocomplete -->

### 🐞 问题修复

- [^] 修复 `ConfigProvider` 组件在进行 `ui` 相关配置时，配置意外地对全局生效的问题。<!-- #ConfigProvider -->
- [^] `help-position` 非 `side` 的 `Field` 组件的内容部分容器现在将自动撑满整行宽度。<!-- #Field -->

## 2.13.4 (2023-03-28)

### 💡 主要变更

- [+] `ConfigProvider` 组件现在可以设置组件的 `ui` 相关配置如 `icons` 了。<!-- #ConfigProvider -->

  #### 使用方法

  ```html
  <veui-config-provider :value="config">
    <veui-date-picker/>
    <veui-dialog/>
  </veui-config-provider>
  ```

  ```js
  // ...
  import { IconCalendarSolid } from 'dls-icons-vue'

  export default {
    // ...
    data () {
      return {
        config: {
          'datepicker.icons.calendar': IconCalendarSolid, // 替换日期选择器的日历图标
          'dialog.parts.cancel': 'ghost' // 将对话框的取消按钮设置为 `ghost` 类型
        }
      }
    },
    // ...
  }
  ```

### 🐞 问题修复

- [^] 修复 `TagInput` 组件在开启 `allow-duplicate` 时，删除标签会删除所有与其值相同的标签的问题。<!-- #TagInput -->

## 2.13.3 (2023-03-27)

### 🐞 问题修复

- [^] 修复 `TagInput` 组件在处于输入法状态且无已输入文本时按退格键会删除最后一个标签的问题。<!-- #TagInput -->
- [^] 修复 `Select` / `Cascader` / `TagInput` 组件在文本输入处于输入法状态时，候选文字可能被截断无法完整显示的问题。<!-- #Select #Cascader #TagInput -->

## 2.13.2 (2023-03-23)

### 🐞 问题修复

- [^] 修复 `Tag` 组件在同时开启 `selectable` 与 `removable` 时，标签嵌套可能不正确导致服务端渲染与客户端渲染不一致的问题。<!-- #Tag -->
- [^] 修复 `TagInput` 组件在开启 `allow-duplicate` 时，按退格键删除时会移除所有与最后一个标签相同值的标签的问题。<!-- #TagInput -->

## 2.13.1 (2023-03-23)

### 💡 主要变更

- [^] 优化了 `Select` / `Cascader` 组件在多选 + 可搜索状态下及 `TagInput` 组件的文字输入区域自动宽度计算逻辑。<!-- #Select #Cascader #TagInput -->

### 🐞 问题修复

- [^] 修复 `TagInput` 组件在非受控模式下，文字输入内容不可见的问题。<!-- #TagInput -->

## 2.13.0 "☘️ Shamrock" (2023-03-23)

### 🐞 问题修复

- [^] 修复 `Button` 组件的 `strong text` 和 `strong icon` 样式下加载态的背景色。<!-- #Button -->
- [^] 修复 `Autocomplete` 组件没有正确设置默认宽度的问题。<!-- #Autocomplete -->
- [^] 修复 `Select` / `Cascader` 组件在只读状态下依然可以通过键盘进行展开、修改等操作的问题。<!-- #Select #Cascader -->
- [^] 优化了 `Tag` 组件的文字截断样式。<!-- #Tag -->
- [^] 修复 `Select` / `Cascader` 在多选时超长选项可能溢出容器的样式问题。<!-- #Select #Cascader -->

### 🧪 实验性功能

- [+] 新增 `TagInput` 组件，支持自由输入多段文本形成标签列表。<!-- # TagInput -->

## 2.12.2 (2023-03-16)

### ⚠️ 非兼容性变更

- [^] 当前未公开的 API `useUi` 和 `useInput` 均被调整为函数类型。<!-- #useUi #useInput -->

### 🐞 问题修复

- [^] 修复 `Button` 组件的 `strong` 样式无法正常显示的问题。<!-- #Button -->
- [^] 修复尺寸不同的多级嵌套 `Drawer` 组件可能导致缩进不一致的问题。<!-- #Drawer -->

### 🧪 实验性功能

- [+] 为 `Drawer` 组件新增了实验性的 CSS 自定义属性 `--dls-drawer-width` 来更加精细地指定宽度。<!-- #Drawer -->

## 2.12.1 (2023-02-13)

### 🐞 问题修复

- [^] 修复嵌套的 `Stack` 组件间距处理不正确的问题。<!-- #Stack -->
- [^] 修复 `veui-theme-dls` 的预编译输出遗漏 `Stack` 组件样式的问题。<!-- #veui-theme-dls #Stack -->

## 2.12.0 "🌱 Seedling" (2023-02-13)

### 💡 主要变更

- [+] 为 `alert` / `confirm` / `prompt` 插件新增 `okLabel` / `cancelLabel` 配置以允许自定义按钮文案。<!-- #$alert #$confirm #$prompt -->

### 🐞 问题修复

- [^] 修复了 `prompt` 插件值无法正常同步的问题。<!-- #$prompt -->
- [^] 修正了 `Radio` / `Checkbox` 组件可能影响内部插槽内 `<input>` 元素样式的问题。<!-- #Radio #Checkbox -->

### 🧪 实验性功能

- [+] 新增 `Stack` 组件。<!-- #Stack -->

## 2.11.2 (2023-01-11)

### 🐞 问题修复

- [^] 修复了 `Table` 在极端场景下，切换作用域插槽实现时，渲染更新不及时的问题。<!-- #Table #Column -->
- [^] 在极端场景下（`Column` 组件默认插槽内容从非嵌套列切换到嵌套列时）可能出现较多多余渲染且命令行提示重复 `key` 错误的问题，现在可以通过为最末层 `Column` 组件设置 `group` prop 来绕过。<!-- #Table #Column -->

## 2.11.1 (2022-12-27)

### 🐞 问题修复

- [^] 修复 `Field` 组件在校验中情况下出现高度抖动的问题。<!-- #Field -->
- [^] 修复 `drag` 指令没有正确处理 `handle` 属性是 CSS 选择器的场景。<!-- #v-drag -->
- [^] 修复 `Cascader` 组件在不可搜索的情况下选中值太长而出现超出的问题。<!-- #Cascader -->

### 🧪 实验性功能

- [+] 为 `Dialog` 组件新增了实验性的 CSS 自定义属性 `--dls-dialog-width` 和 `--dls-dialog-content-width` 来更加精细地指定宽度。<!-- #Dialog -->

## 2.11.0 "👻 Ghost" (2022-12-13)

### 💡 主要变更

- [^] `Button` 组件新增幽灵按钮变体 `ghost` / `ghost strong` / `ghost aux` / `ghost reverse`。<!-- Button -->

### 🐞 问题修复

- [^] `Tab` 组件的 `label` 插槽现在可以访问 `active` 参数了。<!-- #Tabs #Tab -->
- [^] 修正了 `Table` 组件在未设置 `scroll` 和 `scroll.x` 时，在有横向滚动时没有同步滚动表头的问题。<!-- #Table -->
- [^] 修正了 `Table` 组件横向滚动在没有固定列时边缘阴影未正确展示的问题。<!-- #Table -->

## 2.10.4 (2022-12-06)

### 🐞 问题修复

- [^] `Tabs` 组件的 `scrollTabIntoView` 方法参数从 `tabId` 修正为 `tabName`。<!-- #Tabs -->

## 2.10.3 (2022-12-01)

### 💡 主要变更

- [+] `Tabs` 组件新增 `scrollTabIntoView` 方法，用于将指定的标签页滚动到组件视口。<!-- #Tabs -->
- [^] `Tabs` 组件会在渲染 `panel` 插槽时自动加上 `key`, 避免出现切换时插槽内组件复用。<!-- #Tabs -->
- [+] 为 `NumberInput`、`DatePicker` 和 `TimePicker` 组件自动增加输入掩码供功能（暂时在 Firefox 下无效）。<!-- #NumberInput #DatePicker #TimePicker -->

### 🐞 问题修复

- [^] 修正 `Textarea` 组件在禁用状态下的文字颜色。<!-- #Textarea -->

## 2.10.2 (2022-11-09)

### ⚠️ 非兼容性变更

- [^] `Tabs` 组件的 `sort` 事件参数从整个 `items` 列表，调整为 `(fromIndex: number, toIndex: number)`。<!-- #Tabs -->

## 2.10.1 (2022-11-08)

### 💡 主要变更

- [+] `Tabs` 组件新增 `sortable` 属性和 `sort` 事件，允许对选项卡进行拖拽排序。<!-- #Tabs -->
- [+] `Tabs` 组件新增 `items` 属性，允许通过数据源的方式定义选项卡内容。<!-- #Tabs -->
- [+] `v-drag` 指令新增 `exclude` 选项，用于指定不触发拖拽回调的区域。<!-- #v-drag -->

## 2.10.0 "🍪 Cookie" (2022-10-14)

### 💡 主要变更

- [^] 调整了全局色板的生成逻辑，使浅背景色更容易辨识。<!-- #veui-theme-dls -->
- [^] 升级了 `Steps` 组件的默认视觉风格。<!-- #Steps -->
- [+] `Steps` 组件新增 `ui` 样式 `dot`，提供圆点样式步骤。<!-- #Steps -->
- [+] `Steps` 组件新增 `stateless` 属性，支持纯展示型无状态步骤。<!-- #Steps -->
- [+] `Tabs` 组件新增 `ui` 样式 `borderless`，支持默认样式下隐藏底部分割线。<!-- #Tabs -->

## 2.9.0 "🍄 Mushroom" (2022-09-13)

### 💡 主要变更

- [+] 新增 `LoadingBar` 组件，用于使用进度条来展示加载中的状态。<!-- #LoadingBar -->
- [+] `Table` 组件新增 `loading-options` 属性和全局配置项 `table.loadingOptions`，用于指定加载中状态的选项配置。<!-- #Table -->
- [^] `Table` 组件默认使用进度条型加载态，以代替原来的转动提示。可以通过设置 `loadingOptions.type` 为 `spinner` 切换回之前版本的加载态。在进度条模式下，如果加载过程已经正确处理了数据请求的竞态，可以设置 `loadingOptions.modal` 为 `false`，开启非模态的加载态，以提供更流畅的操作体验。<!-- #Table -->
- [+] `Progress` 组件新增了可选的 `ui` 尺寸 `xs`。<!-- #Progress -->
- [^] `Progress` 组件在环形模式下现在根据 `ui` 尺寸不同，进行了尺寸上的调整。<!-- #Progress -->

### 🐞 问题修复

- [^] 修正 `Uploader` 组件 `key-field` 指定的字段可能被覆盖的问题。<!-- #Uploader -->
- [^] 修正 `RadioButtonGroup` 组件在禁用状态（整体禁用 & 单项禁用）下依然可以通过键盘获取焦点并进行修改的问题。<!-- #RadioButtonGroup -->
- [^] 修正 `Icon` 组件的 `spin` 属性失效的问题。<!-- #Icon -->

## 2.8.2 (2022-08-01)

### 🐞 问题修复

- [^] 修正 `babel-plugin-veui` 没有正确处理将 identifier 通过别名引入的问题。<!-- #babel-plugin-veui -->
- [^] 修正 `Tag` 组件的删除按钮不能正常接收焦点的问题。<!-- #Tag -->
- [^] 修正 `Select` 多级菜单展开位置没有完全对齐的问题。<!-- #Tag -->

## 2.8.1 (2022-07-25)

### 🐞 问题修复

- [^] 修复了 `dls-illustration-vue` 的依赖没有引入的问题。<!-- #veui -->

## 2.8.0 "💧 Droplet" (2022-07-25)

### ⚠️ 非兼容性变更

- [^] `Column` 组件 `tooltip` 为 `true` 时现在将自动展示对应单元格的 `textContent`。<!-- #Table #Column -->
- [^] `v-tooltip` 指令在未指定 `content` 时现在将自动展示对应元素的 `textContent`。<!-- #v-tooltip -->

### 💡 主要变更

- [+] 新增 `Empty` 组件，提供空状态内容的标准样式。<!-- #Empty -->

### 🐞 问题修复

- [^] 修复了 `Badge` / `Select` / `Switch` / `Table` / `Toast` 等组件在动态设置插槽时的渲染更新问题。<!-- #Badge #Select #Switch #Table #Toast -->
- [^] 优化了 `Input` 组件的自动填充识别逻辑，样式同步更加实时，且自动提示待选内容不再会与组件的占位提示重叠。<!-- #Input -->
- [^] 优化了 `Input` 组件在 Safari 浏览器下自动提示的样式。<!-- #Input -->

## 2.7.3 (2022-06-30)

### 💡 主要变更

- [+] `Cascader` 组件新增 `load` 属性来支持数据项懒加载的场景。<!-- #Cascader -->

### 🐞 问题修复

- [^] 修正了 `Nav` 组件悬浮切换时没有动画的问题。<!-- #Nav -->

## 2.7.2 (2022-06-15)

### 💡 主要变更

- [+] `Field` 组件新增 `required` 属性支持必选的样式，替代使用 `Fieldset` 的场景。<!-- #Field -->
- [^] 表单校验策略升级，展示校验结果时会自动合并相同的消息。<!-- #Field #Form -->
- [+] `Field` 组件的 `rules` 属性支持内联 `validate` 校验器。<!-- #Field -->
- [+] `Uploader` 组件支持定制失败项目是否展示预览。<!-- #Uploader -->

### 🐞 问题修复

- [^] 修正了 `Field` 组件在内部有多个输入型组件时，校验信息可能会被错误地清空的问题。<!-- #Field -->
- [^] 修正了 `Uploader` 组件的图标和样式问题。<!-- #Uploader -->
- [^] 修正了 `TimePicker` 组件选中项目的样式问题。<!-- #TimePicker -->
- [^] 修正了 `Fieldset` 组件内的 `Field` 不展示字段名称的问题。<!-- #Field -->

## 2.7.1 (2022-06-06)

### 💡 主要变更

- [^] 优化了 `Slider` 组件的交互，现在通过鼠标拖动完毕后浮层会自动隐藏。<!-- #Slider -->
- [^] `Slider` 组件现在也可以通过键盘 <kbd>↑</kbd> 和 <kbd>↓</kbd> 调整取值了。<!-- #Slider -->
- [+] `Tabs` 组件新增 `tooltip` 属性，允许被截断的标签页标题自动显示完整内容浮层提示。<!-- #Tabs -->

### 🐞 问题修复

- [^] 修正了 `Field` 组件在 `label-position` 为 `top` 时侧边帮助信息位置不正确的问题。<!-- #Field -->
- [^] 修正了 `Transfer` 组件在已选项扁平显示时的样式问题。<!-- #Transfer -->
- [^] 修正了 `Form` 组件的 `validate` 方法在校验通过时没有返回 `true` 的问题。<!-- #Form -->

## 2.7.0 "🪁 Kite" (2022-05-26)

### 💡 主要变更

- [^] `Uploader` 组件进行了整体优化。<!-- #Uploader -->

  - 新增 `pick` 属性用于来自定义选择文件的行为；
  - 新增 `validity-display` 属性来支持不同的校验信息展示方式；
  - `desc` 插槽重命名为 `help`，并新增了 `help` 属性来设置帮助文本；
  - 新增 `help-position` 属性来支持不同的帮助文本展示位置；
  - `picker-position` 属性值新增 `none` 和 `top` 来支持上传入口隐藏或置于上方；
  - 废弃 `button-label` 插槽，新增了 `picker-label` 和 `picker-icon` 属性来设置上传入口的文本和图标。

- [+] `Drawer` 组件新增多级自动缩进功能。<!-- #Drawer -->
- [+] `Form` 组件新增 `label-position` 属性，支持设置表单项标题显示在上方或侧面。<!-- #Form -->
- [+] `Field` 组件的 `help-position` 属性新增可选值 `top`，支持设置表单项帮助文本显示在上方。<!-- #Field -->
- [+] `veui-theme-dls` 新增 `typography.less`，提供“Baidu Number”字体支持。<!-- #veui-theme-dls -->

### 🐞 问题修复

- [^] 修正 `Dropdown` 组件不能正确渲染 `position` 为 `popup` 的内联 `OptionGroup` 子组件。<!-- #Dropdown -->
- [+] 修正 `Uploader` 组件在禁用状态下依然可以点击触发文件选择窗口的问题。<!-- #Uploader -->

## 2.6.5 (2022-05-17)

### 💡 主要变更

- [+] `Form` 组件新增了 `clearValidities` 和 `setValidities` 方法，方便用户清除校验信息和设置校验信息。常用的场景是：将提交后后端返回的校验信息更新到表单中去。<!-- #Form -->
- [+] 乐观清除校验信息：当用户更新输入型组件（如 `Input`/`Select` 等）的值时，该字段的校验信息也会同时被清除。<!-- #Field -->

### 🐞 问题修复

- [^] 修正 `Tree` 组件可勾选时，复选框与内容间距过小的问题。<!-- #Tree -->

## 2.6.4 (2022-04-25)

### 🐞 问题修复

- [^] 修复了没有 `Footer` 时 `Sidebar` 组件高度没有正常撑满容器的问题。<!-- #Sidebar -->

## 2.6.3 (2022-04-21)

### ⚠️ 非兼容性变更

- [^] 重命名组件 `Menu` 为 `Sidenav` 并且升级了样式：<!-- #Menu #Sidenav -->

  - 不再支持 `s` / `l` 尺寸变体，现在只支持默认的 `m` 尺寸。
  - 移除了属性 `collapsible`，侧导航不再内置切换展开/收起的按钮。
  - `collapsed` 属性在不受控时默认会和上层 `Sidebar` 的 `collapsed` 属性联动。

- [^] 组件 `Sidebar` 的属性 `collapsible` 默认值调整为 `false`。<!-- #Sidebar -->

### 💡 主要变更

- [^] 组件 `Popover` 支持透传 `overlay-options` 来配置浮层选项。<!-- #Popover -->

### 🐞 问题修复

- [^] 修复了 `Cascader` 组件的禁用项目可以选中的问题。<!-- #Cascader -->
- [^] 修复了 `Cascader` 组件在悬浮展开子级面板时报错的问题。<!-- #Cascader -->

## 2.6.2 (2022-04-08)

### 🐞 问题修复

- [^] 修正 `babel-plugin-veui` 转换包含组件名后缀的具名导出时误识别为组件的问题。<!-- #babel-plugin-veui -->
- [^] 修正 `status` 为 `success` 的 `Message` 组件图标使用不正确的问题。<!-- #Message -->
- [^] 修正复选的 `Cascader` 已选状态触发区样式布局错误的问题。<!-- #Cascader -->
- [^] 修正 `Field` 组件的 `tip` 属性通过 `Tooltip` 而非 `Popover` 展示的问题。<!-- #Field -->
- [^] 调整了 `Overlay` 组件开启 `autofocus` 时获取焦点的时机，以避免获取焦点时尚未展示完毕从而导致的页面滚动。<!-- #Overlay -->
- [^] 修正了全局类型声明没有包含 `Message` 组件的问题（将影响使用诸如 `unplugin-vue-components` 插件的场景）。<!-- #Message -->

## 2.6.1 (2022-03-30)

### 🐞 问题修复

- [^] 修复 `veui-theme-dls` 打包版本没有正确引入 `Message` 组件的问题。<!-- #veui-theme-dls -->
- [^] 修复 `Field` 组件销毁时没有正确清除对应校验信息的问题。<!-- #Field -->
- [^] 修复树相关组件项目 `key` 与唯一 `value` 不对应的问题。<!-- #Cascader #CascaderPane #Tree #Menu -->

## 2.6.0 "🌻 Sunflower" (2022-03-30)

### ⚠️ 非兼容性变更

- [^] 限定了 `Tabs` 组件单个标签页标题的宽度，对于超出最大宽度的内容会被省略。<!-- #Tabs -->
- [^] 移除了 `Nav` 组件的 `s` / `l` 两个尺寸变体，现在 `Nav` 组件只支持 `m` 尺寸。<!-- #Nav -->

### 💡 主要变更

- [+] 新增 `Message` 组件，提供统一的内联消息提示。<!-- #Message -->
- [^] 优化 `Tabs` 组件样式。<!-- #Tabs -->
- [^] 优化 `Nav` 组件样式，新增悬浮和点击动效。<!-- #Nav -->
- [+] 表单相关功能进行了大幅优化，升级了校验信息样式。`Field` 组件新增了 `help` / `help-position` 属性与 `help` 插槽来支持配置辅助说明。新增了 `abstract` / `withhold-validity` 属性来支持微调校验流程，新增了 `validity-display` 属性来控制校验信息展示样式，校验结果支持配置 `status` 以展示更丰富的校验状态。<!-- #Form #Fieldset  #Field -->
- [^] `Field` 内如果有多个输入类组件，可以通过将输入组件的 `name` 属性设置为与 `Field` 相同来标记“主要”输入组件，自动绑定校验逻辑与相关反馈。<!-- #Field -->

### 🐞 问题修复

- [^] 为布局相关组件补充了缺失的接口类型声明。<!-- #Layout #Header #Content #Footer #Sidebar -->
- [^] 修正了 `Radio` 与 `Checkbox` 组件在没有标签文本时的对齐样式。<!-- #Radio #Checkbox -->

## 2.5.5 (2022-03-23)

### ⚠️ 非兼容性变更

- [^] `Lightbox` 组件在关闭时的 `cancel` 事件修改成 `close` 事件。<!-- #Lightbox -->

### 💡 主要变更

- [+] 优化了 `Radio` / `Checkbox` 组件在垂直方向的对齐方式。<!-- #Radio #Checkbox -->
- [+] `Select` 组件新增 `show-select-all` 属性，支持全选的功能。<!-- #Select -->

### 🐞 问题修复

- [^] 修正了 `DatePicker` / `Button` 禁用样式的问题。<!-- #DatePicker #Button -->
- [^] 修正了 `Uploader` 媒体上传项目在禁用状态下的样式问题。<!-- #Uploader -->
- [^] 修正了 `Menu` 覆盖 `item` 插槽会导致报错的问题。<!-- #Menu -->
- [^] 修正了 `Cascader` 选中文本超长溢出的样式问题。<!-- #Cascader -->
- [^] 修正了 `Tag` 组件禁用状态下的焦点样式。<!-- #Tag -->

## 2.5.4 (2022-03-01)

### 💡 主要变更

- [+] `Tabs` 组件现在在标签页标题横向溢出滚动时，支持使用滚轮进行左右滚动。<!-- #Tabs -->
- [+] `Lightbox` 组件新增 `outside-closable` 属性，用于指定是否可以在内容外部点击关闭。<!-- #Lightbox -->

### 🐞 问题修复

- [^] 修正了 `DatePicker` 的 `select` 事件重复触发的问题。<!-- #DatePicker -->
- [^] 优化了 `Overlay` 组件的关闭逻辑，消除了部分组件关闭过程中会发生肉眼可见的闪烁的问题。<!-- #Overlay -->
- [^] 修正了 `RadioGroup` / `CheckboxGroup` / `RadioButtonGroup` / `CheckboxButtonGroup` 组件可能遮挡左侧组件点击区域的问题。<!-- #RadioGroup #CheckboxGroup #RadioButtonGroup #CheckboxButtonGroup -->
- [^] 为 `v-drag.sort` 指令新增了对 Chrome 关于拖动图片生成坐标相关 bug 的兼容性处理。<!-- #v-drag -->

## 2.5.3 (2022-02-07)

### 💡 主要变更

- [+] 为 `Dialog` / `Drawer` / `AlertBox` / `ConfirmBox` / `PromptBox` 等组件新增 `afteropen` 事件。<!-- #Dialog #AlertBox #ConfirmBox #PromptBox -->

### 🐞 问题修复

- [^] 修正了 `Button` 组件键盘交互某些情况下没有正确触发的问题。<!-- #Button -->

## 2.5.2 (2022-01-25)

### 💡 主要变更

- [^] 新增全局注册类型声明，以便使用了类似 `unplugin-vue-components` 功能时自动引入并注册组件的场景下依然可以获取正确的组件类型信息。<!-- #TypeScript -->
- [+] `Form` 组件的 `default` 和 `actions` 插槽新增 `validating` 属性，用于指示当前表单是否正处于异步校验过程中。<!-- #Form -->
- [+] `Form` 组件的 `default` 插槽新增 `submit` 属性，用于触发表单提交。<!-- #Form -->

### 🐞 问题修复

- [^] 修正了用户在封装多个 `Column` 组件并传入 `Table` 时可能导致乱序的问题。<!-- #Table -->

## 2.5.1 (2022-01-20)

### 🐞 问题修复

- [^] 修正了类型声明与 `@vue/composition-api` 导出的 `defineComponent` 的类型声明不匹配的问题。<!-- #TypeScript -->

## 2.5.0 "🤸 Person Cartwheeling" (2022-01-19)

### 💡 主要变更

- [+] 为 VEUI 的所有组件增加了类型描述文件，可以配合 [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) 在模板中得到属性/事件/插槽类型的自动提示。<!-- #TypeScript -->

### 🐞 问题修复

- [^] 修正了 `Accordion` 组件的 `toggle-position` 属性没有正确生效的问题。<!-- #Accordion -->

## 2.4.4 (2022-01-15)

### 🐞 问题修复

- [^] 修正了 `Tabs` / `Tab` / `Table` / `Column` / `Accordion` / `Collapse` 组件通过内联子组件方式使用时，动态切换子组件时可能顺序错乱的问题。<!-- #Tabs #Tab #Table #Column #Accordion #Collapse -->
- [^] 修正了 `DatePicker` 组件在快捷选项区域点击空白处会触发下拉面板关闭的问题。<!-- #DatePicker -->
- [^] 调整了 `Button` 组件的样式实现方式，以修复 v2.4.2 重构时引入的部分样式问题。<!-- #Button #Uploader #Dropdown #Sidebar -->

## 2.4.3 (2022-01-11)

### 🐞 问题修复

- [^] 修正 `Dropdown` 组件按钮内间距过大的问题。<!-- #Dropdown -->

## 2.4.2 (2022-01-07)

### 🐞 问题修复

- [^] 重构了 `Button` 组件以解决在动态切换 `disabled` / `loading` 属性时过渡动效丢失的问题。<!-- #Button -->
- [^] 修复了 `veui-loader` 中 `global` 选项没有正确处理 `string` 类型配置的问题。<!-- #veui-loader -->

## 2.4.1 (2022-01-05)

### 🐞 问题修复

- [^] 修复了 `sideEffects` 配置错误导致依赖组件类型判断的逻辑失效的问题。<!-- #veui -->

## 2.4.0 "🪆 Nesting Dolls" (2022-01-02)

### 💡 主要变更

- [+] 新增全局布局组件 `Layout` / `Header` / `Sidebar` / `Footer` / `Content`。<!-- #Layout #Header #Sidebar #Footer #Content -->

### 🐞 问题修复

- [^] 修复了 `Badge` 组件的 `max` prop 没有正常响应全局设置的问题。<!-- #Badge -->

## 2.3.4

### 🐞 问题修复

- [^] 修正了单选 `Select` / `Cascader` 组件在有已选项时，展开下拉浮层可能导致页面滚动位置跳动的问题。<!-- #Select #Cascader -->

## 2.3.3

### 🐞 问题修复

- [^] 修正了动态添加/移除 `Column` 组件时可能导致顺序不正确的问题。<!-- #Table #Column -->
- [^] 修正了 `Select` 组件在非受控模式下下拉菜单中当前激活项显示不正确的问题。<!-- #Select -->

### 🧪 实验性功能

- [+] 为 `Calendar` 组件新增了实验性的 `ui` 样式 `display`。<!-- #Calendar -->

## 2.3.2

### ⚠️ 非兼容性变更

- [^] 将对 `dls-icons-vue` 的依赖更新为 `2.0.0`。其中：<!-- #Icon -->

  - `quality-circle` 图标重命名为 `grade-circle`；
  - `full-square` 图标重命名为 `full-circle`。

### 🐞 问题修复

- [^] 修正了 `Cascader` 组件在复选模式下搜索框位置不正确的问题。<!-- #Cascader -->
- [^] 修正了 `Table` 组件通栏展开行、footer 行高度不正确的问题。<!-- #Table -->

## 2.3.1

### 💡 主要变更

- [^] 优化了下拉浮层展开时列表滚动到激活项的功能，避免可见的闪动。<!-- #Select #Cascader #DatePicker #TimePicker -->
- [^] 在滚动锁定开启时尝试使用原生的 `scrollbar-gutter` 来避免页面内容整体抖动。<!-- #Dialog -->
- [^] 优化了 `v-drag.sort` 指令在 Safari 下在 `transform` 容器内拖动时拖动元素初始样式的覆盖场景。<!-- #v-drag -->

### 🐞 问题修复

- [^] 修正了 `v-tooltip` 指令提示内容没有实时响应式更新的问题。<!-- #v-tooltip -->
- [^] 升级了 `Loading` 组件的加载动效，避免了在 Chrome 下可能由于动画不同步造成的闪动。<!-- #Loading -->

## 2.3.0 "🏍️ Motorcycle"

### ⚠️ 非兼容性变更

- [^] `Pagination` 组件默认不展示每页数量选择器。<!-- #Pagination -->

### 💡 主要变更

- [^] `Autocomplete` 组件的 `strict` prop 行为对齐到 `Input` 组件的 `strict` prop，不再表示限制只能选择 `datasource` 中的值。<!-- #Autocomplete -->
- [^] 废弃 `Autocomplete` 组件的 `suggest` 事件，当用户采纳建议时额外触发新增的 `select` 事件。<!-- #Autocomplete -->
- [^] `Autocomplete` 组件新增 `maxlength` prop 来限制值的长度。<!-- #Autocomplete -->
- [^] `Pagination` 组件新增 `show-total` / `show-page-size` / `show-goto` prop 来分别指定是否显示项目总数/每页条数/跳转到指定页。将 `goto` prop 废弃并重命名为 `show-goto`。<!-- #Pagination -->
- [+] `v-tooltip` 指令新增修饰符 `overflow`，用来指定仅当目标元素内容发生溢出时才显示悬浮提示。<!-- #v-tooltip -->
- [+] `Column` 组件新增 `tooltip` prop，用于指定某列内容溢出时展示的悬浮提示文本。<!-- #Column -->

### 🐞 问题修复

- [^] 修正大部分输入型组件的一些事件无法作为表单校验的触发器。涉及组件包括: `Autocomplete` / `Checkbox` / `Input` / `Radio` / `Switch` / `Textarea`。<!-- #Autocomplete #Checkbox #Input #Radio #Switch #Textarea -->
- [^] 修正 `Uploader` 组件继续上传按钮的样式问题。<!-- #Uploader -->
- [^] 修正 `Carousel` 组件切换时报错的问题。<!-- #Carousel -->
- [^] 优化搜索类组件对 Unicode 代理对与 Zero Width Joiner (`U+200D`) 的支持。<!-- #Autocomplete #Dropdown #Select #Cascader #SearchBox -->
- [^] 修正 `Table` 组件的自定义 CSS 属性 `--dls-table-cell-lines` / `--dls-table-head-cell-lines` 默认值没有设置为 `1` 的问题。<!-- #Table -->

## 2.2.1

### ⚠️ 非兼容性变更

- [^] `Anchor` 组件的 `target-offset` / `sticky-offset` 使用数值时不再作为比例系数，而是作为绝对 `px` 值。<!-- #Anchor -->

### 💡 主要变更

- [+] `Anchor` 组件的 `target-offset` / `sticky-offset` 支持传入如 `'10%'` 格式的字符串，用于支持比例系数。<!-- #Anchor -->

### 🐞 问题修复

- [^] 修正 `Button` 组件在 Safari 浏览器上的样式问题。<!-- #Button -->
- [^] 修正 `DatePicker` 组件在 Safari 浏览器上点击快捷方式报错的问题。<!-- #DatePicker -->

### 🧪 实验性功能

- [^] `Table` 组件的自定义 CSS 属性 `--dls-table-cell-lines` / `--dls-table-head-cell-lines` 默认值更新为 `1`，可以通过设置为 `auto` 来设置自适应高度。<!-- #Table -->

## 2.2.0 "🪗 Accordion"

### 💡 主要变更

- [+] 为 `Accordion` / `Collapse` 组件新增 `ui` 样式 `simple` / `basic` / `strong` / `bordered` / `borderless` / `dull`。<!-- #Accordion #Collapse -->
- [+] 为 `Accordion` / `Collapse` 组件新增 `toggle-position` prop，用于自定义展开/收起箭头的位置。<!-- #Accordion #Collapse -->
- [+] 为 `Collapse` 组件新增 `title-after` 插槽，用于自定标题后缀内容。<!-- #Collapse -->
- [+] 为 `Popover` 组件新增 `title` prop 与 `title` 插槽，用于自定义标题内容。<!-- #Popover -->
- [+] 为 `Popover` 组件新增 `foot` / `ok-label` / `cancel-label` prop 与 `foot` 插槽，用于开启底部操作区并自定义操作按钮文本。<!-- #Popover -->

### 🐞 问题修复

- [^] 修正 `Tabs` 组件销毁过程中触发数据变化的问题。<!-- #Tabs -->
- [^] 修正 `Anchor` 组件在滚动容器的 CSS `scroll-behavior` 为 `smooth` 时下点击项目导致的滚动会进一步影响激活项的问题。<!-- #Anchor -->
- [^] 修正 `Anchor` 组件的容器样式可能导致进入/退出吸附状态时抖动的问题。<!-- #Anchor -->
- [-] 去除了 `Anchor` 组件初始状态的自动滚动，以避免和浏览器的默认行为冲突。<!-- #Anchor -->
- [^] 修正 `Table` 组件在切换 `selectable` / `expandable` 时没有更新布局的问题。<!-- #Table -->

### 🧪 实验性功能

- [+] 为 `Table` 组件新增自定义 CSS 属性 `--dls-table-cell-lines` / `--dls-table-head-cell-lines`，用于指定显示固定内容/表头行数的表格。<!-- #Table -->
- [+] 为 `Accordion` 组件新增自定义 CSS 属性 `--dls-accordion-gutter`，用于自定义折叠面板间距。<!-- #Accordion -->

## 2.1.7

### 💡 主要变更

- [+] 为 `Link` 组件新增全局配置项 `link.routerLink`，用于在路由模式下允许使用除了 `<router-link>` 以外的组件，比如在 Nuxt 项目下使用 `<nuxt-link>`。<!-- #Link -->

### 🐞 问题修复

- [^] 修正 `Progress` 组件的状态一致性问题。<!-- #Progress -->
- [^] 修正 `Uploader` 组件的 `convert-response` 无法通过 `ConfigProvider` 组件进行局部配置的问题。<!-- #Uploader -->
- [^] 修正 `Textarea` / `Calendar` / `Input` 组件在 Safari 下的样式问题。<!-- #Textarea #Calendar #Input -->
- [^] 修正 `DatePicker` 组件的下拉浮层在溢出视口时没有正确左右翻转的问题。<!-- #DatePicker -->
- [^] 修正 `v-tooltip` 指令在目标元素销毁时可能没有消失的问题。<!-- #v-tooltip -->

## 2.1.6

### 💡 主要变更

- [+] 为 `Tooltip` / `Popover` 组件新增 `aim-center` prop，用来支持浮层箭头始终指向目标元素中心的模式。<!-- #Tooltip #Popover -->
- [+] 为 `RadioButtonGroup` / `CheckButtonGroup` 组件新增 `ui` 选项 `stable`，来实现多行显示多个按钮组时更整齐的视觉效果。<!-- #RadioButtonGroup #CheckButtonGroup -->

### 🐞 问题修复

- [^] 修正 `Tabs` 组件在路由模式下 `active` 数据可能没有正确响应路由变化的问题。<!-- #Tabs -->
- [^] 修正 `Tabs` 组件在移除最后一个标签页时 `active` 计算不正确的问题。<!-- #Tabs -->
- [^] 修正 `DatePicker` 组件的 `placeholder` 类型描述漏掉 `Array` 的问题。<!-- #DatePicker -->
- [^] 修正 `Table` 组件固定列 `z-index` 过低可能导致被滚动内容穿透的问题。<!-- #Table -->

### 🧪 实验性功能

- [+] 为 `RadioButtonGroup` / `CheckButtonGroup` 组件分别新增自定义 CSS 属性 `--dls-radio-button-min-width` / `--dls-checkbox-button-min-width`，用于自定义组内按钮项的最小宽度。<!-- #RadioButtonGroup #CheckButtonGroup -->

## 2.1.5

### 🐞 问题修复

- [^] 修正 `Tabs` 组件在路由模式下可能会没有正常激活标签项的问题。<!-- #Tabs -->
- [^] 将 `CheckButtonGroup` / `RadioButtonGroup` 组件的样式 token 升级到最新版本，以解决无法与最新版本 less-plugin-dls 共同工作的问题。<!-- #CheckButtonGroup #RadioButtonGroup -->
- [^] 修正 `RadioGroup` 组件未实现可受控功能的问题。<!-- #RadioGroup -->

### 🧪 实验性功能

- [+] 为 `Field` 组件新增自定义 CSS 属性 `--dls-field-label-width`，用于自定义表单项文字标签列的宽度。<!-- #Field -->

## 2.1.4

### 🐞 问题修复

- [^] 修正了 `veui/dist/locale.*.esm.js` 没有被标记入 `sideEffects` 配置的问题。<!-- #veui -->

## 2.1.3

### 💡 主要变更

- [+] 为 `RadioGroup` / `CheckboxGroup` / `RadioButtonGroup` / `CheckboxButtonGroup` 新增 `Popover` 弹层提示支持。新增数据源 `desc` 字段及对应的 `desc` 作用域插槽。<!-- #RadioGroup #CheckboxGroup #RadioButtonGroup #CheckButtonGroup -->
- [+] 支持搜索的组件 `Autocomplete` / `Cascader` / `SearchBox` / `Select` / `Dropdown` 的 `match` prop 返回值现在在仅有一段匹配时可以直接返回 `[number, number]`。<!-- #Autocomplete #Cascader #SearchBox #Select #Dropdown -->

### 🐞 问题修复

- [^] 修正了 locale 包的 ESM 打包版本没有引用 VEUI 的 ESM 版本的问题。<!-- #veui -->
- [^] 修正了 `DatePicker` 组件清除功能有时不正常的问题。<!-- #DatePicker -->
- [^] 修正了 `Select` / `Dropdown` 组件可能出现两个滚动条的样式问题。<!-- #Select #Dropdown -->
- [^] 修正了 `Table` 在无边框样式下组件固定列阴影处有 1px 偏差的问题。<!-- #Table -->

## 2.1.2

### 💡 主要变更

- [^] `veui-theme-dls-icons` 新增产出文件：<!-- #veui-theme-dls-icons -->

  - `dist/icons.esm.js` ESM 版本。

## 2.1.1

### ⚠️ 非兼容性变更

- [-] 组件 `Autocomplete` 的 `match` prop 参数签名从 `(item, keyword, ancestors)` 变更为 `(item, keyword, { ancestors })`。<!-- #Autocomplete -->
- [^] 将 `Carousel` 组件的 `indicator-alignment` prop 重命名为 `indicator-align`。<!-- #Carousel -->

### 💡 主要变更

- [+] 为 `RadioButtonGroup` / `CheckButtonGroup` 新增 `ui` 样式 `simple`，并支持跨行样式。<!-- #RadioButtonGroup #CheckButtonGroup -->
- [^] `Button` 组件现在可以在禁用状态下响应除了 `click` 以外的事件，并可以接收焦点。<!-- #Button -->
- [+] 为支持搜索的组件 `Autocomplete` / `Cascader` / `SearchBox` / `Select` / `Dropdown` 新增 `match` / `filter` prop。<!-- #Autocomplete #Cascader #SearchBox #Select #Dropdown -->

  - `match` 函数签名：`(item, keyword, { ancestors }) => boolean | Array<[number, number]>` 以支持自定义高亮逻辑；
  - `filter` 函数签名：`(item, keyword, { ancestors, offsets }) => boolean` 以支持自定义搜索命中逻辑。

## 2.1.0 "🌰 Chestnut"

### 💡 主要变更

- [+] 新增了 `ConfigProvider` 组件，用于对局部组件进行全局配置的自定义。<!-- #ConfigProvider -->
- [^] 对 `Carousel` 组件进行了功能、样式升级：<!-- #Carousel -->

  - `indicator` prop 新增 `bar` / `dot` 值，用于指定播放指示器的样式类型。其中 `bar` 用于替换之前的 `radio`（`radio` 也保持兼容支持）。
  - 新增了 `effect` prop，用于指定轮播切换效果，其中 `fade` 仅在切换组个数与同时显示个数相同时生效。
  - 新增了 `vertical` prop，用于支持纵向布局的轮播。
  - 新增了 `indicator-alignment` prop，用于支持指示器的相对于布局方向的位置。
  - 新增了 `indicator-position` prop，用于支持指示器显示在轮播容器的内部/外部。
  - 新增了 `controls-position` prop，用于支持切换按钮相对于布局方向的位置。
  - 新增了 `slide-aspect-ratio` prop，用于指定每个轮播项的纵横比。
  - 新增了视频轮播项的支持，并新增 `options` prop 用于指定不同轮播项类型的默认配置。
  - 新增了 `slides-per-view` prop，用于指定同时显示多少个轮播项。
  - 新增了 `slides-per-group` prop，用于指定每次前后切换的一组包含多少个轮播项。

### 🧪 实验性功能

- [+] 为 `Carousel` 组件新增自定义 CSS 属性：<!-- #Carousel -->

  - `--dls-carousel-slide-gutter`：轮播项的间距；
  - `--dls-carousel-transition-duration`：轮播一次切换的持续时间。

### 🐞 问题修复

- [^] 修正了 `Switch` 组件加载状态没有使用 `Loading` 组件的问题。<!-- #Switch -->

## 2.0.6

### 🐞 问题修复

- [^] 优化了 `Dialog`、`Drawer` 及 `Lightbox` 等触发模态层组件释放滚动锁定的逻辑，已避免模态层关闭时进行路由跳转可能导致解锁逻辑没有执行的问题。<!-- #Dialog #Drawer #Lightbox -->

## 2.0.5

### 🐞 问题修复

- [^] 修复 `Input` 组件开启 `trim` 后无法输入带空格的文本的问题。<!-- #Input -->

## 2.0.4

### 🐞 问题修复

- [^] 修复 `Uploader` 组件遗漏的服务端渲染时的异常。<!-- #Uploader -->

## 2.0.3

### 💡 主要变更

- [+] `Input` 组件新增 `trim` prop，用来给输入值清除前后的空格。<!-- #Input -->

### 🐞 问题修复

- [^] 修复 `Checkbox` 组件初始化时触发全局点击事件的问题。<!-- #Checkbox -->
- [^] 修复 `Textarea` 组件在 `autoresize` 时，当最初渲染在隐藏容器内展现后高度不正确的问题。<!-- #Textarea -->

## 2.0.2

### 💡 主要变更

- [+] 在 UMD 版本输出中新增整体注册功能，将自动注册所有组件并启用 VEUI 的所有插件。<!-- #veui -->

  #### 使用方法

  ```html
  <div id="app">
    <v-button ui="primary">OK</v-button>
  </div>
  ```

  ```js
  Vue.use(veui, { prefix: 'v' }) // prefix 可选，默认为 `veui`

  new Vue({
    el: '#app'
  })
  ```

### 🐞 问题修复

- [^] 修正了 `Uploader` 组件在 SSR 环境下异常的问题。<!-- #Uploader -->
- [^] 修正了 `Uploader` 组件渲染的文件列表可能超过 `max-count` 定义的上限的问题。<!-- #Uploader -->
- [^] 修正了 `options` 参数在 `toast` 插件调用时没有正常生效的问题。<!-- #$toast -->
- [^] 修正了 `veui-theme-dls` 单独打包输出的样式顺序问题。<!-- #veui-theme-dls -->
- [^] 修正了 `Tag` 组件在深色背景下显示效果不符合预期的问题。<!-- #Tag -->

## 2.0.1

### 🐞 问题修复

- [^] 修正了 `Menu` 组件 `item-label` slot 范围过大的问题。<!-- #Menu -->

## 2.0.0 "📅 Calendar"

### ⚠️ 非兼容性变更

- [-] 移除了 `Table` 组件的 `keys` prop，请使用 `key-field` prop 代替。<!-- #Table -->
- [-] 移除了 `Tag` 组件的 `closable` prop 和 `close` 事件，请分别使用 `removable` prop 和 `remove` 事件代替。<!-- #Tag -->
- [-] 移除了 `Uploader` 组件的 `extensions` prop，请使用 `accept` prop 代替。<!-- #Uploader -->
- [-] 移除了 `Uploader` 组件的 `uploadFiles` 方法，并将 `triggerUpload` 方法更名为 `startUpload`。<!-- #Uploader -->
- [-] 移除了 `v-drag` 指令的 `draggable` 选项，请使用 `disabled` 选项代替。<!-- #v-drag -->
- [-] 移除了 `v-drag.sort` 指令的 `callback` 选项，请使用 `sort` 选项代替。<!-- #v-drag -->
- [-] 移除了校验规则的 `message` 自定义模板的 `%{arg}` 语法，请使用 `{arg}` 语法代替。<!-- #rules -->

### 🐞 问题修复

- [^] 修复了 `Uploader` 组件列表切换动效不正确的问题。<!-- #Uploader -->

## 2.0.0-rc.5

### 🐞 问题修复

- [^] 修正了 `Nav` 组件从当前项目移动到下拉浮层会导致当前项目关闭的问题。<!-- #Nav -->
- [^] 修正了 `Table` 组件的过滤器下拉浮层出现两个滚动条的问题。<!-- #Table -->
- [^] 修正了 `veui` 公共模块导出可能出现组件未定义的情况。<!-- #veui -->
- [^] 修正了部分组件的语言配置未打包到 UMD 版本输出的问题。<!-- #veui -->
- [^] 修正了 rc.4 版本错误引入 `Dropdown` 组件的 `strong` 样式。<!-- #Dropdown -->

## 2.0.0-rc.4

### 💡 主要变更

- [^] `veui` 产出中新增文件：<!-- #veui -->
  - `dist/veui.js` UMD 版本，包含中英文语言包。
  - `dist/veui.esm.js` ESM 版本，不包含中英文语言包。
  - `dist/locale.en-US.esm.js` 英文语言包。
  - `dist/locale.zh-Hans.esm.js` 中文语言包。
- [^] `veui-theme-dls` 产出中新增文件：<!-- #veui-theme-dls -->
  - `dist/dls.js` UMD 版本，Baidu DLS 主题包。
  - `dist/dls.esm.js` ESM 版本，Baidu DLS 主题包。
- [^] `veui` 的公共模块导出调整为：<!-- #veui -->

  #### ESM

  ```js
  import {
    Button, // components
    config,
    i18n,
    validation, // managers
    useControllable,
    useSearchable, // mixins
    $alert,
    $confirm,
    $prompt,
    $toast, // plugins
    drag,
    outside,
    resize,
    nudge,
    longpress,
    tooltip // directives
  } from 'veui'
  ```

  #### 全局对象

  ```html
  <script src="/path/to/vue.js"></script>
  <script src="/path/to/veui/dist/veui.js"></script>
  <script src="/path/to/veui-theme-dls/dist/dls.js"></script>
  <script>
    const { Button, i18n, outside } = window.veui
  </script>
  ```

### 🐞 问题修复

- [^] `Dropdown` 组件现在支持 `ui="strong text"`。<!-- #Dropdown -->
- [^] 修正了 `Dialog` 组件的 `draggable` prop 失效的问题。<!-- #Dialog -->
- [^] 修正了 `Drawer` 组件的 `overlay-class` prop 没有正确输出的问题。<!-- #Drawer -->
- [^] 修正了 `v-drag` 指令在非使用 `target` 选项非受控拖动时失效的问题。<!-- #v-drag -->
- [^] 修正了 `v-drag.sort` 在 Safari 下容器有 `transform` 时产生偏移的问题。<!-- #v-drag -->
- [^] 修正了 `Uploader` 组件按住图片拖拽排序时失效的问题。<!-- #Uploader -->

## 2.0.0-rc.3

### ⚠️ 非兼容性变更

- [^] `v-drag.sort` 指令的 `callback` 选项重命名为 `sort`。参数从 `(toIndex: number, fromIndex: number)` 修改为 `(fromIndex: number, toIndex: number)`。同时排序回调不再需要关心移动动画的完成状态。<!-- #v-drag -->
- [^] `v-drag` 指令的 `draggable` 选项被 `disabled` 选项取代，默认值为 `false`。<!-- #v-drag -->
- [-] 移除全局配置项 `drag.prefix`。<!-- #v-drag -->

### 💡 主要变更

- [+] 为 `v-drag` 指令新增选项 `handle`，可用于指定拖动的“把手”元素。<!-- #v-drag -->

### 🐞 问题修复

- [^] 修正 `Lightbox` 组件可能产生重复 `key` 的问题。<!-- #Lightbox -->

## 2.0.0-rc.2

### 🐞 问题修复

- [^] 修正 `NumberInput` 组件无法正常清空的问题。<!-- #NumberInput -->

## 2.0.0-rc.1

### 💡 主要变更

- [+] 为 `Popover` / `Tooltip` / `AlertBox` / `ConfirmBox` / `PromptBox` / `Dialog` / `Select` / `Dropdown` / `Lightbox` / `DatePicker` / `TimePicker` / `SearchBox` / `Cascader` / `CascaderPane` 等组件新增 `overlay-style` prop，用于自定义浮层样式。<!-- #Popover #Tooltip #AlertBox #ConfirmBox #PromptBox #Dialog #Select #Dropdown #Lightbox #DatePicker #TimePicker #SearchBox #Cascader #CascaderPane -->
- [+] `Link` 组件现在支持绑定通用的鼠标、键盘事件，无需使用 `.native` 修饰符。<!-- #Link -->

### 🐞 问题修复

- [^] 修复 `Nav` 组件项目在光标悬浮状态下的样式问题。<!-- #Nav -->
- [^] 修复 `Select` 组件的 slot prop 中缺失 `close` 方法的问题。<!-- #Select -->
- [^] 修复 `NumberInput` 组件在非法值的基础上使用步进操作产生 `NaN` 的问题。<!-- #NumberInput -->
- [^] 修复 `Radio` 组件在有相同 `name` 的组件时，因为其它同组组件被选中导致的 DOM 状态与组件状态不同步的问题。<!-- #Radio -->

### 🧪 实验性功能

- [+] 为 `Select` / `Dropdown` / `SearchBox` / `Cascader` 新增 `--dls-dropdown-max-display-items` 配置支持，见 `2.0.0-rc.0` 版本实验性功能说明。<!-- #Select #Dropdown #SearchBox #Cascader -->

## 2.0.0-rc.0

### ⚠️ 非兼容性变更

- [^] `v-drag.sort` 指令的 `callback` 函数参数 `(toIndex, fromIndex)` 中的 `toIndex` 参数含义变更，从原来的“移动到 `toIndex` 前”变更成“移动到 `toIndex` 处”。<!-- #v-drag -->

### 💡 主要变更

- [+] 为 `Overlay` / `Autocomplete` 等组件新增 `overlay-style` prop，用于自定义浮层样式。<!-- #Overlay #Autocomplete -->
- [+] 新增 `v-tooltip` 指令，用于指定全局共享的浮层提示。<!-- #v-tooltip -->
- [^] 优化了 `v-drag.sort` 的移动触发交互，使拖动排序更顺畅。<!-- #v-drag -->

### 🐞 问题修复

- [^] 修复 modal 类型浮层的 focus trap 功能。<!-- #veui -->

### 🧪 实验性功能

- [+] 新增支持通过给浮层设置 CSS 自定义属性 `--dls-dropdown-max-display-items` 来设置 `Autocomplete` 组件下拉浮层最大显示项目数，超出此高度将触发滚动。（给浮层设置样式可通过 `overlay-class` / `overlay-style` prop 的方式。）<!-- #Autocomplete -->

  > #### 使用示例
  >
  > ```vue
  > <!-- 配置最多显示 6 个选项（为提高在溢出且隐藏滚动条环境中的可访问性， -->
  > <!-- 实际最大高度为 6.5 个选项的高度以提示更多选项的存在） -->
  > <veui-dropdown
  >   :overlay-style="{ '--dls-dropdown-max-display-items': 6 }"
  >   ...
  > />
  > ```

## 2.0.0-beta.33

### 💡 主要变更

- [+] 新增了部分组件的文案配置 prop（[#750](https://github.com/ecomfe/veui/issues/750)），具体包括：

  - `Dialog` / `Drawer` / `ConfirmBox` / `PromptBox` 组件新增 `ok-label` / `cancel-label` prop；<!-- #Dialog #Drawer #ConfirmBox #PromptBox -->
  - `AlertBox` 组件新增 `ok-label` prop；<!-- #AlertBox -->
  - `Tabs` 组件新增 `add-label` prop；<!-- #Tabs -->
  - `Transfer` 组件新增 `candidate-title` / `selected-title` prop。<!-- #Transfer -->

- [+] `AlertBox` / `ConfirmBox` / `PromptBox` 均补齐 `disabled` / `loading` prop，与 `Dialog` 组件对齐。<!-- #AlertBox #ConfirmBox #PromptBox -->

## 2.0.0-beta.32

### 💡 主要变更

- [^] `Overlay` 组件内容现在仅会在 `open` 状态下渲染，以提高渲染性能。<!-- #Overlay -->
- [^] 优化了 `Table` 组件内容溢出时的阴影样式。<!-- #Table -->

### 🐞 问题修复

- [^] 修正 `Carousel` 和 `Lightbox` 组件的项目插槽，从 `default` 修正为 `item`。修正 `Lightbox` 组件的 `desc` 插槽。<!-- #Carousel #Lightbox -->
- [^] 修正不同尺寸 `Cascader` 组件的样式问题。<!-- #Cascader -->
- [^] 修正 `SearchBox`、`Table` 筛选等下拉场景没有高度限制的问题。<!-- #SearchBox #Table -->
- [^] 修正 `file` 类型 `Uploader` 组件会发起预览网络请求的问题。<!-- #Uploader -->

## 2.0.0-beta.31

### 💡 主要变更

- [+] 新增 `Cascader` 及 `CascaderPane` 组件。<!-- #Cascader #CascaderPane -->
- [+] `Dialog` 组件新增 `disabled` 属性，用于控制确定按钮的启用/禁用。<!-- #Dialog -->

### 🐞 问题修复

- [^] 修正 `Select` 组件在 `s` / `xs` 尺寸下多选标签的样式。<!-- #Select -->
- [^] 修正 `Lightbox` 组件在 Safari 下无法正常显示内容的问题。<!-- #Lightbox -->
- [^] 修正 `Uploader` 组件在 `request-mode` 为 `custom` 时没有对返回值调用 `convertResponse` 的问题。（#800）<!-- #Uploader -->
- [^] 修正 `SearchBox` 在显示搜索提示时按下 <kbd>enter</kbd> 没有触发 `search` 事件的问题。（#806）<!-- #SearchBox -->
- [^] 修正 `Carousel` 组件尺寸不能通过最外层元素进行调整的问题。（#811）<!-- #Carousel -->

## 2.0.0-beta.30

### 💡 主要变更

- [+] `Tree` / `Transfer` 组件新增 `merge-checked` prop，用于对节点勾选的冗余信息进行合并。支持的值如下：<!-- #Tree #Transfer -->

  - `keep-all`：默认值，选中值中包含所有勾选状态的节点。
  - `upwards`：尽量向上合并，当某个节点下所有节点均勾选时仅保留该节点本身。
  - `downwards`：尽量向下合并，仅保留叶子节点。

- [^] `Tree` 组件的被禁用的子节点现在允许切换展开/收起。<!-- #Tree -->
- [+] `Tree` 组件新增支持对于没有 `value` 的节点，根据 `name` 字段控制展开收起及节点选择（非勾选）状态，用来支持受控切换这两类状态且不出现在已勾选的输出值中（仅作为分组节点使用）。<!-- #Tree -->
- [+] 在 `Transfer` 组件的 `candidate-head` / `candidate-title` / `selected-head` / `selected-title` 插槽中新增了 `count` 插槽属性，分别表示备选数量和已选数量。<!-- #Transfer -->

### 🐞 问题修复

- [^] 修复 `Tree` 组件禁用逻辑，现在被禁用的节点的所有子节点也将被禁用。<!-- #Tree -->
- [^] 修复 `Transfer` 节点在禁用时会受“全选”/“清空”操作影响选择状态的问题。<!-- #Transfer -->
- [^] 修复 `Transfer` 在搜索/过滤后全选会选中所有数据而非过滤后数据的问题。<!-- #Transfer -->
- [^] 修正 `Select` 组件“未选择”状态的判断逻辑，现在 `null` / `undefined` / `[]` 均视为未选状态。<!-- #Select -->
- [^] 修正 `babel-plugin-veui` 在改写 `import` 时没有更新 local binding 导致 JSX 插件误判组件名为字符串的问题。<!-- #babel-plugin-veui -->

## 2.0.0-beta.29

### 💡 主要变更

- [+] `Overlay` 组件在层叠顺序变化时将触发 `orderchange` 事件。<!-- #Overlay -->

### 🐞 问题修复

- [^] 修复 `Transfer` 组件可以通过批量选择切换禁用项的问题。<!-- #Transfer -->

## 2.0.0-beta.28

### 💡 主要变更

- [+] `Uploader` 组件新增 `sortable` prop，支持上传文件的拖拽排序。<!-- #Uploader -->
- [+] `Transfer` 组件新增 `candidate` slot，用于替换整个待选面板的内容。<!-- #Transfer -->

### 🐞 问题修复

- [^] `$confirm` 插件在同步回调时不再显示 loading 状态。<!-- #$confirm -->
- [^] 修复了 `Select` 组件无法通过键盘 focus 的问题。<!-- #Select -->
- [^] 修复了 `RadioButtonGroup` 通过方向键切换选项时可能报错的问题。<!-- #RadioButtonGroup -->
- [^] 修复了 `Link` 组件引用了错误的 `event` 对象的问题。<!-- #Link -->
- [^] 修正了 `Select` 下拉浮层在出现内部滚动时，下层选项组展开定位不符合预期的问题。<!-- #Select -->

## 2.0.0-beta.27

### ⚠️ 非兼容性变更

- [^] `Select` 与 `Dropdown` 组件的 `trigger` slot 属性中 `props` 被重命名为 `attrs`，用来表达需要输出到 DOM 元素上的属性。<!-- #Select #Dropdown -->

### 💡 主要变更

- [+] `Column` 组件新增 `filter-options` 与 `filter-multiple` prop，用于开启内置的下拉筛选并设置单选/多选。<!-- #Column -->
- [^] `Column` 组件的 `filter-value` prop 可以支持 `true` 以外的其它属性，在使用内置下拉筛选时对应下拉选项的 `value` 值。当值为 `null` 时，用来指定筛选未激活的状态。<!-- #Column -->
- [+] `Column` 组件新增 `filter-title` prop，用于指定下拉筛选的标题说明。<!-- #Column -->
- [+] `Dropdown` 组件的 `trigger` slot 新增作用域参数 `expanded` / `toggle`，用于获取/切换下拉菜单的展开状态。<!-- #Dropdown -->

### 🐞 问题修复

- [^] 修复了 `less-plugin-dls` 版本依赖错误的问题。

## 2.0.0-beta.26

### ⚠️ 非兼容性变更

- [-] 已移除 `Uploader` 组件的 `compat` prop，不再兼容 `string` 类型的 `value`。<!-- #Uploader -->

### 💡 主要变更

- [^] `Uploader` 组件大幅重构，并拆分组件实现。<!-- #Uploader -->
- [+] `Uploader` 组件新增 `key-field` prop，用于指定 `value` 数组项的唯一键的键名。默认为 `'key'`。<!-- #Uploader -->
- [+] `Uploader` 组件的 `value` 数组项新增唯一键字段，用于数据回填时的定位到准确的位置。<!-- #Uploader -->
- [+] `Uploader` 组件新增 `multiple` prop，用于指定 `value` 的数据类型是否为数组。如果 `multiple` 为 `true`，即使 `maxCount` 为 `1`，`value` 仍为数组类型。而当指定了大于 `1` 的 `max-count` 值，即使 `multiple` 为 `false` 也不会生效，`value` 始终为数组。<!-- #Uploader -->
- [+] `Uploader` 组件新增 `after-pick` 函数 prop，用于新增在选择完文件后执行定的 hook 逻辑。<!-- #Uploader -->

### 🐞 问题修复

- [^] 修正了 `Table` 组件没有正确处理非可排序列的标题交互状态导致可能报错的问题。<!-- #Table -->

## 2.0.0-beta.25

### 💡 主要变更

- [+] `v-drag` 指令增加 `sort` 类型，用于容器内元素列表的拖动排序。<!-- #v-drag -->
- [+] `Progress` 组件在进度条模式下支持新增的属性 `indeterminate`，用于展示不确定进度的情况。<!-- #Progress -->

### 🐞 问题修复

- [^] 修复 `Uploader` 组件的 `max-size` 校验在 iframe 上传模式下失效的问题。<!-- #Uploader -->
- [^] 为 `file` 类型的 `Uploader` 在 iframe 上传模式下提供正常的进度条展示（不确定进度）。<!-- #Uploader -->

## 2.0.0-beta.24

### 💡 主要变更

- [+] `Column` 组件新增 `filter-value` prop，用来指定表格列的筛选值。当前仅支持在发生过筛选后设置为 `true`。<!-- #Column -->
- [+] `Column` 组件新增 `filter` slot，用来指定自定义筛选下拉浮层内容。<!-- #Column -->

### 🐞 问题修复

- [^] 修正 `RadioGroup` / `CheckboxGroup` 组件样式可能错误触发容器发生溢出滚动的问题。<!-- #RadioGroup -->
- [^] `Link` 组件的 `to` prop 现在可以正常使用绝对路径了。<!-- #Link -->
- [^] 修正 `Radio` / `Checkbox` / `Switch` 组件在点击时会触发两次 `click` 事件的问题。<!-- #Radio -->

## 2.0.0-beta.23

### ⚠️ 非兼容性变更

- [-] 已移除实验性全局配置项 `modal.scrollLockMode`，原因是保留滚动位置时无法保证屏幕不发生瞬间闪烁。<!-- #veui -->

### 🐞 问题修复

- [^] 修正 `Overlay` 组件在有开启 `inline` / `local` prop 的父级 `Overlay` 时报错的问题。<!-- #Overlay -->
- [^] 修正 `Uploader` 组件在单文件模式下外部修改文件列表不正常的问题。<!-- #Uploader -->

## 2.0.0-beta.22

### 🐞 问题修复

- [^] 修正 `Uploader` 组件插槽参数中字段缺失 `status` 的问题。<!-- #Uploader -->
- [^] 修正遗漏 `shopping-cart` 和 `film` 图标的问题。<!-- #veui-theme-dls-icons -->

## 2.0.0-beta.21

### 💡 主要变更

- [^] `Dialog` 触发滚动锁定时，新增实验性全局配置项 `modal.scrollLockMode`，可选值为 `safe` / `advanced`。<!-- #Dialog -->

  > #### 详细说明
  >
  > 滚动锁定用来处理在出现全屏遮罩时，滚动行为透传到上层滚动容器的问题。目前的主流方案都使用 `overflow: hidden` 将上层滚动容器锁定，但当滚动条可见时，切换时会导致容器内部的尺寸发生变化进而发生抖动，故通常方案将在容器上添加一个额外的与滚动条宽度相同的 `padding-right` 来保持内部布局的稳定，也就是 `safe` 模式下采取的行为。但当视口发生滚动时，隐藏其滚动条将使得视口尺寸发生变化，固定定位元素的相对参考位置也会发生变化，会对这部分元素产生滚动条宽度的抖动。如果想避免这一现象，可以全局配置 `modal.scrollLockMode` 为 `advanced`，将采取另一种锁定策略，将 `<body>` 元素固定定位到撑满视口并 `overflow: hidden`，从而使视口不会发生内容溢出，同时强制 `<html>` 使用 `overflow: scroll`，保证视口滚动条依然展示，以达到视口内内容的稳定。但这种模式下同样可能对本身相对 `<body>` 元素底部绝对定位的元素产生副作用。使用时可以测试两种不同的模式后自行选择。

### 🐞 问题修复

- [^] 修正 `Uploader` 组件插槽参数中字段缺失的问题。<!-- #Uploader -->
- [^] 修正 `Select` 组件在校验错误状态下的样式问题（#758）。<!-- #Select -->

## 2.0.0-beta.20

### 💡 主要变更

- [^] `Table` 组件现在在整个表头区域内点击都会触发排序（如果开启了排序功能），内部可获取焦点的元素（被认为可以触发其它交互）除外。<!-- #Table -->

### 🐞 问题修复

- [^] 修正 `Uploader` 组件后缀名校验不正确的问题。<!-- #Uploader -->
- [^] 修正 `Tooltip` 组件内容可能溢出容器的问题。<!-- #Tooltip -->
- [^] 修正 `Link` 组件在新标签/窗口打开链接（通过 <kbd>Ctrl</kbd>/<kbd>Shift</kbd>/<kbd>⌘</kbd> + 鼠标点击或链接包含 `target="_blank"` 时）时，原标签/窗口内容发生跳转的问题。<!-- #Link -->

## 2.0.0-beta.19

### 🐞 问题修复

- [^] 更新 `dls-icons-vue` 依赖，修正图标 treeshake 逻辑没有正常生效的问题。<!-- #veui-theme-dls-icons -->

## 2.0.0-beta.18

### 🐞 问题修复

- [^] 修正 `veui-theme-dls-icons` 图标没有更新的问题。<!-- #veui-theme-dls-icons -->

## 2.0.0-beta.17

### 💡 主要变更

- [+] `Column` 组件新增 `desc` prop，可用来在表头通过 `Popover` 输出额外说明。同时新增对应的 `desc` 插槽，来自定义 `Popover` 组件的内容。<!-- #Table -->
- [+] `Tabs` 组件新增 `eager` prop，将提前渲染未激活的标签面板内容。<!-- #Tabs -->

### 🐞 问题修复

- [^] 修正 `Uploader` 组件在图片/视频上传时底栏操作时间遗漏回调参数的问题。<!-- #Uploader -->
- [^] 修正 `Tabs` 组件有时无法滚动到最后的问题。<!-- #Tabs -->

## 2.0.0-beta.16

### 🐞 问题修复

- [^] 修正 `Tabs` 组件在移除标签项时激活状态切换不正确的问题。<!-- #Tabs -->

## 2.0.0-beta.15

### 💡 主要变更

- [+] `Lightbox` 组件新增 `options` prop，允许指定视频项播放时的 `muted` / `autoplay` / `controls` 等配置。<!-- #Lightbox -->
- [+] `Uploader` 组件新增 `preview-options` prop，允许指定预览时调用的 `Lightbox` 的配置。<!-- #Uploader -->

### 🐞 问题修复

- [^] 修正 `Uploader` 组件在图片、视频上传状态下的预览图标。<!-- #Uploader -->
- [^] 修正 `Uploader` 组件有时没有正确处理图片预览的问题。<!-- #Uploader -->
- [^] 修正 `Uploader` 组件在某一上传项第二次上传/校验失败后无法展示失败理由的问题。<!-- #Uploader -->
- [^] 修正 `Lightbox` 未处理初始化时焦点导致打开后初始状态下键盘切换项目失效的问题。<!-- #Lightbox -->
- [^] 修正 `Pagination` 组件在没有传入 `to` prop 时，点击跳转到 x 页后没有触发 `redirect` 事件的问题。<!-- #Pagination -->

## 2.0.0-beta.14

### 🐞 问题修复

- [^] 修正 `veui` 没有正确标注 `dls-graphics` 依赖类型的问题。<!-- #veui -->

## 2.0.0-beta.13

### 🐞 问题修复

- [^] 修正 `veui-loader` 没有正确标注 `magic-string` 依赖类型的问题。<!-- #veui-loader -->

## 2.0.0-beta.12

### ⚠️ 非兼容性变更

- [+] `Uploader` 组件新增了 `m` / `s` 两种 `ui` 属性值，默认尺寸有所增大。<!-- #Uploader -->

### 💡 主要变更

- [+] 新增了 `Lightbox` 组件。<!-- #Lightbox -->
- [+] 为 `Dropdown` / `Select` / `SearchBox` / `DatePicker` / `TimePicker` / `Autocomplete` 组件新增可受控 prop `expanded` 和 `toggle` 事件，用来控制其下拉浮层的展开/收起。<!-- #Dropdown -->
- [+] `Table` 组件新增 `loading` prop，展示“加载中”状态。<!-- #Table -->
- [+] `Table` / `Column` 组件新增 `allowed-orders` prop，支持定制允许的顺序。<!-- #Table -->
- [+] `Select` 组件新增 `trigger` 插槽，用于自定义下拉触发区域。<!-- #Select -->
- [+] `Select` 组件新增 `selected` 插槽，用于自定义下拉按钮已选项回填内容的展示。<!-- #Select -->

  > #### 与 `label` 插槽的区别
  >
  > `label` 插槽仅针对收起状态下的已选项回填内容，而 `selected` 插槽包括了展开状态下的已选项回填内容。

- [+] `Uploader` 组件新增了 `type` prop 的可选值 `video` / `media`，用来支持视频上传的场景。<!-- #Uploader -->
- [+] `Uploader` 组件新增了 `entries` prop，内置了多入口操作的功能，类型和 `controls` 的返回值相同。<!-- #Uploader -->
- [^] 为 `Loading` 组件添加了新的动效。<!-- #Loading -->

### 🐞 问题修复

- [^] 修正 `Progress` 组件偶尔会由于浏览器编码识别错误显示了错误内容的问题。<!-- #Progress -->
- [^] 修正 `RadioGroup` 组件和 `CheckboxGroup` 组件在内容换行时显示不正确的问题。<!-- #RadioGroup -->
- [^] 修正 `SearchBox` 组件按下 <kbd>enter</kbd> 时触发表单提交的问题。<!-- #SearchBox -->
- [^] 修正 `Select` 组件在清空时将禁用的选项一同清空的问题。<!-- #Select -->

## 2.0.0-beta.11

### 💡 主要变更

- [+] `Uploader` 组件的 `upload` 自定义函数 prop 中的第二个参数增加 `oncancel: Function` 字段，可在自定义上传逻辑中主动取消上传。对于“重新上传”场景，取消后将恢复为之前已经上传的文件。<!-- #Uploader -->

### 🐞 问题修复

- [^] 修复从外部改变 `Uploader` 组件的 `value` prop 导致渲染不正确的问题。<!-- #Uploader -->
- [^] 修复了 `Dialog` 组件在关闭时也可能抛出 `cancel` 事件的问题。<!-- #Dialog -->
- [^] 修复了 `NumberInput` 组件在右键点击调节按钮时会触发连续调整的问题。<!-- #NumberInput -->

## 2.0.0-beta.10

### 🐞 问题修复

- [^] 修复上个版本 `Overlay` 组件 `target` 更新逻辑引入的导致 `match-width` 在第一次浮层展开时失效的问题。<!-- #Overlay -->
- [^] 修正 `Form` 组件没有正确通过 `Field` 的 `name` prop 进行识别的问题。<!-- #Form -->
- [^] 修正 `Accordion` 组件无限重渲染的问题。<!-- #Accordion -->

## 2.0.0-beta.9

### 💡 主要变更

- [+] `DatePicker` 组件新增 `parse` prop 用于指定如何从输入值解析日期对象。<!-- #DatePicker -->
- [+] `DatePicker` 组件新增 `selectstart` / `selectprogress` 事件，用于对外同步日期范围选择的过程信息。<!-- #DatePicker -->
- [+] `Calendar` / `DatePicker` 组件的 `disabeldDate` prop 在日期范围选择过程中，新增第二个参数，表示当前第一个选择日期。<!-- #Calendar -->
- [+] `Input` / `Textarea` 组件新增 prop `get-length`，用于自定义计算已输入字符串长度的逻辑。<!-- #Input #Textarea -->

### 🐞 问题修复

- [^] 修复 `Schedule` 组件快捷选项由于引用被修改导致的数据混乱。<!-- #Schedule -->
- [^] 修复了 `Dialog` / `Table` 组件在极端条件下触发 Firefox 图层合成 bug 的问题。<!-- #Dialog #Table -->
- [^] `Overlay` 组件现在不仅在初始化时查找 `target` 对应元素，而是在每次显示时均查找，使得定位逻辑不再依赖对应元素的渲染顺序。<!-- #Overlay -->
- [^] 修正了 `Select` 组件中已选的 `disabled` 选项可以被删除的问题。<!-- #Select -->
- [^] 修正了 `Select` 组件中内联 `Option` 的 `disabled` prop 不生效的问题。<!-- #Select -->

## 2.0.0-beta.8

### 💡 主要变更

- [+] `Uploader` 组件的插槽 `button-label` 现在对图片上传也生效（默认为添加图片图标）。<!-- #Uploader -->
- [^] 去除了所有输入组件、按钮默认的 `vertical-align: middle` 样式。<!-- #Autocomplete #Badge #ButtonGroup #Button #Dropdown #InputGroup #Input #Loading #Pagination #Progress #SearchBox #Select #Switch #Tag  -->

### 🐞 问题修复

- [^] 修正 `Transfer` 组件无法正常删除父级选项的问题。<!-- #Transfer -->
- [^] 修正 `Input` 组件在 Firefox 下无法正常输入的问题。<!-- #Input -->
- [^] 修复 `Dialog` 内容在极端场景下触发 Firefox 图层合成 bug 的问题。<!-- #Dialog -->
- [^] 默认为可搜索的 `Select` 中的 `Input` 关闭了原生 `autocomplete` 功能，以避免原生浮层与 `Select` 下拉浮层重叠的问题。<!-- #Select -->

## 2.0.0-beta.7

### 🐞 问题修复

- [^] 修复 `Tab` 面板内容没有正确响应外部数据变化的问题。<!-- #Tab -->
- [^] 修复 `CheckboxGroup` 选项间距不正确的问题。<!-- #CheckboxGroup -->

## 2.0.0-beta.6

### ⚠️ 非兼容性变更

- [^] `veui-theme-dls-icons` 中的 `plus-square-circle` 和 `storage` 图标名称分别修正为 `plus-square` 和 `save`。<!-- #veui-theme-dls-icons -->

### 💡 主要变更

- [+] `CheckboxGroup` 和 `CheckButtonGroup` 组件的 `items` prop 项目支持传入 `exclusive: true` 来指定当前项为排它选项，即选择后将取消其它选中项。<!-- #CheckboxGroup #CheckButtonGroup -->
- [+] `CheckboxGroup` 和 `CheckButtonGroup` 组件新增 `empty-value` prop，用来指定在用户取消所有复选项时需要重新选中的项目，需要配合新增的 `exclusive` 使用。<!-- #CheckboxGroup #CheckButtonGroup -->
- [+] 为 `ButtonGroup` 的 `ui` 增加可选值 `basic`。<!-- #ButtonGroup -->

### 🐞 问题修复

- [^] 修正 `Slider` 组件值为 `0` 时渲染不正常的问题。<!-- #Slider -->

## 2.0.0-beta.5

### 🐞 问题修复

- [^] 修复 `Select` 组件中使用了废弃的 `Tag` 组件接口的问题。<!-- #Select -->
- [^] 修复 `Dropdown` 组件焦点状态不会在关闭后自动清除的问题。<!-- #Dropdown -->
- [^] 修复 `DatePicker` 组件浮层位置无法指定的问题。<!-- #DatePicker -->
- [^] 修复图标按钮内图标的边距问题。<!-- #Button -->
- [^] 修复 `Table` 组件表头图标颜色错误的问题。<!-- #Table -->
- [^] 修复 `Menu` 组件顶层导航项的字重。<!-- #Menu -->

## 2.0.0-beta.4

### ⚠️ 非兼容性变更

- [+] `Tag` 组件的 `closable` prop 重命名为 `removable`。<!-- #Tag -->
- [+] `Tag` 组件的 `close` 事件重命名为 `remove`。<!-- #Tag -->

### 💡 主要变更

- [+] `NumberInput` 组件增加 `parse` / `format` prop，用来对输入的内容进行格式化输出。<!-- #NumberInput -->
- [+] `Tag` 组件增加 `removed` prop，可以通过外部控制是否被移除。<!-- #Tag -->

## 2.0.0-beta.3

### ⚠️ 非兼容性变更

- [^] `veui-theme-dls-icons` 中，`triangle-up` / `triangle-right` / `triangle-down` / `triangle-left` 分别重命名为 `caret-up` / `caret-right` / `caret-down` / `caret-left`。<!-- #veui-theme-dls-icons -->

### 💡 主要变更

- [^] 所有支持 `v-model` / `.sync` 的 prop 现在均支持完全受控模式。<!-- #Accordion #Alert #AlertBox #CheckButtonGroup #CheckboxGroup #Collapse #ConfirmBox #Dialog #Drawer #Input #NumberInput #Progress #PromptBox #Radio #SearchBox #Select #Slider #Switch #Table #Tabs #Tag #Textarea #TimePicker #Toast #Tooltip #Transfer #Tree #Uploader -->
- [+] `Input` 组件增加 `placeholder` 插槽。<!-- #Input -->
- [^] `Select` 组件的 `label` 插槽现在可以对 `multiple` 及 `searchable` 的状态生效了。<!-- #Select -->

### 🐞 问题修复

- [^] 修复 `Icon` 组件 `name` 为 `null` 时报错的问题。<!-- #Icon -->
- [^] 修复 `Select` / `Slider` / `Tabs` / `InputGroup` / `Collapse` 等组件样式细节。<!-- #Select #Slider #Tabs #InputGroup #Collapse -->
- [^] 修复 `Label` 组件 `for` prop 不支持传入组件/元素的问题。<!-- #Label -->

## 2.0.0-beta.2

### ⚠️ 非兼容性变更

- [-] 移除 `veui-theme-one-icons`。<!-- #veui-theme-one-icons -->

### 💡 主要变更

- [+] 允许 `CheckButtonGroup` 配置 `icons.check` 来指定已选项的图标。<!-- #CheckButtonGroup -->

### 🐞 问题修复

- [^] 修复多数组件内的图标按钮样式。
- [^] 修复 `DatePicker` 与 `Textarea` 的样式问题。<!-- #DatePicker #Textarea -->

## 2.0.0-beta.1

### 💡 主要变更

- [^] 基于 `dls-icons-vue` 重新实现了 `veui-theme-dls-icons`。<!-- #veui-theme-dls-icons -->
- [^] `RadioButton` 组件的 `value` prop 支持可受控模式。<!-- #RadioButton -->

### 🐞 问题修复

- [^] 修复了全局 config 模块可能进入无限递归的问题。<!-- #veui -->

## 2.0.0-beta.0

### ⚠️ 非兼容性变更

- [^] `veui-theme-dls` 对组件的 `ui` prop 进行了调整，见下表。<!-- #Button #Dropdown #Field #Table #Tabs #Tag -->

  | 组件       | 删除                                 | 新增                                  |
  | ---------- | ------------------------------------ | ------------------------------------- |
  | `Button`   | -                                    | `normal` / `basic` / `aux` / `square` |
  | `Dropdown` | -                                    | `basic` / `normal`                    |
  | `Field`    | `micro` / `tiny` / `small` / `large` | `xs` / `s` / `m` / `l`                |
  | `Table`    | -                                    | `compact` / `loose` / `normal`        |
  | `Tabs`     | -                                    | `simple` / `strong`                   |
  | `Tag`      | `borderless`                         | `bordered`                            |

  其中，按钮默认样式变为 `normal`，原默认样式现对应为 `basic`。

- [^] 将 `ButtonGroup` / `RadioGroup` / `CheckboxGroup` / `RadioButtonGroup` / `CheckButtonGroup` 组件的每个项目的作用域插槽从 `default` 更名为 `item`。后续使用时需要用 `<template #item="...">...</template>` 自定义项目内容。<!-- #ButtonGroup #RadioGroup #CheckboxGroup #RadioButtonGroup #CheckButtonGroup -->
- [-] 移除了 `GridContainer` 组件的 `flex` prop，默认行容器均使用 flex 布局，不再按条件指定。<!-- #GridContainer -->
- [-] 移除了 `Input` 组件的 `prepend` / `append` 插槽，并将 `before` / `after` 插槽移入 `Input` 内部。原有的前后组合的场景请使用 `InputGroup` 组件进行组合输入型组件使用。<!-- #Input -->
- [^] `NumberInput` 组件的 `prepend` / `append` 插槽重命名为 `before` / `after`。<!-- #NumberInput -->
- [^] `Progress` 组件的 `append` 插槽重命名为 `after`。<!-- #Progress -->
- [^] `Tree` 组件的 `item-prepend` / `item-append` 插槽重命名为 `item-before` / `item-after`。<!-- #Tree -->

### 💡 主要变更

- [^] 将整体设计切换到了 D20 版本。<!-- #veui-theme-dls -->
- [^] 新增 `Nav` 组件。<!-- #Nav -->
- [+] `Alert` 组件的 `default` / `extra` 插槽增加参数 `close`，可用来控制提示的关闭。<!-- #Alert -->
- [+] `Alert` 组件的 `extra` 插槽增加参数 `message`。<!-- #Alert -->
- [+] `Form` 组件新增 `actions` 插槽，用来放置操作按钮。<!-- #Form -->
- [+] `Icon` 组件的 `name` prop 支持直接传入组件定义进行渲染，此时只支持 `spin` 属性。<!-- #Icon -->
- [+] `OptionGroup` 组件的 `option-tag` prop 支持传入 `function`，来根据选项数据动态生成内部 `Option` / `OptionGroup` 使用的标签。<!-- #OptionGroup -->
- [^] `Tree` 组件的 `item` / `item-before` / `item-after` / `item-label` 增加参数 `expanded` 和 `parents`。<!-- #Tree -->
- [+] `Tree` 组件新增 `include-indeterminate` prop，用来指定半选状态的节点是否被计入 `checked` 结果中。<!-- #Tree -->

### 🐞 问题修复

- [^] 修复了 `Menu` 组件的键盘导航功能。<!-- #Menu -->

## 2.0.0-alpha.21

### 🐞 问题修复

- [^] 修正 `Uploader` 组件 `invalid` 事件参数中丢失错误 `type` 字段的问题。<!-- #Uploader -->

## 2.0.0-alpha.20

### 💡 主要变更

- [+] `Uploader` 组件新增 `invald` 事件，在文件校验失败、选择的文件数量超过最大数量限制时触发，回调参数为包含错误信息的数组。<!-- #Uploader -->
- [+] `Uploader` 组件的 `failure` 事件的第一个回调参数文件对象增加字段 `message`，表示错误信息。<!-- #Uploader -->

## 2.0.0-alpha.19

### 🐞 问题修复

- [^] 修正 `NumberInput` 在输入值被 `min` / `max` 裁切时没有正确同步变更的问题。<!-- #NumberInput -->

## 2.0.0-alpha.18

### 🐞 问题修复

- [^] 修正 `Uploader` 在 `iframe` 模式并且已选文件数量达到 `max-count` 的情况下，没有正确上传文件的问题。<!-- #Uploader -->
- [^] 修正 `Uploader` 在 `iframe` 模式下，反复上传文件列表最后一个文件的问题。<!-- #Uploader -->

## 2.0.0-alpha.17

### 💡 主要变更

- [^] `toast` 插件调用后返回值从 `void` 修改为 `function` 类型，调用后将关闭该条提示，可用于自行控制 `Toast` 关闭时机。<!-- #$toast -->

### 🐞 问题修复

- [^] 修正 `Alert` 组件调用 `extra` 插槽的方式，使得不管单条/多条情况下可以使用同样方式调用。<!-- #Alert -->
- [^] 修正 `Alert` 组件数据变化时当前索引值可能溢出的问题。<!-- #Alert -->

## 2.0.0-alpha.16

### 💡 主要变更

- [+] `Checkbox` 组件的 `checked` prop 支持可受控模式。<!-- #Checkbox -->

### 🐞 问题修复

- [^] 修复了 `OptionGroup` 组件在使用内联写法时，动态数据源可能导致渲染结果不正确的问题。<!-- #OptionGroup -->
- [^] 修复了 `OptionGroup` 组件的 `before` / `after` slot 在配合 `v-slot` 语法结合动态数据源时在数据变化后消失的问题。<!-- #OptionGroup -->

## 2.0.0-alpha.15

### 💡 主要变更

- [+] `Overlay` 组件新增了 `local` prop，值为 `true` 时浮层将不被移到 `<body>` 元素下并且脱离全局浮层顺序管理。<!-- #Overlay -->

### 🐞 问题修复

- [^] 修复了 `Overlay` 组件没有正确销毁的问题。<!-- #Overlay -->
- [^] 修复了 `InputGroup` 组件在子组件指定了自定义的 `class` 时样式可能不正确的问题。<!-- #InputGroup -->

## 2.0.0-alpha.14

### 💡 主要变更

- [^] `Calendar` 组件的 `selected` prop 支持可受控模式。<!-- #Calendar -->
- [^] `Carousel` 组件的 `index` prop 支持可受控模式。<!-- #Carousel -->
- [^] `TimePicker` 组件的 `value` prop 支持可受控模式。<!-- #TimePicker -->
- [^] `Dropdown` 组件新增 slot `trigger`，用于自定义下拉触发区域。<!-- #Dropdown -->
- [+] `Dropdown` 组件默认 slot 新增参数 `close` 函数，用来在自定义下拉内容区时需要关闭下拉浮层时调用。<!-- #Dropdown -->
- [+] `Overlay` 组件新增 `local` prop，用来指定不将浮层移动到 `document.body` 下，脱离全局浮层管理。<!-- #Overlay -->

### 🐞 问题修复

- [^] 修复了 `Popover` 组件的 `ui` prop 不生效的问题。<!-- #Popover -->
- [^] 修复了 `Tabs` 组件在销毁时依然触发 `active` 变化的问题（[#659](https://github.com/ecomfe/veui/issues/659)）。<!-- #Tabs -->
- [^] 修正了 `Tabs` 组件在 Safari 下的样式问题。<!-- #Tabs -->
- [^] `Menu` 组件使用路由的 `path` 来计算当前激活的项目，而不是 `fullPath`。<!-- #Menu -->

## 2.0.0-alpha.13

### 💡 主要变更

- [+] `Autocomplete` 组件新增了 `option-label` 插槽。<!-- #Autocomplete -->
- [+] `OptionGroup` 组件新增 `before` / `after` 插槽，用于在 `popup` 模式下在新开浮层上下插入自定义内容。<!-- #OptionGroup -->

### 🐞 问题修复

- [^] 修复了 `Tab` 组件的 `label` 等 prop 更新时视图没有同步更新的问题。<!-- #Tab -->
- [^] 修复了 `Menu` 组件数据源在 SSR 环境下无限循环的问题。<!-- #Menu -->
- [^] 修复了 `Anchor` 组件在 SSR 环境下访问 DOM 的问题。<!-- #Anchor -->

## 2.0.0-alpha.12

### 🐞 问题修复

- [^] `veui` 现在在 `babel-plugin-veui` 的 `peerDependencies` 中，以免多版本共存时 `babel-plugin-veui` 无法找到正确的 `veui` 版本。<!-- #babel-plugin-veui -->
- [^] 修复了 `Menu` 组件非受控模式下第一次没有正确同步当前路由状态的问题。<!-- #Menu -->
- [^] 修复了 `Calendar` 组件 `disabled-date` prop 对显示在本月的前后月日期未生效的问题（[#644](https://github.com/ecomfe/veui/issues/502)）。<!-- #Calendar -->
- [^] 现在 `ButtonGroup` 组件只有在按钮项 `value` 为字符串时抛出同名事件，避免在非字符串类型时报错。<!-- #ButtonGroup -->
- [^] 去除了多选 `Select` 组件已选项默认滚动入可视区域的行为（因为可能有多个已选项）。<!-- #Select -->
- [^] 修正了开启搜索功能的 `Dropdown` 组件搜索栏和选项区域同时滚动的问题，搜索栏现在固定在下拉菜单顶端。<!-- #Dropdown -->

## 2.0.0-alpha.11

### ⚠️ 非兼容性变更

- [-] 移除了 `babel-preset-veui`。<!-- #babel-preset-veui -->
- [-] 移除了 `veui-theme-one`。<!-- #veui-theme-one -->
- [-] 移除了 `Tabs` 组件的 `index` prop，现在控制激活标签页只能使用 `active` prop，并支持可受控模式。<!-- #Tabs -->

  > #### 使用指南
  >
  > ##### 使用 `active` prop 与 `change` 事件完全外部控制激活状态
  >
  > ```html
  > <veui-tabs :active="active" @change="tab => active = tab.name">
  >   <veui-tab label="A" name="a">Content A</veui-tab>
  >   <veui-tab label="B" name="b">Content B</veui-tab>
  >   <veui-tab label="C" name="c">Content C</veui-tab>
  > </veui-tabs>
  > ```
  >
  > ##### 使用 `active.sync` 双向同步激活状态
  >
  > ```html
  > <veui-tabs :active.sync="active">
  >   <veui-tab label="A" name="a">Content A</veui-tab>
  >   <veui-tab label="B" name="b">Content B</veui-tab>
  >   <veui-tab label="C" name="c">Content C</veui-tab>
  > </veui-tabs>
  > ```
  >
  > ##### 激活状态完全由组件内部控制
  >
  > ```html
  > <veui-tabs>
  >   <veui-tab label="A">Content A</veui-tab>
  >   <veui-tab label="B">Content B</veui-tab>
  >   <veui-tab label="C">Content C</veui-tab>
  > </veui-tabs>
  > ```

- [^] `Tabs` 组件的 `tabs-extra` slot 更名为 `extra`，且仅包括提示区域的内容，不包括添加按钮。<!-- #Tabs -->
- [-] 移除了 `Tabs` 组件的 `tabs-extra-label` 与 `tabs-extra-tip` slot。<!-- #Tabs -->
- [^] `Tabs` 组件的 `tab-item` scoped slot 现在包含整个按钮/链接，方便替换为自定义实现。<!-- #Tabs -->
- [-] 移除了`Tabs` 组件的 `tab-item-extra` scoped slot，`removable` 的 `Tab` 组件始终显示移除按钮。<!-- #Tabs -->
- [^] `Tabs` 组件在路由模式下，不再自动输出 `<router-view>` 组件，需要通过 `Tab` 的 `default` slot 或 `Tabs` 新增的 `panel` slot 中进行输出。<!-- #Tabs -->

  > #### 使用指南
  >
  > ##### （嵌套）路由模式
  >
  > 在之前的版本，如果 `Tab` 组件的 `default` slot 未传入任何内容，路由模式下 VEUI 会自动在标签内容容器内渲染 `<router-view>`。这导致在不使用嵌套路由时或是希望灵活控制 `<router-view>` 位置时产生额外的问题。所以在这个版本中移除了这个逻辑，用户可以使用 `Tabs` 的 `panel` slot 来统一在标签内容容器中输出 `<router-view>`，也可以在某些 `Tab` 的 `default` slot 中输出 `<router-view>` 及额外内容来覆盖全局的 `panel` slot，甚至可以将 `<router-view>` 输出到其它任意合适的位置。
  >
  > ```html
  > <veui-tabs>
  >   <veui-tab label="A" to="content/a" />
  >   <veui-tab label="B" to="content/b" />
  >   <veui-tab label="C" to="content/c">
  >     <h3>Content C</h3>
  >     <router-view />
  >   </veui-tab>
  >   <template #panel>
  >     <router-view />
  >   </template>
  > </veui-tabs>
  > ```

### 💡 主要变更

- [+] 新增了 `Tabs` 组件的 `tab-label` scoped slot，用于仅自定义标签项内容。
- [+] 新增 `Tabs` 组件的 `panel` slot，用于指定标签下方面板内的自定义内容。
- [+] 新增 `Tabs` 组件的 `change` 事件，回调参数为 `tab` 对像，包含 `name`、`label`、`to`、`status` 等字段。
- [+] 新增 `Tab` 组件的 `item` slot，用于自定义标签内容，与 `Tabs` 组件的 `tab-item` 对应，优先级更高。
- [+] 新增 `Tab` 组件的 `label` slot，用于自定义标签内容，与 `Tabs` 组件的 `tab-label` 对应，优先级更高。

  > #### 使用指南
  >
  > ##### 自定义标签项内容
  >
  > 可以使用 `Tabs` 的 `tab-item` scoped slot 来自定义所有标签项的内容，也可以使用 `Tab` 的 `item` scoped slot 来自定义单个标签项内容（单个内容将覆盖整体的内容）。
  >
  > ```html
  > <veui-tabs>
  >   <veui-tab label="A">
  >     Content A
  >     <template #item="tab">
  >       <button
  >         type="button"
  >         class="foo-btn"
  >         :disabled="tab.disabled"
  >         v-bind="tab.attrs"
  >         @click="tab.activate"
  >       >
  >         {{ `${tab.label} ${tab.active ? '✅' : '' }` }}
  >       </button>
  >     </template>
  >   </veui-tab>
  >   <veui-tab label="B">Content B</veui-tab>
  >   <veui-tab label="C">Content C</veui-tab>
  > </veui-tabs>
  > ```
  >
  > 如果只想定义文本区域的内容（不需重写点击激活等逻辑），请使用 `Tabs` 的 `tab-label` 或 `Tab` 的 `label` scoped slot，用法类似。
  >
  > ```html
  > <veui-tabs>
  >   <veui-tab label="A">
  >     Content A
  >     <template #label="tab"
  >       >Content A {{ `${tab.active ? '✅' : '' }` }}</template
  >     >
  >   </veui-tab>
  >   <veui-tab label="B">Content B</veui-tab>
  >   <veui-tab label="C">Content C</veui-tab>
  > </veui-tabs>
  > ```

### 🐞 问题修复

- [^] 修复了 `Transfer` 组件删除已选项时报错的问题。<!-- #Transfer -->
- [^] 修复了 `Transfer` 组件和 `Tree` 组件在被禁用状态下依然可以添加已选项的问题。<!-- #Transfer #Tree -->
- [^] 修复了悬浮触发的 `Tooltip` 组件可能被错误关闭的问题。<!-- #Tooltip -->
- [^] 修复了在局部输出全局样式时没有正确处理 `Anchor` 浮层的问题。<!-- #Anchor -->
- [^] 修复了 `Overlay` 组件没有响应 `inline` prop 变化的问题。<!-- #Overlay -->
- [^] 修复了 `NumberInput` 组件在 `strong` 模式下最大最小值没有正确工作的问题。<!-- #NumberInput -->

## 2.0.0-alpha.10

### ⚠️ 非兼容性变更

- [^] 使用 `Uploader` 的 `upload` prop 自定义上传过程时，参数中的回调函数 `onload` / `onprogress` / `onerror` 中第一个参数 `file` 被移除，原来提供上传结果、进度或错误信息的第二个参数成为第一个参数。<!-- #Uploader -->

  > #### 迁移指南
  >
  > ##### 原回调方法
  >
  > ```js
  > function upload(file, { onload, onprogress, onerror }) {
  >   const xhr = new XMLHttpRequest()
  >   xhr.upload.onprogress = (e) => onprogress(file, e)
  >   xhr.onload = () => {
  >     onload(file, JSON.parse(xhr.responseText))
  >   }
  >   xhr.onerror = (e) => onerror(file, e)
  >
  >   // ……实际上传操作……
  > }
  > ```
  >
  > ##### 新回调方法
  >
  > ```js
  > function upload(file, { onload, onprogress, onerror }) {
  >   const xhr = new XMLHttpRequest()
  >   xhr.upload.onprogress = (e) => onprogress(e)
  >   xhr.onload = () => {
  >     onload(JSON.parse(xhr.responseText))
  >   }
  >   xhr.onerror = (e) => onerror(e)
  >
  >   // ……实际上传操作……
  > }
  > ```

### 💡 主要变更

- [^] `Uploader` 使用 `upload` prop 自定义上传过程时，如果返回一个函数，该函数将在用户操作取消或上传组件销毁时被调用，用来中断自定义上传过程。<!-- #Uploader -->
- [^] `Uploader` 没有通过文件类型校验、文件大小校验和自定义校验的文件现在会以上传失败的状态出现在文件列表中。<!-- #Uploader -->
- [+] `Uploader` 新增 prop `picker-position`，支持图片上传模式下控制上传按钮始终保持在列表最前面还是最后面。<!-- #Uploader -->
- [+] `Uploader` 新增可供外部调用的方法 `addFiles`，支持通过函数直接添加并上传文件。<!-- #Uploader -->
- [+] `Menu` 组件新增了 `icon` / `before` / `after` 三个插槽。<!-- #Menu -->

### 🐞 问题修复

- [^] 修复了使用 `tabs-extra` 插槽时由于插槽位置错误可能引起报错的问题。<!-- #Tabs -->
- [^] 修正了 `Menu` 组件图标尺寸错误的问题。<!-- #Menu -->
- [^] 调整了部分输入组件的样式，解决了在为组件最外层元素设置宽度后内部组件没有匹配尺寸的问题。<!-- #Input -->
- [^] 修正了 `Table` 组件在初始数据为空时（比如异步加载），滚动事件监听器没有正常初始化导致内容加载后，表头与内容横向滚动不同步的问题。<!-- #Table -->

## 2.0.0-alpha.9

### 🐞 问题修复

- [^] 修复了仍有部分局部输出全局样式对浮层不生效的问题。😭<!-- #veui-theme-dls -->
- [^] 修正了入口文件导出没有与最新组件列表同步的问题。<!-- #veui -->
- [^] 修正了 `Schedule` 组件 tooltip 提示可能失效的问题。<!-- #Schedule -->

## 2.0.0-alpha.8

### 💡 主要变更

- [^] `DatePicker` 组件的 `selected` prop 支持可受控模式。<!-- #DatePicker -->

### 🐞 问题修复

- [^] 修复了局部输出全局样式对浮层不生效的问题。<!-- #veui-theme-dls -->

## 2.0.0-alpha.7

### ⚠️ 非兼容性变更

- [-] 移除了 `Button` 组件的 `loading` 插槽。<!-- #Button -->

### 💡 主要变更

- [+] `veui-theme-dls` 新增了 `@veui-root-element` 变量，支持局部输出全局样式的功能。<!-- #veui-theme-dls -->

  > #### 使用指南
  >
  > 可以配置全局 Less 变量 `@veui-root-element` 为目标区域的元素名（这里必须是自定义元素），此时所有全局样式规则会自动调整到只针对该类元素内部生效，比如：
  >
  > ```less
  > @veui-root-element: v-app;
  > ```
  >
  > 此时输出的全局样式都会带上 `v-app` 前缀，如：
  >
  > ```css
  > v-app button,
  > v-app [type='button'],
  > v-app [type='reset'],
  > v-app [type='submit'] {
  >   -webkit-appearance: button;
  > }
  > ```
  >
  > ##### 为什么要使用自定义元素？
  >
  > 如果允许自定义前缀使用 ID 或类选择器、或者其它复合选择器，将会使全局样式的特异性过高，超过 VEUI 组件样式的特异性（比如 `#app button` > `.veui-button`），导致组件样式被全局 normalize 之类的样式覆盖，产生不符合预期的结果。而由于组件至少有一级类选择器，所以在这里我们只要合理使用自定义元素，就可以有效避免样式覆盖的问题。

### 🐞 问题修复

- [^] 修复了 `Table` 组件初始时表头和内容列有时错位的问题。<!-- #Table -->
- [^] 修正了 `Menu` 引入了错误的尖角图标的问题。<!-- #Menu -->

## 2.0.0-alpha.6

### ⚠️ 非兼容性变更

- [^] 删除了 `Drawer` 组件的 `backdrop-closable` prop，新增 `outside-closable` prop 来控制点击组件外区域时是否关闭。<!-- #Drawer -->
- [-] 移除了 `Sorter` 组件，仅在 `Table` 内部使用。<!-- #Sorter -->
- [^] `Table` 组件带边框的样式修改为依赖新增 prop `bordered`，而非通过 `ui="bordered"` 指定，并且当存在单元格合并（包括表格内容合并和嵌套表头时）必须输出带边框样式。<!-- #Table -->

### 💡 主要变更

- [+] 新增 `Menu` 组件。<!-- #Menu -->
- [+] 指令式调用 `Toast` 组件时，支持传入自定义的渲染函数以输出非纯文本内容。<!-- #$toast -->
- [+] `Table` 组件新增列分组（输出嵌套表头）功能支持。<!-- #Table -->
- [+] `Table` 组件新增固定列功能支持。<!-- #Table -->
- [+] `Dialog` 组件在 `modal` 模式下，新增滚动锁定功能支持。<!-- #Dialog -->

### 🐞 问题修复

- [^] 修复了 `Toast` 组件的进入动画。<!-- #Toast -->
- [^] 修复了 `Input` 组件在非 WebKit 浏览器下报错的问题。<!-- #Input -->
- [^] 修复了 `SearchBox` 组件的 `role` 属性输出。<!-- #SearchBox -->

## 2.0.0-alpha.5

### 🐞 问题修复

- [^] 修复了 `Drawer` 组件没有正确支持 `overlay-class` prop 的问题。<!-- #Drawer -->
- [^] 修正了 `DatePicker` 组件没有根据 `week-start` prop 处理快捷选项的问题。<!-- #DatePicker -->

## 2.0.0-alpha.4

### ⚠️ 非兼容性变更

- [^] `Uploader` 组件调整为适配 DLS 实现，新增了插槽 `upload` 支持图片模式下自定义上传区域，移除 `type-invald` / `size-invalid` / `count-overflow` / `extra-operation` 这四个插槽，移除 prop `progress`，移除 `ui` 选项 `horizontal`。<!-- #Uploader -->
- [^] 用来接入多个版本 VEUI 的 `babel-plugin-veui` 与 `veui-loader` 的 `name` 选项重命名为 `alias`。<!-- #babel-plugin-veui #veui-loader -->
- [^] `Tree` 组件的 `item-click` prop 被移除，现在点击内容区域的行为修改为：`selectable` 时切换选中，否则 `checkable` 时切换勾选，否则在有子节点时切换展开收起。<!-- #Tree -->

### 💡 主要变更

- [+] `Uploader` 组件新增了 `validator` prop，支持自定义的异步校验功能。<!-- #Uploader -->
- [+] `Uploader` 组件新增了 `controls` prop，支持在图片模式下自定义可对文件进行的操作。<!-- #Uploader -->
- [^] `veui-loader` 和 `babel-plugin-veui` 的 `name` 选项改名为 `alias`。<!-- #veui-loader #babel-plugin-veui -->
- [+] `Tooltip` 与 `Popover` 新增了 `autofocus` prop，允许在 `interactive` 不为 `false` 时在打开时自动聚焦内容。<!-- #Tooltip #Popover -->
- [+] `Input` 与 `Textarea` 新增了 `maxlength` prop，用来指定最长的字符数限制。<!-- #Input #Textarea -->
- [+] `Input` 与 `Textarea` 新增了 `strict` prop，用来指定是否允许在字符数到达 `maxlength` 限制时继续输入。<!-- #Input #Textarea -->
- [+] 新增 `babel-plugin-veui/rewrite`，可以将指定路径下对 `veui` 的依赖根据 `alias` 参数重写。<!-- #babel-plugin-veui -->

  > #### 例子
  >
  > 对于一个典型的同时引入两个版本 VEUI 的项目，`babel.config.js` 内容建议如下：
  >
  > ```js
  > module.exports = {
  >   presets: ['@vue/app'],
  >   plugins: ['veui', ['veui', { name: 'veui-next' }, 'veui-next'], 'lodash'],
  >   overrides: [
  >     {
  >       test: [/veui-theme-dls/],
  >       plugins: [['babel-plugin-veui/lib/rewrite', { alias: 'veui-next' }]]
  >     }
  >   ]
  > }
  > ```

### 🐞 问题修复

- [^] 修正了 `veui-loader` 读取到非用户依赖版本的 `veui` 版本的问题。<!-- #veui-loader -->
- [^] 修正了 `veui-loader` 会对用户依赖版本 `veui` 生效而  非仅仅对指定别名的包生效的问题。<!-- #veui-loader -->
- [^] 修复 `DatePicker` 组件 shortcut 样式不正确的问题。<!-- #DatePicker -->
- [^] 修复 `Uploader` 组件在有文件未上传完成的情况下，上传新文件会重复上传未上传完的文件的问题。<!-- #Uploader -->
- [^] 修复 `Option` 聚焦时可能错误引发滚动的问题。<!-- #Option -->
- [^] 修复了部分样式未按类名前缀变量进行输出的问题。<!-- #veui -->
- [^] 修复了对 `date-fns` 模块引用了错误路径的问题。<!-- #veui -->

## 2.0.0-alpha.3

### ⚠️ 非兼容性变更

- [-] `DatePicker` 组件不再支持 `shortcuts-position` 和 `panel` prop，并删除对应的全局配置项 `datepicker.shortcutsPosition`。<!-- #DatePicker -->

### 💡 主要变更

- [+] 为 `veui-loader` 与 `babel-plugin-veui` 增加了自定义 `veui` 别名的功能，以允许项目同时使用多个版本的 VEUI，帮助顺利从 `veui@1` 向 `veui@2` 进行切换。详细用法见 #596。<!-- #veui-loader #babel-plugin-veui -->
- [+] 新增 `InputGroup` 组件。<!-- #InputGroup -->
- [+] 为 `Label` 组件增加了 `for` prop，用于显式指定被激活的输入组件。<!-- #Label -->
- [+] 为 `Input` / `NumberInput` / `TimePicker` / `Textarea` / `Autocomplete` 组件增加 `invalid` prop，使其处于错误状态。<!-- #Input #NumberInput #TimePicker #Textarea #Autocomplete -->
- [+] 为 `Autocomplete` / `Dropdown` / `Input` / `SearchBox` / `TimePicker` 组件新增 `clear` 事件。（#591）<!-- #Autocomplete #Dropdown #Input #SearchBox #TimePicker -->
- [+] 为 `Dialog` / `Drawer` / `Embedded` / `PromptBox` 新增 `loading` prop，默认使确认按钮处于加载状态。<!-- #Dialog #Drawer #Embedded #PromptBox -->
- [+] 为 `PromptBox` 增加 `invalid` prop，会使内部的输入框处于错误状态。<!-- #PromptBox -->
- [^] 现在 `confirm` / `prompt` 的 manager 与插件中，`ok` / `cancel` 选项函数返回 `false` 或返回的 `Promise` resolve `false` 时，将阻止对话框关闭。<!-- #$confirm #$prompt -->
- [^] 现在 `prompt` 的 manager 与插件中，`ok` / `cancel` 选项函数会接收到输入框当前值作为第一个参数。（#593）<!-- #$prompt -->
- [^] `DatePicker` / `Calendar` 组件样式更新到 DLS 版本。<!-- #DatePicker #Calendar -->
- [^] `DatePicker` 组件新增全局配置项 `datepicker.monthRangePlaceholder` 与 `datepicker.yearRangePlaceholder`。<!-- #DatePicker -->
- [+] `Calendar` 组件 `viewchange` 事件参数中新增该事件触发面板的 `index` 数据。<!-- #Calendar -->
- [+] `DatePicker` / `Calendar` 组件支持月份/年份的范围选择。<!-- #DatePicker #Calendar -->
- [+] `Calendar` 组件支持月份/年份的多选。<!-- #Calendar -->
- [+] 可搜索的 `Select` 组件现在在输入过程中会对外触发 `input` 事件并携带输入内容。<!-- #Select -->
- [+] `Select` 新增作用域插槽 `tag`，用来自定义多选情况下已选项的内容。<!-- #Select -->

### 🐞 问题修复

- [^] 修复 `Slider` 组件分段模式下两端缺少 marker 的问题。<!-- #Slider -->
- [^] 修复 `Transfer` 组件中搜索功能没有正确随组件设置禁用的问题。<!-- #Transfer -->
- [^] 修复 `Column` 的 `head` / `foot` 插槽数据更新失效的问题。<!-- #Column -->
- [^] 优化了 `Select` / `Dropdown` 组件的键盘操作。<!-- #Select #Dropdown -->
- [^] 优化了 `NumberInput` 组件的显示。<!-- #NumberInput -->
- [^] 修复 `Textarea` 的 `placeholder` 没有生效的问题。<!-- #Textarea -->
- [^] 修复 `SearchBox` 在未触发下拉提示时按下 <kbd>enter</kbd> 也不触发 `submit` 事件的问题。<!-- #SearchBox -->

## 2.0.0-alpha.2

### ⚠️ 非兼容性变更

- [^] `Searchbox` 组件更名为 `SearchBox`。同时组件内部所有的 `class` 中的 `searchbox` 亦被更名为 `search-box`。如果在样式代码中进行过定制，请进行全局替换。<!-- #SearchBox -->

### 💡 主要变更

- [+] `Switch` 组件增加了 `on-label` 和 `off-label` prop 以及 `content` 作用域插槽，支持在内部输出提示文字或其它内容。<!-- #Switch -->
- [^] 重写了 overlay manager，修复了输出的 `z-index` 无限制上涨的问题。<!-- #veui -->
- [+] 新增了全局配置项 `managers.overlay`，可以注入其它实例接管浮层管理逻辑。<!-- #veui -->
- [^] 调整了耦合组件的关联机制，现在 `Column`、`Tab` 等组件可以被封装在其它组件内，填充入 `Table`、`Tabs` 等的插槽中使用。<!-- #Column #Tab #Table #Tabs -->
- [+] `Dialog` 新增了 `footless` prop，用于不输出默认的底部操作栏。<!-- #Dialog -->

### 🐞 问题修复

- [^] 修复 `Tabs` 组件有时为激活 tab 的操作设置了错误参数的问题。<!-- #Tabs -->
- [^] 修复 `Schedule` 组件合并选择范围时可能出现的问题。<!-- #Schedule -->
- [^] 修正了大量样式细节。<!-- #veui-theme-dls -->

## 2.0.0-alpha.1

### 💡 主要变更

- [^] 补充了 `veui-theme-dls-icons` 中缺失的图标。<!-- #veui-theme-dls-icons -->

## 2.0.0-alpha.0

### ⚠️ 非兼容性变更

- [^] 用 Popper.js 替代了 Tether。`Overlay` 组件的 `options` prop（以及多个组件的 `overlay-options` prop）现在都对应于 [Popper.js 的 `options` 参数](https://popper.js.org/popper-documentation.html#new_Popper_new)。`Overlay` 的 `position` prop 在之前的版本就已经兼容了 Popper.js 的语法，所以如果之前就以 Popper.js 风格进行描述，则无需调整。见 [#574](https://github.com/ecomfe/veui/pull/574)。<!-- #Overlay -->
- [^] `Input` 组件的 `before` / `after` slot 重命名为 `prepend` / `append`，新的 `before` / `after` 位置在输入框外部。并且新增了 `before-label` / `after-label` 两个 slot。见 [#502](https://github.com/ecomfe/veui/issues/502)。<!-- #Input -->
- [^] `NumberInput` 组件的 `before` / `after` slot 重命名为 `prepend` / `append`。见 [#502](https://github.com/ecomfe/veui/issues/502)。<!-- #NumberInput -->
- [-] 移除 `Alert` 组件的 `close-label` 属性。<!-- #Alert -->
- [^] `Pagination` 组件根据新的设计不再支持总数显示。<!-- #Pagination -->
- [-] 移除已废弃的 `Pager` 组件，请使用 `Pagination` 组件代替。
- [-] 移除 `Progress` 组件已废弃的 `precision` prop，请使用 `decimal-place` prop 代替。<!-- #Progress -->
- [-] 移除 `Progress` 组件已废弃的 `state` prop，请使用 `status` prop 代替。<!-- #Progress -->
- [-] 移除 `Progress` 组件已废弃的 `auto-succeed` prop，请使用 `autosucceed` prop 代替。<!-- #Progress -->
- [-] 移除 `Schedule` 组件已废弃的 `shortcuts-display` 值 `expand` / `collapse`，请使用 `inline` / `popup` 代替。<!-- #Schedule -->
- [-] 移除 `OptionGroup` 组件已废弃的 `position` 值 `popout`，请使用 `popup` 代替。<!-- #OptionGroup -->
- [-] 移除 `Tooltip` 组件已废弃的 `custom` prop，请使用 `trigger: 'custom'` 代替。<!-- #Tooltip -->
- [-] 移除 `Tree` 组件已废弃的 `expands` prop，请使用 `expanded` 代替。<!-- #Tree -->
- [-] 移除 `Uploader` 组件已废弃的 `auto-upload` prop，请使用 `autoupload` prop 代替。<!-- #Uploader -->
- [-] `Uploader` 组件响应数据中的 `status` 及 `reason` 字段被移除，请使用 `success` 及 `message` 代替。见 [1.0.0-alpha.19](#1.0.0-alpha.19) 的迁移指南。<!-- #Uploader -->

### 💡 主要变更

- [+] 支持在编译时指定组件 class 前缀。具体自定义方式见 [#573](https://github.com/ecomfe/veui/pull/573)。<!-- #veui -->
- [+] 新增了 `veui-theme-dls` 主题并将大部分组件调整为适配 DLS 实现。<!-- #veui-theme-dls -->
- [+] 新增了 `Loading` 组件。<!-- #Loading -->
- [+] 新增了 `Collapse` 组件。<!-- #Collapse -->
- [+] 新增了 `Accordion` 组件。<!-- #Accordion -->
- [+] 新增了 `Badge` 组件。<!-- #Badge -->
- [+] 新增了 `TimePicker` 组件。<!-- #TimePicker -->
- [+] 新增了 `Drawer` 组件。<!-- #Drawer -->
- [+] 新增了 `Embedded` 组件。<!-- #Embedded -->
- [+] 新增了 `Anchor` 组件。<!-- #Anchor -->
- [+] 为 `Overlay` / `Dialog` 组件新增了 `inline` prop，允许内联在内容中进行渲染。<!-- #Overlay #Dialog -->
- [+] 为 `Overlay` 组件新增了 `match-width` prop，允许对于相对指定元素定位时，以目标元素宽度为浮层最小宽度。<!-- #Overlay -->
- [+] 为 `Progress` 组件新增了 `append` slot。<!-- #Progress -->
- [+] 为 `Alert` 组件新增了 `title`、`extra` slot。<!-- #Alert -->

### 🐞 问题修复

- [^] 修复 `Select` 组件中 `Option` 没有传入 `label` 时对应 slot 不渲染的问题。<!-- #Select -->
- [^] 修复 `Select` 内联写法时部分 slot 不生效的问题。<!-- #Select -->
- [^] 修复 `Select` 内联写法时 `trigger` prop 不生效的问题。<!-- #Select -->

## 1.0.0-alpha.32

### ⚠️ 非兼容性变更

- [^] `Select` / `Input` / `Checkbox` / `Radio` / `Switch` 组件现在不会在外部数据发生变化后触发更新时抛出 `input` 或 `change` 事件。当需要始终同步数据时，则需使用 `v-model` 进行绑定。<!-- #Select #Input #Checkbox #Radio #Switch -->

### 💡 主要变更

- [^] `outside` 指令判断元素位置时增加了 Portal 逻辑的支持，如果 Portal 入口在指定范围内，则被其移动的元素也将视为在指定范围内。<!-- #v-outside -->

### 🐞 问题修复

- [^] 修复 `Uploader` 组件在 `iframe` 模式下，提交过程中被销毁时没有正确移除 `<iframe>` 和 `<form>` 的情况。<!-- #Uploader -->

## 1.0.0-alpha.31

### ⚠️ 非兼容性变更

- [^] 修正 `Uploader` 组件中 `file` / `uploading` / `failure` 三个作用域插槽参数。由 `{ file: { name, src, status, index } }` 修正为 `{ name, src, status, index }`。<!-- #Uploader -->

### 💡 主要变更

- [+] `drag` 指令现在仅在鼠标左键按下时才触发拖动。<!-- #v-drag -->
- [+] `drag` 指令的 `dragend` 回调参数中新增 `cancel` 方法，可用来撤消最近一次拖动（恢复到 `dragstart` 之前的位置）。<!-- #v-drag -->

## 1.0.0-alpha.30

### 💡 主要变更

- [+] `ButtonGroup` 的点击事件增加最后一个参数为原生事件对象。<!-- #ButtonGroup -->
- [+] 增加 `Autocomplete` 组件。<!-- #Autocomplete -->
- [+] 增加 `Drawer` 组件（缺样式）。<!-- #Drawer -->
- [+] 增加 `Tag` 组件（缺样式）。<!-- #Tag -->

### 🐞 问题修复

- [^] `Dropdown` 组件现在可以正确支持不同尺寸。<!-- #Dropdown -->
- [^] 修复 `Input` 组件占位符有时没有正确清除的问题。<!-- #Input -->
- [^] 修复 `NumberInput` 有时无法正确输入的问题。<!-- #NumberInput -->
- [^] 修复 `Searchbox` 组件在 `readonly` 状态下会触发提示的问题。<!-- #SearchBox -->

## 1.0.0-alpha.29

### 🐞 问题修复

- [^] 修正 `RegionPicker` 组件浮层不能正常关闭的问题。<!-- #RegionPicker -->
- [^] 修正 `Tooltip` 组件的 `v-outside` 参数类型问题导致有时无非正常关闭。<!-- #Tooltip -->
- [^] 修正 `Schedule` 组件没有正确处理 `readonly`、`disabled` 和 `disabled-hour` prop 的问题。<!-- #Schedule -->
- [^] 修正 `Schedule` 组件的 `label` 插槽 `from` 参数错误的问题。<!-- #Schedule -->

## 1.0.0-alpha.28

### 🐞 问题修复

- [^] 修正 npm 包没有正确发布的问题。<!-- #veui -->

## 1.0.0-alpha.27

### 🐞 问题修复

- [^] 修正 `babel-plugin-veui` 可能阻断后续插件执行的问题。(#469)<!-- #babel-plugin-veui -->

## 1.0.0-alpha.26

### 🐞 问题修复

- [^] 修正 `Tree` 组件 `item-label` slot 没有正常渲染的问题。<!-- #Tree -->
- [^] 修正 `longpress` 指令 `repeat` 参数的默认值为 `false`。<!-- #v-longpress -->
- [^] 修正 `resize` 指令没有正确处理 `leading` 参数的问题。<!-- #v-resize -->
- [^] 修正 `outside` 指令没有准确判断参数是否变更的问题。<!-- #v-outside -->
- [^] 修正 `Breadcrumb` 组件初始值为 `null` 时报错的问题。<!-- #Breadcrumb -->

## 1.0.0-alpha.25

### ⚠️ 非兼容性变更

- [^] `Checkbox` 的 `indeterminate` prop 不再支持 `.sync`，始终由外部控制。<!-- #Checkbox -->
- [^] `Switch` 的 `change` 事件将在数据更新完毕后触发。<!-- #Switch -->

### 💡 主要变更

- [^] 支持多个 `Checkbox` 在 `v-model` 绑定到同一个数组时自动组成复选框组。<!-- #Checkbox -->
- [+] `Textarea` 新增 `select-on-focus` prop。<!-- #Textarea -->

### 🐞 问题修复

- [^] 修复了部分原生 `<button>` 未设置 `type="button"` 的问题。<!-- #Slider #Table #Transfer #Tree -->
- [^] 修正了 `Checkbox`、`Radio` 与 `Switch` 组件中原生 `<input>` 状态没有正确同步的问题，以触发 CSS 中正确的伪类样式。<!-- #Checkbox #Radio #Switch -->
- [^] 修正了带下拉浮层的组件的 ARIA 标注，使浮层拥有正确的从属关系。<!-- #DatePicker #Dropdown #SearchBox #OptionGroup #Select -->
- [^] 修正了组合组件时可能发生未正确继承 `ui` prop 的问题。<!-- #veui -->
- [^] 修复了 `Schedule` 组件在拖动选取多日时段时，`selected` 中可能共享同一数组实例的问题。<!-- #Schedule -->
- [^] 优化了 `Input`、`NumberInput` 与 `Textarea` 的属性透传机制，现在未被识别为 prop 的属性都会正确输出到原生 `<input>` 或 `<textarea>` 元素上。<!-- #Input #NumberInput #Textarea -->
- [^] 优化了原生事件透传机制，原生元素触发的事件将可以被外层组件直接透传。涉及的组件为 `Button`、`Checkbox`、`Radio`、`Switch`、`Input`。`NumberInput`、`Textarea`。<!-- #Button #Checkbox #Radio #Switch #Input #NumberInput #Textarea -->

  > **相关事件包括：**
  >
  > `auxclick`、`click`、`contextmenu`、`dblclick`、`mousedown`、`mouseenter`、`mouseleave`、`mousemove`、`mouseover`、`mouseout`、`mouseup`、`select`、`wheel`、`keydown`、`keypress`、`keyup`、`focus`、`blur`、`focusin`、`focusout`。

## 1.0.0-alpha.24

### 💡 主要变更

- [+] 为 `Calendar` 及 `DatePicker` 组件增加 prop `type`，以支持月份/年份选择。<!-- #Calendar #DatePicker -->
- [+] 为 `Transfer` 组件实现了 `focus` 方法。<!-- #Transfer -->
- [^] 优化了 `Tree` 的键盘导航及 ARIA 标注。<!-- #Tree -->
- [^] 优化了 Chrome 下自动填充时的样式。<!-- #Input -->

### 🐞 问题修复

- [^] 修正 `Transfer` 组件已选项不能从外部正确更新的问题。<!-- #Transfer -->
- [^] 修正 `Table` 中 `colspan` 在动态显示列时计算不正确的问题。<!-- #Table -->
- [^] 修正 `Uploader` 提示样式可能被截断的问题。<!-- #Uploader -->

## 1.0.0-alpha.23

### ⚠️ 非兼容性变更

- [^] `Tree` 组件的 `expands` prop 更名为 `expanded`。`expands` 被废弃，将在 `1.0.0` 移除。<!-- #Tree -->
- [^] `Radio` 和 `Checkbox` 的 `change` 事件将在数据更新完毕后触发。<!-- #Radio #Checkbox -->

### 💡 主要变更

- [^] 为 `Overlay` 组件增加 prop `position`。<!-- #Overlay -->
- [^] 为 `FilterPanel` 组件增加 prop `title`。<!-- #FilterPanel -->
- [^] `Tree` 组件的 `item` 及 `item-label` slot 作用域参数现在包含每个节点数据项的所有字段。<!-- #Tree -->
- [^] `Transfer` 组件的 `candidate-item`、`selected-item`、`candidate-item-label` 及 `selected-item-label` slot 作用域参数现在包含每个节点数据项的所有字段。<!-- #Transfer -->

### 🐞 问题修复

- [^] 修正 `Overlay` 组件 prop 类型导致 SSR 报错的问题。<!-- #Overlay -->
- [^] 修正 `Searchbox` 组件 `suggestions` prop 类型为 `Array<string>` 时，`replace-on-select` 设置无效的问题。<!-- #SearchBox -->
- [^] 修正 `veui-theme-one-icons` 中图标的 `fill` & `stroke`。<!-- #veui-theme-one-icons -->
- [^] 修正 `Transter` 组件的 `selected-item-label` 插槽在 `selected-show-mode` 为 `'flat'` 时无效的问题。<!-- #Transfer -->
- [^] 修正 `Transfer` 组件更新 `datasource` 时候选项没有正确更新的问题。<!-- #Transfer -->
- [^] 修正 `Schedule` 时段合并逻辑在从 `0:00` 开始时失效的问题。<!-- #Schedule -->

## 1.0.0-alpha.22

### ⚠️ 非兼容性变更

- [^] `Progress` 组件的 `auto-succeed` prop 更名为 `autosucceed`。`auto-succeed` 被废弃，将在 `1.0.0` 移除。<!-- #Progress -->

### 💡 主要变更

- [^] `Pagination` 组件支持不传入 `to` prop，完全使用事件进行交互。<!-- #Pagination -->
- [^] 为 `Dialog` 组件的所有插槽传入作用域参数 `close` 函数。<!-- #Dialog -->

### 🐞 问题修复

- [^] 修复了 `Button` 中 `target` 等 `props` 的同步问题。<!-- #Button -->
- [^] 修正了 `PromptBox` 回车确认时事件重复触发的问题。<!-- #PromptBox -->
- [^] 修正了 `CheckboxGroup` 和 `CheckButtonGroup` 组件初始值为 `null` 时报错的问题。<!-- #CheckboxGroup #CheckButtonGroup -->
- [^] 修正了 `Calendar` 和 `Schedule` 组件范围选择初始值为 `null` 时计算错误的问题。<!-- #Calendar #Schedule -->
- [^] 修正了 `AlerBox` 和 `Tabs` 组件存在硬编码文本的问题。<!-- #AlertBox #Tabs -->
- [^] 修正了 `Select` 和 `OptionGroup` 在使用内联组件时，作用域插槽没有生效的问题。<!-- #Select #OptionGroup -->
- [^] 修正了 `Textarea` 在显示行号且不自动扩展时，行号滚动不同步的问题。<!-- #Textarea -->
- [^] 修正了 `Tooltip` 组件的在 `target` / `trigger` 改变时重新绑定事件的逻辑。<!-- #Tooltip -->

## 1.0.0-alpha.21

### 🐞 问题修复

- [^] 修复了 `NumberInput` 中 `value` 和 `localValue` 的同步问题。<!-- #NumberInput -->
- [^] 修正了 `Overlay` 组件 `target` prop 类型声明在 SSR 下报错的问题。<!-- #Overlay -->
- [^] 修正了内部滚动模式的 `Table` 组件在系统有滚动条时的表头宽度。<!-- #Table -->
- [^] 修正了用 `row` prop 指定 `Textarea` 组件高度时在 IE 下无视行高的问题。<!-- #Textarea -->
- [^] 修正了 `Alert` 组件图标在 IE 下没有垂直居中的问题。<!-- #Alert -->
- [^] 修正了 `Slider` 组件在有多按钮时在 IE 下不能正常工作的问题。<!-- #Slider -->
- [^] 修正了 `Tree`、`DatePicker` 有时在鼠标操作时误显示聚焦样式的问题。<!-- #Tree #DatePicker -->
- [^] 修复了 `Tabs` 中使用 `offsetWidth` 的精度问题导致 `active` 和 `index` 切换失效的问题。<!-- #Tabs -->

## 1.0.0-alpha.20

### 💡 主要变更

- [+] `Searchbox` 新增了 `suggestions-before` 与 `suggestions-after` 两个插槽。<!-- #SearchBox -->
- [^] `Searchbox` 提示层只在选择选项后关闭，如果点击自定义插槽而非默认的选择选项时，提示层不再自动关闭。<!-- #SearchBox -->
- [+] 在控制台警告中增加了组件层级信息。<!-- #veui -->
- [+] 为 `Tree` / `FilterPanel` / `Transfer` 组件的增加了键盘交互。<!-- #Tree #FilterPanel #Transfer -->
- [+] 为所有支持聚焦或激活操作的组件添加了 `focus` 或 `activate` 方法。<!-- #Checkbox #CheckboxGroup #DatePicker #Dialog #Dropdown #Input #NumberInput #Overlay #Radio #RadioButtonGroup #RadioGroup #RegionPicker #Schedule #SearchBox #Slider #Switch #Textarea #Uploader -->
- [+] 对于使用路由模式的 `Tabs` 及 `Tab` 组件，新增函数 prop `matches(current, to)` 来允许指定自定义的激活状态判断，不再需要手动在 `Tabs` 组件中控制 `index`。`Tab` 组件的 `matches` 逻辑优先于上层 `Tabs` 组件中的 `matches`。<!-- #Tabs #Tab -->
- [+] 增加了全局配置项 `tabs.matches` 来允许全局自定义 `Tab` 组件 `matches` prop 的默认值。<!-- #Tabs -->
- [^] 使用了更为显著的聚焦样式。<!-- #veui-theme-one -->

### 🐞 问题修复

- [^] 修复了 `Overlay` 组件的 `target` prop 类型。<!-- #Overlay -->
- [^] 修正了主模块没有导出 `OptionGroup` 组件的问题。<!-- #OptionGroup -->
- [^] 提前判断是否需要修正复选框 `indeterminate` 兼容性，而非在用到的组件 `mounted` 以后才判断，避免模拟的点击触发了已经定义的事件监听器。<!-- #Checkbox -->
- [^] 去除了多余的类型判断，修复 `min` / `max` 规则失效的问题。<!-- #NumberInput -->

## 1.0.0-alpha.19

### ⚠️ 非兼容性变更

- [^] `Uploader` 组件上传请求响应经过 `convert-response` 函数转换后，需要提供给组件执行后续操作的数据结构有所调整。目前仍然兼容老版本格式，但将在 `1.0.0` 移除。<!-- #Uploader -->

  > #### 迁移指南
  >
  > ##### 原数据格式
  >
  > **成功：**
  >
  > ```json
  > { "status": "success", "name": "...", "src": "..." }
  > ```
  >
  > **失败：**
  >
  > ```json
  > { "status": "failure", "reason": "..." }
  > ```
  >
  > ##### 新数据格式
  >
  > **成功：**
  >
  > ```json
  > { "success": true, "name": "...", "src": "..." }
  > ```
  >
  > **失败：**
  >
  > ```json
  > { "success": false, "message": "..." }
  > ```

- [-] 移除了 `managers/config` 的 `merge` 与 `mergeDefaults` 方法，现在对于 `Object` 类型的配置项需要提供完整值。<!-- #veui -->
- [^] `Breadcrumb` 组件的 `default` 作用域插槽重命名为 `item`，因为 Vue 实际的 fallback 逻辑，所以避免使用同名的 slot 和 scoped slot。<!-- #Breadcrumb -->

### 💡 主要变更

- [+] 新增了 I18N 支持，外置了所有文案，并添加了组件级别对应的 `zh-Hans` 与 `en-US` locale。<!-- #veui -->
- [+] `veui-loader` 新增支持通过 `locale` 选项配置要自动引入的语言包。<!-- #veui-loader -->
- [+] `veui-loader` 新增支持通过 `global` 选项配置全局引入的模块。<!-- #veui-loader -->
- [^] `managers/config` 模块的配置现在为响应式数据，支持在组件渲染后进行全局修改。<!-- #veui -->
- [^] `Field` 组件对应的数据字段名现在默认优先取 `name` prop，且可以被 `field` prop 覆盖。<!-- #Field -->
- [^] `rule` 模板占位符由 `${...}` 变更为 `{...}`，以方便在模板字符串中进行书写。老语法仍然保持兼容。<!-- #veui -->
- [^] `Calendar`、`DatePicker` 与 `Schedule` 的范围合并逻辑现在默认为“智能”模式，当用户从已选项开始选择范围时，将从整体已选范围中去除当前选区；当从未选项开始选择时，则将当前选区并入整体。<!-- #Calendar #DatePicker #Schedule -->
- [+] `Table` 组件新增 prop `scroll`，用来限定内容滚动区域的最大高度，设置时会使得表格的头/脚固定。<!-- #Table -->
- [+] `Table` 组件新增 prop `expandable` 与 `expanded`，用来支持行展开，且新增作用域插槽 `sub-row`。<!-- #Table -->
- [+] `Column` 组件新增作用域插槽 `sub-row`。<!-- #Column -->
- [^] `Link` 组件新增 prop `rel`、`target`，当 `target` 为 `_blank` 时自动为 `rel` 增加 `noopener` 值，以增强安全性。<!-- #Link -->
- [^] 将所有图标替换为了新版「标局」图标并拆分为新的 `veui-theme-one-icons` 包。原 `veui-theme-one/icons` 下的图标依然保留。<!-- #veui-theme-one-icons @veui-theme-one -->

### 🐞 问题修复

- [^] 修正了 `GridContainer` 的左右边距计算。<!-- #GridContainer -->
- [^] 修正了 `Link` 组件在默认模式下 `disabled` 未起效的问题。<!-- #Link -->
- [^] 修正了 `Uploader` 组件 `remove` 事件的回调参数 `file` 提供了错误的文件的问题。<!-- #Uploader -->
- [^] 修正了未注册的 `ui` 值不能直接输出的问题（[#378](https://github.com/ecomfe/veui/issues/378)）。<!-- #veui -->

## 1.0.0-alpha.18

### ⚠️ 非兼容性变更

- [^] 对 Vue-Awesome 的依赖升级到 `3.1.2`。如果之前有在项目中直接使用 `vue-awesome@2` 的，需要升级到最新版，否则无法混用 VEUI 与 VueAwesome 的图标。<!-- #veui -->
- [^] `Tooltip` 组件的 `custom` prop 被废弃，将在 `1.0.0` 移除。替代方式为：将 `trigger` prop 指定为 `custom` 来使用自定义逻辑控制打开及关闭。<!-- #Tooltip -->
- [^] `Pagination` 组件内部所有的 `class` 中的 `pager` 被更名为 `pagination`。如果在样式代码中进行过定制，请进行全局替换。<!-- #Pagination -->
- [^] `Uploader` 组件的 `progress` prop 的 `'number'` 取值被替换为 `'percent'` 及 `'detail'`，分别表示显示百分比及显示进度详情。进度详情将以 <code>\`${loaded}KB/${total}KB\`</code> 的形式输出。<!-- #Uploader -->
- [^] `Uploader` 组件的 prop `convert-response` 函数必须返回转换后的数据对象。<!-- #Uploader -->

### 💡 主要变更

- [^] 增加主题包为组件部件指定 `ui` 的功能，同时组件现在将自动继承父组件中可继承的 `ui` 字段，并更新了 `veui-theme-one` 中所有相应的部分。<!-- #veui #veui-theme-one -->
- [+] `Breadcrumb` 组件的 scoped slot `default` 新增参数 `index`。<!-- #Breadcrumb -->
- [+] `Button` 组件增加 `ui` 选项 `dark`。<!-- #Button -->
- [^] `rule` 的 `validate` 方法现在可以传入额外的上下文的数据，比如在 `Field` 验证时传入整个 `Form` 的 `data`。<!-- #veui -->

### 🐞 问题修复

- [^] 修正 `GridContainer` 没有正确发布的问题。<!-- #GridContainer -->
- [^] 修复 `Slider` 组件在有 `step` 时的选择逻辑，由向下选取点改为就近取点，且修正了 `min` 值非 `0` 时的逻辑。<!-- #Slider -->
- [^] 修复 `Uploader` 组件无法正确获取全局配置的 `uploader.convertResponse` 函数的问题。<!-- #Uploader -->

## 1.0.0-alpha.17

### ⚠️ 非兼容性变更

- [^] `Dialog` 组件预设 `ui` 值 `top` 更名为 `high`。<!-- #Dialog -->
- [^] `Button` 组件再 `loading` 状态下将保留 slot 内容，不再强行设置为 `'加载中……'`。<!-- #Button -->
- [-] 删除了 `$confirm`、`$prompt` 插件本来就无效的带状态唤起接口。<!-- #$confirm $prompt -->

### 💡 主要变更

- [+] 增加 `longpress` 指令。<!-- #v-longpress -->
- [+] `Dropdown` 组件增加了 `trigger` prop，来指定何时展开下拉框。<!-- #Dropdown -->
- [+] `Dropdown` 组件增加了 `split` prop，来允许拆分指令按钮与下拉切换按钮。<!-- #Dropdown -->
- [+] `Button` 组件增加了 `mouseenter` / `mouseleave` 事件。<!-- #Button -->
- [+] `NumberInput` 组件支持长按调整值。<!-- #NumberInput -->
- [+] 增加了 `GridContainer` / `GridRow` / `GridColumn` 组件。<!-- #GridContainer #GridRow #GridColumn -->
- [+] `Progress` 组件增加了预设 `ui` 值 `fluid`，自适应容器宽度。<!-- #Progress -->
- [+] `Dialog` 组件增加了预设 `ui` 值 `small` / `large` / `auto`，用于指定预设宽度。<!-- #Dialog -->
- [+] 为 `Overlay` / `Dialog` / `AlertBox` / `ConfirmBox` / `PromptBox` 组件增加了 `afterclose` 事件。<!-- #Overlay #Dialog #AlertBox #ConfirmBox #PromptBox -->
- [^] 调整了 `alert` / `confirm` / `prompt` / `toast` 插件的接口，现在 `$alert` / `$confirm` / `$prompt` / `$toast` 均可直接作为函数调用。<!-- #$alert #$confirm #$prompt #$toast -->

### 🐞 问题修复

- [^] 修复 `Tabs` 组件移除标签时可能产生的问题。<!-- #Tabs -->
- [^] 修正 `ConfirmBox` 没有正确触发事件的问题。<!-- #ConfirmBox -->

## 1.0.0-alpha.16

### 💡 主要变更

- [+] 增加了 `babel-preset-veui`，简化了引入 VEUI 一起进行转译所需的步骤。<!-- #babel-preset-veui -->
- [^] 引入 `date-fns` 替换了对 `moment` 的依赖。<!-- #veui -->

### 🐞 问题修复

- [^] 修复了 `DatePicker` 组件 `panel` prop 默认值错误的问题。<!-- #DatePicker -->
- [^] 修正 `Alert` 组件样式。<!-- #Alert -->
- [^] 修正 `Breadcrumb` 组件样式。<!-- #Breadcrumb -->

## 1.0.0-alpha.15

### ⚠️ 非兼容性变更

- [^] 因为 `less@2` 依赖的包存在安全漏洞，故此次升级将对 `less` 的依赖升级到了 `^3.8.0`，对 `less-plugin-est` 的依赖升级到了 `^3.0.0`。<!-- #veui -->

  > #### 迁移指南
  >
  > 1. 更新 `less` 与 `less-plugin-est` 的版本；
  > 2. 如果使用 `vue-cli` 的 `webpack` 模板初始化项目，请按如下方式修改 `build/utils.js` 文件：
  >
  > ```diff
  > -    less: generateLoaders('less'),
  > +    less: generateLoaders('less', { javascriptEnabled: true }),
  > ```

- [^] `Dialog` 组件现在默认会在点击默认的按钮及按下 <kbd>esc</kbd> 键时关闭并通过 `.sync` 修饰符同步外部数据。并且新增 `before-close` 函数 prop 来处理需要阻止对话框关闭的情况。增加 `default` / `foot` slot 的 slot 参数 `close`，用来在重写组件 slot 时调用关闭逻辑。<!-- #Dialog -->

  > #### 迁移指南
  >
  > 对于重写 `foot` slot 处理关闭逻辑的使用方式，不会受新逻辑影响。
  >
  > 对于监听 `ok` / `cancel` 事件并直接关闭对话框时，亦不受此改动影响。当需要阻止对话框关闭时，需要使用新增的 `before-close` 函数 prop。
  >
  > `before-close` prop 对应的函数类型为 `function(type: string): boolean=|Promise<boolean=>`，`type` 将会是 `Dialog` 组件关闭操作的类型，默认情况下会有 `ok` 与 `cancel`。返回值可以是一个 `boolean`，也可以是一个 resolve `boolean` 的 `Promise`，用来处理可能需要异步决定对话框关闭状态的情况。返回值或 resolve 值非 `false` 时才会关闭对话框。例如，如果我们要异步处理 `ok`，而对 `cancel` 直接关闭，可以按如下方式处理：
  >
  > ```html
  > <veui-dialog :open.sync="dialogOpen" :before-close="submit"
  >   >...</veui-dialog
  > >
  > ```
  >
  > ```js
  > methods: {
  >   submit (type) {
  >     if (type === 'ok') {
  >       return axios.post('/item/create', {/* ... */})
  >         .then(({ id, error }) => {
  >           if (error) {
  >             this.showError(error)
  >             return false // resolve `false` 将阻止对话框关闭
  >           }
  >         })
  >     }
  >     // resolve 但不返回 `false` 时会关闭对话框
  >   },
  >   // ...
  > }
  > ```
  >
  > 对于需要重写 slot（例如添加底部按钮等）的情况，可以使用新增的 slot 参数 `close`，类型为 `function(type: string): void`，使用者只需要在合适的时机自行调用 `close` 函数即可，`type` 默认支持 `ok` / `cancel` 并会透传到 `before-close` 的流程中。例如：
  >
  > ```html
  > <veui-dialog :open.sync="dialogOpen" :before-close="submit">
  >   ...
  >   <template slot="foot" slot-scope="{ close }"
  >     ><button @click="close">OK</button></template
  >   >
  > </veui-dialog>
  > ```

- [^] `Pagination` 组件的 `redirect` 事件回调参数从 `({ page, event })` 调整为 `(page, event)`。<!-- #Pagination -->
- [^] 调整 `FilterPanel` 组件和 `Tree` 组件的对外接口参数名，统一将 `options` / `option` 更名为 `items` / `item`。<!-- #FilterPanel -->
- [^] 调整 `resize` 指令的默认每次都触发回调，增加 `throttle` / `debounce` / `leading` 三个 modifier。<!-- #v-resize -->
- [^] 通过 `prompt` manager 以指令式调用输入弹框功能时，现在返回的 `Promise` 在确认提交与取消时 `resolve` 的值分别是字符串和 `null`，与原生全局 `prompt` 方法一致（原来是 `{ isOk: true, value }` 与 `false`）。<!-- #$prompt -->
- [^] `Button` 组件加载中的文本修改为默认 slot 的内容。<!-- #Button -->
- [^] 调整 `rule` 出错信息变量模板匹配语法从 `%{ruleValue}` 修为 `${ruleValue}`，旧语法将在 `1.0.0` 移除。<!-- #veui -->
- [^] `Alert` 组件新增 `closable` prop，默认为 `false`，显式指定后才会显示关闭按钮/文本，而非原来的始终显示关闭按钮/文本。<!-- #Alert -->
- [^] `Alert` 组件的 `close-text` prop 更名为 `close-label`，`close-text` 将在 `1.0.0` 移除。<!-- #Alert -->

### 💡 主要变更

- [+] `Uploader` 组件增加自定义上传模式。`request-mode` 新增可选值 `custom`，设置为该值时，支持通过新增的 prop `upload` 自定义上传函数。<!-- #Uploader -->
- [+] `Uploader` 组件增加切换动画。<!-- #Uploader -->
- [+] `Steps` 组件的 `click` 事件回调参数增加原生事件对象 `event`，现为 `(index, event)`。<!-- #Steps -->
- [+] `Overlay` 组件浮层根元素上现在增加了对 `overlay.overlayClass` 全局配置项对应类名的输出。<!-- #Overlay -->
- [+] `Switch` 组件现在会透传与 `Checkbox` 组件一致的原生 DOM 事件。<!-- #Switch -->
- [+] `Toast` 组件增加 prop `open`，支持 `.sync`。<!-- #Toast -->
- [+] `Toast` 组件增加 slot `default`。<!-- #Toast -->
- [+] `Toast` 组件增加全局配置 `toast.duration`。<!-- #Toast -->

### 🐞 问题修复

- [^] 修复了 `Uploader` 组件 `iframe` 模式中上传失败后重试时没有上传文件的问题。<!-- #Uploader -->
- [^] 修复了 `Uploader` 组件初始化后丢失 `name` 和 `src` 以外的自定义属性丢失的问题。<!-- #Uploader -->
- [^] 修复了 `Overlay` 组件中寻找最近父级浮层时，可能跨过太多层级的问题。<!-- #Overlay -->
- [^] 修复了 `FilterPanel` 组件在不展示搜索框的时候，内容区域高度不正确的问题。<!-- #FilterPanel -->
- [^] 修复了 `Field` 组件内部输入组件交互时数据同步导致校验不正确的问题。<!-- #Field -->
- [^] 修复了 `Tabs` 组件使用 `label` slot 时的事件绑定问题。<!-- #Tabs -->
- [^] 修复了 `Input` 组件父级设置值为 `null` 后，仅格式化本地值为 `''`，未同步 `''` 至父级的问题。<!-- #Input -->
- [^] 去除了 `Steps` 组件的多余外边距。<!-- #Steps -->
- [^] 去除了 `Progress` 组件多余的内边距。<!-- #Progress -->
- [^] 修正了 `Progress` 组件的 `auto-succeed` prop 的逻辑。<!-- #Progress -->
- [^] 修正了 `NumberInput` 组件的 `min` / `max` prop 有时失效的问题。<!-- #NumberInput -->
- [^] 修正了 `Alert` 组件多消息导航和关闭按钮不会同时显示的问题。<!-- #Alert -->
- [^] 修正了 `alert` / `confirm` / `prompt` plugin 不能正常工作的问题。<!-- #$alert #$confirm #$prompt -->
- [^] 修复了 `Table` 组件 `foot` slot 的渲染。<!-- #Table -->

## 1.0.0-alpha.14

### ⚠️ 非兼容性变更

- [^] `Progress` 组件的 `state` prop 更名为 `status`。`state` 将在 `1.0.0` 移除。<!-- #Progress -->
- [^] `Schedule` 组件的 `shortcuts-display` prop 值 `expand` / `collapse` 分别更名为 `inline` / `popup`。旧的值将在 `1.0.0` 移除。<!-- #Schedule -->
- [^] `Schedule` 组件的 `header` slot 更名为 `header-content`，新 `header` slot 现在包括顶部内容的整个容器。<!-- #Schedule -->

### 💡 主要变更

- [^] `RegionPicker` 组件的 `datasource` prop 中的 `id` 字段重命名为 `value`，但 `id` 依然保留，优先使用 `value`。<!-- #RegionPicker -->
- [^] 优化了 `outside` 指令解析数字值的逻辑。<!-- #v-outside -->
- [^] 为 `Pagination` 组件内的 `Select` 组件新增了 `overlay-class` 定义，方便自定义样式。<!-- #Pagination -->
- [^] 优化了 `Switch`、`Steps`、`Schedule`、`Table`、`Fieldset` 等组件的可访问性，实现了键盘交互。<!-- #Switch #Steps #Schedule #Table #Fieldset -->

### 🐞 问题修复

- [^] 修复了更多在计算浮层层级过程中有时会导致死循环的场景。<!-- #veui -->
- [^] 去除了 `dropdown` mixin 中多余的默认 `overlay-options` 约束条件，修正某些场景下的浮层展开的默认方向。<!-- #DatePicker #Dropdown #SearchBox #Select -->
- [^] 修复了 `Input` 组件初始值为 `null` 时使用输入法会失效的问题。<!-- #Input -->
- [^] 现在 `Searchbox` 组件在 `suggestions` 变化时会自动更新浮层位置。<!-- #SearchBox -->
- [^] 修复了点击 `Label` 组件激活同 `Field` 下的输入组件时，没有考虑组件禁用/只读状态的问题。<!-- #Label #Field -->

## 1.0.0-alpha.13

### ⚠️ 非兼容性变更

- [^] `Checkbox`、`Switch` 组件新增 prop `model`，对应 `v-model`。`checked` prop 不再对应 `v-model`，而是支持 `.sync`。<!-- #Checkbox #Switch -->
- [^] `Checkbox`、`Radio`、`Switch` 组件新增 `input` 事件用于 `v-model`。`change` 事件参数抛出当前的 `checked` 值，仅在用户切换时触发。<!-- #Checkbox #Radio #Switch -->
- [^] `Calendar` 组件的 `selectstart` 事件抛出的参数格式从 `[Date]` 修改为 `Date`，表示选择的起始日期，去除多余的数组。<!-- #Calendar -->
- [^] 移除 `DatePicker` 组件的 `placeholderBegin`、`placeholderEnd` prop 及相应的 slot `placeholder-begin`、`placeholder-end`，以及全局配置 `datepicker.placeholderBegin`、`datepicker.placeholderEnd`。取而代之的是，增加配置项 `datepicker.rangePlaceholder`，并总是响应外部设置的 `placeholder` prop。默认状态下，会根据 `range` prop 来显示 `datepicker.placeholder` 或 `datepicker.rangePlaceholder` 的值。<!-- #DatePicker -->
- [^] `DatePicker` 组件的 `date` scoped slot 现在会透传给内部的 `Calendar` 的同名 scoped slot，不再表示已选择日期区域。原来已选择位置的 scoped slot 重命名为 `selected`，为范围选择时；类型为 `Date` 的 `date` 字段废弃，取而代之的是三个类型为 `number` 的字段：`year`、`month`（`0` 表示一月）、`date`；增加参数字段 `position`，起止日期分别对应 `from` 和 `to`。<!-- #DatePicker -->
- `Carousel` 组件的轮播项内容现在完全在 scoped slot `item` 内部，不再在外部添加行内图片背景样式，方便自定义非图片类型的轮播项。<!-- #Carousel -->

### 💡 主要变更

- [^] `veui-loader` 支持 webpack 4，resolve 路径逻辑调整为异步。<!-- #veui-loader -->
- [+] 为 `RegionPicker` 添加了键盘导航和 WAI-ARIA 支持。<!-- #RegionPicker -->
- [+] `BreadcrumbItem` 和 `Link` 组件的 `to` prop 支持使用 `Object` 格式（以传递具名路由对象）。<!-- #BreadcrumbItem #Link -->
- [+] `DatePicker` 组件增加 `today` prop，和 `Calendar` 对应 `prop` 一致。<!-- #DatePicker -->
- [+] `DatePicker` 组件的 `format` prop 现在可以传入函数，签名为 `function(Date): string`。<!-- #DatePicker -->
- [+] `DatePicker` 组件的 `shortcuts` 配置中，`to` 字段新增默认值 `0`。<!-- #DatePicker -->
- [+] `Input` 组件新增 WebKit 自动填充状态的判断，优化样式。<!-- #Input -->
- [+] `Tabs` 新增 ui 值 `block`，并带动画效果。<!-- #Tabs -->
- [+] `Tab` 组件新增 `status` prop。<!-- #Tab -->
- [^] `Tab` 组件在路由模式下会自动渲染 `<router-view>`。<!-- #Tab -->
- [*] `Tab` 组件的 prop `to` 现在可以使用相对路径。<!-- #Tab -->
- [^] `resize` 指令底层升级，切换到 `resize-detecor`，并增加 debounce 优化。<!-- #v-resize -->
- [+] `RadioGroup`、`CheckboxGroup`、`RadioButtonGroup` 及 `CheckButtonGroup` 组件的默认 scoped slot 参数增加 `index` 表示选项序号。<!-- #RadioGroup #CheckboxGroup #RadioButtonGroup #CheckButtonGroup -->
- [^] `numeric` 校验规则现在禁止多余的 `0` 开头的字符串值。<!-- #veui -->
- [^] `Select` 组件的 scoped slot `label` 现在作用域绑定到完整的已选中的 `options` 项，而非 `{ label }`。<!-- #Select -->

### 🐞 问题修复

- [^] 修复了上一版本中引入的浮层 `autofocus` 失效的问题。<!-- #veui -->
- [^] 修复了上一版本中引入的在计算浮层层级过程中有时会导致死循环的问题。<!-- #veui -->
- [^] 修复了 `Textarea` 组件初始 `value` 为 `null` 时的问题。<!-- #Textarea -->
- [^] 修复了 `Input` 组件在 SSR 时报错的问题。<!-- #Input -->
- [^] `input` 类型组件的错误状态通过组件数据进行传递，而不仅仅依赖于外层 `Field` 的 `class`。<!-- #DatePicker #Input #NumberInput #Select #Textarea #Transfer -->
- [^] 修复了 `Tab` 使用路由模式时设置 `name` prop 会出错的问题。<!-- #Tab -->
- [^] 修复了 `Table` 的 `update:selected` 事件有时未正确抛出的问题。<!-- #Table -->
- [^] 修复了 `Progress` 组件 prop 校验的问题。<!-- #Progress -->
- [^] 修复了 `OptionGroup` 组件未将 `disabled` 传递给 `Option` 组件的问题。<!-- #OptionGroup -->

## 1.0.0-alpha.12

### ⚠️ 非兼容性变更

- [^] `Uploader` 组件在 `maxCount` 的值是 `1` 的情况下，`value` 的默认类型从字符串改成对象，可以通过设置 prop `compat` 为 `true` 将 `value` 的类型设置为字符串兼容旧版本。`compat` 模式未来不会移除，但不建议使用。<!-- #Uploader -->

  > #### 迁移指南
  >
  > `Uploader` 在 `max-count` 为 `1` 时的 `value` prop 数据类型修改为对象，和多文件时的数组项相同。需要兼容原字符串数据格式时，需要设置 `compat` prop 为 `true`：
  >
  > ```html
  > <veui-uploader compat ... />
  > ```

- [^] 修改了 `Radio` 组件的 `v-model` 语义，现在机制和 Vue.js 对原生 `<input type="radio">` 的处理保持一致。<!-- #Radio -->

  > #### 迁移指南
  >
  > 此版本前的 `Radio` 组件的 `v-model` 对应 `checked` 属性，但由于之前的版本中存在多个同 `name` 的 `Radio` 组件时，被取消选中的单选框并不会响应数据变化，导致实际 `v-model` 并不完全可用。新版本在使用 `v-model` 的场景下修复了这个问题，并把逻辑和 Vue.js 对原生元素的处理方式进行了对齐。
  >
  > ```html
  > <veui-radio value="html" name="lang" v-model="lang" />
  > <veui-radio value="css" name="lang" v-model="lang" />
  > <veui-radio value="javascript" name="lang" v-model="lang" />
  > ```
  >
  > 通过将多个 `Radio` 组件的 `v-model` 绑定到同一个数据项，即可完成数据的双向绑定。注意，仍然建议使用 `name` 属性来正确表达分组。这将会影响元素的可访问性。
  >
  > 同时，更建议使用 `RadioGroup` 组件来实现单选组，因为它会有更简单的 API 和可访问性。

- [-] 移除 `Input` 组件的 `type` prop 对 `textarea` 的支持。<!-- #Input -->

  > #### 迁移指南
  >
  > 使用 `Textarea` 组件进行替代：
  >
  > ```html
  > <veui-textarea v-model="value" ... />
  > ```

- [^] 将 `OptionGroup` 的 `position` 属性的 `popout` 值重命名为了 `popup`（与 `aria-haspopup` 保持一致）。将在 `1.0.0` 移除对 `popout` 的支持。<!-- #OptionGroup -->
- [^] 将 `Progress` 组件的 `precision` prop 重命名为和 `NumberInput` 一致的 `decimal-place`。`precision` 将在 `1.0.0` 移除。<!-- #Progress -->

### 💡 主要变更

- [+] `babel-plugin-veui` 支持在 `import` 时为组件添加前缀，方便直接使用快捷写法定义组件的 `components` 选项。默认支持 `veui-` 和 `v-` 两种前缀。<!-- #babel-plugin-veui -->

  > ```vue
  > <template>
  > <div>
  >   <veui-button>确定 <v-icon name="check"></veui-button>
  > </div>
  > </template>
  > <script>
  > import { VeuiButton, VIcon } from 'veui'
  >
  > export default {
  >   name: 'my-component',
  >   components: {
  >     VeuiButton,
  >     VIcon
  >   }
  > }
  > </script>
  > ```

- [+] `NumberInput` 新增 `max` / `min` prop，优先从直接父组件 `Field` 的 prop `rule` 中继承 `max` / `min` rule 的值。<!-- #NumberInput -->
- [+] `Input` 新增 `clearable` prop，提供清除输入内容的功能；补充 `placeholder` prop 对 IE9 的支持。<!-- #Input -->
- [^] `Uploader` 组件的事件 `success`、`failure`、`remove` 增加参数：当前处理文件的序号。<!-- #Uploader -->
- [^] `Uploader` 组件在重新上传的时候不再触发 `remove` 事件。<!-- #Uploader -->
- [^] 增加了 `Select`、`Dropdown`、`Carousel`、`Pagination` 及 `Progress` 等组件的 WAI-ARIA 支持。<!-- #Select #Dropdown #Carousel #Pagination #Progress -->

### 🐞 问题修复

- [^] 修复了 `Textarea` 触发事件时没有正确处理 `this` 的问题。<!-- #Textarea -->
- [^] 修复了 `NumberInput` 在只读状态下可以用键盘上下键调整值的问题。<!-- #NumberInput -->
- [^] 修复了 `outside` 指令设置 `delay` 时未清除定时器的问题。<!-- #v-outside -->
- [^] 修复了浮层 `z-index` 未更新完毕就展现造成的闪动问题。<!-- #Overlay -->

## 1.0.0-alpha.11

### 🐞 问题修复

- [^] 修复了 `config/uiTypes.js` 命中 `npmignore` 规则被过滤的问题。<!-- #veui -->

## 1.0.0-alpha.10

### ⚠️ 非兼容性变更

- [^] `AlertBox` 组件，之前只能通过 `ui` prop 传递类型信息（ `success` / `error` / `info` ），现在和 `Toast` 保持风格统一，使用 `type` prop 传递类型信息。<!-- #AlertBox -->

  > #### 迁移指南
  >
  > **对于非如下两种情况的用户，本次变更并不产生影响。**
  >
  > 1. 所有直接使用 `AlertBox` 的情况下，需要将如 `ui="success"` 修改为 `type="success"` 的方式进行指定。
  >
  > 2. 对于主题包的作者，需要将原来针对如 `[ui~="success"]` 编写的样式，修改为 `.veui-alert-box-success`。

- [-] **[预告]** `Input` 组件的 `type` prop 将在下个版本去除对 `textarea` 的支持，请使用 `Textarea` 组件代替。<!-- #Input -->

### 💡 主要变更

- [+] 新增了 `NumberInput` 组件。<!-- #NumberInput -->
- [+] 为 `Input` 增加了 `before` / `after` slot，提供扩展的空间。<!-- #Input -->
- [+] 为 `Select` 增加了 `filter` prop，用来过滤下拉内容。<!-- #Select -->
- [+] 为 `OptionGroup` 增加了 `position` prop，用来指定在弹出菜单中显示。<!-- #OptionGroup -->
- [+] 为 `Option` 增加了 `hidden` prop。<!-- #Option -->
- [+] 为 `Overlay` 增加了 `locate` 事件，在位置发生变化时触发（时机为 `tether` 的 `reposition` 事件）。<!-- #Overlay -->
- [+] `Searchbox` 组件增加 `suggest-trigger` prop，用来指定推荐列表的弹出时机；增加 `suggest` 事件，当需要显示推荐列表时触发。<!-- #SearchBox -->
- [+] `Field` 的 `rules` 中增加 `priority` 的配置，用来覆盖当前内置的规则优先级。<!-- #Field -->
- [^] 将 `icons` mixin 并入 `ui`。<!-- #veui -->
- [+] 支持配置 `ui` prop 项的元数据，以支持进一步校验及根据 `ui` 值配置图标。<!-- #veui -->
- [^] 将 `Progress` 组件硬编码在组件代码中的尺寸解耦到 `veui-theme-one` 中，现在组件可以从主题包的 JS 模块中注入预定义的样式参数。<!-- #Progress -->
- [+] `Uploader` 组件的 `image` 模式在图片的遮罩层上增加 scoped-slot `extra-operation`；在上传项目前后分别增加 `file-before` 和 `file-after` 两个 scoped slot。<!-- #Uploader -->
- [^] `Uploader` 组件增加 prop `order`，配置新上传文件的插入顺序。<!-- #Uploader -->

### 🐞 问题修复

- [^] 为 `uiTypes` 定制了选项合并策略，并修正了 `Select` 组件在 `uiTypes` 中声明的 `input` 被 mixin 中加入的 `select` 覆盖的问题。<!-- #Select -->
- [^] 去除了 `Link` 组件中错误注册组件的代码。<!-- #Link -->
- [^] 修复了关闭非 `modal` 的 `Dialog` 时 `FocusManager` 报错的问题。<!-- #Dialog -->
- [^] 修复了 `FocusManager` 在 `trap` 模式下会自动聚焦最后一个元素的问题。<!-- #veui -->
- [^] 修复了 `Textarea` 组件在 IE9 下的兼容性问题。<!-- #Textarea -->
- [^] 修复了 `Field` 组件使用 `slot` 时 `class` 判断遗漏的问题。<!-- #Field -->
- [^] 修复了 `pattern` / `numeric` 校验规则的优先级，使 `pattern` 置于 `numeric` 之后。<!-- #veui -->
- [^] 去除了 `rule` 校验失败信息中包含部分校验成功的无用信息。<!-- #veui -->
- [^] 去除了 `Input` 部分过时的 prop。<!-- #Input -->

## 1.0.0-alpha.9

### ⚠️ 非兼容性变更

- [^] 将对 Vue 的依赖更新到 `^2.5.13`。这使得使用 scoped slot 时，`scope` 需要改写为 `slot-scope`。由于 VEUI 内部已经使用 `slot-scope`，所以该版本无法与 `vue@2.5.0` 之前的版本一同使用。<!-- #veui -->

  > #### 迁移指南
  >
  > 请检查项目中所有用到
  >
  > ```html
  > <template slot="..." scope="...">...</template>
  > ```
  >
  > 的地方，统一替换为：
  >
  > ```html
  > <template slot="..." slot-scope="...">...</template>
  > ```
  >
  > 同时，由于 `vue@2.5.3` 修改了 slot 的逻辑，所以当代码中存在使用
  >
  > ```html
  > <template slot="..."></template>
  > ```
  >
  > 的写法来将 slot 内容置空时，现在会自动使用定义 slot 时备用内容填充而非置空，暂时的方法是使用一个零宽空格（`&#8203;`）来填充。

### 💡 主要变更

- [+] 为 `Tabs`、`ButtonGroup`、`Dialog`、`Calendar` 等数十个组件增加了键盘导航及 WAI-ARIA 支持。<!-- #AlertBox #Breadcrumb #ButtonGroup #Calendar #CheckButtonGroup #CheckboxGroup #ConfirmBox #DatePicker #Dialog #PromptBox #RadioButtonGroup #RadioGroup #Tab #Tabs -->
- [+] 新增 `Slider` 组件。<!-- #Slider -->
- [+] 新增 `nudge` 指令。<!-- #v-nudge -->
- [+] 新增 `OptionGroup` 组件。<!-- #OptionGroup -->
- [+] `Select`、`Dropdown` 组件支持直接组件内嵌写法。<!-- #Select #Dropdown -->
- [+] `Select`、`Dropdown` 组件支持键盘导航。<!-- #Select #Dropdown -->

### 🐞 问题修复

- [^] 对话框现在可以整体获取焦点，避免点击无焦点区域后接收不到键盘事件的问题。<!-- #Dialog -->
- [^] 修正了 `PromptBox` 默认样式。<!-- #PromptBox -->
- [^] 修正了 `RadioGroup` 的聚焦样式。<!-- #RadioGroup -->
- [^] 修复 `Textarea` 组件在显示行号模式下高度设置的问题。<!-- #Textarea -->
- [^] 修复 `drag` 指令的问题，防止在移动后窗口大小变化后产生的位置错误。<!-- #v-drag -->
- [^] 修复了 `Pagination` 组件在翻页按钮禁用时点击后依然抛出事件的问题。<!-- #Pagination -->

## 1.0.0-alpha.8

### 💡 主要变更

- [+] 增加了焦点管理模块。<!-- #veui -->
- [+] `Overlay` 组件增加 `autofocus` 和 `modal` 两个 prop，分别用来指定浮层是否需要抢占焦点、以及是否将后续焦点移动限制在浮层内。<!-- #Overlay -->
- [+] `Dialog` 组件增加 `escapable` prop，允许对话框通过按下 <kbd>esc</kbd> 键关闭。<!-- #Dialog -->
- [+] 为 `AlertBox`、`ConfirmBox`、`PromptBox` 增加了键盘交互（[#216](https://github.com/ecomfe/veui/issues/216)）。<!-- #AlertBox #ConfirmBox #PromptBox -->
- [+] 增加了 `Input` 组件的 `tiny` 及 `micro` 尺寸样式。<!-- #Input -->

### 🐞 问题修复

- [^] 修复了 `Select` 组件下拉菜单展开后自动将选中项滚动到可视范围时可能引起页面滚动的问题。<!-- #Select -->
- [^] `babel-plugin-veui` 及 `veui-loader` 内不再冗余生成组件列表，组件列表信息随 `veui` 包发布。<!-- #babel-plugin-veui #veui-loader #veui -->

## 1.0.0-alpha.7

### ⚠️ 非兼容性变更

- [^] 将对 `wicg-focus-ring@2.x` 的依赖更新为 `focus-visible` + `classlist-polyfill`，并且移入了 `veui-theme-one` 的 `dependencies`。使用 `veui-theme-one` 且需兼容 IE9 的项目需要同时引入这两个模块。同时 `veui-theme-one` 中的 `.focus-ring` 也均已升级为 `.focus-visible`。<!-- #veui-theme-one -->

  > #### 迁移指南
  >
  > - 在主模块中删除 `import 'wicg-focus-ring'；
  > - 安装上述包后，将引入语句替换为：
  >
  >   ```js
  >   import 'classlist-polyfill'
  >   import 'focus-visible'
  >   ```

- [^] 去除了 `veui-theme-one` 中 `Alert` 组件默认的上下 `margin`。<!-- #veui-theme-one -->
- [^] `Column` 组件的 scoped slot `head` 和 `foot` 现在变更为 slot。<!-- #Column -->
- [-] 删除 `veui-theme-dux`。<!-- #veui-theme-dux -->
- [-] 删除 `Field` 组件 prop `rules` 默认可选表单校验规则 `maxByte` 和 `minByte`。<!-- #Field -->

### 💡 主要变更

- [+] 新增 `Textarea` 组件。<!-- #Textarea -->
- [+] `Column` 组件新增 prop `span`，用来指定行/列方向合并单元格的逻辑。<!-- #Column -->
- [^] `Column` 组件的默认 scoped slot 传入的参数现在会将列表项的数据展开，不需要多加一层 `item` 进行访问（与其它类似数据源的组件一致，需注意数据源对象中不能使用 `item` / `index` 作为属性名）。<!-- #Column -->
- [+] `Table` 组件新增 prop `key-field`，指明用哪一个 field 作为表格数据的键。当 `Table` 为 `selectable` 时，可以用来指定选择列纵向合并单元格的逻辑需要参照的列，以及选择逻辑返回的值来自哪一列。<!-- #Table -->
- [+] 优化 `Column` 组件注册到 `Table` 的逻辑，支持在模板中通过 `v-for`、`v-if` 等动态配置，并且将注册过程移入 `created` 生命周期以支持服务端渲染。<!-- #Column -->
- [^] `Breadcrumb` 组件 `routes` 数据项的文本域重命名为 `label`，保留了 `text` 的用法进行兼容。<!-- #Breadcrumb -->
- [+] `Uploader` 组件增加 `statuschange` 事件，用于表单提交的时候校验是否还有文件正在上传或上传失败。<!-- #Uploader -->
- [+] `Uploader` 组件增加 prop `data-type`，用于指明回调的内容的格式。<!-- #Uploader -->
- [+] `Uploader` 组件 prop `name` 现在有默认值 `file`。<!-- #Uploader -->
- [+] `Field` 组件优化交互式校验规则显示顺序。<!-- #Field -->
- [+] `Field` prop `rules` 校验规则的出错消息支持传入函数。<!-- #Field -->
- [^] `Select` 组件被选中的选项现在会在浮层展开时自动滚动到可视范围。<!-- #Select -->

### 🐞 问题修复

- [^] 修复 `Schedule` 组件状态未与 `selected` prop 同步的问题。<!-- #Schedule -->
- [^] 修复 `Tabs` 组件在仅指定 `active` 时会导致无法切换的问题。<!-- #Tabs -->
- [^] 修复 `Tooltip` 组件在 `target` 变化时会自动显示的问题。<!-- #Tooltip -->
- [^] `Uploader` 组件的 `value` 不再包含正在上传中或上传失败的文件，不再包含 `status`等内部变量。<!-- #Uploader -->
- [^] 修复 `Uploader` 组件 `accept` prop 判断后缀的错误。<!-- #Uploader -->
- [^] 修复 `resize` 指令在 `target` 元素被移动过后丢失目标 `document` 的问题。<!-- #v-resize -->
- [^] 修复大小比较规则的提示信息。<!-- #veui -->
- [^] 修复使用 Popper 风格设置浮层 `position` 时解析不正确的问题。<!-- #veui -->

## 1.0.0-alpha.6

### 🐞 问题修复

- [^] 修复 `RegionPicker` 末层数据项禁用不生效的问题。<!-- #RegionPicker -->
- [^] 修复 `Tabs` 组件样式，解耦硬编码的图标，优化内容溢出更新视图的计算逻辑。<!-- #Tabs -->
- [^] 修复全局配置无法读取函数配置项的问题。<!-- #veui -->
- [^] 修复全局浮层管理模块计算 `zIndex` 错误的问题。<!-- #veui -->

## 1.0.0-alpha.5

### ⚠️ 非兼容性变更

- [^] 为 `Select` 用名为 `option-label` 的 scoped slot 替代了原来的 `option`。原来的 `option` 现在为整个选项的内容，包括文本和图标等。<!-- #Select -->

### 💡 主要变更

- [+] 新增 `resize` 指令。<!-- #v-resize -->
- [^] `Tabs` 组件中的 `Tab` 元素不再需要强制配置 `name` prop。<!-- #Tabs #Tab -->
- [+] `Alert` 组件显示多条消息时，增加当前消息索引/总消息数的展示。<!-- #Alert -->
- [^] 调整 `Alert` 组件默认 slot 范围，同时新增默认 scoped slot。<!-- #Alert -->
- [+] `RegionPicker` 组件支持数据项的禁用。<!-- #RegionPicker -->

### 🐞 问题修复

- [^] 修复 `Tabs` 组件中 `Tab` 元素的渲染顺序和 prop 同步问题。<!-- #Tabs -->
- [^] 修复 `Searchbox` 组件在按 <kbd>enter</kbd> 后自动触发表单提交的问题。<!-- #SearchBox -->
- [^] 修复 `Overlay` 组件中判断组件类型错误的问题。<!-- #Overlay -->
- [^] `Calendar` 组件在时间段选择过程中，如果 `selected` 发生变更，现在会自动清除半选状态。<!-- #Calendar -->
- [^] 修复 `veui-loader` 在 Windows 下生成路径错误的问题。<!-- #veui-loader -->
- [^] 修复 `Uploader` 组件文件名没有去掉 `fakepath` 前缀的问题。<!-- #Uploader -->
- [^] 修复 `Uploader` 组件没有正确使用 `name` prop 的问题。<!-- #Uploader -->

## 1.0.0-alpha.4

### ⚠️ 非兼容性变更

- [^] 重构了 `babel-plugin-veui` 及 `veui-loader` 的逻辑，以支持服务端渲染时首屏样式的抽取。<!-- #babel-plugin-veui #veui-loader -->

  > #### 迁移指南
  >
  > - 删除 `build/vue-loader.conf.js` 中 `preLoaders` 中的 `veui-loader` 配置；
  >
  > - 将 `.babelrc` 中的 `veui` 插件配置删除，整个只保留字符串 `'veui'`；
  > - 在 `build/webpack.base.conf.js` 中，重新配置 `veui-loader`：
  >
  > ```js
  > {
  >   test: /\.vue$/,
  >   loader: 'veui-loader',
  >   enforce: 'pre',
  >   options: {
  >     modules: [
  >       {
  >         package: 'veui-theme-one',
  >         fileName: '${module}.less'
  >       },
  >       {
  >         package: 'veui-theme-one',
  >         fileName: '${module}.js',
  >         transform: false
  >       }
  >     ]
  >   },
  >   include: [resolve('veui'), resolve('vue-awesome')]
  > }
  > ```

- [^] 将 `Pager` 组件重命名为 `Pagination`。暂时保留兼容，`Pager` 将在 `1.0.0` 移除。

### 🐞 问题修复

- [^] 修正了 `Carousel` 组件 slot 的位置。<!-- #Carousel -->

## 1.0.0-alpha.3

### 🐞 问题修复

- [^] 统一所有内部依赖版本。<!-- #veui -->

## 1.0.0-alpha.2

### 🐞 问题修复

- [^] 修复主题包 `peerDependencies` 中的 `veui` 版本号。<!-- #veui -->

## 1.0.0-alpha.1

### ⚠️ 非兼容性变更

- [^] 主题包 `veui-theme-x` 重命名为正式名称 `veui-theme-one`。<!-- #veui-theme-x #veui-theme-one -->

### 💡 主要变更

- [+] 新增 `Tree` 组件。<!-- #Tree -->
- [+] 新增 `FilterPanel` 组件。<!-- #FilterPanel -->
- [+] 新增 `Transfer` 组件。<!-- #Transfer -->
- [+] 新增 `Schedule` 组件。<!-- #Schedule -->
- [+] 为 `babel-plugin-veui` 增加了类似 `babel-plugin-lodash` 的功能，以减小打包体积。<!-- #babel-plugin-veui -->
- [+] `Tabs` 组件支持在传入的 slot 内容中动态切换内部的 `Tab` 元素，增加预设的添加删除按钮。<!-- #Tabs -->
- [+] `outside` 指令新增 `excludeSelf` 参数，使判断仅对 `refs` 生效。<!-- #v-outside -->
- [+] `outside` 指令新增 `mousedown`、`mouseup` 的支持。<!-- #v-outside -->
- [+] `Tooltip` 组件新增 `interactive` prop，控制浮层是否可交互。<!-- #Tooltip -->
- [+] `Calendar` 组件新增 scoped slot `date`。<!-- #Calendar -->

### 🐞 问题修复

- [^] 修复 `Calendar` 组件在选择范围时错误切换视图的问题。<!-- #Calendar -->
- [^] `Checkbox` 和 `Radio` 组件现在可以在未绑定数据时进行交互。<!-- #Checkbox #Radio -->
- [^] 修复 Chrome 62 起给按钮默认添加圆角的问题。<!-- #Button -->

## 0.3.3

### ⚠️ 非兼容性变更

- [^] `Uploader` 本地校验失败的 slot 名修改为 `type-invalid` 及 `size-invalid`。<!-- #Uploader -->

### 💡 主要变更

- [+] `config` 模块支持对对象配置的 `merge`、`mergeDefaults` 操作。<!-- #veui -->
- [+] 为调用了 `Overlay` 组件的元素增加了指定 `overlay-options` 的功能。<!-- #Overlay -->
- [+] 新增了 `Carousel` 组件。<!-- #Carousel -->

### 🐞 问题修复

- [^] 修复 `config` 模块参数重载错误的问题。<!-- #veui -->
- [^] 修复 `Uploader` 禁用 `input` 导致上传失败的问题。<!-- #Uploader -->
- [^] 修复了 `RegionPicker` 浮层有时会闪动的问题。<!-- #RegionPicker -->

## 0.3.2

### 🐞 问题修复

- [^] 修正 `Calendar` 单元格的文字颜色、背景色相关样式。<!-- #Calendar -->
- [^] 修复上个版本完善 `outside` 指令时引入的问题。<!-- #v-outside -->

## 0.3.1

### 💡 主要变更

- [+] `Tooltip` 增加延时隐藏的 prop `hide-delay`。<!-- #Tooltip -->

### 🐞 问题修复

- [^] 修复不引入 `ButtonGroup` 时，`CheckButtonGroup` 和 `RadioButtonGroup` 部分样式丢失的问题。<!-- #CheckButtonGroup #RadioButtonGroup -->

## 0.3.0

### ⚠️ 非兼容性变更

- [^] 规范化所有公用组件文件名、组件 `name`、组件 DOM 容器 `class` 的命名规则，所有非首位的大写字母在转换为小写后增加 `-` 进行分隔。修改清单见 [#122](https://github.com/ecomfe/veui/issues/122)。<!-- #veui -->
- [-] 移除了 `BreadCrumb` 组件的 prop `routers`。<!-- #BreadCrumb -->
- [^] `Pager` 组件 `to` 默认值修改为 `''`（空字符串），以进入 `Link` 的无跳转逻辑。<!-- #Pager -->
- [-] 移除了 `Pager` 组件的 prop `pageTotal`。<!-- #Pager -->
- [^] `Radiobox` 组件重命名为 `Radio`。<!-- #Radiobox #Radio -->
- [^] `RadioboxGroup` 组件重命名为 `RadioGroup`。<!-- #RadioboxGroup #RadioGroup -->
- [^] `Button` 组件的 `aux` 风格 `ui` 现在是默认样式，原有的默认样式更名为 `secondary`。<!-- #Button -->
- [^] 为组件支持了 `:focus-ring` 的 polyfill，需要使用方自行引入。详见 [#121](https://github.com/ecomfe/veui/issues/121)。<!-- #veui -->
- [^] 优化了 `Uploader` 组件的部分 prop、slot 的命名。详见 [#133](https://github.com/ecomfe/veui/issues/133)。<!-- #Uploader -->
- [^] `Uploader` 的 prop `accept` 现在需要按规范书写，。详见[此处](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Limiting_accepted_file_types)。<!-- #Uploader -->

### 💡 主要变更

- [+] **增加了统一 UI 样式包，暂定名 `veui-theme-x`**。<!-- #veui-theme-x -->
- [^] 将所有图标移入样式包分别管理。<!-- #veui-theme-x -->
- [+] `Uploader` 的 prop `maxSize` 现在支持形如 `'100KB'` 的字符串作为值。<!-- #Uploader -->
- [+] 为 `Table` 增加 `select-mode` prop，用于提供单选模式。<!-- #Table -->
- [+] 增加 `ButtonGroup` 组件。<!-- #ButtonGroup -->
- [+] 增加 `RadioButtonGroup` 组件。<!-- #RadioButtonGroup -->
- [+] 增加 `CheckButtonGroup` 组件。<!-- #CheckButtonGroup -->
- [+] 增加 `Sorter` 组件。<!-- #Sorter -->
- [+] 增加 `Progress` 组件（限 `theme-x`）。<!-- #Progress -->
- [+] 所有有单一浮层逻辑的组件，新增 prop `overlay-class`，最终渲染到 `Overlay` 实例的 DOM `class` 上，方便外部区分浮层归属。<!-- #Overlay -->

### 🐞 问题修复

- [^] 修复 `RegionPicker` 浮层在特殊情况下显示上的问题。<!-- #RegionPicker -->
- [^] 修复 `Dropdown` 在 `ui` 为 `link` 时的样式。<!-- #Dropdown -->

## 0.2.4

### ⚠️ 非兼容性变更

- [^] `Table` 组件的 `select` 事件将在 `selected` prop 更新后触发，`select` 事件在全选时增加 `null` 值作为当前选择项的数据，参数列表修改为和单选时一致。<!-- #Table -->

### 💡 主要变更

- [+] 增加 `veui-loader`，确保只在 Webpack 能够 resolve 样式文件时 `babel-plugin-veui` 才注入样式 `import` 语句。<!-- #veui-loader -->
- [^] 改善 `Button`、`Table` 组件的样式。<!-- #Button #Table -->
- [+] 为 `Link` 组件增加 `fallback` prop，用于指定无链接时渲染的容器标签名。<!-- #Link -->
- [+] 为 `Steps` 添加路由支持。<!-- #Steps -->
- [^] `Select` 组件选项值现在支持 `''`（空字符串）或 `0`。<!-- #Select -->
- [+] 为 `Select` 组件添加未命名分组样式。<!-- #Select -->
- [+] 为 `Switch` 组件增加描述及默认 slot。<!-- #Switch -->
- [+] 为 `Searchbox` 组件增加 `clearable` prop，`suggestions` scoped slot 以及 `select` 事件，`suggestions` 支持字符串数组。<!-- #SearchBox -->

### 🐞 问题修复

- [^] 修正 `indeterminate` 状态 `Checkbox` 的浏览器兼容性。<!-- #Checkbox -->
- [^] 修正 `RegionPicker` 无法响应外部 `selected` 变化的问题。<!-- #RegionPicker -->

## 0.2.3

### 🐞 问题修复

- [^] 修复 `0.2.2` 版本 npm 包的问题。<!-- #veui -->

## 0.2.2

### ⚠️ 非兼容性变更

- [^] `SearchBox` 重命名为 `Searchbox`。<!-- #SearchBox -->

### 💡 主要变更

- [+] 增加 `$alert`、`$confirm`、`$prompt` 插件。<!-- #$alert #$confirm #$prompt -->
- [+] 增加 `RegionPicker` 组件。<!-- #RegionPicker -->
- [+] 增加 `Steps` 组件。<!-- #Steps -->
- [^] 去除 `Breadcrumb`、`Table`、`Tabs` 中对 Vue 内部函数的依赖。<!-- #Breadcrumb #Table #Tabs -->
- [+] 为 `Overlay` 组件增加 `open.sync` 支持。<!-- #Overlay -->

### 🐞 问题修复

- [^] 修复 `outside` 指令重复添加事件绑定的问题。<!-- #v-outside -->
- [^] 修复 `Calendar` 组件年份选择视图前后选择不正确的问题。<!-- #Calendar -->

## 0.2.1

### 💡 主要变更

- [+] 增加了 `SearchBox` 组件。<!-- #SearchBox -->
- [+] 为 `Select` 组件增加了 `clearable` prop，可以根据 `placeholder` 生成首选项以清除之前的选择。<!-- #Select -->
- [^] 优化了 `Button` 中元素的对齐方式。<!-- #Button -->
- [+] 增加了 `Pager` 每页显示数和默认选项的全局配置。<!-- #Pager -->
- [^] 重命名 `Pager` 的 `page-total` prop 为 `total`，旧名称仍然兼容，未来版本可能删除。<!-- #Pager -->

### 🐞 问题修复

- [^] 修复 `Select` 组件有分组时子选项无法正常选择的问题。<!-- #Select -->
- [^] 修复了 `Tooltip` 组件在循环中绑定 `target` 的问题。<!-- #Tooltip -->
- [^] 修复了 `Table` 组件 slot `no-data` 失效的问题。<!-- #Table -->
- [^] 修复了 `Table` 组件在选择时会修改未添加 `.sync` 的 `selected` prop 的问题。<!-- #Table -->
- [+] 修复了 `Pager` 在没有数据时下一页按钮没有禁用的问题。<!-- #Pager -->

## 0.2.0

### 💡 主要变更

- [^] 项目转为 mono-repo 的组织方式，使用 `lerna` 进行管理。<!-- #veui -->
- [+] 将样式代码独立为单独的包 `veui-theme-dux`。<!-- #veui-theme-dux -->
- [+] 使用 `babel-plugin-veui` 识别、改写对组件的引用，无缝引入可配置的样式文件包。<!-- #babel-plugin-veui -->
- [+] 增加 `Form`、`Field`、`Fieldset` 组件。<!-- #Form #Field #Fieldset -->
- [^] 根据表单逻辑修改了输入型控件 `disabled` / `readonly` 的实际生效方式，最终生效的值更改为计算属性 `realDisalbed` / `realReadonly`。
- [+] 增加 `Tabs` 和 `Tab` 组件。<!-- #Tabs #Tab -->
- [+] 增加 `Switch` 组件。<!-- #Switch -->
- [^] `Checkbox` 新增 `true-value` 和 `false-value` prop，调整相应逻辑。<!-- #Checkbox -->
- [+] 增加指令式调用 `alert` / `confirm` / `prompt` 的功能。
- [^] `Pager` 组件新增 `pageSizes` prop，用来指定可选的页数。<!-- #Pager -->

## 0.1.3

### 💡 主要变更

- [^] 将 `BreadCrumb` 组件的 `routers` prop 重命名为 `routes`，后续版本会将 `routers` 移除。<!-- #BreadCrumb -->
- [^] 小幅重构 `Table` 组件代码。<!-- #Table -->

### 🐞 问题修复

- [^] 修复 `Icon` 组件嵌套失效的问题。<!-- #Icon -->
- [^] 修正 `Table` 组件样式中行高不准确的问题。<!-- #Table -->
