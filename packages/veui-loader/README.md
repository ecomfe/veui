# veui-loader

This webpack loader helps you to automatically load theme modules at build time.

You can load peer style/script modules for any VEUI component by configuring loader options.

```js
modules: [
  {
    package: 'veui-theme-dls',
    fileName: '{module}.less'
  },
  {
    package: 'veui-theme-dls',
    fileName: '{module}.js',
    transform: false
  }
]
```

The above config means that two additional modules will be loaded for each component. eg. for `Button.vue`, it will load `veui-theme-dls/components/button.less` and `veui-theme-dls/components/Button.js`.

## Options

### `locale`

Type: `string|Array<string>`

Default: `'zh-Hans'`

To specify locale modules which are injected for each component. Support `en-US` and `zh-Hans`. Given an array, multiple locale modules will be injected.

### `global`

Type: `Array<string>`

An array of module paths that will be injected for every component.

### `modules`

Type: `Array`

An array that holds the peer module configs for each component.

### Options for each module

#### `package`

Type: `string`

The peer package name. It's usually the name of the theme package, like `veui-theme-dls`.

#### `path`

Type: `string`

Default: `'components'`

The path for component directory in the peer module.

#### `fileName`

Type: `string`

Default: `'{module}.css'`

The template for the peer file name for the component. Must contain the placeholder `{module}`.

#### `transform`

Type: `'kebab-case'`|`'camleCase'`|`'PascalCase'`|`false`

Default: `'kebab-case'`

Transformation applied to the component name. The transformed module name will replace the `{module}` placeholder in `fileName`. Use `false` to suggest no transformation should be applied.
