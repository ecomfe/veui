export function allSettled (promises) {
  return Promise.all(
    promises.map(p => Promise.resolve(p).then(
      val => ({ val }),
      err => ({ err })
    ))
  )
}
