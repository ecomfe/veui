import { mount } from '@vue/test-utils'
import { wait } from '../../../utils'
import Carousel from '@/components/Carousel'

let items = [
  {
    src:
      'http://ecmb.bdimg.com/public01/one-design/2b77cc4a4c5c906993c0e512f3ddaf03.jpg',
    alt: 'A cute kitty looking at you with its greenish eyes.',
    label: '猫'
  },
  {
    src:
      'http://ecmb.bdimg.com/public01/one-design/6fedc62b9221846ce5114c7447622e47.jpeg',
    alt: 'A common kingfisher flying above river.',
    label: '翠鸟'
  },
  {
    src:
      'http://ecmb.bdimg.com/public01/one-design/e1b6473c898d9e456452ee79d7533a86.jpeg',
    alt: 'A white and gray dolphin in blue water.',
    label: '海豚'
  },
  {
    src: 'https://www.baidu.com/img/bd_logo1.png',
    alt: 'Baidu logo.',
    label: '百度'
  },
  {
    src:
      'https://ss3.bdstatic.com/yrwDcj7w0QhBkMak8IuT_XF5ehU5bvGh7c50/logopic/1b61ee88fdb4a4b918816ae1cfd84af1_fullsize.jpg',
    alt: 'Tesla logo.',
    label: '特斯拉'
  }
]

