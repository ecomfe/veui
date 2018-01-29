import { resolveOverlayPosition } from '@/utils/helper'

describe('utils/helper', () => {
  it('should resolve Popper-style overlay position to Tether-style correctly', () => {
    expect(resolveOverlayPosition('top-end')).to.deep.equal({
      targetAttachment: 'top right',
      attachment: 'bottom right'
    })
    expect(resolveOverlayPosition('right-start')).to.deep.equal({
      targetAttachment: 'top right',
      attachment: 'top left'
    })
    expect(resolveOverlayPosition('bottom')).to.deep.equal({
      targetAttachment: 'bottom center',
      attachment: 'top center'
    })
    expect(resolveOverlayPosition('auto-right')).to.deep.equal({
      targetAttachment: 'bottom right',
      attachment: 'top right'
    })
    expect(resolveOverlayPosition('right')).to.deep.equal({
      targetAttachment: 'middle right',
      attachment: 'middle left'
    })
  })
})
