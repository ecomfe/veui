import { resolveOverlayPosition } from '@/utils/helper'

describe('utils/helper', () => {
  it('should resolve Popper-style overlay position to Tether-style correctly', () => {
    expect(resolveOverlayPosition('top-end')).toEqual({
      targetAttachment: 'top right',
      attachment: 'bottom right'
    })
    expect(resolveOverlayPosition('right-start')).toEqual({
      targetAttachment: 'top right',
      attachment: 'top left'
    })
    expect(resolveOverlayPosition('bottom')).toEqual({
      targetAttachment: 'bottom center',
      attachment: 'top center'
    })
    expect(resolveOverlayPosition('auto-right')).toEqual({
      targetAttachment: 'bottom right',
      attachment: 'top right'
    })
    expect(resolveOverlayPosition('right')).toEqual({
      targetAttachment: 'middle right',
      attachment: 'middle left'
    })
  })
})
