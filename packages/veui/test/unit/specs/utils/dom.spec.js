import { closest, toggleClass, scrollToAlign, scrollTo } from '@/utils/dom'
import { wait } from '../../../utils'

describe('utils/dom', () => {
  it('should find the closest parent as expected', () => {
    let el = document.createElement('div')
    el.innerHTML = `<div class="tip">点此
      <a class="btn" href="/login">
        <span class="text">登录</span>
      </a>
    </div>`
    document.body.appendChild(el)

    let span = el.querySelector('span')

    expect(closest(span, 'span').className).to.be.equal('text')
    expect(closest(span, 'a').className).to.be.equal('btn')
    expect(closest(span, 'div').className).to.be.equal('tip')
    expect(closest(span, 'nav')).to.be.equal(null)

    el.parentNode.removeChild(el)
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

    el.parentNode.removeChild(el)
  })

  it('should scrollToAlign correctly', async () => {
    let el = document.createElement('div')
    el.style = 'width:200px;height:200px;overflow:auto;'
    el.innerHTML = `<div style="width:400px;height:400px;"></div>`
    document.body.appendChild(el)

    let target = el.childNodes[0]
    scrollToAlign(el, target, 0.5)
    await wait(500)
    expect(el.scrollTop, 'scrollToAlign 0.5').to.be.equal(100)

    scrollToAlign(el, target, {
      targetPosition: 0.2,
      viewportPosition: 0.2
    })
    await wait(500)
    expect(el.scrollTop, 'scrollToAlign 0.2').to.be.equal(40)

    document.body.removeChild(el)
  })

  it('should scrollTo correctly', async () => {
    let el = document.createElement('div')
    el.style = 'width:200px;height:200px;overflow:auto;'
    el.innerHTML = `<div style="width:400px;height:400px;"></div>`
    document.body.appendChild(el)

    scrollTo(el, 50, 50)
    await wait(500)
    expect(el.scrollTop, 'scrollTo top 50px').to.be.equal(50)
    expect(el.scrollLeft, 'scrollTo left 50px').to.be.equal(50)

    scrollTo(el, {
      left: 100,
      top: 100
    })
    await wait(500)
    expect(el.scrollTop, 'scrollTo top 100px').to.be.equal(100)
    expect(el.scrollLeft, 'scrollTo left 100px').to.be.equal(100)
    document.body.removeChild(el)
  })
})
