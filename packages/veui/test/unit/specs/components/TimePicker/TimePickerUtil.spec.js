import { range } from 'lodash'
import TimePickerUtil from '@/components/TimePicker/_TimePickerUtil'

let util = new TimePickerUtil()
const hours = range(24)
const minutes = range(60)
const seconds = minutes
let avail

describe('TimePickerUtil', function () {
  it('`getMinTime/getMaxTime` on no limit', () => {
    util.setOptions({
      datasource: [hours]
    })
    let min = util.getMinTime()
    let max = util.getMaxTime()
    expect(min).to.deep.equal([0])
    expect(max).to.deep.equal([23])

    util.setOptions({
      datasource: [hours, minutes, seconds]
    })
    min = util.getMinTime()
    max = util.getMaxTime()
    expect(min).to.deep.equal([0, 0, 0])
    expect(max).to.deep.equal([23, 59, 59])

    util.setOptions({
      datasource: [
        [1, 2],
        [3, 4],
        [5, 6]
      ]
    })
    min = util.getMinTime()
    max = util.getMaxTime()
    expect(min).to.deep.equal([1, 3, 5])
    expect(max).to.deep.equal([2, 4, 6])
  })

  it('`getMinTime` on limited', () => {
    util.setOptions({
      datasource: [hours],
      min: [1],
      max: [20]
    })
    let min = util.getMinTime()
    let max = util.getMaxTime()
    expect(min).to.deep.equal([1])
    expect(max).to.deep.equal([20])

    util.setOptions({
      datasource: [
        [1, 2, 3],
        [1, 2, 3]
      ],
      min: [1, 2],
      max: [2, 0]
    })
    min = util.getMinTime()
    max = util.getMaxTime()
    expect(min).to.deep.equal([1, 2])
    expect(max).to.deep.equal([1, 3])

    util.setOptions({
      datasource: [hours, minutes, seconds],
      min: [1, 2, 3],
      max: [2, 0, 4]
    })
    min = util.getMinTime()
    max = util.getMaxTime()
    expect(min).to.deep.equal([1, 2, 3])
    expect(max).to.deep.equal([2, 0, 4])

    // 贴不住
    util.setOptions({
      datasource: [hours, range(10, 60), range(20, 50)],
      min: [1, 10, 51],
      max: [2, 10, 19]
    })
    min = util.getMinTime()
    max = util.getMaxTime()
    expect(min).to.deep.equal([1, 11, 20])
    expect(max).to.deep.equal([1, 59, 49])

    util.setOptions({
      datasource: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ],
      min: [2, 3, 8],
      max: [2, 6, 5]
    })
    min = util.getMinTime()
    max = util.getMaxTime()
    expect(min).to.deep.equal([2, 4, 7])
    expect(max).to.deep.equal([2, 5, 9])
  })

  it('has fully available datasources', () => {
    util.setOptions({
      datasource: [hours],
      min: null,
      max: [23]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([hours])

    util.setOptions({
      datasource: [hours, minutes],
      min: null,
      max: [23, 59]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([hours, minutes])

    util.setOptions({
      datasource: [hours, minutes, seconds],
      min: null,
      max: [23, 59, 59]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([hours, minutes, seconds])
  })

  it('has partial available datasources', () => {
    util.setOptions({
      datasource: [hours],
      min: [10],
      max: [23]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([range(10, 24)])

    util.setOptions({
      datasource: [[1, 2, 3], minutes],
      min: [2, 59],
      max: [3, 1]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([
      [2, 3],
      [0, 1, 59]
    ])

    util.setOptions({
      datasource: [[1, 2, 3]],
      min: [4],
      max: [4]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([])

    util.setOptions({
      datasource: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ],
      min: [3, 7, 10],
      max: [4, 8, 11]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([])

    util.setOptions({
      datasource: [[1, 2, 3]],
      min: [3],
      max: [3]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([[3]])

    util.setOptions({
      datasource: [
        [1, 2, 3],
        [1, 2, 3]
      ],
      min: [3, 2]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([[3], [2, 3]])

    util.setOptions({
      datasource: [
        [1, 2, 3],
        [1, 2, 3]
      ],
      min: [1, 2],
      max: [2, 0]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([[1], [2, 3]])

    util.setOptions({
      datasource: [
        [1, 2, 3],
        [1, 2, 3]
      ],
      min: null,
      max: [3, 4]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([
      [1, 2, 3],
      [1, 2, 3]
    ])

    util.setOptions({
      datasource: [
        [1, 2, 3],
        [1, 2, 3]
      ],
      min: [2, 3],
      max: [2, 3]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([[2], [3]])

    // 小时分钟下限限制
    util.setOptions({
      datasource: [
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3]
      ],
      min: [3, 3, 2],
      max: null
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([[3], [3], [2, 3]])

    // 小时分钟上限限制
    util.setOptions({
      datasource: [
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3]
      ],
      min: [1, 1, 1],
      max: [1, 1, 2]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([[1], [1], [1, 2]])

    util.setOptions({
      datasource: [
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3]
      ],
      min: [1, 1, 2],
      max: [1, 1, 2]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([[1], [1], [2]])

    util.setOptions({
      datasource: [
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3]
      ],
      min: [1, 3, 2],
      max: [2, 1, 1]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([
      [1, 2],
      [1, 3],
      [1, 2, 3]
    ])

    // NONE
    util.setOptions({
      datasource: [hours, minutes, seconds],
      min: [1, 1, 1],
      max: [2, 59, 59]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([[1, 2], minutes, seconds])

    // INTERSECTION
    // *-*-*
    util.setOptions({
      datasource: [hours, minutes, seconds],
      min: [1, 1, 1],
      max: [1, 1, 1]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([[1], [1], [1]])

    util.setOptions({
      datasource: [hours, minutes, [2, 3]],
      min: [1, 1, 3],
      max: [1, 1, 2]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([])

    // *-* -*
    //    \-*
    util.setOptions({
      datasource: [hours, minutes, seconds],
      min: [1, 1, 1],
      max: [1, 1, 2]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([[1], [1], [1, 2]])

    // * -*-*
    //  \-*-*
    util.setOptions({
      datasource: [hours, minutes, seconds],
      min: [1, 1, 59],
      max: [1, 2, 0]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([[1], [1, 2], [0, 59]])

    // * -*-交叉
    //  \-*-交叉
    util.setOptions({
      datasource: [[1], [1, 2], [1, 2, 3]],
      min: [1, 1, 2],
      max: [1, 2, 2]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([[1], [1, 2], [1, 2, 3]])

    // * -*-*
    //  \-*/
    util.setOptions({
      datasource: [[1], [1, 2], [1]],
      min: [1, 1, 0],
      max: [1, 2, 2]
    })
    avail = util.getAvailable()
    expect(avail).to.deep.equal([[1], [1, 2], [1]])
  })

  it('getMinimumTimeOfIndex', () => {
    util.setOptions({
      datasource: [
        [1, 2, 3],
        [2, 1],
        [1, 2, 3]
      ],
      min: [1, 1, 2],
      max: [2, 2, 1]
    })
    avail = util.getAvailable()

    expect(avail).to.deep.equal([
      [1, 2],
      [1, 2],
      [1, 2, 3]
    ])

    expect(util.getMinimumTimeOfIndex(1, 1)).to.deep.equal([1, 1, 2])

    expect(util.getMinimumTimeOfIndex(1, 0)).to.equal(null)

    expect(util.getMinimumTimeOfIndex(0, 2)).to.deep.equal([2, 1, 1])

    expect(util.isAvailable([2, 3, 1], true)).to.equal(false)

    util.setOptions({
      datasource: [hours, minutes, seconds],
      min: [1, 30, 50],
      max: [3, 0, 0]
    })
    expect(util.getMinimumTimeOfIndex(1, 4)).to.deep.equal([2, 4, 0])
  })
})
