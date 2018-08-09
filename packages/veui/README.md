# VEUI

![](https://travis-ci.org/ecomfe/veui.svg?branch=dev)

Enterprise UI components for Vue.js. Based on ONE DESIGN from Baidu, Inc.

*This is a work in progress.*

[DEMO](https://ecomfe.github.io/veui/components)

## Installation

```sh
$ npm i --save veui
$ npm i --save-dev babel-preset-veui veui-loader
```

To use default theme `one` you have to install it too.

```sh
$ npm i --save veui-theme-one
```

## Configuration

First, scaffold your project using `vue-cli` with template `webpack`.

### Babel plugins

VEUI requires some Babel plugins to be transpiled correctly. We've provided a preset which contains all presets and plugins needed to transpile VEUI, you just need to add the following configs into your `.babelrc` file in addition to the existing `presets`:

```json
{
  "presets": [
    "veui"
  ]
}
```

### webpack loaders

To use the default theme `veui-theme-one`, make sure to configure `veui-loader` in the workflow as follows:

In `build/webpack.base.conf.js`, prepend this rule:

```js
{
  test: /\.vue$/,
  loader: 'veui-loader',
  enforce: 'pre',
  options: {
    modules: [
      {
        package: 'veui-theme-one',
        fileName: '${module}.less'
      },
      {
        package: 'veui-theme-one',
        fileName: '${module}.js',
        transform: false
      }
    ]
  },
  include: [resolve('node_modules/veui')]
}
```

And you should include `veui` and `vue-awesome` in the configs for `babel-loader`:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  include: [resolve('node_modules/veui'), resolve('node_modules/vue-awesome')]
}
```

## Browser Support

Evergreen browsers, IE9 and above.
