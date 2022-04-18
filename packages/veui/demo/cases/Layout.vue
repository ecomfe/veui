<script>
import bus from '../bus'
import {
  Layout,
  Header,
  Sidebar,
  Content,
  Footer,
  CheckButtonGroup,
  Overlay,
  Button,
  Nav,
  Sidenav
} from 'veui'
import 'veui-theme-dls-icons/calendar'

const navItems = [
  {
    label: '订单',
    icon: 'calendar',
    name: 'order'
  },
  {
    label: '计划',
    icon: 'calendar'
  },
  {
    label: '单元',
    icon: 'calendar'
  },
  {
    label: '创意',
    icon: 'calendar'
  },
  {
    label: '订单2',
    icon: 'calendar'
  },
  {
    label: '计划2',
    icon: 'calendar'
  },
  {
    label: '单元2',
    icon: 'calendar'
  },
  {
    label: '更多',
    icon: 'calendar',
    children: [
      {
        label: '订单3',
        icon: 'calendar'
      },
      {
        label: '计划3',
        icon: 'calendar'
      },
      {
        label: '单元3',
        icon: 'calendar'
      },
      {
        label: '订单4',
        icon: 'calendar'
      },
      {
        label: '计划4',
        icon: 'calendar'
      },
      {
        label: '单元4',
        icon: 'calendar'
      }
    ]
  }
]

