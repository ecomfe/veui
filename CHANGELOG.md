### 0.2.4

* [^] 改善 `Button`、`Table` 组件的样式。
* [+] 为 `Link` 组件增加 `fallback` prop，用于指定无链接时渲染的容器标签名。
* [+] 为 `Steps` 添加路由支持。
* [^] `Select` 组件选项值现在支持 `''`（空字符串）或 `0`。
* [+] 为 `Select` 组件添加未命名分组样式。
* [+] 为 `Switch` 组件增加描述及默认 slot。
* [+] 为 `Searchbox` 组件增加 `clearable` 属性，`suggestions` scoped slot 以及 `select` 事件，`suggestions` 支持字符串数组。

### 0.2.3

* [^] 修复 `0.2.2` 版本 npm 包的问题。

### 0.2.2

* [+] 增加 `$alert`、`$confirm`、`$prompt` 插件。
* [+] 增加 `RegionPicker` 组件。
* [+] 增加 `Steps` 组件。
* [^] `SearchBox` 重命名为 `Searchbox`。**[Breaking change]**
* [^] 去除 `Breadcrumb`、`Table`、`Tabs` 中对 Vue 内部函数的依赖。
* [+] 为 `Overlay` 组件增加 `open.sync` 支持。
* [^] 修复 `outside` 指令重复添加事件绑定的问题。
* [^] 修复 `Calendar` 组件年份选择视图前后选择不正确的问题。

### 0.2.1

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

### 0.2.0

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

### 0.1.3

* [^] 将 `BreadCrumb` 组件的 `routers` 属性重命名为 `routes`，后续版本会将 `routers` 移除。
* [^] 修复 `Icon` 组件嵌套失效的问题。
* [^] 修正 `Table` 组件样式中行高不准确的问题。
* [^] 小幅重构 `Table` 组件代码。
