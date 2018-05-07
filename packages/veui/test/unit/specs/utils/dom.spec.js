import { closest } from '@/utils/dom'

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
})
