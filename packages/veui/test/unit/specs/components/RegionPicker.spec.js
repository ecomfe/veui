import { mount } from '@vue/test-utils'
import RegionPicker from '@/components/RegionPicker'

describe('components/RegionPicker', () => {
  it('should handle selected prop with `null` value.', done => {
    let wrapper = mount({
      data () {
        return {
          datasource: [{ id: '1' }]
        }
      },
      methods: {
        handleSelect (val) {
          expect(val).to.deep.equal(['1'])

          wrapper.destroy()
          done()
        }
      },
      render () {
        return (
          <RegionPicker
            datasource={this.datasource}
            onSelect={val => this.handleSelect(val)}
          />
        )
      }
    })

    wrapper.find('.veui-checkbox input').trigger('change')
  })
})
