# VEUI

[![](https://badgen.net/circleci/github/ecomfe/veui)](https://circleci.com/gh/ecomfe/veui)

Enterprise UI components for Vue.js. Based on Baidu Design Language System (DLS).

*This is a work in progress.*

[DEMO](https://dls.veui.dev/)

## Installation

```sh
npm i --save veui
npm i --save-dev babel-plugin-veui veui-loader lodash babel-plugin-lodash less less-loader
```

To use default theme `dls` you have to install it too.

```sh
npm i --save veui-theme-dls
```

## Configuration

First, scaffold your project using `@vue/cli`.

### Babel plugins

VEUI requires some Babel plugins to work. Configure `babel.config.js` as follows:

```js
module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    'veui',
    'lodash'
  ]
}
```

### webpack configs

You need to configure `vue.config.js` as follows to make VEUI loader and the transpilation work:

```js
module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  transpileDependencies: [
    'veui',
    'vue-awesome',
    'resize-detector'
  ],
  chainWebpack: config => {
    config.module
      .rule('veui')
      .test(/\.vue$/)
      .pre()
      .use('veui-loader')
      .loader('veui-loader')
      .tap(() => {
        return {
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
        }
      })
  }
}
```

### Global styles

You can import global styles from `veui-theme-dls` in JS/Less:

```js
import 'veui-theme-dls/common.less'
```

or

```less
@import "~veui-theme-dls/common.less";
```


## Browser Support

Evergreen browsers, IE11 and above.
