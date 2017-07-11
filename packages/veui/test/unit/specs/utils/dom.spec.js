import {closest} from '@/utils/dom'

describe('utils/dom', () => {
  it('closest', () => {
    let root = document.createElement('div')
    root.innerHTML = `<div class="tip">点此
      <a class="btn" href="/login">
        <span class="text">登录</span>
      </a>
    </div>`
    document.body.appendChild(root)

    let span = root.querySelector('span')

    expect(closest(span, 'span').className).to.equal('text')
    expect(closest(span, 'a').className).to.equal('btn')
    expect(closest(span, 'div').className).to.equal('tip')
    expect(closest(span, 'nav')).to.be.a('null')
  })
})
