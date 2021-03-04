import { normalize } from './utils'

const VEUI_PACKAGE_NAME = 'veui'
const COMPONENTS_DIRNAME = 'components'

export default function ({ types: t }) {
  return {
    name: 'veui',
    visitor: {
      ImportDeclaration (path, { opts = {} }) {
        let { node } = path
        let { alias = VEUI_PACKAGE_NAME } = opts
        let src = normalize(node.source.value)

        if (src === alias) {
          if (
            node.specifiers.length === 1 &&
            (node.specifiers[0].type === 'ImportDefaultSpecifier' ||
              node.specifiers[0].type === 'ImportNamespaceSpecifier')
          ) {
            return
          }

          let newImports = node.specifiers.map(({ imported, local }) => {
            if (imported.name === 'default') {
              return t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier(local.name))],
                t.stringLiteral(src)
              )
            } else {
              let realName = getComponentName(imported.name)

              let componentSrc = getComponentPath(realName, alias)
              if (!componentSrc) {
                throw new Error(
                  `[${realName}] is not a valid component in VEUI.`
                )
              }
              let name = local.name || imported.name
              return t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier(name))],
                t.stringLiteral(componentSrc)
              )
            }
          })

          path.replaceWithMultiple(newImports)
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
function getComponentPath (componentName, alias) {
  let components = require(`${alias}/components.json`)
  let entry = components.find(({ name }) => name === componentName)
  if (!entry) {
    return null
  }
  return `${alias}/${COMPONENTS_DIRNAME}/${entry.path}`
}
