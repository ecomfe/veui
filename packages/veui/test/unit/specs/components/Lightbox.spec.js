import Lightbox from '@/components/Lightbox'
import { mount } from '../../../utils'

let items = [
  {
    src:
      'http://ecmb.bdimg.com/public01/one-design/2b77cc4a4c5c906993c0e512f3ddaf03.jpg',
    alt: 'A cute kitty looking at you with its greenish eyes.',
    label: '猫',
    type: 'image'
  },
  {
    src:
      'http://ecmb.bdimg.com/public01/one-design/6fedc62b9221846ce5114c7447622e47.jpeg',
    alt: 'A common kingfisher flying above river.',
    label: '翠鸟',
    type: 'image'
  },
  {
    src:
      'http://ecmb.bdimg.com/public01/one-design/e1b6473c898d9e456452ee79d7533a86.jpeg',
    alt: 'A white and gray dolphin in blue water.',
    label: '海豚',
    type: 'image'
  },
  {
    src:
      'http://ecmb.bdimg.com/public01/one-design/e1b6473c898d9e456452ee79d7533a86.jpeg',
    alt: 'A white and gray dolphin in blue water.',
    label: '海豚',
    type: 'image'
  },
  {
    name: '330206454.sd.mp4',
    src:
      'https://player.vimeo.com/external/330206454.sd.mp4?s=243f3d7497ba5d1c7f7ee57071e947540484a89a&profile_id=164&oauth2_token_id=57447761',
    poster:
      'https://images.pexels.com/videos/2156021/free-video-2156021.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    type: 'video'
  },
  {
    name: '380082136.sd.mp4',
    src:
      'https://player.vimeo.com/external/380082136.sd.mp4?s=930b81a8bf84310005cdb7f3d0c6489b777d7032&profile_id=139&oauth2_token_id=57447761',
    type: 'video'
  }
]

describe('components/Lightbox', () => {
  it('should handle video type correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-lightbox': Lightbox
        },
        template: `
          <veui-lightbox
            :datasource="items"
            open
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

    let images = wrapper.findAll('img')
    expect(images.length).to.equal(4)

    let videos = wrapper.findAll('video')
    expect(videos.length).to.equal(2)

    wrapper.destroy()
  })

  it('should handle prop options correctly', async () => {
    let options = {
      video: {
        muted: false,
        autoplay: false,
        controls: false
      }
    }
    let wrapper = mount(
      {
        components: {
          'veui-lightbox': Lightbox
        },
        template: `
          <veui-lightbox
            :datasource="items"
            :options="options"
            open
          />`,
        data () {
          return {
            items,
            options
          }
        }
      },
      {
        sync: false
      }
    )

    let video = wrapper.find('video').element
    expect(video.muted).to.equal(false)
    expect(video.autoplay).to.equal(false)
    expect(video.controls).to.equal(false)
    wrapper.destroy()
  })

  it('should switch correctly with local state', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-lightbox': Lightbox
        },
        template: `
          <veui-lightbox
            :datasource="items"
            open
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
    let next = wrapper.find('.veui-lightbox-control-next')
    let prev = wrapper.find('.veui-lightbox-control-prev')

    expect(
      wrapper
        .findAll('.veui-lightbox-item')
        .at(0)
        .classes()
    ).to.include('veui-lightbox-item-current')
    prev.trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-lightbox-item')
        .at(0)
        .classes()
    ).to.include('veui-lightbox-item-current')
    next.trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-lightbox-item')
        .at(1)
        .classes()
    ).to.include('veui-lightbox-item-current')

    wrapper.destroy()
  })

  it('should switch correctly with .sync', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-lightbox': Lightbox
        },
        template: `
          <veui-lightbox
            :datasource="items"
            :index.sync="index"
            open
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
    let next = wrapper.find('.veui-lightbox-control-next')

    expect(
      wrapper
        .findAll('.veui-lightbox-item')
        .at(3)
        .classes()
    ).to.include('veui-lightbox-item-current')
    next.trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-lightbox-item')
        .at(4)
        .classes()
    ).to.include('veui-lightbox-item-current')
    expect(vm.index).to.equal(4)
    vm.index = 1

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-lightbox-item')
        .at(1)
        .classes()
    ).to.include('veui-lightbox-item-current')

    wrapper.destroy()
  })

  it('should switch correctly with controlled mode', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-lightbox': Lightbox
        },
        template: `
          <veui-lightbox
            :datasource="items"
            :index="index"
            open
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
    let next = wrapper.find('.veui-lightbox-control-next')

    expect(
      wrapper
        .findAll('.veui-lightbox-item')
        .at(1)
        .classes()
    ).to.include('veui-lightbox-item-current')
    next.trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-lightbox-item')
        .at(1)
        .classes()
    ).to.include('veui-lightbox-item-current')
    vm.index = 2

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-lightbox-item')
        .at(2)
        .classes()
    ).to.include('veui-lightbox-item-current')
    next.trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-lightbox-item')
        .at(3)
        .classes()
    ).to.include('veui-lightbox-item-current')
    expect(vm.index).to.equal(3)

    wrapper.destroy()
  })

  it('should render `indicator` correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-lightbox': Lightbox
        },
        template: `
          <veui-lightbox
            :datasource="items"
            :indicator="indicator"
            open
          />`,
        data () {
          return {
            items,
            indicator: 'number'
          }
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    expect(wrapper.find('.veui-lightbox-indicator-numbers').exists()).to.equal(
      true
    )
    expect(wrapper.find('.veui-lightbox-indicator-numbers').text()).to.equal(
      '1/6'
    )

    vm.indicator = 'none'

    await vm.$nextTick()

    expect(wrapper.find('.veui-lightbox-indicator-numbers').exists()).to.equal(
      false
    )

    wrapper.destroy()
  })

  it('should handle `wrap` correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-lightbox': Lightbox
        },
        template: `
          <veui-lightbox
            :datasource="items"
            :wrap="wrap"
            open
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
    let prev = wrapper.find('.veui-lightbox-control-prev')

    prev.trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-lightbox-item')
        .at(0)
        .classes()
    ).to.include('veui-lightbox-item-current')

    vm.wrap = true

    await vm.$nextTick()
    prev.trigger('click')

    await vm.$nextTick()
    expect(
      wrapper
        .findAll('.veui-lightbox-item')
        .at(5)
        .classes()
    ).to.include('veui-lightbox-item-current')

    wrapper.destroy()
  })

  it('should handle `control` and `indicator` correctly when only have one image or video', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-lightbox': Lightbox
        },
        template: `
          <veui-lightbox
            :datasource="items"
            :wrap="wrap"
            open
          />`,
        data () {
          return {
            items: items.slice(0, 1),
            wrap: false
          }
        }
      },
      {
        sync: false
      }
    )

    expect(wrapper.find('.veui-lightbox-control-prev').isVisible()).to.equal(
      false
    )
    expect(wrapper.find('.veui-lightbox-control-next').isVisible()).to.equal(
      false
    )
    expect(wrapper.find('.veui-lightbox-indicator-numbers').exists()).to.equal(
      false
    )

    let { vm } = wrapper
    vm.wrap = true
    await vm.$nextTick()

    expect(wrapper.find('.veui-lightbox-control-prev').isVisible()).to.equal(
      false
    )
    expect(wrapper.find('.veui-lightbox-control-next').isVisible()).to.equal(
      false
    )
    expect(wrapper.find('.veui-lightbox-indicator-numbers').exists()).to.equal(
      false
    )

    wrapper.destroy()
  })
})
