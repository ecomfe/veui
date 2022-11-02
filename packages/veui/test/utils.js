import { trim } from 'lodash'
import { mount as vueMount } from '@vue/test-utils'

export function mount (component, options = {}) {
  options = {
    ...options,
    sync: false
  }
  return vueMount(component, options)
}

export function wait (timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

export function nextFrame () {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve)
  })
}

export async function doubleNextFrame () {
  await nextFrame()
  await nextFrame()
}

export function getStyle (element) {
  let cssText = element.style.cssText || ''
  let arr = cssText.split(';')
  return arr.reduce((obj, item) => {
    if (!item) {
      return obj
    }
    let [key, value] = item.split(':')
    return { ...obj, [trim(key)]: trim(value) }
  }, {})
}

export function normalizeTransform (transform) {
  let el = document.createElement('div')
  el.style.transform = transform
  document.body.appendChild(el)
  let result = getComputedStyle(el).transform
  el.parentElement.removeChild(el)
  return result === 'none' ? 'matrix(1, 0, 0, 1, 0, 0)' : result
}

export function expectTooltip (content, position) {
  const tooltip = document.body.querySelector('.veui-global-tooltip')
  if (content === null) {
    expect(tooltip).to.equal(null)
  } else if (content === false) {
    expect(tooltip).to.not.equal(null)
    expect(tooltip.style.display).to.equal('none')
  } else {
    expect(tooltip).to.not.equal(null)
    expect(tooltip.textContent.trim()).to.equal(content)

    if (position) {
      expect(tooltip.getAttribute('x-placement')).to.equal(position)
    }
  }
}

export function expectDisabled (wrapper, force = true) {
  const disabled =
    wrapper.attributes('disabled') === 'disabled' ||
    wrapper.attributes('aria-disabled') === 'true'
  expect(disabled).to.equal(force)
}

export function unorderedEqual (a, b) {
  expect(a).to.have.members(b).and.to.have.lengthOf(b.length)
}

export function expectFieldError (wrapper, err) {
  if (err) {
    expect(wrapper.find('.veui-invalid').exists()).to.eql(true)
    expect(wrapper.find('.veui-message-content').text()).to.contains(err)
  } else {
    expect(wrapper.find('.veui-invalid').exists()).to.eql(false)
    expect(wrapper.find('.veui-message-content').exists()).to.eql(false)
  }
}

export function expectTokenList (value) {
  const list = value.split(/\s+/).filter(Boolean)

  return {
    has (token) {
      expect(list).to.include(token)
    },
    hasNot (token) {
      expect(list).to.not.include(token)
    }
  }
}

// wrapper.trigger doesn't work for DragEvent for now
// https://github.com/vuejs/vue-test-utils/issues/1762
function createDragEvent (type, args) {
  return new DragEvent(type, {
    dataTransfer: new DataTransfer(),
    ...args
  })
}

function dispatchDrag (el, type, args, handlers) {
  if (!el.draggable) {
    return
  }

  el.dispatchEvent(createDragEvent(type, args))
  let handler = {
    dragstart: handlers.onDragStart,
    dragend: handlers.onDragEnd
  }[type]
  if (handler) {
    handler()
  }
}

export async function performDrag ($el, series, $handle = $el, handlers = {}) {
  let [start, ...moves] = series
  let end = moves.pop()

  let el = $el.element

  let { top, left, right, bottom } = $handle.element.getBoundingClientRect()
  let [x, y] = start
  if (top < y && right > x && bottom > y && left < x) {
    $handle.trigger('mousedown', {
      clientX: start[0],
      clientY: start[1]
    })
  }

  dispatchDrag(
    el,
    'dragstart',
    {
      clientX: start[0],
      clientY: start[1]
    },
    handlers
  )

  await wait(50)

  for (let i = 0; i < moves.length; i++) {
    let move = moves[i]
    dispatchDrag(
      el,
      'drag',
      {
        clientX: move[0],
        clientY: move[1]
      },
      handlers
    )

    await wait(100)
  }

  dispatchDrag(
    el,
    'dragend',
    {
      clientX: end[0],
      clientY: end[1]
    },
    handlers
  )
}