describe('components/Carousel', () => {
  it('should switch correctly with local state', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
          />`,
        data () {
          return {
            items
          }
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let next = wrapper.find('.veui-carousel-control-next')
    let prev = wrapper.find('.veui-carousel-control-prev')

    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(0)
        .classes()
    ).to.include('veui-carousel-item-current')
    prev.trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(0)
        .classes()
    ).to.include('veui-carousel-item-current')
    next.trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(1)
        .classes()
    ).to.include('veui-carousel-item-current')

    wrapper.destroy()
  })

  it('should switch correctly with .sync', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
            :index.sync="index"
          />`,
        data () {
          return {
            items,
            index: 3
          }
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let next = wrapper.find('.veui-carousel-control-next')

    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(3)
        .classes()
    ).to.include('veui-carousel-item-current')
    next.trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(4)
        .classes()
    ).to.include('veui-carousel-item-current')
    expect(vm.index).to.equal(4)
    vm.index = 1

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(1)
        .classes()
    ).to.include('veui-carousel-item-current')

    wrapper.destroy()
  })

  it('should switch correctly with controlled mode', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
            :index="index"
            @change="change"
          />`,
        data () {
          return {
            items,
            index: 1
          }
        },
        methods: {
          change (index) {
            if (index >= 3) {
              this.index = index
            }
          }
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let next = wrapper.find('.veui-carousel-control-next')

    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(1)
        .classes()
    ).to.include('veui-carousel-item-current')
    next.trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(1)
        .classes()
    ).to.include('veui-carousel-item-current')
    vm.index = 2

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(2)
        .classes()
    ).to.include('veui-carousel-item-current')
    next.trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(3)
        .classes()
    ).to.include('veui-carousel-item-current')
    expect(vm.index).to.equal(3)

    wrapper.destroy()
  })

  it('should handle `autoplay` and `interval` correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
            :autoplay="autoplay"
            :interval="interval"
          />`,
        data () {
          return {
            items,
            autoplay: true,
            interval: 200
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(0)
        .classes()
    ).to.include('veui-carousel-item-current')

    await wait(300)
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(1)
        .classes()
    ).to.include('veui-carousel-item-current')

    await wait(200)
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(2)
        .classes()
    ).to.include('veui-carousel-item-current')
    vm.interval = 100

    await wait(150)
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(3)
        .classes()
    ).to.include('veui-carousel-item-current')
    vm.autoplay = false

    await wait(100)
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(3)
        .classes()
    ).to.include('veui-carousel-item-current')

    wrapper.destroy()
  })

  it('should render `indicator` correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
            :indicator="indicator"
          />`,
        data () {
          return {
            items,
            indicator: 'radio'
          }
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    expect(wrapper.find('.veui-carousel-indicator-radios').exists()).to.equal(
      true
    )
    expect(
      wrapper
        .findAll('.veui-carousel-indicator-item')
        .at(0)
        .classes()
    ).to.include('veui-carousel-indicator-item-current')
    vm.indicator = 'number'

    await vm.$nextTick()
    expect(wrapper.find('.veui-carousel-indicator-numbers').exists()).to.equal(
      true
    )
    expect(wrapper.find('.veui-carousel-indicator-numbers').text()).to.equal(
      '1/5'
    )
    vm.indicator = 'tab'

    await vm.$nextTick()
    expect(wrapper.find('.veui-carousel-indicator-tabs').exists()).to.equal(
      true
    )
    expect(
      wrapper
        .findAll('.veui-carousel-indicator-item')
        .at(0)
        .classes()
    ).to.include('veui-carousel-indicator-item-current')
    vm.indicator = 'none'

    await vm.$nextTick()
    expect(wrapper.find('.veui-carousel-indicator-radios').exists()).to.equal(
      false
    )
    expect(wrapper.find('.veui-carousel-indicator-numbers').exists()).to.equal(
      false
    )
    expect(wrapper.find('.veui-carousel-indicator-tabs').exists()).to.equal(
      false
    )
    vm.indicator = 'number'

    wrapper.destroy()
  })

  it('should handle `switch-trigger` correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
            :switch-trigger="trigger"
          />`,
        data () {
          return {
            items,
            trigger: 'click'
          }
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper

    wrapper
      .findAll('.veui-carousel-indicator-item')
      .at(3)
      .trigger('mouseenter')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-carousel-indicator-item')
        .at(0)
        .classes()
    ).to.include('veui-carousel-indicator-item-current')

    wrapper
      .findAll('.veui-carousel-indicator-item')
      .at(0)
      .trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-carousel-indicator-item')
        .at(0)
        .classes()
    ).to.include('veui-carousel-indicator-item-current')

    wrapper
      .findAll('.veui-carousel-indicator-item')
      .at(3)
      .trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-carousel-indicator-item')
        .at(3)
        .classes()
    ).to.include('veui-carousel-indicator-item-current')
    vm.trigger = 'hover'

    await vm.$nextTick()
    wrapper
      .findAll('.veui-carousel-indicator-item')
      .at(1)
      .trigger('mouseenter')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-carousel-indicator-item')
        .at(1)
        .classes()
    ).to.include('veui-carousel-indicator-item-current')

    wrapper.destroy()
  })

  it('should handle `pause-on-hover` correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
            :pause-on-hover="pauseOnHover"
            autoplay
            :interval="200"
          />`,
        data () {
          return {
            items,
            pauseOnHover: true
          }
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper

    await wait(300)
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(1)
        .classes()
    ).to.include('veui-carousel-item-current')
    wrapper.find('.veui-carousel-viewport').trigger('mouseenter')

    await wait(300)
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(1)
        .classes()
    ).to.include('veui-carousel-item-current')
    wrapper.find('.veui-carousel-viewport').trigger('mouseleave')

    await wait(300)
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(2)
        .classes()
    ).to.include('veui-carousel-item-current')
    vm.pauseOnHover = false

    await vm.$nextTick()
    wrapper.find('.veui-carousel-viewport').trigger('mouseenter')

    await wait(300)
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(3)
        .classes()
    ).to.include('veui-carousel-item-current')
    wrapper.find('.veui-carousel-viewport').trigger('mouseleave')

    wrapper.destroy()
  })

  it('should handle `wrap` correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
            :wrap="wrap"
          />`,
        data () {
          return {
            items,
            wrap: false
          }
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let prev = wrapper.find('.veui-carousel-control-prev')

    prev.trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(0)
        .classes()
    ).to.include('veui-carousel-item-current')
    vm.wrap = true

    await vm.$nextTick()
    prev.trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-carousel-item')
        .at(4)
        .classes()
    ).to.include('veui-carousel-item-current')

    wrapper.destroy()
  })

  it('should handle `lazy` correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
            :lazy="lazy"
          />`,
        data () {
          return {
            items,
            lazy: false
          }
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let next = wrapper.find('.veui-carousel-control-next')

    expect(wrapper.findAll('.veui-carousel-item img').length).to.equal(5)
    vm.lazy = true

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-carousel-item img')
        .wrappers.map(wrapper => wrapper.element.alt)
    ).to.eql([items[0].alt, items[1].alt, items[4].alt])
    next.trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-carousel-item img')
        .wrappers.map(wrapper => wrapper.element.alt)
    ).to.eql([items[0].alt, items[1].alt, items[2].alt])
    vm.lazy = {
      preload: 2
    }

    await vm.$nextTick()
    expect(wrapper.findAll('.veui-carousel-item img').length).to.equal(5)

    wrapper.destroy()
  })

  it('should handle focus correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
            :interval="100"
          />`,
        data () {
          return {
            items
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    let item
    let next = wrapper.find('.veui-carousel-control-next')
    let prev = wrapper.find('.veui-carousel-control-prev')
    next.element.focus()

    await vm.$nextTick()
    expect(wrapper.classes()).to.include('veui-focus')
    next.element.blur()

    await vm.$nextTick()
    expect(wrapper.classes()).to.not.include('veui-focus')
    next.element.focus()

    await vm.$nextTick()
    prev.element.focus()
    expect(wrapper.classes()).to.include('veui-focus')
    wrapper.trigger('keydown.right')

    await wait(0)
    item = wrapper.findAll('.veui-carousel-item').at(1)
    expect(item.classes(), '#1').to.include('veui-carousel-item-current')
    expect(item.element).to.equal(document.activeElement)
    wrapper.trigger('keydown.left')

    await wait(0)
    item = wrapper.findAll('.veui-carousel-item').at(0)
    expect(item.classes(), '#2').to.include('veui-carousel-item-current')
    expect(item.element).to.equal(document.activeElement)
    wrapper.trigger('keydown.left')

    await wait(0)
    item = wrapper.findAll('.veui-carousel-item').at(0)
    expect(item.classes(), '#3').to.include('veui-carousel-item-current')
    expect(item.element).to.equal(document.activeElement)
    wrapper.trigger('keydown.left')

    wrapper.destroy()
  })
})
