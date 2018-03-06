## 1.0.0-alpha.10

### 🐞 问题修复

* [^] 去除了 `Link` 组件中错误注册组件的代码。

## 1.0.0-alpha.9

### ⚠️ 非兼容性变更

* [^] 将对 Vue 的依赖更新到 `^2.5.13`。这使得使用 scoped slot 时，`scope` 需要改写为 `slot-scope`。由于 VEUI 内部已经使用 `slot-scope`，所以该版本无法与 `vue@2.5.0` 之前的版本一同使用。

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

* [+] 为 `Tabs`、`ButtonGroup`、`Dialog`、`Calendar` 等数十个组件增加了键盘导航及 WAI-ARIA 支持。
* [+] 新增 `Slider` 组件。
* [+] 新增 `nudge` 指令。
* [+] 新增 `OptionGroup` 组件。
* [+] `Select`、`Dropdown` 组件支持直接组件内嵌写法。
* [+] `Select`、`Dropdown` 组件支持键盘导航。

### 🐞 问题修复

* [^] 对话框现在可以整体获取焦点，避免点击无焦点区域后接收不到键盘事件的问题。
* [^] 修正了 `PromptBox` 默认样式。
* [^] 修正了 `RadioGroup` 的聚焦样式。
* [^] 修复 `Textarea` 组件在显示行号模式下高度设置的问题。
* [^] 修复 `drag` 指令的问题，防止在移动后窗口大小变化后产生的位置错误。
* [^] 修复了 `Pagination` 组件在翻页按钮禁用时点击后依然抛出事件的问题。

## 1.0.0-alpha.8

### 💡 主要变更

