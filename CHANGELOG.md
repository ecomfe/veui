## ?

### ⚠️ 非兼容性变更

* [^] 用 Popper.js 替代了 Tether。`Overlay` 组件的 `options` prop（以及多个组件的 `overlay-options` prop）现在都对应于[Popper.js 的 `options` 参数](https://popper.js.org/popper-documentation.html#new_Popper_new)。`Overlay` 的 `position` prop 在之前的版本就已经兼容了 Popper.js 的语法，所以如果之前就以 Popper.js 风格进行描述，则无需调整。

### 🐞 问题修复

* [^] 修复 `Select` 组件中 `Option` 没有传入 `label` 时对应 slot 不渲染的问题。
* [^] 修复 `Select` 内联写法时部分 slot 不生效的问题。
* [^] 修复 `Select` 内联写法时 `trigger` prop 不生效的问题。

## 1.0.0-alpha.32

### ⚠️ 非兼容性变更

* [^] `Select`/`Input`/`Checkbox`/`Radio`/`Switch` 组件现在不会在外部数据发生变化后触发更新时抛出 `input` 或 `change` 事件。当需要始终同步数据时，则需使用 `v-model` 进行绑定。

### 💡 主要变更

* [^] `outside` 指令判断元素位置时增加了 Portal 逻辑的支持，如果 Portal 入口在指定范围内，则被其移动的元素也将视为在指定范围内。

### 🐞 问题修复

* [^] 修复 `Uploader` 组件在 `iframe` 模式下，提交过程中被销毁时没有正确移除 `<iframe>` 和 `<form>` 的情况。

## 1.0.0-alpha.31

### ⚠️ 非兼容性变更

* [^] 修正 `Uploader` 组件中 `file`/`uploading`/`failure` 三个作用域插槽参数。由 `{ file: { name, src, status, index } }` 修正为 `{ name, src, status, index }`。

### 💡 主要变更

* [+] `drag` 指令现在仅在鼠标左键按下时才触发拖动。
* [+] `drag` 指令的 `dragend` 回调参数中新增 `cancel` 方法，可用来撤消最近一次拖动（恢复到 `dragstart` 之前的位置）。

## 1.0.0-alpha.30

### 💡 主要变更

* [+] `ButtonGroup` 的点击事件增加最后一个参数为原生事件对象。
* [+] 增加 `Autocomplete` 组件。
* [+] 增加 `Drawer` 组件（缺样式）。
* [+] 增加 `Tag` 组件（缺样式）。

### 🐞 问题修复

* [^] `Dropdown` 组件现在可以正确支持不同尺寸。
* [^] 修复 `Input` 组件占位符有时没有正确清除的问题。
* [^] 修复 `NumberInput` 有时无法正确输入的问题。
* [^] 修复 `Searchbox` 组件在 `readonly` 状态下会触发提示的问题。

## 1.0.0-alpha.29

### 🐞 问题修复

* [^] 修正 `RegionPicker` 组件浮层不能正常关闭的问题。
* [^] 修正 `Tooltip` 组件的 `v-outside` 参数类型问题导致有时无非正常关闭。
* [^] 修正 `Schedule` 组件没有正确处理 `readonly`、`disabled` 和 `disabled-hour` prop 的问题。
* [^] 修正 `Schedule` 组件的 `label` 插槽 `from` 参数错误的问题。

## 1.0.0-alpha.28

### 🐞 问题修复

* [^] 修正 npm 包没有正确发布的问题。

## 1.0.0-alpha.27

### 🐞 问题修复

* [^] 修正 `babel-plugin-veui` 可能阻断后续插件执行的问题。(#469)

## 1.0.0-alpha.26

### 🐞 问题修复

* [^] 修正 `Tree` 组件 `item-label` slot 没有正常渲染的问题。
* [^] 修正 `longpress` 指令 `repeat` 参数的默认值为 `false`。
* [^] 修正 `resize` 指令没有正确处理 `leading` 参数的问题。
* [^] 修正 `outside` 指令没有准确判断参数是否变更的问题。
* [^] 修正 `Breadcrumb` 组件初始值为 `null` 时报错的问题。

## 1.0.0-alpha.25

### ⚠️ 非兼容性变更

* [^] `Checkbox` 的 `indeterminate` prop 不再支持 `.sync`，始终由外部控制。
* [^] `Switch` 的 `change` 事件将在数据更新完毕后触发。

### 💡 主要变更

* [^] 支持多个 `Checkbox` 在 `v-model` 绑定到同一个数组时自动组成复选框组。
* [+] `Textarea` 新增 `select-on-focus` prop。

### 🐞 问题修复

* [^] 修复了部分原生 `<button>` 未设置 `type="button"` 的问题。
* [^] 修正了 `Checkbox`、`Radio` 与 `Switch` 组件中原生 `<input>` 状态没有正确同步的问题，以触发 CSS 中正确的伪类样式。
* [^] 修正了带下拉浮层的组件的 ARIA 标注，使浮层拥有正确的从属关系。
* [^] 修正了组合组件时可能发生未正确继承 `ui` prop 的问题。
* [^] 修复了 `Schedule` 组件在拖动选取多日时段时，`selected` 中可能共享同一数组实例的问题。
* [^] 优化了 `Input`、`NumberInput` 与 `Textarea` 的属性透传机制，现在未被识别为 prop 的属性都会正确输出到原生 `<input>` 或 `<textarea>` 元素上。
* [^] 优化了原生事件透传机制，原生元素触发的事件将可以被外层组件直接透传。涉及的组件为 `Button`、`Checkbox`、`Radio`、`Switch`、`Input`。`NumberInput`、`Textarea`。

  > **相关事件包括：**
  >
  > `auxclick`、`click`、`contextmenu`、`dblclick`、`mousedown`、`mouseenter`、`mouseleave`、`mousemove`、`mouseover`、`mouseout`、`mouseup`、`select`、`wheel`、`keydown`、`keypress`、`keyup`、`focus`、`blur`、`focusin`、`focusout`。

## 1.0.0-alpha.24

### 💡 主要变更

* [+] 为 `Calendar` 及 `DatePicker` 组件增加 prop `type`，以支持月份/年份选择。
* [+] 为 `Transfer` 组件实现了 `focus` 方法。
* [^] 优化了 `Tree` 的键盘导航及 ARIA 标注。
* [^] 优化了 Chrome 下自动填充时的样式。

### 🐞 问题修复

* [^] 修正 `Transfer` 组件已选项不能从外部正确更新的问题。
* [^] 修正 `Table` 中 `colspan` 在动态显示列时计算不正确的问题。
* [^] 修正 `Uploader` 提示样式可能被截断的问题。

## 1.0.0-alpha.23

### ⚠️ 非兼容性变更

* [^] `Tree` 组件的 `expands` prop 更名为 `expanded`。`expands` 被废弃，将在 `1.0.0` 移除。
* [^] `Radio` 和 `Checkbox` 的 `change` 事件将在数据更新完毕后触发。

### 💡 主要变更

* [^] 为 `Overlay` 组件增加 prop `position`。
* [^] 为 `FilterPanel` 组件增加 prop `title`。
* [^] `Tree` 组件的 `item` 及 `item-label` slot 作用域参数现在包含每个节点数据项的所有字段。
* [^] `Transfer` 组件的 `candidate-item`、`selected-item`、`candidate-item-label` 及 `selected-item-label` slot 作用域参数现在包含每个节点数据项的所有字段。

### 🐞 问题修复

* [^] 修正 `Overlay` 组件 prop 类型导致 SSR 报错的问题。
* [^] 修正 `Searchbox` 组件 `suggestions` prop 类型为 `Array<string>` 时，`replace-on-select` 设置无效的问题。
* [^] 修正 `veui-theme-one-icons` 中图标的 `fill` & `stroke`。
* [^] 修正 `Transter` 组件的 `selected-item-label` 插槽在 `selected-show-mode` 为 `'flat'` 时无效的问题。
* [^] 修正 `Transfer` 组件更新 `datasource` 时候选项没有正确更新的问题。
* [^] 修正 `Schedule` 时段合并逻辑在从 `0:00` 开始时失效的问题。

## 1.0.0-alpha.22

### ⚠️ 非兼容性变更

* [^] `Progress` 组件的 `auto-succeed` prop 更名为 `autosucceed`。`auto-succeed` 被废弃，将在 `1.0.0` 移除。

### 💡 主要变更

* [^] `Pagination` 组件支持不传入 `to` prop，完全使用事件进行交互。
* [^] 为 `Dialog` 组件的所有插槽传入作用域参数 `close` 函数。

### 🐞 问题修复

* [^] 修复了 `Button` 中 `target` 等 `props` 的同步问题。
* [^] 修正了 `PromptBox` 回车确认时事件重复触发的问题。
* [^] 修正了 `CheckboxGroup` 和 `CheckButtonGroup` 组件初始值为 `null` 时报错的问题。
* [^] 修正了 `Calendar` 和 `Schedule` 组件范围选择初始值为 `null` 时计算错误的问题。
* [^] 修正了 `AlerBox` 和 `Tabs` 组件存在硬编码文本的问题。
* [^] 修正了 `Select` 和 `OptionGroup` 在使用内联组件时，作用域插槽没有生效的问题。
* [^] 修正了 `Textarea` 在显示行号且不自动扩展时，行号滚动不同步的问题。
* [^] 修正了 `Tooltip` 组件的在 `target`/`trigger` 改变时重新绑定事件的逻辑。

## 1.0.0-alpha.21

### 🐞 问题修复

* [^] 修复了 `NumberInput` 中 `value` 和 `localValue` 的同步问题。
* [^] 修正了 `Overlay` 组件 `target` prop 类型声明在 SSR 下报错的问题。
* [^] 修正了内部滚动模式的 `Table` 组件在系统有滚动条时的表头宽度。
* [^] 修正了用 `row` prop 指定 `Textarea` 组件高度时在 IE 下无视行高的问题。
* [^] 修正了 `Alert` 组件图标在 IE 下没有垂直居中的问题。
* [^] 修正了 `Slider` 组件在有多按钮时在 IE 下不能正常工作的问题。
* [^] 修正了 `Tree`、`DatePicker` 有时在鼠标操作时误显示聚焦样式的问题。
* [^] 修复了 `Tabs` 中使用 `offsetWidth` 的精度问题导致 `active` 和 `index` 切换失效的问题。

## 1.0.0-alpha.20

### 💡 主要变更

* [+] `Searchbox` 新增了 `suggestions-before` 与 `suggestions-after` 两个插槽。
* [^] `Searchbox` 提示层只在选择选项后关闭，如果点击自定义插槽而非默认的选择选项时，提示层不再自动关闭。
* [+] 在控制台警告中增加了组件层级信息。
* [+] 为 `Tree`/`FilterPanel`/`Transfer` 组件的增加了键盘交互。
* [+] 为所有支持聚焦或激活操作的组件添加了 `focus` 或 `activate` 方法。
* [+] 对于使用路由模式的 `Tabs` 及 `Tab` 组件，新增函数 prop `matches(current, to)` 来允许指定自定义的激活状态判断，不再需要手动在 `Tabs` 组件中控制 `index`。`Tab` 组件的 `matches` 逻辑优先于上层 `Tabs` 组件中的 `matches`。
* [+] 增加了全局配置项 `tabs.matches` 来允许全局自定义 `Tab` 组件 `matches` prop 的默认值。
* [^] 使用了更为显著的聚焦样式。

### 🐞 问题修复

* [^] 修复了 `Overlay` 组件的 `target` prop 类型。
* [^] 修正了主模块没有导出 `OptionGroup` 组件的问题。
* [^] 提前判断是否需要修正复选框 `indeterminate` 兼容性，而非在用到的组件 `mounted` 以后才判断，避免模拟的点击触发了已经定义的事件监听器。
* [^] 去除了多余的类型判断，修复 `min`/`max` 规则失效的问题。

## 1.0.0-alpha.19

### ⚠️ 非兼容性变更

* [^] `Uploader` 组件上传请求响应经过 `convert-response` 函数转换后，需要提供给组件执行后续操作的数据结构有所调整。目前仍然兼容老版本格式，但将在 `1.0.0` 移除。

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

* [-] 移除了 `managers/config` 的 `merge` 与 `mergeDefaults` 方法，现在对于 `Object` 类型的配置项需要提供完整值。
* [^] `Breadcrumb` 组件的 `default` 作用域插槽重命名为 `item`，因为 Vue 实际的 fallback 逻辑，所以避免使用同名的 slot 和 scoped slot。

### 💡 主要变更

* [+] 新增了 I18N 支持，外置了所有文案，并添加了组件级别对应的 `zh-Hans` 与 `en-US` locale。
* [+] `veui-loader` 新增支持通过 `locale` 选项配置要自动引入的语言包。
* [+] `veui-loader` 新增支持通过 `global` 选项配置全局引入的模块。
* [^] `managers/config` 模块的配置现在为响应式数据，支持在组件渲染后进行全局修改。
* [^] `Field` 组件对应的数据字段名现在默认优先取 `name` prop，且可以被 `field` prop 覆盖。
* [^] `rule` 模板占位符由 `${...}` 变更为 `{...}`，以方便在模板字符串中进行书写。老语法仍然保持兼容。
* [^] `Calendar`、`DatePicker` 与 `Schedule` 的范围合并逻辑现在默认为“智能”模式，当用户从已选项开始选择范围时，将从整体已选范围中去除当前选区；当从未选项开始选择时，则将当前选区并入整体。
* [+] `Table` 组件新增 prop `scroll`，用来限定内容滚动区域的最大高度，设置时会使得表格的头/脚固定。
* [+] `Table` 组件新增 prop `expandable` 与 `expanded`，用来支持行展开，且新增作用域插槽 `sub-row`。
* [+] `Column` 组件新增作用域插槽 `sub-row`。
* [^] `Link` 组件新增 prop `rel`、`target`，当 `target` 为 `_blank` 时自动为 `rel` 增加 `noopener` 值，以增强安全性。
* [^] 将所有图标替换为了新版「标局」图标并拆分为新的 `veui-theme-one-icons` 包。原 `veui-theme-one/icons` 下的图标依然保留。

### 🐞 问题修复

* [^] 修正了 `GridContainer` 的左右边距计算。
* [^] 修正了 `Link` 组件在默认模式下 `disabled` 未起效的问题。
* [^] 修正了 `Uploader` 组件 `remove` 事件的回调参数 `file` 提供了错误的文件的问题。
* [^] 修正了未注册的 `ui` 值不能直接输出的问题（[#378](https://github.com/ecomfe/veui/issues/378)）。

## 1.0.0-alpha.18

### ⚠️ 非兼容性变更

* [^] 对 Vue-Awesome 的依赖升级到 `3.1.2`。如果之前有在项目中直接使用 `vue-awesome@2` 的，需要升级到最新版，否则无法混用 VEUI 与 VueAwesome 的图标。
* [^] `Tooltip` 组件的 `custom` prop 被废弃，将在 `1.0.0` 移除。替代方式为：将 `trigger` prop 指定为 `custom` 来使用自定义逻辑控制打开及关闭。
* [^] `Pagination` 组件内部所有的 `class` 中的 `pager` 被更名为 `pagination`。如果在样式代码中进行过定制，请进行全局替换。
* [^] `Uploader` 组件的 `progress` prop 的 `'number'` 取值被替换为 `'percent'` 及 `'detail'`，分别表示显示百分比及显示进度详情。进度详情将以 <code>\`${loaded}KB/${total}KB\`</code> 的形式输出。
* [^] `Uploader` 组件的 prop `convert-response` 函数必须返回转换后的数据对象。

### 💡 主要变更

* [^] 增加主题包为组件部件指定 `ui` 的功能，同时组件现在将自动继承父组件中可继承的 `ui` 字段，并更新了 `veui-theme-one` 中所有相应的部分。
* [+] `Breadcrumb` 组件的 scoped slot `default` 新增参数 `index`。
* [+] `Button` 组件增加 `ui` 选项 `dark`。
* [^] `rule` 的 `validate` 方法现在可以传入额外的上下文的数据，比如在 `Field` 验证时传入整个 `Form` 的 `data`。

### 🐞 问题修复

* [^] 修正 `GridContainer` 没有正确发布的问题。
* [^] 修复 `Slider` 组件在有 `step` 时的选择逻辑，由向下选取点改为就近取点，且修正了 `min` 值非 `0` 时的逻辑。
* [^] 修复 `Uploader` 组件无法正确获取全局配置的 `uploader.convertResponse` 函数的问题。

## 1.0.0-alpha.17

### ⚠️ 非兼容性变更

* [^] `Dialog` 组件预设 `ui` 值 `top` 更名为 `high`。
* [^] `Button` 组件再 `loading` 状态下将保留 slot 内容，不再强行设置为 `'加载中……'`。
* [-] 删除了 `$confirm`、`$prompt` 插件本来就无效的带状态唤起接口。

### 💡 主要变更

* [+] 增加 `longpress` 指令。
* [+] `Dropdown` 组件增加了 `trigger` prop，来指定何时展开下拉框。
* [+] `Dropdown` 组件增加了 `split` prop，来允许拆分指令按钮与下拉切换按钮。
* [+] `Button` 组件增加了 `mouseenter`/`mouseleave` 事件。
* [+] `NumberInput` 组件支持长按调整值。
* [+] 增加了 `GridContainer`/`GridRow`/`GridColumn` 组件。
* [+] `Progress` 组件增加了预设 `ui` 值 `fluid`，自适应容器宽度。
* [+] `Dialog` 组件增加了预设 `ui` 值 `small`/`large`/`auto`，用于指定预设宽度。
* [+] 为 `Overlay`/`Dialog`/`AlertBox`/`ConfirmBox`/`PromptBox` 组件增加了 `afterclose` 事件。
* [^] 调整了 `alert`/`confirm`/`prompt`/`toast` 插件的接口，现在 `$alert`/`$confirm`/`$prompt`/`$toast` 均可直接作为函数调用。

### 🐞 问题修复

* [^] 修复 `Tabs` 组件移除标签时可能产生的问题。
* [^] 修正 `ConfirmBox` 没有正确触发事件的问题。

## 1.0.0-alpha.16

### 💡 主要变更

* [+] 增加了 `babel-preset-veui`，简化了引入 VEUI 一起进行转译所需的步骤。
* [^] 引入 `date-fns` 替换了对 `moment` 的依赖。

### 🐞 问题修复

* [^] 修复了 `DatePicker` 组件 `panel` prop 默认值错误的问题。
* [^] 修正 `Alert` 组件样式。
* [^] 修正 `Breadcrumb` 组件样式。

## 1.0.0-alpha.15

### ⚠️ 非兼容性变更

* [^] 因为 `less@2` 依赖的包存在安全漏洞，故此次升级将对 `less` 的依赖升级到了 `^3.8.0`，对 `less-plugin-est` 的依赖升级到了 `^3.0.0`。

  > #### 迁移指南
  >
  > 1. 更新 `less` 与 `less-plugin-est` 的版本；
  > 2. 如果使用 `vue-cli` 的 `webpack` 模板初始化项目，请按如下方式修改 `build/utils.js` 文件：
  >
  >  ```diff
  >  -    less: generateLoaders('less'),
  >  +    less: generateLoaders('less', { javascriptEnabled: true }),
  >  ```

* [^] `Dialog` 组件现在默认会在点击默认的按钮及按下 <kbd>esc</kbd> 键时关闭并通过 `.sync` 修饰符同步外部数据。并且新增 `before-close` 函数 prop 来处理需要阻止对话框关闭的情况。增加 `default`/`foot` slot 的 slot 参数 `close`，用来在重写组件 slot 时调用关闭逻辑。

  > #### 迁移指南
  >
  > 对于重写 `foot` slot 处理关闭逻辑的使用方式，不会受新逻辑影响。
  >
  > 对于监听 `ok`/`cancel` 事件并直接关闭对话框时，亦不受此改动影响。当需要阻止对话框关闭时，需要使用新增的 `before-close` 函数 prop。
  >
  > `before-close` prop 对应的函数类型为 `function(type: string): boolean=|Promise<boolean=>`，`type` 将会是 `Dialog` 组件关闭操作的类型，默认情况下会有 `ok` 与 `cancel`。返回值可以是一个 `boolean`，也可以是一个 resolve `boolean` 的 `Promise`，用来处理可能需要异步决定对话框关闭状态的情况。返回值或 resolve 值非 `false` 时才会关闭对话框。例如，如果我们要异步处理 `ok`，而对 `cancel` 直接关闭，可以按如下方式处理：
  >
  > ```html
  > <veui-dialog :open.sync="dialogOpen" :before-close="submit">...</veui-dialog>
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
  > 对于需要重写 slot（例如添加底部按钮等）的情况，可以使用新增的 slot 参数 `close`，类型为 `function(type: string): void`，使用者只需要在合适的时机自行调用 `close` 函数即可，`type` 默认支持 `ok`/`cancel` 并会透传到 `before-close` 的流程中。例如：
  >
  > ```html
  > <veui-dialog :open.sync="dialogOpen" :before-close="submit">
  >   ...
  >   <template slot="foot" slot-scope="{ close }"><button @click="close">OK</button></template>
  > </veui-dialog>
  > ```

* [^] `Pagination` 组件的 `redirect` 事件回调参数从 `({ page, event })` 调整为 `(page, event)`。
* [^] 调整 `FilterPanel` 组件和 `Tree` 组件的对外接口参数名，统一将 `options`/`option` 更名为 `items`/`item`。
* [^] 调整 `resize` 指令的默认每次都触发回调，增加 `throttle`/`debounce`/`leading` 三个 modifier。
* [^] 通过 `prompt` manager 以指令式调用输入弹框功能时，现在返回的 `Promise` 在确认提交与取消时 `resolve` 的值分别是字符串和 `null`，与原生全局 `prompt` 方法一致（原来是 `{ isOk: true, value }` 与 `false`）。
* [^] `Button` 组件加载中的文本修改为默认 slot 的内容。
* [^] 调整 `rule` 出错信息变量模板匹配语法从 `%{ruleValue}` 修为 `${ruleValue}`，旧语法将在 `1.0.0` 移除。
* [^] `Alert` 组件新增 `closable` prop，默认为 `false`，显式指定后才会显示关闭按钮/文本，而非原来的始终显示关闭按钮/文本。
* [^] `Alert` 组件的 `close-text` prop 更名为 `close-label`，`close-text` 将在 `1.0.0` 移除。

### 💡 主要变更

* [+] `Uploader` 组件增加自定义上传模式。`request-mode` 新增可选值 `custom`，设置为该值时，支持通过新增的 prop `upload` 自定义上传函数。
* [+] `Uploader` 组件增加切换动画。
* [+] `Steps` 组件的 `click` 事件回调参数增加原生事件对象 `event`，现为 `(index, event)`。
* [+] `Overlay` 组件浮层根元素上现在增加了对 `overlay.overlayClass` 全局配置项对应类名的输出。
* [+] `Switch` 组件现在会透传与 `Checkbox` 组件一致的原生 DOM 事件。
* [+] `Toast` 组件增加 prop `open`，支持 `.sync`。
* [+] `Toast` 组件增加 slot `default`。
* [+] `Toast` 组件增加全局配置 `toast.duration`。

### 🐞 问题修复

* [^] 修复了 `Uploader` 组件 `iframe` 模式中上传失败后重试时没有上传文件的问题。
* [^] 修复了 `Uploader` 组件初始化后丢失 `name` 和 `src` 以外的自定义属性丢失的问题。
* [^] 修复了 `Overlay` 组件中寻找最近父级浮层时，可能跨过太多层级的问题。
* [^] 修复了 `FilterPanel` 组件在不展示搜索框的时候，内容区域高度不正确的问题。
* [^] 修复了 `Field` 组件内部输入组件交互时数据同步导致校验不正确的问题。
* [^] 修复了 `Tabs` 组件使用 `label` slot 时的事件绑定问题。
* [^] 修复了 `Input` 组件父级设置值为 `null` 后，仅格式化本地值为 `''`，未同步 `''` 至父级的问题。
* [^] 去除了 `Steps` 组件的多余外边距。
* [^] 去除了 `Progress` 组件多余的内边距。
* [^] 修正了 `Progress` 组件的 `auto-succeed` prop 的逻辑。
* [^] 修正了 `NumberInput` 组件的 `min`/`max` prop 有时失效的问题。
* [^] 修正了 `Alert` 组件多消息导航和关闭按钮不会同时显示的问题。
* [^] 修正了 `alert`/`confirm`/`prompt` plugin 不能正常工作的问题。
* [^] 修复了 `Table` 组件 `foot` slot 的渲染。

## 1.0.0-alpha.14

### ⚠️ 非兼容性变更

* [^] `Progress` 组件的 `state` prop 更名为 `status`。`state` 将在 `1.0.0` 移除。
* [^] `Schedule` 组件的 `shortcuts-display` prop 值 `expand`/`collapse` 分别更名为 `inline`/`popup`。旧的值将在 `1.0.0` 移除。
* [^] `Schedule` 组件的 `header` slot 更名为 `header-content`，新 `header` slot 现在包括顶部内容的整个容器。

### 💡 主要变更

* [^] `RegionPicker` 组件的 `datasource` prop 中的 `id` 字段重命名为 `value`，但 `id` 依然保留，优先使用 `value`。
* [^] 优化了 `outside` 指令解析数字值的逻辑。
* [^] 为 `Pagination` 组件内的 `Select` 组件新增了 `overlay-class` 定义，方便自定义样式。
* [^] 优化了 `Switch`、`Steps`、`Schedule`、`Table`、`Fieldset` 等组件的可访问性，实现了键盘交互。

### 🐞 问题修复

* [^] 修复了更多在计算浮层层级过程中有时会导致死循环的场景。
* [^] 去除了 `dropdown` mixin 中 多余的默认 `overlay-options` 约束条件，修正某些场景下的浮层展开的默认方向。
* [^] 修复了 `Input` 组件初始值为 `null` 时使用输入法会失效的问题。
* [^] 现在 `Searchbox` 组件在 `suggestions` 变化时会自动更新浮层位置。
* [^] 修复了点击 `Label` 组件激活同 `Field` 下的输入组件时，没有考虑组件禁用/只读状态的问题。

## 1.0.0-alpha.13

### ⚠️ 非兼容性变更

* [^] `Checkbox`、`Switch` 组件新增 prop `model`，对应 `v-model`。`checked` prop 不再对应 `v-model`，而是支持 `.sync`。
* [^] `Checkbox`、`Radio`、`Switch` 组件新增 `input` 事件用于 `v-model`。`change` 事件参数抛出当前的 `checked` 值，仅在用户切换时触发。
* [^] `Calendar` 组件的 `selectstart` 事件抛出的参数格式从 `[Date]` 修改为 `Date`，表示选择的起始日期，去除多余的数组。
* [^] 移除 `DatePicker` 组件的 `placeholderBegin`、`placeholderEnd` prop 及相应的 slot `placeholder-begin`、`placeholder-end`，以及全局配置 `datepicker.placeholderBegin`、`datepicker.placeholderEnd`。取而代之的是，增加配置项 `datepicker.rangePlaceholder`，并总是响应外部设置的 `placeholder` prop。默认状态下，会根据 `range` prop 来显示 `datepicker.placeholder` 或 `datepicker.rangePlaceholder` 的值。
* [^] `DatePicker` 组件的 `date` scoped slot 现在会透传给内部的 `Calendar` 的同名 scoped slot，不再表示已选择日期区域。原来已选择位置的 scoped slot 重命名为 `selected`，为范围选择时；类型为 `Date` 的 `date` 字段废弃，取而代之的是三个类型为 `number` 的字段：`year`、`month`（`0` 表示一月）、`date`；增加参数字段 `position`，起止日期分别对应 `from` 和 `to`。
* `Carousel` 组件的轮播项内容现在完全在 scoped slot `item` 内部，不再在外部添加行内图片背景样式，方便自定义非图片类型的轮播项。

### 💡 主要变更

* [^] `veui-loader` 支持 webpack 4，resolve 路径逻辑调整为异步。
* [+] 为 `RegionPicker` 添加了键盘导航和 WAI-ARIA 支持。
* [+] `BreadcrumbItem` 和 `Link` 组件的 `to` prop 支持使用 `Object` 格式（以传递具名路由对象）。
* [+] `DatePicker` 组件增加 `today` prop，和 `Calendar` 对应 `prop` 一致。
* [+] `DatePicker` 组件的 `format` prop 现在可以传入函数，签名为 `function(Date): string`。
* [+] `DatePicker` 组件的 `shortcuts` 配置中，`to` 字段新增默认值 `0`。
* [+] `Input` 组件新增 WebKit 自动填充状态的判断，优化样式。
* [+] `Tabs` 新增 ui 值 `block`，并带动画效果。
* [+] `Tab` 组件新增 `status` prop。
* [^] `Tab` 组件在路由模式下会自动渲染 `<router-view>`。
* [*] `Tab` 组件的 prop `to` 现在可以使用相对路径。
* [^] `resize` 指令底层升级，切换到 `resize-detecor`，并增加 debounce 优化。
* [+] `RadioGroup`、`CheckboxGroup`、`RadioButtonGroup` 及 `CheckButtonGroup` 组件的默认 scoped slot 参数增加 `index` 表示选项序号。
* [^] `numeric` 校验规则现在禁止多余的 `0` 开头的字符串值。
* [^] `Select` 组件的 scoped slot `label` 现在作用域绑定到完整的已选中的 `options` 项，而非 `{ label }`。

### 🐞 问题修复

* [^] 修复了上一版本中引入的浮层 `autofocus` 失效的问题。
* [^] 修复了上一版本中引入的在计算浮层层级过程中有时会导致死循环的问题。
* [^] 修复了 `Textarea` 组件初始 `value` 为 `null` 时的问题。
* [^] 修复了 `Input` 组件在 SSR 时报错的问题。
* [^] `input` 类型组件的错误状态通过组件数据进行传递，而不仅仅依赖于外层 `Field` 的 `class`。
* [^] 修复了 `Tab` 使用路由模式时设置 `name` prop 会出错的问题。
* [^] 修复了 `Table` 的 `update:selected` 事件有时未正确抛出的问题。
* [^] 修复了 `Progress` 组件 prop 校验的问题。
* [^] 修复了 `OptionGroup` 组件未将 `disabled` 传递给 `Option` 组件的问题。

## 1.0.0-alpha.12

### ⚠️ 非兼容性变更

* [^] `Uploader` 组件在 `maxCount` 的值是 `1` 的情况下，`value` 的默认类型从字符串改成对象，可以通过设置 prop `compat` 为 `true` 将 `value` 的类型设置为字符串兼容旧版本。`compat` 模式未来不会移除，但不建议使用。

  > #### 迁移指南
  >
  > `Uploader` 在 `max-count` 为 `1` 时的 `value` prop 数据类型修改为对象，和多文件时的数组项相同。需要兼容原字符串数据格式时，需要设置 `compat` prop 为 `true`：
  >
  > ```html
  > <veui-uploader compat .../>
  > ```

* [^] 修改了 `Radio` 组件的 `v-model` 语义，现在机制和 Vue.js 对原生 `<input type="radio">` 的处理保持一致。

  > #### 迁移指南
  >
  > 此版本前的 `Radio` 组件的 `v-model` 对应 `checked` 属性，但由于之前的版本中存在多个同 `name` 的 `Radio` 组件时，被取消选中的单选框并不会响应数据变化，导致实际 `v-model` 并不完全可用。新版本在使用 `v-model` 的场景下修复了这个问题，并把逻辑和 Vue.js 对原生元素的处理方式进行了对齐。
  >
  > ```html
  > <veui-radio value="html" name="lang" v-model="lang"/>
  > <veui-radio value="css" name="lang" v-model="lang"/>
  > <veui-radio value="javascript" name="lang" v-model="lang"/>
  > ```
  >
  > 通过将多个 `Radio` 组件的 `v-model` 绑定到同一个数据项，即可完成数据的双向绑定。注意，仍然建议使用 `name` 属性来正确表达分组。这将会影响元素的可访问性。
  >
  > 同时，更建议使用 `RadioGroup` 组件来实现单选组，因为它会有更简单的 API 和可访问性。

* [-] 移除 `Input` 组件的 `type` prop 对 `textarea` 的支持。

  > #### 迁移指南
  >
  > 使用 `Textarea` 组件进行替代：
  >
  > ```html
  > <veui-textarea v-model="value" .../>
  > ```

* [^] 将 `OptionGroup` 的 `position` 属性的 `popout` 值重命名为了 `popup`（与 `aria-haspopup` 保持一致）。将在 `1.0.0` 移除对 `popout` 的支持。
* [^] 将 `Progress` 组件的 `precision` prop 重命名为和 `NumberInput` 一致的 `decimal-place`。`precision` 将在 `1.0.0` 移除。

### 💡 主要变更

* [+] `babel-plugin-veui` 支持在 `import` 时为组件添加前缀，方便直接使用快捷写法定义组件的 `components` 选项。默认支持 `veui-` 和 `v-` 两种前缀。

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

* [+] `NumberInput` 新增 `max`/`min` prop，优先从直接父组件 `Field` 的 prop `rule` 中继承 `max`/`min` rule 的值。
* [+] `Input` 新增 `clearable` prop，提供清除输入内容的功能；补充 `placeholder` prop 对 IE9 的支持。
* [^] `Uploader` 组件的事件 `success`、`failure`、`remove` 增加参数：当前处理文件的序号。
* [^] `Uploader` 组件在重新上传的时候不再触发 `remove` 事件。
* [^] 增加了 `Select`、`Dropdown`、`Carousel`、`Pagination` 及 `Progress` 等组件的 WAI-ARIA 支持。

### 🐞 问题修复

* [^] 修复了 `Textarea` 触发事件时没有正确处理 `this` 的问题。
* [^] 修复了 `NumberInput` 在只读状态下可以用键盘上下键调整值的问题。
* [^] 修复了 `outside` 指令设置 `delay` 时未清除定时器的问题。
* [^] 修复了浮层 `z-index` 未更新完毕就展现造成的闪动问题。

## 1.0.0-alpha.11

### 🐞 问题修复

* [^] 修复了 `config/uiTypes.js` 命中 `npmignore` 规则被过滤的问题。

## 1.0.0-alpha.10

### ⚠️ 非兼容性变更

* [^] `AlertBox` 组件，之前只能通过 `ui` prop 传递类型信息（ `success`/`error`/`info` ），现在和 `Toast` 保持风格统一，使用 `type` prop 传递类型信息。

  > #### 迁移指南
  >
  > **对于非如下两种情况的用户，本次变更并不产生影响。**
  >
  > 1. 所有直接使用 `AlertBox` 的情况下，需要将如 `ui="success"` 修改为 `type="success"` 的方式进行指定。
  >
  > 2. 对于主题包的作者，需要将原来针对如 `[ui~="success"]` 编写的样式，修改为 `.veui-alert-box-success`。

* [-] **[预告]** `Input` 组件的 `type` prop 将在下个版本去除对 `textarea` 的支持，请使用 `Textarea` 组件代替。

### 💡 主要变更

* [+] 新增了 `NumberInput` 组件。
* [+] 为 `Input` 增加了 `before`/`after` slot，提供扩展的空间。
* [+] 为 `Select` 增加了 `filter` prop，用来过滤下拉内容。
* [+] 为 `OptionGroup` 增加了 `position` prop，用来指定在弹出菜单中显示。
* [+] 为 `Option` 增加了 `hidden` prop。
* [+] 为 `Overlay` 增加了 `locate` 事件，在位置发生变化时触发（时机为 `tether` 的 `reposition` 事件）。
* [+] `Searchbox` 组件增加 `suggest-trigger` prop，用来指定推荐列表的弹出时机；增加 `suggest` 事件，当需要显示推荐列表时触发。
* [+] `Field` 的 `rules` 中增加 `priority` 的配置，用来覆盖当前内置的规则优先级。
* [^] 将 `icons` mixin 并入 `ui`,
* [+] 支持配置 `ui` prop 项的元数据，以支持进一步校验及根据 `ui` 值配置图标。
* [^] 将 `Progress` 组件硬编码在组件代码中的尺寸解耦到 `veui-theme-one` 中，现在组件可以从主题包的 JS 模块中注入预定义的样式参数。
* [+] `Uploader` 组件的 `image` 模式在图片的遮罩层上增加 scoped-slot `extra-operation`；在上传项目前后分别增加 `file-before` 和 `file-after` 两个 scoped slot。
* [^] `Uploader` 组件增加 prop `order`，配置新上传文件的插入顺序。

### 🐞 问题修复

* [^] 为 `uiTypes` 定制了选项合并策略，并修正了 `Select` 组件在 `uiTypes` 中声明的 `input` 被 mixin 中加入的 `select` 覆盖的问题。
* [^] 去除了 `Link` 组件中错误注册组件的代码。
* [^] 修复了关闭非 `modal` 的 `Dialog` 时 `FocusManager` 报错的问题。
* [^] 修复了 `FocusManager` 在 `trap` 模式下会自动聚焦最后一个元素的问题。
* [^] 修复了 `Textarea` 组件在 IE9 下的兼容性问题。
* [^] 修复了 `Field` 组件使用 `slot` 时 `class` 判断遗漏的问题。
* [^] 修复了 `pattern`/`numeric` 校验规则的优先级，使 `pattern` 置于 `numeric` 之后。
* [^] 去除了 `rule` 校验失败信息中包含部分校验成功的无用信息。
* [^] 去除了 `Input` 部分过时的 prop。

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
* [+] `Uploader` 组件增加 prop `data-type`，用于指明回调的内容的格式。
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

* [^] 将 `Pager` 组件重命名为 `Pagination`。暂时保留兼容，`Pager` 将在 `1.0.0` 移除。

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
* [^] 重命名 `Pager` 的 `page-total` prop 为 `total`，旧名称仍然兼容，未来版本可能删除。

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
