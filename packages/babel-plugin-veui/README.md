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
