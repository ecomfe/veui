import { normalize } from './utils'

const VEUI_PACKAGE_NAME = 'veui'
const COMPONENTS_DIRNAME = 'components'

export default function (babel) {
  const { types: t } = babel

  return {
    name: 'veui',
    visitor: {
      ImportDeclaration (path, { opts = {} }) {
        let { node } = path
        let { name: veuiName = VEUI_PACKAGE_NAME } = opts
        let src = normalize(node.source.value)

        if (src === veuiName) {
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
              path.getSibling(path.key - 1).skip()
            } else {
              let realName = getComponentName(imported.name)

              let componentSrc = getComponentPath(realName, veuiName)
              if (!componentSrc) {
                throw new Error(
                  `[${realName}] is not a valid component in VEUI.`
                )
              }
              let name = local.name || imported.name
              path.insertBefore(
                t.importDeclaration(
                  [t.importDefaultSpecifier(t.identifier(name))],
                  t.stringLiteral(componentSrc)
                )
              )
              path.getSibling(path.key - 1).skip()
            }
          })

          path.remove()
        }
      }
    }
  }
}

const VAR_PATTERN = /(?:V(?:eui)?)?([A-Z][a-zA-Z]*)/

function getComponentName (importedName) {
  let [, name] = importedName.match(VAR_PATTERN)
  return name || null
}

// 'Icon' → 'veui/components/Icon.vue'
function getComponentPath (componentName, name) {
  let components = require(`${name}/components.json`)
  let entry = components.find(({ name }) => name === componentName)
  if (!entry) {
    return null
  }
  return `${name}/${COMPONENTS_DIRNAME}/${entry.path}`
}
