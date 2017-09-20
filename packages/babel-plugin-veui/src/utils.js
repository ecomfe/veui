import fs from 'fs'
import path from 'path'

export function kebabCase (str) {
  return str
    .replace(/[-_ ]+|([A-Z])/g, (whole, ch) => {
      return ch ? `-${ch.toLowerCase()}` : '-'
    })
    .replace(/^-/g, '')
    .replace(/-+/g, '-')
}

export function camelCase (str) {
  return kebabCase(str).replace(/-([a-z])/g, (whole, ch) => ch.toUpperCase())
}

export function pascalCase (str) {
  return camelCase(str).replace(/^([a-z])/g, (whole, ch) => ch.toUpperCase())
}

export function transformName (name, transform = false) {
  if (!name) {
    return null
  }

  switch (transform) {
    case 'kebab-case':
      return kebabCase(name)
    case 'camelCase':
      return camelCase(name)
    case 'PascalCase':
      return pascalCase(name)
    default:
      return name
  }
}

export function getJSON (path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'))
}

export function normalize (filePath) {
  return filePath.replace(/[/\\]/g, path.sep)
}
