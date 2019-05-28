export function wait (timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

export function nextFrame () {
  return new Promise(resolve => {
    requestAnimationFrame(resolve)
  })
}

export async function doubleNextFrame () {
  await nextFrame()
  await nextFrame()
}
