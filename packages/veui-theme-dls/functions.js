module.exports = {
  install (less, pluginManager, functions) {
    functions.add('args', node => {
      let result = []
      for (let i = 0; i < node.value.length; i++) {
        result.push(node.value[i].value)
      }
      return result.join(', ')
    })
  }
}
