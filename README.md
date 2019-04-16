# VEUI

[![](https://badgen.net/circleci/github/ecomfe/veui)](https://circleci.com/gh/ecomfe/veui)

[Documentation 🇨🇳](https://veui.dev)

Enterprise UI components for Vue.js. Based on ONE DESIGN from Baidu, Inc.

🚧 *This is a work in progress.* 🚧

## Features

* 🤘 Powerful and flexible components & directives
* 💅 Switchable/customizable themes
* 🌲 Fully tree-shakable components
* 🌐 I18N support w/ compile-time optimization
* ⌨️ A11Y support w/ ARIA annotation & complete keyboard navigation
* ☁️ SSR support w/ component level Critical CSS

Four packages are included in this repo:

* [`veui`](./packages/veui)
* [`babel-preset-veui`](./packages/babel-preset-veui)
* [`babel-plugin-veui`](./packages/babel-plugin-veui)
* [`veui-loader`](./packages/veui-loader)
* [`veui-theme-one`](./packages/veui-theme-one)
* [`veui-theme-one-icons`](./packages/veui-theme-one-icons)

Please visit each package for further introductions.

## Contribution

To develop `veui` locally you need to clone this repo and run the following in `veui`'s root directory:

```sh
$ npm run bootstrap
$ npm run dev
```

And then you should be able to see the demo via `http://localhost:8080/`.

## License

[MIT](./LICENSE)
