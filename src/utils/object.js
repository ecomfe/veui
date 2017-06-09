export function getByName (name, obj, delimiter) {
  delimiter = delimiter || '.'

  let parts = name.split(delimiter)
  let current = obj || window
  let part
  /* eslint-disable no-cond-assign */
  while (part = parts.shift()) {
    if (current[part] != null) {
      current = current[part]
    } else {
      return null
    }
  }
  return current
};