* [+] 增加了焦点管理模块。
* [+] `Overlay` 组件增加 `autofocus` 和 `modal` 两个 prop，分别用来指定浮层是否需要抢占焦点、以及是否将后续焦点移动限制在浮层内。
* [+] `Dialog` 组件增加 `escapable` prop，允许对话框通过按下 <kbd>esc</kbd> 键关闭。
* [+] 为 `AlertBox`、`ConfirmBox`、`PromptBox` 增加了键盘交互（[#216](https://github.com/ecomfe/veui/issues/216)）。
* [+] 增加了 `Input` 组件的 `tiny` 及 `micro` 尺寸样式。

### 🐞 问题修复

* [^] 修复了 `Select` 组件下拉菜单展开后自动将选中项滚动到可视范围时可能引起页面滚动的问题。
* [^] `babel-plugin-veui` 及 `veui-loader` 内不再冗余生成组件列表，组件列表信息随 `veui` 包发布。

## 1.0.0-alpha.7

### ⚠️ 非兼容性变更

* [^] 将对 `wicg-focus-ring@2.x` 的依赖更新为 `focus-visible` + `classlist-polyfill`，并且移入了 `veui-theme-one` 的 `dependencies`。使用 `veui-theme-one` 且需兼容 IE9 的项目需要同时引入这两个模块。同时 `veui-theme-one` 中的 `.focus-ring` 也均已升级为 `.focus-visible`。

  > #### 迁移指南
  >
  > * 在主模块中删除 `import 'wicg-focus-ring'；
  > * 安装上述包后，将引入语句替换为：
  >
  >   ```js
  >   import 'classlist-polyfill'
  >   import 'focus-visible'
  >   ```

* [^] 去除了 `veui-theme-one` 中 `Alert` 组件默认的上下 `margin`。
* [^] `Column` 组件的 scoped slot `head` 和 `foot` 现在变更为 slot。
* [-] 删除 `veui-theme-dux`。
* [-] 删除 `Field` 组件 prop `rules` 默认可选表单校验规则 `maxByte` 和 `minByte`。

### 💡 主要变更

* [+] 新增 `Textarea` 组件。
* [+] `Column` 组件新增 prop `span`，用来指定行/列方向合并单元格的逻辑。
* [^] `Column` 组件的默认 scoped slot 传入的参数现在会将列表项的数据展开，不需要多加一层 `item` 进行访问（与其它类似数据源的组件一致，需注意数据源对象中不能使用 `item`/`index` 作为属性名）。
* [+] `Table` 组件新增 prop `key-field`，指明用哪一个 field 作为表格数据的键。当 `Table` 为 `selectable` 时，可以用来指定选择列纵向合并单元格的逻辑需要参照的列，以及选择逻辑返回的值来自哪一列。
* [+] 优化 `Column` 组件注册到 `Table` 的逻辑，支持在模板中通过 `v-for`、`v-if` 等动态配置，并且将注册过程移入 `created` 生命周期以支持服务端渲染。
* [^] `Breadcrumb` 组件 `routes` 数据项的文本域重命名为 `label`，保留了 `text` 的用法进行兼容。
* [+] `Uploader` 组件增加 `statuschange` 事件，用于表单提交的时候校验是否还有文件正在上传或上传失败。
* [+] `Uploader` 组件增加 prop `dataType`，用于指明回调的内容的格式。
* [+] `Uploader` 组件 prop `name` 现在有默认值 `file`。
* [+] `Field` 组件优化交互式校验规则显示顺序。
* [+] `Field` prop `rules` 校验规则的出错消息支持传入函数。
* [^] `Select` 组件被选中的选项现在会在浮层展开时自动滚动到可视范围。

### 🐞 问题修复

* [^] 修复 `Schedule` 组件状态未与 `selected` prop 同步的问题。
* [^] 修复 `Tabs` 组件在仅指定 `active` 时会导致无法切换的问题。
* [^] 修复 `Tooltip` 组件在 `target` 变化时会自动显示的问题。
* [^] `Uploader` 组件的 `value` 不再包含正在上传中或上传失败的文件，不再包含 `status`等内部变量。
* [^] 修复 `Uploader` 组件 `accept` prop 判断后缀的错误。
* [^] 修复 `resize` 指令在 `target` 元素被移动过后丢失目标 `document` 的问题。
* [^] 修复大小比较规则的提示信息。
* [^] 修复使用 Popper 风格设置浮层 `position` 时解析不正确的问题。

## 1.0.0-alpha.6

### 🐞 问题修复

* [^] 修复 `RegionPicker` 末层数据项禁用不生效的问题。
* [^] 修复 `Tabs` 组件样式，解耦硬编码的图标，优化内容溢出更新视图的计算逻辑。
* [^] 修复全局配置无法读取函数配置项的问题。
* [^] 修复全局浮层管理模块计算 `zIndex` 错误的问题。

## 1.0.0-alpha.5

### ⚠️ 非兼容性变更

* [^] 为 `Select` 用名为 `option-label` 的 scoped slot 替代了原来的 `option`。原来的 `option` 现在为整个选项的内容，包括文本和图标等。

### 💡 主要变更

* [+] 新增 `resize` 指令。
* [^] `Tabs` 组件中的 `Tab` 元素不再需要强制配置 `name` prop。
* [+] `Alert` 组件显示多条消息时，增加当前消息索引/总消息数的展示。
* [^] 调整 `Alert` 组件默认 slot 范围，同时新增默认 scoped slot。
* [+] `RegionPicker` 组件支持数据项的禁用。

### 🐞 问题修复

* [^] 修复 `Tabs` 组件中 `Tab` 元素的渲染顺序和 prop 同步问题。
* [^] 修复 `Searchbox` 组件在按 <kbd>enter</kbd> 后自动触发表单提交的问题。
* [^] 修复 `Overlay` 组件中判断组件类型错误的问题。
* [^] `Calendar` 组件在时间段选择过程中，如果 `selected` 发生变更，现在会自动清除半选状态。
* [^] 修复 `veui-loader` 在 Windows 下生成路径错误的问题。
* [^] 修复 `Uploader` 组件文件名没有去掉 `fakepath` 前缀的问题。
* [^] 修复 `Uploader` 组件没有正确使用 `name` prop 的问题。

## 1.0.0-alpha.4

### ⚠️ 非兼容性变更

* [^] 重构了 `babel-plugin-veui` 及 `veui-loader` 的逻辑，以支持服务端渲染时首屏样式的抽取。

  > #### 迁移指南
  >
  > * 删除 `build/vue-loader.conf.js` 中 `preLoaders` 中的 `veui-loader` 配置；
  >
  > * 将 `.babelrc` 中的 `veui` 插件配置删除，整个只保留字符串 `'veui'`；
  > * 在 `build/webpack.base.conf.js` 中，重新配置 `veui-loader`：
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

### 🐞 问题修复

* [^] 修正了 `Carousel` 组件 slot 的位置。

## 1.0.0-alpha.3

### 🐞 问题修复

* [^] 统一所有内部依赖版本。

## 1.0.0-alpha.2

### 🐞 问题修复

* [^] 修复主题包 `peerDependencies` 中的 `veui` 版本号。

## 1.0.0-alpha.1

### ⚠️ 非兼容性变更

* [^] 主题包 `veui-theme-x` 重命名为正式名称 `veui-theme-one`。

### 💡 主要变更

* [+] 新增 `Tree` 组件。
* [+] 新增 `FilterPanel` 组件。
* [+] 新增 `Transfer` 组件。
* [+] 新增 `Schedule` 组件。
* [+] 为 `babel-plugin-veui` 增加了类似 `babel-plugin-lodash` 的功能，以减小打包体积。
* [+] `Tabs` 组件支持在传入的 slot 内容中动态切换内部的 `Tab` 元素，增加预设的添加删除按钮。
* [+] `outside` 指令新增 `excludeSelf` 参数，使判断仅对 `refs` 生效。
* [+] `outside` 指令新增 `mousedown`、`mouseup` 的支持。
* [+] `Tooltip` 组件新增 `interactive` prop，控制浮层是否可交互。
* [+] `Calendar` 组件新增 scoped slot `date`。

### 🐞 问题修复

* [^] 修复 `Calendar` 组件在选择范围时错误切换视图的问题。
* [^] `Checkbox` 和 `Radio` 组件现在可以在未绑定数据时进行交互。
* [^] 修复 Chrome 62 起给按钮默认添加圆角的问题。

## 0.3.3

* [^] 修复 `config` 模块参数重载错误的问题。
* [+] `config` 模块支持对对象配置的 `merge`、`mergeDefaults` 操作。
* [^] 修复 `Uploader` 禁用 `input` 导致上传失败的问题。
* [^] `Uploader` 本地校验失败的 slot 名修改为 `type-invalid` 及 `size-invalid`。**[Breaking change]**
* [+] 为调用了 `Overlay` 组件的元素增加了指定 `overlay-options` 的功能。
* [^] 修复了 `RegionPicker` 浮层有时会闪动的问题。
* [+] 新增了 `Carousel` 组件。

## 0.3.2

* [^] 修正 `Calendar` 单元格的文字颜色、背景色相关样式。
* [^] 修复上个版本完善 `outside` 指令时引入的问题。

## 0.3.1

* [+] `Tooltip` 增加延时隐藏的 prop `hideDelay`。
* [^] 修复不引入 `ButtonGroup` 时，`CheckButtonGroup` 和 `RadioButtonGroup` 部分样式丢失的问题。

## 0.3.0

*此版本包含多个 breaking change，升级前请仔细阅读下列说明。*

* [+] **增加了统一 UI 样式包，暂定名 `veui-theme-x`**。
* [^] 将所有图标移入样式包分别管理。
* [^] 规范化所有公用组件文件名、组件 `name`、组件 DOM 容器 `class` 的命名规则，所有非首位的大写字母在转换为小写后增加 `-` 进行分隔。修改清单见 [#122](https://github.com/ecomfe/veui/issues/122)。**[Breaking change]**
* [-] 移除了 `BreadCrumb` 组件的 prop `routers`。**[Breaking change]**
* [^] `Pager` 组件 `to` 默认值修改为 `''`（空字符串），以进入 `Link` 的无跳转逻辑。**[Breaking change]**
* [-] 移除了 `Pager` 组件的 prop `pageTotal`。**[Breaking change]**
* [^] `Radiobox` 组件重命名为 `Radio`。**[Breaking change]**
* [^] `RadioboxGroup` 组件重命名为 `RadioGroup`。**[Breaking change]**
* [^] `Button` 组件的 `aux` 风格 `ui` 现在是默认样式，原有的默认样式更名为 `secondary`。**[Breaking change]**
* [^] 为组件支持了 `:focus-ring` 的 polyfill，需要使用方自行引入。详见 [#121](https://github.com/ecomfe/veui/issues/121)。**[Breaking change]**
* [^] 优化了 `Uploader` 组件的部分 prop、slot 的命名。详见 [#133](https://github.com/ecomfe/veui/issues/133)。**[Breaking change]**
* [+] `Uploader` 的 prop `maxSize` 现在支持形如 `'100KB'` 的字符串作为值。
* [^] `Uploader` 的 prop `accept` 现在需要按规范书写，。详见[此处](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Limiting_accepted_file_types)。**[Breaking change]**
* [^] 修复 `RegionPicker` 浮层在特殊情况下显示上的问题。
* [+] 为 `Table` 增加 `select-mode` prop，用于提供单选模式。
* [^] 修复 `Dropdown` 在 `ui` 为 `link` 时的样式。
* [+] 增加 `ButtonGroup` 组件。
* [+] 增加 `RadioButtonGroup` 组件。
* [+] 增加 `CheckButtonGroup` 组件。
* [+] 增加 `Sorter` 组件。
* [+] 增加 `Progress` 组件（限 `theme-x`）。
* [+] 所有有单一浮层逻辑的组件，新增 prop `overlay-class`，最终渲染到 `Overlay` 实例的 DOM `class` 上，方便外部区分浮层归属。

## 0.2.4

* [+] 增加 `veui-loader`，确保只在 Webpack 能够 resolve 样式文件时 `babel-plugin-veui` 才注入样式 `import` 语句。
* [^] 改善 `Button`、`Table` 组件的样式。
* [+] 为 `Link` 组件增加 `fallback` prop，用于指定无链接时渲染的容器标签名。
* [+] 为 `Steps` 添加路由支持。
* [^] `Select` 组件选项值现在支持 `''`（空字符串）或 `0`。
* [+] 为 `Select` 组件添加未命名分组样式。
* [+] 为 `Switch` 组件增加描述及默认 slot。
* [+] 为 `Searchbox` 组件增加 `clearable` prop，`suggestions` scoped slot 以及 `select` 事件，`suggestions` 支持字符串数组。
* [^] 修正 `indeterminate` 状态 `Checkbox` 的浏览器兼容性。
* [^] `Table` 组件的 `select` 事件将在 `selected` prop 更新后触发，`select` 事件在全选时增加 `null` 值作为当前选择项的数据，参数列表修改为和单选时一致。**[Breaking change]**
* [^] 修正 `RegionPicker` 无法响应外部 `selected` 变化的问题。

## 0.2.3

* [^] 修复 `0.2.2` 版本 npm 包的问题。

## 0.2.2

* [+] 增加 `$alert`、`$confirm`、`$prompt` 插件。
* [+] 增加 `RegionPicker` 组件。
* [+] 增加 `Steps` 组件。
* [^] `SearchBox` 重命名为 `Searchbox`。**[Breaking change]**
* [^] 去除 `Breadcrumb`、`Table`、`Tabs` 中对 Vue 内部函数的依赖。
* [+] 为 `Overlay` 组件增加 `open.sync` 支持。
* [^] 修复 `outside` 指令重复添加事件绑定的问题。
* [^] 修复 `Calendar` 组件年份选择视图前后选择不正确的问题。

## 0.2.1

* [+] 增加了 `SearchBox` 组件。
* [+] 为 `Select` 组件增加了 `clearable` prop，可以根据 `placeholder` 生成首选项以清除之前的选择。
* [^] 修复 `Select` 组件有分组时子选项无法正常选择的问题。
* [^] 优化了 `Button` 中元素的对齐方式。
* [^] 修复了 `Tooltip` 组件在循环中绑定 `target` 的问题。
* [^] 修复了 `Table` 组件 slot `no-data` 失效的问题。
* [^] 修复了 `Table` 组件在选择时会修改未添加 `.sync` 的 `selected` prop 的问题。
* [+] 增加了 `Pager` 每页显示数和默认选项的全局配置。
* [+] 修复了 `Pager` 在没有数据时下一页按钮没有禁用的问题。
* [^] 重命名 `Pager` 的 `pageTotal` prop 为 `total`，旧名称仍然兼容，未来版本可能删除。

## 0.2.0

* [^] 项目转为 mono-repo 的组织方式，使用 `lerna` 进行管理。
* [+] 将样式代码独立为单独的包 `veui-theme-dux`。
* [+] 使用 `babel-plugin-veui` 识别、改写对组件的引用，无缝引入可配置的样式文件包。
* [+] 增加 `Form`、`Field`、`Fieldset` 组件。
* [^] 根据表单逻辑修改了输入型控件 `disabled`/`readonly` 的实际生效方式，最终生效的值更改为计算属性 `realDisalbed`/`realReadonly`。
* [+] 增加 `Tabs` 和 `Tab` 组件。
* [+] 增加 `Switch` 组件。
* [^] `Checkbox` 新增 `true-value` 和 `false-value` prop，调整相应逻辑。
* [+] 增加指令式调用 `alert`/`confirm`/`prompt` 的功能。
* [^] `Pager` 组件新增 `pageSizes` prop，用来指定可选的页数。

## 0.1.3

* [^] 将 `BreadCrumb` 组件的 `routers` prop 重命名为 `routes`，后续版本会将 `routers` 移除。
* [^] 修复 `Icon` 组件嵌套失效的问题。
* [^] 修正 `Table` 组件样式中行高不准确的问题。
* [^] 小幅重构 `Table` 组件代码。