export default {
  name: 'layout-demo',
  data () {
    return {
      open: false,
      collapsed: false,
      feature: ['long-content'],
      header: ['header', 'sticky'],
      sidebar: ['sidebar', 'sticky', 'collapsible', 'autocollapse'],
      outerFooter: ['footer', 'sticky'],
      innerFooter: ['footer'],
      headerFeatures: [
        { label: 'header', value: 'header' },
        { label: 'sticky', value: 'sticky' }
      ],
      sidebarFeatures: [
        { label: 'sidebar', value: 'sidebar' },
        { label: 'sticky', value: 'sticky' },
        { label: '通顶', value: '通顶' },
        { label: '窄收缩', value: 'slim' },
        { label: 'collapsible', value: 'collapsible' },
        { label: 'autocollapse', value: 'autocollapse' }
      ],
      outerFooterFeatures: [
        { label: 'outerFooter', value: 'footer' },
        { label: 'sticky', value: 'sticky' }
      ],
      innerFooterFeatures: [
        { label: 'innerFooter', value: 'footer' }
        // { label: 'sticky', value: 'sticky' }
      ],
      features: [{ label: '内容变长', value: 'long-content' }]
    }
  },
  computed: {
    long () {
      return this.feature.includes('long-content') ? 'height: 1000px;' : null
    },
    hasOuterFooter () {
      return this.outerFooter.includes('footer')
    },
    hasHeader () {
      return this.header.includes('header')
    },
    hasSidebar () {
      return this.sidebar.includes('sidebar')
    },
    isTongding () {
      return this.hasSidebar && this.sidebar.includes('通顶')
    },
    stickyOuterFooter () {
      return this.outerFooter.includes('sticky')
    },
    style () {
      let result = { header: {}, footer: {} }
      if (this.hasHeader && this.header.includes('sticky')) {
        result.header['--dls-layout-header-height'] = '64px'
      }
      if (this.hasOuterFooter && this.stickyOuterFooter) {
        result.footer['--dls-layout-footer-height'] = '67.6px'
      }
      return result
    },
    strategy () {
      const cf = 'Content+Footer'
      const lscf = { value: 'Layout', children: ['Sidebar', cf] }
      const hcf = ['Header', 'Content+Footer']
      let result
      switch (true) {
        case !this.hasHeader && !this.hasSidebar:
          result = [cf]
          break
        case !this.hasHeader:
          result = [lscf]
          break
        case !this.hasSidebar:
          result = this.hasOuterFooter
            ? hcf
            : [{ value: 'Layout', children: hcf }]
          break
        case this.isTongding:
          result = [
            {
              value: 'Layout',
              children: [
                'Sidebar',
                {
                  value: 'Layout',
                  children: hcf
                }
              ]
            }
          ]
          break
        default:
          const hlscf = ['Header', lscf]
          result = this.hasOuterFooter
            ? hlscf
            : [{ value: 'Layout', children: hlscf }]
          break
      }

      return this.hasOuterFooter
        ? [
          {
            value: 'Layout',
            children: [...result, 'Footer']
          }
        ]
        : result
    }
  },
  mounted () {
    this.$children.forEach((child) => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
  },
  methods: {
    renderControls () {
      return (
        <section>
          <CheckButtonGroup
            value={this.feature}
            items={this.features}
            onChange={(e) => {
              this.feature = e
            }}
          />
          <CheckButtonGroup
            value={this.header}
            items={this.headerFeatures}
            onChange={(e) => {
              this.header = e
            }}
          />
          <CheckButtonGroup
            value={this.sidebar}
            items={this.sidebarFeatures}
            onChange={(e) => {
              this.sidebar = e
            }}
          />
          <CheckButtonGroup
            value={this.outerFooter}
            items={this.outerFooterFeatures}
            onChange={(e) => {
              this.outerFooter = e
            }}
          />
          <CheckButtonGroup
            value={this.innerFooter}
            items={this.innerFooterFeatures}
            onChange={(e) => {
              this.innerFooter = e
            }}
          />
          <Button
            onClick={() => {
              this.open = false
            }}
          >
            退出 Layout 全屏示例
          </Button>
        </section>
      )
    },
    renderContent () {
      return (
        <Layout>
          <Content style={this.long}>{this.renderControls()}</Content>
          {this.innerFooter.includes('footer') && (
            <Footer sticky={this.innerFooter.includes('sticky')}>
              夜深风竹敲秋韵，万叶千声皆是恨。
            </Footer>
          )}
        </Layout>
      )
    },
    renderItem (current) {
      switch (current.value || current) {
        case 'Header':
          return (
            <Header sticky={this.header.includes('sticky')}>
              <div class="demo-header-content">
                {!this.isTongding && <div class="demo-header-logo" />}
                <Nav items={navItems} active="order" />
              </div>
            </Header>
          )
        case 'Sidebar':
          return (
            <Sidebar
              sticky={this.sidebar.includes('sticky')}
              collapseMode={this.sidebar.includes('slim') ? 'slim' : 'hidden'}
              collapsible={this.sidebar.includes('collapsible')}
              collapsed={this.collapsed}
              autocollapse={this.sidebar.includes('autocollapse')}
              {...{
                on: {
                  'update:collapsed': (val) => {
                    this.collapsed = val
                  }
                }
              }}
            >
              <div class="demo-sidebar-content">
                {this.isTongding && <div class="demo-header-logo" />}
                <Sidenav items={navItems} />
              </div>
            </Sidebar>
          )
        case 'Content+Footer':
          return this.renderContent()
        case 'Footer':
          return (
            <Footer
              sticky={this.stickyOuterFooter}
              style="background-color: #ff000048;"
            >
              人生在世不称意，明朝散发弄扁舟。
            </Footer>
          )
        case 'Layout':
          const hasHeader = current.children.some((i) => i === 'Header')
          const hasFooter = current.children.some((i) => i === 'Footer')
          return (
            <Layout
              style={{
                ...(hasHeader && this.style.header),
                ...(hasFooter && this.style.footer)
              }}
            >
              {this.renderList(current.children)}
            </Layout>
          )
      }
    },
    renderList (list) {
      return list.map((item) => this.renderItem(item))
    }
  },
  render () {
    return (
      <article>
        <h1>
          <code>&lt;veui-layout&gt;</code>
        </h1>
        <Button
          onClick={() => {
            this.open = true
          }}
        >
          进入 Layout 全屏示例
        </Button>
        <Overlay open={this.open}>
          <div class="mock-window">{this.renderList(this.strategy)}</div>
        </Overlay>
      </article>
    )
  }
}
</script>

<style scoped lang="less">
article {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  .veui-button {
    align-self: start;
  }
}

.demo-sidebar-content {
  display: flex;
  flex-direction: column;
}

.custom-sidebar-head {
  display: flex;
  flex-direction: row-reverse;
}

.mock-window {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
  background: #f6f7fa;
  box-shadow: 0 2px 24px 1px #00000005, 0 4px 26px 2px #00000008,
    0 6px 28px 2px #0000000a;

  & + & {
    margin-top: 24px;
  }
}

.demo-header {
  &-content {
    height: 100%;
    display: flex;

    .veui-nav {
      flex: auto;
    }
  }

  &-logo {
    display: inline-block;
    width: 200px;
    height: 100%;
    background-position: 50% 70%; // sidebar collapsed 下需要70%
    margin-top: -15px;
    margin-bottom: 15px;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url("https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png");

    .veui-layout-sidebar & {
      height: 64px;
      width: 100%;
    }
  }
}

section {
  display: flex;
  flex-direction: column;
  padding: 100px;

  .veui-check-button-group {
    margin-bottom: 24px;
  }

  .veui-button {
    align-self: start;
  }
}

.veui-layout-footer {
  padding: 24px 0;
}
</style>
