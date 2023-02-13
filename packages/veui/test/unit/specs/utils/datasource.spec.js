import { walk, mapDatasource } from '@/utils/datasource'

describe('utils/datasource', function () {
  this.timeout(10000)

  const items = [
    {
      l: '1',
      children: [{ l: '11' }, { l: '12' }]
    },
    {
      l: '2',
      children: [{ l: '21' }, { l: '22' }]
    }
  ]

  it('should walk items correctly', () => {
    let count = 0
    walk(items, () => count++)
    expect(count).to.be.equal(6)

    count = 0
    walk(items, (_, { skip }) => {
      count++
      skip()
    })

    count = 0
    walk(items, (_, { skip }) => {
      skip(!!count)
      count++
    })
    expect(count).to.be.equal(4)

    count = 0
    walk(items, ({ l }, { replace }) => {
      count++
      if (l === '11') {
        replace({
          l: '11',
          children: [
            {
              l: '111'
            }
          ]
        })
      }
    })
    expect(count).to.be.equal(7)

    walk(items, ({ l }, { setContext, parents, parentLabel }) => {
      setContext({ parentLabel: l })
      if (parents.length) {
        expect(parentLabel).to.be.equal(parents[parents.length - 1].l)
      }
    })
  })

  it('should map items correctly', () => {
    let result = mapDatasource(items, ({ l }) => ({ v: l, l }))
    let count = 0
    walk(result, ({ v, l }) => {
      count++
      expect(v).to.be.equal(l)
    })
    expect(count).to.be.equal(6)

    result = mapDatasource(items, {
      enter ({ l }, { replace }) {
        if (l === '11') {
          replace({
            l: '11',
            children: [
              {
                l: '111'
              }
            ]
          })
        }
      },
      exit ({ l }) {
        return { v: l, l }
      }
    })
    count = 0
    walk(result, ({ v, l }) => {
      count++
      expect(v).to.be.equal(l)
    })
    expect(count).to.be.equal(7)
  })
})
