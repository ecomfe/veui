# VEUI

> Baidu Enterprise UI for Vue.js.

*This is a work in progress.*

[DEMO](https://ecomfe.github.io/veui/components)

## Installation

```sh
$ npm i --save veui
$ npm i --save-dev babel-plugin-veui veui-loader
```

To use default theme `one` you have to install it too.

```sh
$ npm i --save veui-theme-one
```

## Configuration

First, scaffold your project using `vue-cli` with template `webpack`.

### Babel plugins

To bundle VEUI correctly, you need to add the following configs into your `.babelrc` file in addition to the existing `presets`:

```json
{
  "plugins": [
    "veui",
    "lodash",
    "transform-vue-jsx",
    [
      "transform-runtime",
      {
        "polyfill": false,
        "regenerator": false
      }
    ]
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

## Contribution

To develop `veui` locally you need to clone this repo and run the following in `veui`'s root directory:

```sh
$ npm run bootstrap
$ npm run dev
```

And then you should be able to see the demo via `http://localhost:8080/`.

## Browser Support

Evergreen browsers, IE9 and above.

## FAQ

TBD.
