import { ConfigManager } from '@/managers/config'

describe('managers/config', () => {
  it('should be able to set configs from a key/value pair', () => {
    let config = new ConfigManager()
    config.set('test.a', 'a')

    expect(config.get('test.a')).toBe('a')
  })

  it('should be able to set configs from a key/value pair with a namespace', () => {
    let config = new ConfigManager()
    config.set('a', 'a', 'test')

    expect(config.get('test.a')).toBe('a')
  })

  it('should be able to set default configs from a key/value pair', () => {
    let config = new ConfigManager()
    config.defaults('test.a', 'a')
    config.defaults('test.a', 'A')

    expect(config.get('test.a')).toBe('a')
  })

  it('should be able to set default configs from a key/value pair with a namespace', () => {
    let config = new ConfigManager()
    config.defaults('a', 'a', 'test')
    config.defaults('a', 'A', 'test')

    expect(config.get('test.a')).toBe('a')
  })

  it('should be able to set configs from an object', () => {
    let config = new ConfigManager()
    config.set({
      'test.a': 'a',
      'test.b': 'b',
      'test.c': 'c'
    })

    expect(config.get('test.a')).toBe('a')
    expect(config.get('test.b')).toBe('b')
    expect(config.get('test.c')).toBe('c')
  })

  it('should be able to set configs from an object with namespace', () => {
    let config = new ConfigManager()
    config.set(
      {
        x: 'x',
        y: 'y',
        z: 'z'
      },
      'test'
    )

    expect(config.get('test.x')).toBe('x')
    expect(config.get('test.y')).toBe('y')
    expect(config.get('test.z')).toBe('z')
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

    expect(config.get('test.a')).toBe('a')
    expect(config.get('test.b')).toBe('b')
  })

  it('should be able to set default configs from an object with a namespace', () => {
    let config = new ConfigManager()
    config.defaults(
      {
        a: 'a'
      },
      'test'
    )
    config.defaults(
      {
        a: 'A',
        b: 'b'
      },
      'test'
    )

    expect(config.get('test.a')).toBe('a')
    expect(config.get('test.b')).toBe('b')
  })

  it('should throw an error if key is neither a string or an object', () => {
    expect(function () {
      let config = new ConfigManager()
      config.set(1)
    }).toThrow('Config key must be a string value.')

    expect(function () {
      let config = new ConfigManager()
      config.defaults(1)
    }).toThrow('Config key must be a string value.')
  })

  it('should be able to handle `Date` and `Function` instances', () => {
    let config = new ConfigManager()
    config.set({
      a: function () {},
      b: new Date()
    })

    expect(config.get('a') instanceof Function).toBe(true)
    expect(config.get('b') instanceof Date).toBe(true)
  })
})
