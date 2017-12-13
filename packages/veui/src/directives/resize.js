import { assign, uniqueId, isEmpty, partial } from 'lodash'

function attach (el, { value, arg, modifiers, oldValue }, vnode, oldVnode) {
  let obj
  if (!oldValue) {
    let id = uniqueId('veui-resize-')
    el.__veui_resize_target__ = id
    obj = document.createElement('object')
    obj.setAttribute('id', id)
    obj.setAttribute('type', 'text/html')
    obj.setAttribute('data', 'about:blank')
    assign(obj.style, {
      overflow: 'hiddden',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      backgroudColor: 'transparent',
      zIndex: -1
    })
    let position = getComputedStyle(el).position
    if (position === 'static') {
      el.style.position = 'relative'
    }
    let pos = !isEmpty(modifiers) ? Object.keys(modifiers)[0] : 'beforeend'
    let target = arg && vnode.context.$refs[arg] ? vnode.context.$refs[arg] : el
    target.insertAdjacentElement(pos, obj)

    obj.contentDocument.defaultView.onresize = partial(value, el)
    return
  }
  if (value.toString() !== oldValue.toString()) {
    obj = document.querySelector(`#${el.__veui_resize_target__}`)
    obj.contentDocument.defaultView.onresize = partial(value, el)
    return
  }
}

function clear (el, { value }) {
  let obj = document.querySelector(`#${el.__veui_resize_target__}`)
  el.remove(obj)
}

export default {
  inserted: attach,
  componentUpdated: attach,
  unbind: clear
}
