// import ui from 'veui/managers/ui'

import { ui } from 'veui'

describe('managers/ui', function () {
  this.timeout(10000)

  it('should implement `defaults`/`get` function correctly', () => {
    ui.defaults('btn.ui', { foo: { boolean: true } })

    expect(ui.get('btn.ui')).to.deep.equal({ foo: { boolean: true } })

    ui.defaults('ui', { bar: { boolean: true } }, 'btn')

    expect(ui.get('btn.ui')).to.deep.equal({ foo: { boolean: true } })
  })

  it('should implement `set`/`get` function correctly', () => {
    ui.set('btn.ui', { foo: { boolean: true } })

    expect(ui.get('btn.ui')).to.deep.equal({ foo: { boolean: true } })

    ui.set('ui', { bar: { boolean: true } }, 'btn')

    expect(ui.get('btn.ui')).to.deep.equal({ bar: { boolean: true } })

    ui.set({
      'btn.ui': { foo: { boolean: true } },
      'btn.icons': { bar: 'baz' }
    })

    expect(ui.get('btn.ui')).to.deep.equal({ foo: { boolean: true } })
    expect(ui.get('btn.icons')).to.deep.equal({ bar: 'baz' })

    ui.set(
      {
        ui: { bar: { boolean: true } },
        icons: { foo: 'baz' }
      },
      'btn'
    )

    expect(ui.get('btn.ui')).to.deep.equal({ bar: { boolean: true } })
    expect(ui.get('btn.icons')).to.deep.equal({ foo: 'baz' })
  })

  it('should support `setProp` function', () => {
    ui.set('btn.ui', {})

    ui.setProp('btn', 'foo', { values: ['bar'] })
    ui.setProp('btn', 'baz', { boolean: true })

    expect(ui.get('btn.ui')).to.deep.equal({
      foo: { values: ['bar'] },
      baz: { boolean: true }
    })
  })

  it('should support `addPropValue` function', () => {
    ui.addPropValue('btn', 'foo', 'baz')

    expect(ui.get('btn.ui').foo).to.deep.equal({ values: ['bar', 'baz'] })

    expect(() => {
      ui.addPropValue('btn', 'wow', 'yeah')
    }).to.throw()

    expect(() => {
      ui.addPropValue('btn', 'bar', 'wow')
    }).to.throw()
  })

  it('should support `setPropDefault` function', () => {
    ui.setPropDefault('btn', 'foo', 'baz')

    expect(ui.get('btn.ui').foo).to.deep.equal({
      values: ['bar', 'baz'],
      default: 'baz'
    })

    expect(() => {
      ui.setPropDefault('btn', 'wow', 'yeah')
    }).to.throw()

    expect(() => {
      ui.setPropDefault('btn', 'bar', 'wow')
    }).to.throw()

    expect(() => {
      ui.setPropDefault('btn', 'foo', 'qux')
    }).to.throw()
  })

  it('should support `setIcon` function', () => {
    ui.set('btn.icons', {})
    ui.setIcon('btn', 'foo', 'baz')

    expect(ui.get('btn.icons').foo).to.equal('baz')
  })

  it('should support `setPart` function', () => {
    ui.set('btn.parts', {})
    ui.setPart('btn', 'foo', 'baz')

    expect(ui.get('btn.parts').foo).to.equal('baz')
  })
})
