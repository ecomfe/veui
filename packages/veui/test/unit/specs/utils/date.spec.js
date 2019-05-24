import {
  getDaysInMonth,
  toDateData,
  fromDateData,
  toDate,
  isSameDay,
  isInRange,
  mergeRange
} from '@/utils/date'

describe('utils/date', () => {
  it('should calculate days in a month correctly', () => {
    let SPECS = [
      [2000, 1, 29],
      [2016, 1, 29],
      [2018, 0, 31],
      [2018, 1, 28],
      [2018, 2, 31],
      [2018, 3, 30],
      [2018, 4, 31],
      [2018, 5, 30],
      [2018, 6, 31],
      [2018, 7, 31],
      [2018, 8, 30],
      [2018, 9, 31],
      [2018, 10, 30],
      [2018, 11, 31],
      [2100, 1, 28]
    ]

    SPECS.forEach(([year, month, days]) => {
      expect(getDaysInMonth(year, month)).to.be.equal(days)
    })
  })

  it('should convert `Date` objects/timestamps to plain data objects correctly', () => {
    expect(toDateData(new Date(2018, 11, 31))).to.deep.equal({
      year: 2018,
      month: 11,
      date: 31
    })
    expect(toDateData(new Date(2018, 11, 32))).to.deep.equal({
      year: 2019,
      month: 0,
      date: 1
    })
    expect(toDateData(new Date(2018, 0, 0))).to.deep.equal({
      year: 2017,
      month: 11,
      date: 31
    })
    expect(toDateData(new Date(2018, 11, 31).getTime())).to.deep.equal({
      year: 2018,
      month: 11,
      date: 31
    })
    expect(toDateData(new Date(2018, 11, 32).getTime())).to.deep.equal({
      year: 2019,
      month: 0,
      date: 1
    })
    expect(toDateData(new Date(2018, 0, 0).getTime())).to.deep.equal({
      year: 2017,
      month: 11,
      date: 31
    })
  })

  it('should convert plain data objects to `Date` objects correctly', () => {
    expect(fromDateData({ year: 2018, month: 11, date: 31 })).to.deep.equal(
      new Date(2018, 11, 31)
    )
    expect(fromDateData({ year: 2019, month: 0, date: 1 })).to.deep.equal(
      new Date(2018, 11, 32)
    )
    expect(fromDateData({ year: 2017, month: 11, date: 31 })).to.deep.equal(
      new Date(2018, 0, 0)
    )
  })

  it('should convert plain data objects/timestamps to `Date` objects correctly', () => {
    expect(toDate({ year: 2018, month: 11, date: 31 })).to.deep.equal(
      new Date(2018, 11, 31)
    )
    expect(toDate({ year: 2019, month: 0, date: 1 })).to.deep.equal(
      new Date(2018, 11, 32)
    )
    expect(toDate({ year: 2017, month: 11, date: 31 })).to.deep.equal(
      new Date(2018, 0, 0)
    )
    expect(toDate(new Date(2018, 11, 31).getTime())).to.deep.equal(
      new Date(2018, 11, 31)
    )
    expect(toDate(new Date(2018, 11, 32).getTime())).to.deep.equal(
      new Date(2018, 11, 32)
    )
    expect(toDate(new Date(2018, 0, 0).getTime())).to.deep.equal(new Date(2018, 0, 0))
  })

  it('should calculate `Date`/plain date object/timestamp equality correctly', () => {
    expect(isSameDay(new Date(2018, 11, 31).getTime(), new Date(2018, 11, 31)))
    expect(
      isSameDay(
        new Date(2018, 11, 31).getTime(),
        new Date(2018, 11, 31).getTime()
      )
    )
    expect(
      isSameDay(new Date(2018, 11, 31).getTime(), {
        year: 2018,
        month: 11,
        date: 31
      })
    )
    expect(
      isSameDay(new Date(2018, 11, 31), { year: 2018, month: 11, date: 31 })
    )
    expect(isSameDay(new Date(2018, 11, 31), new Date(2018, 11, 31)))
    expect(
      isSameDay(
        { year: 2018, month: 11, date: 31 },
        { year: 2018, month: 11, date: 31 }
      )
    )
  })

  it('should check whether a date is within a range correctly', () => {
    expect(
      isInRange(new Date(2018, 11, 31), [
        new Date(2018, 11, 31),
        new Date(2019, 0, 1)
      ])
    ).to.equal(true)
    expect(
      isInRange(new Date(2018, 11, 31), [
        new Date(2018, 11, 1),
        new Date(2018, 11, 31)
      ])
    ).to.equal(true)
    expect(
      isInRange(new Date(2018, 11, 10), [
        new Date(2018, 11, 1),
        new Date(2019, 0, 1)
      ])
    ).to.equal(true)
    expect(
      isInRange(new Date(2018, 11, 30), [
        new Date(2018, 11, 31),
        new Date(2019, 0, 1)
      ])
    ).to.be.equal(false)
    expect(
      isInRange(new Date(2019, 0, 1), [
        new Date(2018, 11, 1),
        new Date(2018, 11, 31)
      ])
    ).to.be.equal(false)
  })

  function getDate (date) {
    return new Date(2019, 0, date)
  }

  let DATES = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(getDate)

  it('should calculate range difference correctly', () => {
    expect(mergeRange([], [[DATES[1], DATES[1]]])).to.deep.equal([
      [DATES[1], DATES[1]]
    ])
    expect(mergeRange([[DATES[0], DATES[5]]], [[DATES[1], DATES[1]]])).to.deep.equal([
      [DATES[0], DATES[0]],
      [DATES[2], DATES[5]]
    ])
    expect(mergeRange([[DATES[0], DATES[5]]], [[DATES[0], DATES[0]]])).to.deep.equal([
      [DATES[1], DATES[5]]
    ])
    expect(mergeRange([[DATES[0], DATES[0]]], [[DATES[2], DATES[2]]])).to.deep.equal([
      [DATES[0], DATES[0]],
      [DATES[2], DATES[2]]
    ])
    expect(
      mergeRange(
        [[DATES[0], DATES[1]], [DATES[4], DATES[8]]],
        [[DATES[1], DATES[6]]]
      )
    ).to.deep.equal([
      [DATES[0], DATES[0]],
      [DATES[2], DATES[3]],
      [DATES[7], DATES[8]]
    ])
    expect(
      mergeRange(
        [[DATES[0], DATES[1]], [DATES[4], DATES[8]]],
        [[DATES[1], DATES[2]], [DATES[4], DATES[8]]]
      )
    ).to.deep.equal([[DATES[0], DATES[0]], [DATES[2], DATES[2]]])
    expect(
      mergeRange(
        [[DATES[0], DATES[1]], [DATES[5], DATES[7]]],
        [[DATES[3], DATES[4]], [DATES[6], DATES[8]]]
      )
    ).to.deep.equal([
      [DATES[0], DATES[1]],
      [DATES[3], DATES[5]],
      [DATES[8], DATES[8]]
    ])
  })

  it('should calculate range union correctly', () => {
    expect(mergeRange([], [[DATES[2], DATES[5]]], 'union')).to.deep.equal([
      [DATES[2], DATES[5]]
    ])
    expect(
      mergeRange([[DATES[0], DATES[5]]], [[DATES[1], DATES[1]]], 'union')
    ).to.deep.equal([[DATES[0], DATES[5]]])
    expect(
      mergeRange([[DATES[0], DATES[5]]], [[DATES[0], DATES[0]]], 'union')
    ).to.deep.equal([[DATES[0], DATES[5]]])
    expect(
      mergeRange([[DATES[0], DATES[0]]], [[DATES[2], DATES[2]]], 'union')
    ).to.deep.equal([[DATES[0], DATES[0]], [DATES[2], DATES[2]]])
    expect(
      mergeRange(
        [[DATES[0], DATES[1]], [DATES[4], DATES[8]]],
        [[DATES[1], DATES[6]]],
        'union'
      )
    ).to.deep.equal([[DATES[0], DATES[8]]])
    expect(
      mergeRange(
        [[DATES[0], DATES[1]], [DATES[4], DATES[8]]],
        [[DATES[1], DATES[2]], [DATES[4], DATES[8]]],
        'union'
      )
    ).to.deep.equal([[DATES[0], DATES[2]], [DATES[4], DATES[8]]])
    expect(
      mergeRange(
        [[DATES[0], DATES[1]], [DATES[5], DATES[7]]],
        [[DATES[3], DATES[4]], [DATES[6], DATES[8]]],
        'union'
      )
    ).to.deep.equal([[DATES[0], DATES[1]], [DATES[3], DATES[8]]])
  })

  it('should calculate range relative complement correctly', () => {
    expect(mergeRange([], [[DATES[1], DATES[1]]], 'substract')).to.deep.equal([])
    expect(
      mergeRange([[DATES[0], DATES[5]]], [[DATES[1], DATES[1]]], 'substract')
    ).to.deep.equal([[DATES[0], DATES[0]], [DATES[2], DATES[5]]])
    expect(
      mergeRange([[DATES[0], DATES[5]]], [[DATES[0], DATES[0]]], 'substract')
    ).to.deep.equal([[DATES[1], DATES[5]]])
    expect(
      mergeRange([[DATES[0], DATES[0]]], [[DATES[2], DATES[2]]], 'substract')
    ).to.deep.equal([[DATES[0], DATES[0]]])
    expect(
      mergeRange(
        [[DATES[0], DATES[1]], [DATES[4], DATES[8]]],
        [[DATES[1], DATES[6]]],
        'substract'
      )
    ).to.deep.equal([[DATES[0], DATES[0]], [DATES[7], DATES[8]]])
    expect(
      mergeRange(
        [[DATES[0], DATES[1]], [DATES[4], DATES[8]]],
        [[DATES[1], DATES[2]], [DATES[4], DATES[8]]],
        'substract'
      )
    ).to.deep.equal([[DATES[0], DATES[0]]])
    expect(
      mergeRange(
        [[DATES[0], DATES[1]], [DATES[5], DATES[7]]],
        [[DATES[3], DATES[4]], [DATES[6], DATES[8]]],
        'substract'
      )
    ).to.deep.equal([[DATES[0], DATES[1]], [DATES[5], DATES[5]]])
  })
})
