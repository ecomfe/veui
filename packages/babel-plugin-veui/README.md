# babel-plugin-veui

This Babel plugin enables you to wrtie simpler `import` statements by converting such statements:

```js
import { Button, Input } from 'veui'
```

...into:

```js
import Button from 'veui/components/Button'
import Input from 'veui/components/Input'
```

...just like `babel-plugin-lodash` does.

You can also use the following prefixed version to make it easier to register components using object property shorthand:

```js
import { VeuiButton, VeuiInput } from 'veui'

export default {
  components: {
    VeuiButton,
    VeuiIcon
  }
}
```

...or...

```js
import { VButton, VInput } from 'veui'

export default {
  components: {
    VButton,
    VIcon
  }
}
```

So you can use `<veui-button>` or `<v-button>` in templates.
