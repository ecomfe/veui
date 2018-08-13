import { closest, toggleClass } from '@/utils/dom'

describe('utils/dom', () => {
  it('should find the closest parent as expected', () => {
    let root = document.createElement('div')
    root.innerHTML = `<div class="tip">点此
      <a class="btn" href="/login">
        <span class="text">登录</span>
      </a>
    </div>`
    document.body.appendChild(root)

    let span = root.querySelector('span')

    expect(closest(span, 'span').className).toBe('text')
    expect(closest(span, 'a').className).toBe('btn')
    expect(closest(span, 'div').className).toBe('tip')
    expect(closest(span, 'nav')).toBe(null)
  })

  it('should toggle classes correctly', () => {
    let el = document.createElement('div')
    el.className = 'a  b    c d  '
    document.body.appendChild(el)

    toggleClass(el, 'a')
    toggleClass(el, 'b', true)
    toggleClass(el, 'c')
    toggleClass(el, 'd')
    toggleClass(el, 'e')
    toggleClass(el, 'f', true)
    toggleClass(el, 'g', false)
    expect(el.classList.contains('a')).toBe(false)
    expect(el.classList.contains('b')).toBe(true)
    expect(el.classList.contains('c')).toBe(false)
    expect(el.classList.contains('d')).toBe(false)
    expect(el.classList.contains('e')).toBe(true)
    expect(el.classList.contains('f')).toBe(true)
    expect(el.classList.contains('g')).toBe(false)
  })
})
