import { mount, config as testConfig } from '@vue/test-utils'
import { wait } from '../../../utils'
import Carousel from '@/components/Carousel'

testConfig.stubs.transition = false
testConfig.stubs['transition-group'] = false

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
            indicator: 'bar'
          }
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    expect(wrapper.find('.veui-carousel-indicator-bars').exists()).to.equal(
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
    vm.indicator = 'dot'

    await vm.$nextTick()
    expect(wrapper.find('.veui-carousel-indicator-dots').exists()).to.equal(
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
    expect(wrapper.find('.veui-carousel-indicator-bars').exists()).to.equal(
      false
    )
    expect(wrapper.find('.veui-carousel-indicator-numbers').exists()).to.equal(
      false
    )
    expect(wrapper.find('.veui-carousel-indicator-dots').exists()).to.equal(
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

  it('should render indicator and control prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
            :vertical="vertical"
            :autoplay="autoplay"
            indicator-alignment="end"
            :indicator-position="position"
            :controls="controls"
            :controls-position="position"
          />`,
        data () {
          return {
            items,
            vertical: true,
            autoplay: false,
            controls: true,
            position: 'inside'
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let { vm } = wrapper
    // vertical indicator
    let indicator = wrapper.find('.veui-carousel-indicator')
    expect(indicator.classes()).to.include('veui-carousel-indicator-vertical')
    expect(indicator.classes()).to.include('veui-carousel-indicator-right')

    // vertical control
    let control = wrapper.find('.veui-carousel-control')
    expect(control.classes()).to.include('veui-carousel-control-vertical')

    // controls always exists on playing manually
    vm.autoplay = false
    vm.controls = false
    await vm.$nextTick()
    expect(
      wrapper.find('.veui-carousel-control').exists(),
      'controls always exists on playing manually.'
    ).to.equal(true)

    // test outside
    vm.position = 'outside'
    vm.vertical = false
    await vm.$nextTick()
    let viewport = wrapper.find('.veui-carousel-viewport')
    expect(inViewport(viewport, control), '#outside control').to.equal(false)
    expect(inViewport(viewport, indicator), '#outside indicator').to.equal(
      false
    )

    wrapper.destroy()
  })

  it('should handle slide effect correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
            effect="slide"
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

    let slides = wrapper.findAll(
      '.veui-carousel-item:not(.veui-carousel-item-duplicate):not(.veui-carousel-item-pad)'
    )
    let viewport = wrapper.find('.veui-carousel-viewport')
    expect(inViewport(viewport, slides.at(0))).to.equal(true)
    expect(inViewport(viewport, slides.at(1))).to.equal(false)

    let next = wrapper.find('.veui-carousel-control-next')
    next.trigger('click')
    await wait(300)
    expect(inViewport(viewport, slides.at(0))).to.equal(false)
    expect(inViewport(viewport, slides.at(1))).to.equal(true)
    wrapper.destroy()
  })

  it('should handle slidesPerGroup/slidesPerView correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
            :index.sync="index"
            :slides-per-group="group"
            :slides-per-view="view"
            effect="slide"
          />`,
        data () {
          return {
            items,
            group: 2,
            index: 0,
            view: 2
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    let slides = wrapper.findAll(
      '.veui-carousel-item:not(.veui-carousel-item-duplicate):not(.veui-carousel-item-pad)'
    )
    let viewport = wrapper.find('.veui-carousel-viewport')
    expect(slides.at(0).classes()).to.includes('veui-carousel-item-current')
    expect(slides.at(1).classes()).to.includes('veui-carousel-item-current')
    expect(slides.at(2).classes()).to.not.includes('veui-carousel-item-current')
    expect(inViewport(viewport, slides.at(0)), '#per1').to.equal(true)
    expect(inViewport(viewport, slides.at(1)), '#per2').to.equal(true)
    expect(inViewport(viewport, slides.at(2)), '#per3').to.equal(false)

    let next = wrapper.find('.veui-carousel-control-next')
    next.trigger('click')
    await wait(300)
    expect(slides.at(1).classes()).to.not.includes('veui-carousel-item-current')
    expect(slides.at(2).classes()).to.includes('veui-carousel-item-current')
    expect(slides.at(3).classes()).to.includes('veui-carousel-item-current')
    expect(inViewport(viewport, slides.at(1)), '#per4').to.equal(false)
    expect(inViewport(viewport, slides.at(2)), '#per5').to.equal(true)
    expect(inViewport(viewport, slides.at(3)), '#per6').to.equal(true)

    // view/group 目前没有做成响应式的，感觉变化的意义不大？有需求再支持
    vm.index = 0
    vm.view = 2
    vm.group = 1
    await wait(300) // index 变化效果也是slide
    slides = wrapper.findAll(
      '.veui-carousel-item:not(.veui-carousel-item-duplicate):not(.veui-carousel-item-pad)'
    )
    expect(slides.at(0).classes()).to.includes('veui-carousel-item-current')
    expect(slides.at(1).classes()).to.includes('veui-carousel-item-current')
    expect(slides.at(2).classes()).to.not.includes('veui-carousel-item-current')
    expect(inViewport(viewport, slides.at(0)), '#per7').to.equal(true)
    expect(inViewport(viewport, slides.at(1)), '#per8').to.equal(true)
    expect(inViewport(viewport, slides.at(2)), '#per9').to.equal(false)

    next.trigger('click')
    await wait(300)
    expect(slides.at(0).classes()).to.not.includes('veui-carousel-item-current')
    expect(slides.at(1).classes()).to.includes('veui-carousel-item-current')
    expect(slides.at(2).classes()).to.includes('veui-carousel-item-current')
    expect(inViewport(viewport, slides.at(0)), '#per10').to.equal(false)
    expect(inViewport(viewport, slides.at(1)), '#per11').to.equal(true)
    expect(inViewport(viewport, slides.at(2)), '#per12').to.equal(true)
    wrapper.destroy()
  })

  it('should work with wrap + slidesPerGroup/slidesPerView', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
            :index.sync="index"
            :slides-per-group="group"
            :slides-per-view="view"
            wrap
            effect="slide"
          />`,
        data () {
          return {
            items,
            group: 2,
            index: 0,
            view: 2
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    // 2/2 那么在5个里面需要补1个空白pad
    let { vm } = wrapper
    let pads = wrapper.findAll(
      '.veui-carousel-item-pad:not(.veui-carousel-item-duplicate)'
    )
    expect(pads.length).to.equal(1)
    let prev = wrapper.find('.veui-carousel-control-prev')
    // 这里一定要 wait
    await wait(0)
    prev.trigger('click')
    await wait(300)
    expect(vm.index).to.equal(2)

    let next = wrapper.find('.veui-carousel-control-next')
    next.trigger('click')
    await wait(300)
    expect(vm.index).to.equal(0)

    // 3/2 那么在5个里面需要补1个空白 pad 且最后一个 view 的最后一个是第一个项目
    vm.index = 2
    vm.view = 3
    vm.group = 2
    await wait(300)
    pads = wrapper.findAll(
      '.veui-carousel-item-pad:not(.veui-carousel-item-duplicate)'
    )
    expect(pads.length).to.equal(1)
    let slide = wrapper.findAll('.veui-carousel-item-current').at(vm.view - 1)
    expect(slide.find('img').attributes('src')).to.equal(vm.items[0].src)
    wrapper.destroy()
  })

  it('should work with slideAspectRatio + slidesPerView', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
            :slides-per-view="view"
            :slide-aspect-ratio="2/1"
            effect="slide"
            :vertical="vertical"
          />`,
        data () {
          return {
            items,
            view: 2,
            vertical: false
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let { vm } = wrapper
    let slides = wrapper.findAll(
      '.veui-carousel-item:not(.veui-carousel-item-duplicate):not(.veui-carousel-item-pad)'
    )
    let rect0 = slides.at(0).element.getBoundingClientRect()
    let rect1 = slides.at(1).element.getBoundingClientRect()
    let rectViewport = wrapper
      .find('.veui-carousel-viewport')
      .element.getBoundingClientRect()
    expect(rect0.width, '#width aspectRatio').to.equal(rect0.height * 2)
    expect(rect0.left, '#width aspectRatio2').to.equal(rectViewport.left)
    expect(rect1.right, '#width aspectRatio3').to.equal(rectViewport.right)

    vm.vertical = true
    await wait(300)
    slides = wrapper.findAll(
      '.veui-carousel-item:not(.veui-carousel-item-duplicate):not(.veui-carousel-item-pad)'
    )
    rect0 = slides.at(0).element.getBoundingClientRect()
    rect1 = slides.at(1).element.getBoundingClientRect()
    rectViewport = wrapper
      .find('.veui-carousel-viewport')
      .element.getBoundingClientRect()
    expect(rect0.width, '#height aspectRatio').to.equal(rect0.height * 2)
    expect(rect0.top, '#height aspectRatio2').to.equal(rectViewport.top)
    expect(rect1.bottom, '#height aspectRatio3').to.equal(rectViewport.bottom)
    wrapper.destroy()
  })

  it('should handle video content correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-carousel': Carousel
        },
        template: `
          <veui-carousel
            :datasource="items"
            :slides-per-view="view"
            :slide-aspect-ratio="2/1"
            :options="options"
            :effect="effect"
            :index.sync="index"
            wrap
            :vertical="vertical"
          />`,
        data () {
          return {
            items: [
              {
                src:
                  'https://nadvideo2.baidu.com/b45f066cccd13549219cb475ca520cee_1920_1080.mp4',
                alt: 'A 1080p video.',
                label: 'A 1080p video',
                type: 'video'
              },
              ...items
            ],
            view: 2,
            options: {
              video: {
                autoplay: false
              }
            },
            index: 0,
            effect: 'slide',
            vertical: false
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let { vm } = wrapper
    let video = wrapper.find('.veui-carousel-item-current video')
    video.element.currentTime = 1
    await wait(0)
    let next = wrapper.find('.veui-carousel-control-next')
    next.trigger('click')
    await wait(300)
    let prev = wrapper.find('.veui-carousel-control-prev')
    prev.trigger('click')
    await wait(300)
    video = wrapper.find('.veui-carousel-item-current video')
    expect(video.element.currentTime, '#video1').to.equal(0)
    video.element.currentTime = 1
    prev.trigger('click')
    await wait(300)
    video = wrapper.find('.veui-carousel-item-current video')
    expect(
      video.element.currentTime,
      '即使发生loopfix也要保留原来的时间'
    ).to.equal(1)

    vm.effect = 'fade'
    vm.index = 0
    await wait(0)
    video = wrapper.find('.veui-carousel-item-current video')
    video.element.currentTime = 1
    next.trigger('click')
    await wait(300)
    prev.trigger('click')
    await wait(300)
    expect(video.element.currentTime, 'fade 重置时间').to.equal(0)
    wrapper.destroy()
  })
})

function inViewport (viewport, scene) {
  let { left, top, right, bottom } = scene.element.getBoundingClientRect()
  let {
    left: vLeft,
    top: vTop,
    right: vRight,
    bottom: vBottom
  } = viewport.element.getBoundingClientRect()
  return left >= vLeft && top >= vTop && right <= vRight && bottom <= vBottom
}
