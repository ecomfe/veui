import { KeyType } from './utils'
import { OverlayClassAndStyle } from './shared'

export type UiMixin = {
  props: { ui?: string }
}

export type FocusableMixin = {
  methods: { focus(): void }
}

export type ActivatableMixin = {
  methods: { activate(): void }
}

export type ControllableMixin<Emits extends Record<any, Function>> = {
  emits: Emits
}

export type OverlayMixin = {
  props: OverlayClassAndStyle
}

type MergeChecked = 'keep-all' | 'upwards' | 'downwards'

export type TreeMixin = {
  props: {
    mergeChecked?: MergeChecked
  }
}

export type TreeMixinWithIndeterminate = {
  props: {
    mergeChecked?: MergeChecked
    includeIndeterminate?: boolean
  }
}

export type Mix = {
  props?: Record<string, unknown>
  methods?: Record<string, Function>
  emits?: Record<string, Function>
}

export type MultiMixin<
  T extends Array<Mix> | Mix,
  RealMix = T extends Mix ? [T] : T
> = RealMix extends []
  ? {
    props: {}
    methods: {}
    emits: {}
  }
  : RealMix extends [infer First, ...infer Rest]
    ? Rest extends Array<Mix>
      ? {
        props: KeyType<First, 'props'> & KeyType<MultiMixin<Rest>, 'props'>
        methods: KeyType<First, 'methods'> & KeyType<MultiMixin<Rest>, 'methods'>
        emits: KeyType<First, 'emits'> & KeyType<MultiMixin<Rest>, 'emits'>
      } : never
    : never


export type DropdownMixin = MultiMixin<[
  {
    props: {
      overlayPriority?: number
      expanded?: boolean
    }
  },
  OverlayMixin,
  ActivatableMixin,
  ControllableMixin<{
    toggle(expanded: boolean): void
  }>
]>

export type InputMixin = MultiMixin<[
  {
    props: {
      name?: string
      readonly?: boolean
      disabled?: boolean
      invalid?: boolean
    }
  },
  FocusableMixin
]>

export type CarouselMixin = MultiMixin<[
  {
    // props 要泛型
    emits: {
      change(to: number, from: number): unknown
    }
  },
  UiMixin
]>
