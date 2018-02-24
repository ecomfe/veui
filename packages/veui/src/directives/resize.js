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
    obj.setAttribute('tabindex', '-1')
    assign(obj.style, {
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      backgroundColor: 'transparent',
      zIndex: -1
    })
    let position = getComputedStyle(el).position
    if (position === 'static') {
      el.style.position = 'relative'
    }
    let pos = !isEmpty(modifiers) ? Object.keys(modifiers)[0] : 'beforeend'
    let target = arg && vnode.context.$refs[arg] ? vnode.context.$refs[arg] : el
    target.insertAdjacentElement(pos, obj)

    // 异步的组件里边，要通过 onload 来挂回调
    obj.onload = () => {
      obj.contentDocument.defaultView.onresize = partial(value, el)
    }
    // 这里冗余一下，反正是直接 onxx 覆盖，解决 obj 被移动了之后不会触发 inserted 和 updated 但是会触发 onload 的问题
    if (obj.contentDocument) {
      obj.contentDocument.defaultView.onresize = partial(value, el)
    }

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
