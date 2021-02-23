const KEY_FIELD = '__transitionGroupMoveEndObserver__'

function attach (el, binding, vnode) {
  clear(el)

  const vm = vnode.componentInstance
  if (vm.$options._componentTag !== 'transition-group') {
    throw new Error(
      '`v-move-end` directive can only be applied on `<TransitionGroup>`'
    )
  }
  const moveClass = `${vm.name || 'v'}-move`

  let isMoving
  el[KEY_FIELD] = new MutationObserver(function (mutationList) {
    mutationList.forEach(function (mutation) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        if (mutation.target.classList.contains(moveClass)) {
          isMoving = true
        } else if (isMoving) {
          isMoving = false
          // moveClass 从有到无 等于动画结束
          vm.$emit('move-end')
        }
      }
    })
  })

  el[KEY_FIELD].observe(el, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  })
}

function clear (el) {
  if (el[KEY_FIELD]) {
    el[KEY_FIELD].disconnect()
  }
}

export default {
  inserted: attach,
  componentUpdated: attach,
  unbind: clear
}
