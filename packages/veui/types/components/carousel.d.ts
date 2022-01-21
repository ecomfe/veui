import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  LooseObject,
  CarouselMixin
} from '../common'

export type Item = {
  src: string
  label?: string
  alt?: string
  type?: 'video' | 'image'
}

export type CarouselCommonProps<T extends Item> = {
  datasource?: Array<T>
  index?: number
  wrap?: boolean
  lazy?: boolean | { preload: number }
}

type Props<T extends Item> = CarouselCommonProps<T> & {
  indicator?: 'bar' | 'radio' | 'number' | 'none' | 'dot'
  indicatorAlign?: 'start' | 'end'
  indicatorPosition?: 'inside' | 'outside'
  controlsPosition?: 'inside' | 'outside'
  controls?: boolean
  switchTrigger?: 'hover' | 'click'
  keyField?: string
  autoplay?: boolean
  pauseOnHover?: boolean
  interval?: number
  effect?: 'fade' | 'slide'
  slidesPerView?: number
  slidesPerGroup?: number
  vertical?: boolean
  slideAspectRatio?: string | number
  options?: {
    video?: {
      muted?: boolean
      autoplay?: boolean
      controls?: boolean
      loop?: boolean
      [key: keyof any]: unknown
    }
    [key: keyof any]: unknown
  }
}

type Emits = {} // change 也在 mixin 中

type Mixins = CarouselMixin // ui 也在

type Slots = {
  item(slotProps: { item: LooseObject<Item> }): unknown
}

type Carousel = VeuiDefineComponent<{
  new <T extends Item = Item>(...args: any[]): VeuiDefineInstance<
    Props<T>,
    Emits,
    Slots,
    Mixins
  >
}>

export default Carousel
