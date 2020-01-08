import { normalize } from './utils'

const VEUI_PACKAGE_NAME = 'veui'
const PATTERN = new RegExp(`^${VEUI_PACKAGE_NAME}(?=[/$])`)

export default function () {
  return {
    name: 'veui-rewrite',
    visitor: {
      ImportDeclaration (path, { opts = {} }) {
        let { node } = path
        let { alias } = opts
        let src = normalize(node.source.value)

        if (src.match(PATTERN)) {
          node.source.value = src.replace(PATTERN, alias)
        }
      }
    }
  }
}
