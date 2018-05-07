import RegionPicker from '@/components/RegionPicker'
import Vue from 'vue'

describe('components/RegionPicker', () => {
  it('should handle selected prop with `null` value.', done => {
    new Vue({
      data () {
        return {
          datasource: [{ id: '1' }]
        }
      },
      mounted () {
        this.$el
          .querySelector('.veui-checkbox input')
          .dispatchEvent(new Event('change'))
      },
      methods: {
        handleSelect (val) {
          expect(val).toEqual(['1'])
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
    }).$mount()
  })
})
