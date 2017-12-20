## 1.0.0-alpha.5

### ⚠️ 非兼容性变更

* [^] 为 `Select` 用名为 `option-label` 的 scoped slot 替代了原来的 `option`。原来的 `option` 现在为整个选项的内容，包括文本和图标等。

### 💡 主要变更

* [+] 新增 `resize` 指令。
* [^] `Tabs` 组件中的 `Tab` 元素不再需要强制配置 `name` 属性。
* [+] `Alert` 组件显示多条消息时，增加当前消息索引/总消息数的展示。
* [^] 调整 `Alert` 组件默认 slot 范围，同时新增默认 scoped slot。

### 🐞 问题修复

* [^] 修复 `Tabs` 组件中 `Tab` 元素的渲染顺序和属性同步问题。
* [^] 修复 `Searchbox` 组件在按 <kbd>enter</kbd> 后自动触发表单提交的问题。
* [^] 修复 `Overlay` 组件中判断组件类型错误的问题。
* [^] `Calendar` 组件在时间段选择过程中，如果 `selected` 发生变更，现在会自动清除半选状态。
* [^] 修复 `veui-loader` 在 Windows 下生成路径错误的问题。
* [^] 修复 `Uploader` 组件文件名没有去掉fakepath前缀的问题，以及直接使用realName导致自己的name被field的name覆盖的问题。

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
* [+] 为 `Searchbox` 组件增加 `clearable` 属性，`suggestions` scoped slot 以及 `select` 事件，`suggestions` 支持字符串数组。
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
* [+] 为 `Select` 组件增加了 `clearable` 属性，可以根据 `placeholder` 生成首选项以清除之前的选择。
* [^] 修复 `Select` 组件有分组时子选项无法正常选择的问题。
* [^] 优化了 `Button` 中元素的对齐方式。
* [^] 修复了 `Tooltip` 组件在循环中绑定 `target` 的问题。
* [^] 修复了 `Table` 组件 slot `no-data` 失效的问题。
* [^] 修复了 `Table` 组件在选择时会修改未添加 `.sync` 的 `selected` prop 的问题。
* [+] 增加了 `Pager` 每页显示数和默认选项的全局配置。
* [+] 修复了 `Pager` 在没有数据时下一页按钮没有禁用的问题。
* [^] 重命名 `Pager` 的 `pageTotal` 属性为 `total`，旧名称仍然兼容，未来版本可能删除。

## 0.2.0

* [^] 项目转为 mono-repo 的组织方式，使用 `lerna` 进行管理。
* [+] 将样式代码独立为单独的包 `veui-theme-dux`。
* [+] 使用 `babel-plugin-veui` 识别、改写对组件的引用，无缝引入可配置的样式文件包。
* [+] 增加 `Form`、`Field`、`Fieldset` 组件。
* [^] 根据表单逻辑修改了输入型控件 `disabled`/`readonly` 的实际生效方式，最终生效的值更改为计算属性 `realDisalbed`/`realReadonly`。
* [+] 增加 `Tabs` 和 `Tab` 组件。
* [+] 增加 `Switch` 组件。
* [^] `Checkbox` 新增 `true-value` 和 `false-value` 属性，调整相应逻辑。
* [+] 增加指令式调用 `alert`/`confirm`/`prompt` 的功能。
* [^] `Pager` 组件新增 `pageSizes` 属性，用来指定可选的页数。

## 0.1.3

* [^] 将 `BreadCrumb` 组件的 `routers` 属性重命名为 `routes`，后续版本会将 `routers` 移除。
* [^] 修复 `Icon` 组件嵌套失效的问题。
* [^] 修正 `Table` 组件样式中行高不准确的问题。
* [^] 小幅重构 `Table` 组件代码。
