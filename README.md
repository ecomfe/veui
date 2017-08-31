# VEUI

> Baidu Enterprise UI for Vue.js.

*This is a work in progress.*

[DEMO](https://ecomfe.github.io/veui/components)

## Installation

```sh
$ npm i --save veui
$ npm i --save-dev babel-plugin-veui veui-loader
```

To use default theme `dux` you have to install it too.

```sh
$ npm i --save veui-theme-dux
```

## Configuration

First, scaffold your project using `vue-cli` with template `webpack`.

To use default theme `dux`, make sure to add these plugins in `.babelrc`:

```json
{
  "plugins": [
    [
      "veui",
      {
        "package": "veui-theme-dux",
        "path": "components",
        "fileName": "${module}.less",
        "transform": "kebab-case"
      }
    ],
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

To make sure Webpack dynamically loads style modules correctly, make sure to configure `veui-loader` in the workflow as follows:

In `build/webpack.base.conf.js`, prepend this rule:

```js
{
  test: /\.js$/,
  loader: 'veui-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('demo'), resolve('test')]
}
```

In `build/vue-loader.conf.js`, add a pre-loader:

```
{
  preLoaders: {
    js: 'veui-loader'
  }
}
```

## Development

Install `lerna`:

```sh
$ npm i -g lerna
```

After cloning the repo, run

```sh
$ lerna bootstrap
$ npm run dev
```

And then you should be able to see the demo via `http://localhost:8080/`.

## Browser Support

Evergreen browsers, IE9 and above.

## FAQ
