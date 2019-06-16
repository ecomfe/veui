module.exports = {
  install (less, pluginManager, functions) {
    functions.add('args', node => {
      if (typeof node.value === 'string') {
        return node.value
      }
      let result = []
      for (let i = 0; i < node.value.length; i++) {
        result.push(node.value[i].value)
      }
      return result.join(', ')
    })
  }
}
