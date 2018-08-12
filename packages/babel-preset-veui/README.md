# babel-preset-veui

This Babel preset provides all necessary plugins and presets to transpile VEUI.

It includes

* [babel-preset-vue-app](https://github.com/vuejs/babel-preset-vue-app)
* [babel-plugin-veui](../babel-plugin-veui)
* [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash)
* [babel-plugin-transform-class-properties](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/)

Add the following configuation in your `.babelrc` file and it's ready to go.

```json
{
  "presets": [
    "veui"
  ]
}
```
