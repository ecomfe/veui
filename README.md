# VEUI

[![](https://img.shields.io/github/actions/workflow/status/ecomfe/veui/test.yml?branch=d20)](https://github.com/ecomfe/veui/actions/workflows/test.yml) [![](https://img.shields.io/codecov/c/github/ecomfe/veui)](https://codecov.io/gh/ecomfe/veui)

Documentation: [中文 🇨🇳](https://veui.dev) | [English 🇺🇸](https://veui.dev/en-US)

Enterprise UI components for Vue.js. Based on [BAIDU](https://www.baidu.com)'s Light Design Language System (Light Design).

## Features

* 🤘 Powerful and flexible components & directives
* 💅 Switchable/customizable themes
* 🌲 Fully tree-shakable components
* 🌐 I18N support w/ compile-time optimization
* ⌨️ A11Y support w/ ARIA annotation & complete keyboard navigation
* ☁️ SSR support w/ component level Critical CSS

Packages included in this repo are:

* [`veui`](./packages/veui)
* [`babel-plugin-veui`](./packages/babel-plugin-veui)
* [`veui-loader`](./packages/veui-loader)
* [`veui-theme-dls`](./packages/veui-theme-dls)
* [`veui-theme-dls-icons`](./packages/veui-theme-dls-icons)

## Start On Cloud IDE

[https://idegithub.com/ecomfe/veui](https://idegithub.com/ecomfe/veui)

## Contribution

To develop `veui` locally you need to clone this repo and run the following in `veui`'s root directory (VEUI uses pnpm as the package manager):

```sh
$ pnpm install
$ pnpm dev
```

And then you should be able to see the demo via `http://localhost:8080/`.

## License

[MIT](./LICENSE)
