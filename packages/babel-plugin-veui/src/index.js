// import fs from 'fs'
import path from 'path'
// import pkgDir from 'pkg-dir'
import { getJSON, normalize } from './utils'

const COMPONENTS = getJSON(path.resolve(__dirname, '../components.json'))
const COMPONENTS_DIRNAME = 'components'

export default function (babel) {
  const { types: t } = babel

  return {
    name: 'veui',
    visitor: {
      ImportDeclaration (path) {
        let { node } = path
        let src = normalize(node.source.value)

        // import { Button } from 'veui'
        // → import Button from 'veui/components/Button.vue'
        //
        // import { Form, Field, Icon as VeuiIcon, default as veui } from 'veui'
        // → import Form from 'veui/components/Form/Form.vue'
        // → import Field from 'veui/components/Field.js'
        // → import VeuiIcon from 'veui/components/Icon.vue'
        // → import veui from 'veui'
        //
        // DOES NOT TRANSFORM:
        // import * as veui from 'veui'
        // import veui from 'veui'
        if (src === 'veui') {
          if (
            node.specifiers.length === 1 &&
            (node.specifiers[0].type === 'ImportDefaultSpecifier' ||
              node.specifiers[0].type === 'ImportNamespaceSpecifier')
          ) {
            return
          }

          node.specifiers.forEach(({ type, imported, local }) => {
            if (imported.name === 'default') {
              path.insertBefore(
                t.importDeclaration(
                  [t.importDefaultSpecifier(t.identifier(local.name))],
                  t.stringLiteral(src)
                )
              )
              path.getSibling(path.key - 1).stop()
            } else {
              let componentSrc = getComponentPath(imported.name)
              let name = local.name || imported.name
              path.insertBefore(
                t.importDeclaration(
                  [t.importDefaultSpecifier(t.identifier(name))],
                  t.stringLiteral(componentSrc)
                )
              )
              path.getSibling(path.key - 1).stop()
            }
          })

          path.remove()
        }
      }
    }
  }
}

// 'Icon' → 'veui/components/Icon.vue'
function getComponentPath (componentName) {
  let entry = COMPONENTS.find(({ name }) => name === componentName)
  if (!entry) {
    return null
  }
  return `veui/${COMPONENTS_DIRNAME}/${entry.path}`
}
