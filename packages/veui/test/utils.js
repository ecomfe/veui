export function waitTimeout (timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}
