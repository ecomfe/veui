import { mount } from '@vue/test-utils'
import GridContainer from '@/components/GridContainer'
import GridRow from '@/components/GridRow'
import GridColumn from '@/components/GridColumn'
import { getStyle } from '../../../utils'

describe('components/GridContainer', () => {
  it('should render `columns` props correctly', () => {
    let wrapper = mount(
      {
        components: {
          'veui-grid-container': GridContainer,
          'veui-grid-row': GridRow,
          'veui-grid-column': GridColumn
        },
        template: `
          <veui-grid-container :columns="2">
            <veui-grid-row>
              <veui-grid-column />
              <veui-grid-column />
            </veui-grid-row>
          </veui-grid-container>
        `
      },
      {
        sync: false
      }
    )

    expect(wrapper.findAll('.veui-grid-column').length).to.equal(2)

    wrapper.destroy()
  })

  it('should render `gutter` props correctly', () => {
    let wrapper = mount(
      {
        components: {
          'veui-grid-container': GridContainer,
          'veui-grid-row': GridRow,
          'veui-grid-column': GridColumn
        },
        template: `
          <veui-grid-container :gutter="40">
            <veui-grid-row>
              <veui-grid-column />
              <veui-grid-column />
            </veui-grid-row>
          </veui-grid-container>
        `
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let obj = getStyle(wrapper.find('.veui-grid-column').element)

    expect(obj['padding-left']).to.equal('20px')
    expect(obj['padding-right']).to.equal('20px')

    wrapper.destroy()
  })

  it('should render `margin` props correctly', () => {
    let wrapper = mount(
      {
        components: {
          'veui-grid-container': GridContainer,
          'veui-grid-row': GridRow,
          'veui-grid-column': GridColumn
        },
        template: `
          <veui-grid-container :margin="10">
            <veui-grid-row>
              <veui-grid-column />
              <veui-grid-column />
            </veui-grid-row>
          </veui-grid-container>
        `
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let obj = getStyle(wrapper.find('.veui-grid-container').element)

    expect(obj['padding-left']).to.equal('10px')
    expect(obj['padding-right']).to.equal('10px')

    wrapper.destroy()
  })

  it('should render `flex` props correctly', () => {
    let wrapper = mount(
      {
        components: {
          'veui-grid-container': GridContainer,
          'veui-grid-row': GridRow,
          'veui-grid-column': GridColumn
        },
        template: `
          <veui-grid-container flex>
            <veui-grid-row>
              <veui-grid-column />
              <veui-grid-column />
            </veui-grid-row>
          </veui-grid-container>
        `
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    expect(getStyle(wrapper.find('.veui-grid-row').element).display).to.equal(
      'flex'
    )

    wrapper.destroy()
  })
})

describe('components/GridColumn', () => {
  it('should render `span` props correctly', () => {
    let wrapper = mount(
      {
        components: {
          'veui-grid-container': GridContainer,
          'veui-grid-row': GridRow,
          'veui-grid-column': GridColumn
        },
        template: `
          <veui-grid-container :columns="12">
            <veui-grid-row>
              <veui-grid-column :span="8" />
              <veui-grid-column :span="4" />
            </veui-grid-row>
          </veui-grid-container>
        `
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let columns = wrapper.findAll('.veui-grid-column')

    expect(columns.length).to.equal(2)
    expect(getStyle(columns.at(0).element).width).to.equal('66.667%')
    expect(getStyle(columns.at(1).element).width).to.equal('33.333%')

    wrapper.destroy()
  })

  it('should render `offset` props correctly', () => {
    let wrapper = mount(
      {
        components: {
          'veui-grid-container': GridContainer,
          'veui-grid-row': GridRow,
          'veui-grid-column': GridColumn
        },
        template: `
          <veui-grid-container :columns="12">
            <veui-grid-row>
              <veui-grid-column :offset="4" :span="4" />
              <veui-grid-column :span="4" />
            </veui-grid-row>
          </veui-grid-container>
        `
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let obj = getStyle(wrapper.find('.veui-grid-column').element)

    expect(obj.width).to.equal('33.333%')
    expect(obj['margin-left']).to.equal('33.333%')

    wrapper.destroy()
  })

  it('should render `pull` props correctly', () => {
    let wrapper = mount(
      {
        components: {
          'veui-grid-container': GridContainer,
          'veui-grid-row': GridRow,
          'veui-grid-column': GridColumn
        },
        template: `
          <veui-grid-container :columns="12">
            <veui-grid-row>
              <veui-grid-column :pull="4" :span="4" />
              <veui-grid-column />
            </veui-grid-row>
          </veui-grid-container>
        `
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let obj = getStyle(wrapper.find('.veui-grid-column').element)

    expect(obj.width).to.equal('33.333%')
    expect(obj.right).to.equal('33.333%')

    wrapper.destroy()
  })

  it('should render `push` props correctly', () => {
    let wrapper = mount(
      {
        components: {
          'veui-grid-container': GridContainer,
          'veui-grid-row': GridRow,
          'veui-grid-column': GridColumn
        },
        template: `
          <veui-grid-container :columns="12">
            <veui-grid-row>
              <veui-grid-column :push="4" :span="4" />
              <veui-grid-column />
            </veui-grid-row>
          </veui-grid-container>
        `
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let obj = getStyle(wrapper.find('.veui-grid-column').element)

    expect(obj.width).to.equal('33.333%')
    expect(obj.left).to.equal('33.333%')

    wrapper.destroy()
  })
})
