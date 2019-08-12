import { range, isEqual } from 'lodash'
import TimePickerUtil from '@/components/TimePicker/_TimePickerUtil'

let util = new TimePickerUtil()

let avail

describe('TimePickerUtil', function () {
  it('has fully available datasources', () => {
    util.setOptions({
      datasource: [range(24)],
      min: null,
      max: [23]
    })
    avail = util.getAvailableDatasource()
    expect(avail.length === 1 && avail[0].length === 24).to.equal(true)

    util.setOptions({
      datasource: [range(24), range(60)],
      min: null,
      max: [23, 59]
    })
    avail = util.getAvailableDatasource()
    expect(
      avail.length === 2 && avail[0].length === 24 && avail[1].length === 60
    ).to.equal(true)

    util.setOptions({
      datasource: [range(24), range(60), range(60)],
      min: null,
      max: [23, 59, 59]
    })
    avail = util.getAvailableDatasource()
    expect(
      avail.length === 3 &&
        avail[0].length === 24 &&
        avail[1].length === 60 &&
        avail[2].length === 60
    ).to.equal(true)
  })

  it('has partially available datasources', () => {
    util.setOptions({
      datasource: [range(24)],
      min: [10],
      max: [23]
    })
    avail = util.getAvailableDatasource()
    expect(avail.length === 1 && avail[0].length === 14).to.equal(true)

    util.setOptions({
      datasource: [[1, 2, 3], range(60)],
      min: [2, 59],
      max: [3, 1]
    })
    avail = util.getAvailableDatasource()
    expect(isEqual(avail, [[2, 3], [0, 1, 59]])).to.equal(true)

    util.setOptions({
      datasource: [[1, 2, 3]],
      min: [4],
      max: [4]
    })
    avail = util.getAvailableDatasource()
    expect(isEqual(avail, [[]])).to.equal(true)

    util.setOptions({
      datasource: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      min: [3, 7, 10],
      max: [4, 8, 11]
    })
    avail = util.getAvailableDatasource()
    expect(isEqual(avail, [[], [], []])).to.equal(true)

    util.setOptions({
      datasource: [[1, 2, 3]],
      min: [3],
      max: [3]
    })
    avail = util.getAvailableDatasource()
    expect(isEqual(avail, [[3]])).to.equal(true)

    util.setOptions({
      datasource: [[1, 2, 3], [1, 2, 3]],
      min: [3, 2],
      max: null
    })
    avail = util.getAvailableDatasource()
    expect(isEqual(avail, [[3], [2, 3]])).to.equal(true)

    util.setOptions({
      datasource: [[1, 2, 3], [1, 2, 3]],
      min: [1, 2],
      max: [2, 0]
    })
    avail = util.getAvailableDatasource()
    expect(isEqual(avail, [[1], [2, 3]])).to.equal(true)

    util.setOptions({
      datasource: [[1, 2, 3], [1, 2, 3]],
      min: null,
      max: [3, 4]
    })
    avail = util.getAvailableDatasource()
    expect(isEqual(avail, [[1, 2, 3], [1, 2, 3]])).to.equal(true)

    util.setOptions({
      datasource: [[1, 2, 3], [1, 2, 3]],
      min: [2, 3],
      max: [2, 3]
    })
    avail = util.getAvailableDatasource()
    expect(isEqual(avail, [[2], [3]])).to.equal(true)

    // 小时分钟下限限制
    util.setOptions({
      datasource: [[1, 2, 3], [1, 2, 3], [1, 2, 3]],
      min: [3, 3, 2],
      max: null
    })
    avail = util.getAvailableDatasource()
    expect(isEqual(avail, [[3], [3], [2, 3]])).to.equal(true)

    // 小时分钟上限限制
    util.setOptions({
      datasource: [[1, 2, 3], [1, 2, 3], [1, 2, 3]],
      min: [1, 1, 1],
      max: [1, 1, 2]
    })
    avail = util.getAvailableDatasource()
    expect(isEqual(avail, [[1], [1], [1, 2]])).to.equal(true)

    util.setOptions({
      datasource: [[1, 2, 3], [1, 2, 3], [1, 2, 3]],
      min: [1, 1, 2],
      max: [1, 1, 2]
    })
    avail = util.getAvailableDatasource()
    expect(isEqual(avail, [[1], [1], [2]])).to.equal(true)

    // 2
    util.setOptions({
      datasource: [[1, 2, 3], [1, 2, 3], [1, 2, 3]],
      min: [1, 3, 2],
      max: [2, 1, 1]
    })
    avail = util.getAvailableDatasource()
    expect(isEqual(avail, [[1, 2], [1, 3], [1, 2, 3]])).to.equal(true)
  })

  it('getMinimumTimeOfIndex', () => {
    util.setOptions({
      datasource: [[1, 2, 3], [2, 1], [1, 2, 3]],
      min: [1, 1, 2],
      max: [2, 2, 1]
    })
    avail = util.getAvailableDatasource()

    expect(isEqual(avail, [[1, 2], [1, 2], [1, 2, 3]])).to.equal(true)

    expect(isEqual(util.getMinimumTimeOfIndex(1, 1), [1, 1, 2])).to.equal(true)

    expect(isEqual(util.getMinimumTimeOfIndex(1, 0), null)).to.equal(true)

    expect(isEqual(util.getMinimumTimeOfIndex(0, 2), [2, 1, 1])).to.equal(true)

    expect(util.isAvailable([2, 3, 1], true) === false).to.equal(true)
  })
})
