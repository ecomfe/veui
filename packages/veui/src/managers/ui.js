import config from './config'

const uiManager = Object.assign(Object.create(config), {
  addPropValue,
  setPropDefault,
  setProp,
  setIcon,
  setPart
})

export default uiManager

function getConfig (component, key) {
  return uiManager.get(`${component}.${key}`)
}

function addPropValue (component, prop, value) {
  const ui = getConfig(component, 'ui')

  if (!ui || !ui[prop]) {
    throw new Error(
      `[veui] Unknown ui prop "${prop}" of component "${component}".`
    )
  }

  const { values } = ui[prop]
  if (!values) {
    throw new Error(
      `[veui] ui prop "${prop}" of component "${component}" is not a enum prop.`
    )
  }

  if (values.indexOf(value) === -1) {
    values.push(value)
  }
}

function setPropDefault (component, prop, value) {
  const ui = getConfig(component, 'ui')

  if (!ui || !ui[prop]) {
    throw new Error(
      `[veui] Unknown ui prop "${prop}" of component "${component}".`
    )
  }

  const { values } = ui[prop]
  if (!values) {
    throw new Error(
      `[veui] ui prop "${prop}" of component "${component}" is not a enum prop. Only enum props can have default values.`
    )
  }

  if (values.indexOf(value) === -1) {
    throw new Error(
      `[veui] ui prop "${prop}" of component "${component}" does not have value "${value}".`
    )
  }

  ui[prop].default = value
}

function set (type, component, name, def) {
  let item = getConfig(component, type)

  if (!item) {
    item = {}
    config.set(`${component}.${type}`, item)
  }

  item[name] = def
}

function setProp (component, prop, propDef) {
  set('ui', component, prop, propDef)
}

function setIcon (component, icon, iconDef) {
  set('icons', component, icon, iconDef)
}

function setPart (component, part, partDef) {
  set('parts', component, part, partDef)
}
