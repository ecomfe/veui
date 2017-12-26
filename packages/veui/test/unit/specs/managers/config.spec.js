import { ConfigManager } from '@/managers/config'

describe('managers/config', () => {
  it('should be able to set configs from a key/value pair', () => {
    let config = new ConfigManager()
    config.set('test.a', 'a')

    expect(config.get('test.a')).to.equal('a')
  })

  it('should be able to set configs from a key/value pair with a namespace', () => {
    let config = new ConfigManager()
    config.set('a', 'a', 'test')

    expect(config.get('test.a')).to.equal('a')
  })

  it('should be able to set default configs from a key/value pair', () => {
    let config = new ConfigManager()
    config.defaults('test.a', 'a')
    config.defaults('test.a', 'A')

    expect(config.get('test.a')).to.equal('a')
  })

  it('should be able to set default configs from a key/value pair with a namespace', () => {
    let config = new ConfigManager()
    config.defaults('a', 'a', 'test')
    config.defaults('a', 'A', 'test')

    expect(config.get('test.a')).to.equal('a')
  })

  it('should be able to set configs from an object', () => {
    let config = new ConfigManager()
    config.set({
      'test.a': 'a',
      'test.b': 'b',
      'test.c': 'c'
    })

    expect(config.get('test.a')).to.equal('a')
    expect(config.get('test.b')).to.equal('b')
    expect(config.get('test.c')).to.equal('c')
  })

  it('should be able to set configs from an object with namespace', () => {
    let config = new ConfigManager()
    config.set({
      x: 'x',
      y: 'y',
      z: 'z'
    }, 'test')

    expect(config.get('test.x')).to.equal('x')
    expect(config.get('test.y')).to.equal('y')
    expect(config.get('test.z')).to.equal('z')
  })

  it('should be able to set default configs from an object', () => {
    let config = new ConfigManager()
    config.defaults({
      'test.a': 'a'
    })
    config.defaults({
      'test.a': 'A',
      'test.b': 'b'
    })

    expect(config.get('test.a')).to.equal('a')
    expect(config.get('test.b')).to.equal('b')
  })

  it('should be able to set default configs from an object with a namespace', () => {
    let config = new ConfigManager()
    config.defaults({
      a: 'a'
    }, 'test')
    config.defaults({
      a: 'A',
      b: 'b'
    }, 'test')

    expect(config.get('test.a')).to.equal('a')
    expect(config.get('test.b')).to.equal('b')
  })

  it('should be able to merge object values from a key/value pair', () => {
    let config = new ConfigManager()
    config.set({
      'test.a': {
        x: 'x',
        y: 'y',
        z: 'z'
      }
    })

    config.merge('test.a', {
      n: 'n',
      z: 'Z'
    })

    expect(config.get('test.a').n).to.equal('n')
    expect(config.get('test.a').z).to.equal('Z')
  })

  it('should be able to merge object values from a key/value pair with namespace', () => {
    let config = new ConfigManager()
    config.set({
      a: {
        x: 'x',
        y: 'y',
        z: 'z'
      }
    }, 'test')

    config.merge('a', {
      n: 'n',
      z: 'Z'
    }, 'test')

    expect(config.get('test.a').n).to.equal('n')
    expect(config.get('test.a').z).to.equal('Z')
  })

  it('should be able to merge object values from an object', () => {
    let config = new ConfigManager()
    config.set({
      'test.a': {
        x: 'x',
        y: 'y',
        z: 'z'
      }
    })

    config.merge({
      'test.a': {
        n: 'n',
        z: 'Z'
      }
    })

    expect(config.get('test.a').n).to.equal('n')
    expect(config.get('test.a').z).to.equal('Z')
  })

  it('should be able to merge object values from an object with namespace', () => {
    let config = new ConfigManager()
    config.set({
      a: {
        x: 'x',
        y: 'y',
        z: 'z'
      }
    }, 'test')

    config.merge({
      a: {
        n: 'n',
        z: 'Z'
      }
    }, 'test')

    expect(config.get('test.a').n).to.equal('n')
    expect(config.get('test.a').z).to.equal('Z')
  })

  it('should be able to merge default values for object values from a key/value pair', () => {
    let config = new ConfigManager()
    config.set({
      'test.a': {
        x: 'x',
        y: 'y',
        z: 'z'
      }
    })

    config.mergeDefaults('test.a', {
      n: 'n',
      z: 'Z'
    })

    expect(config.get('test.a').n).to.equal('n')
    expect(config.get('test.a').z).to.equal('z')
  })

  it('should be able to merge default values for object values from a key/value pair with namespace', () => {
    let config = new ConfigManager()
    config.set({
      a: {
        x: 'x',
        y: 'y',
        z: 'z'
      }
    }, 'test')

    config.mergeDefaults('a', {
      n: 'n',
      z: 'Z'
    }, 'test')

    expect(config.get('test.a').n).to.equal('n')
    expect(config.get('test.a').z).to.equal('z')
  })

  it('should be able to merge default values for object values from an object', () => {
    let config = new ConfigManager()
    config.set({
      'test.a': {
        x: 'x',
        y: 'y',
        z: 'z'
      }
    })

    config.mergeDefaults({
      'test.a': {
        n: 'n',
        z: 'Z'
      }
    })

    expect(config.get('test.a').n).to.equal('n')
    expect(config.get('test.a').z).to.equal('z')
  })

  it('should be able to merge default values for object values from an object with namespace', () => {
    let config = new ConfigManager()
    config.set({
      a: {
        x: 'x',
        y: 'y',
        z: 'z'
      }
    }, 'test')

    config.mergeDefaults({
      a: {
        n: 'n',
        z: 'Z'
      }
    }, 'test')

    expect(config.get('test.a').n).to.equal('n')
    expect(config.get('test.a').z).to.equal('z')
  })

  it('should throw an error if key is neither a string or an object', () => {
    expect(function () {
      let config = new ConfigManager()
      config.set(1)
    }).to.throw('Config key must be a string value.')

    expect(function () {
      let config = new ConfigManager()
      config.defaults(1)
    }).to.throw('Config key must be a string value.')

    expect(function () {
      let config = new ConfigManager()
      config.merge(1)
    }).to.throw('Config key must be a string value.')

    expect(function () {
      let config = new ConfigManager()
      config.mergeDefaults(1)
    }).to.throw('Config key must be a string value.')
  })

  it('should throw an error when merging non-object values', () => {
    let config = new ConfigManager()
    config.set({
      a: 'a',
      b: { b: 'b' }
    }, 'test')

    expect(() => {
      config.merge('test.a', { b: 'b' })
    }).to.throw('`config.merge` only handles objects.')

    expect(() => {
      config.merge('test.b', '')
    }).to.throw('`config.merge` only handles objects.')

    expect(() => {
      config.merge('test.b', { b: 'B' })
    }).to.not.throw()
  })

  it('should be able to handle `Date` and `Function` instances', () => {
    let config = new ConfigManager()
    config.set({
      a: function () {},
      b: new Date()
    })

    expect(config.get('a') instanceof Function).to.equal(true)
    expect(config.get('b') instanceof Date).to.equal(true)
  })
})

