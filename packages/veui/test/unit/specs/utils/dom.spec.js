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

    expect(closest(span, 'span').className).to.be.equal('text')
    expect(closest(span, 'a').className).to.be.equal('btn')
    expect(closest(span, 'div').className).to.be.equal('tip')
    expect(closest(span, 'nav')).to.be.equal(null)
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
    expect(el.classList.contains('a')).to.be.equal(false)
    expect(el.classList.contains('b')).to.equal(true)
    expect(el.classList.contains('c')).to.be.equal(false)
    expect(el.classList.contains('d')).to.be.equal(false)
    expect(el.classList.contains('e')).to.equal(true)
    expect(el.classList.contains('f')).to.equal(true)
    expect(el.classList.contains('g')).to.be.equal(false)
  })
})
