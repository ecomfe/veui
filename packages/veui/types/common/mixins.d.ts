import { getKey } from './context'

export type UiMixin = {
  props: { ui?: string }
}

export type FocusableMixin = {
  methods: { focus(): unknown }
}

export type ActivatableMixin = {
  methods: { activate(): unknown }
}

export type ControllableMixin<Emits extends Record<any, Function>> = {
  emits: Emits
}

export type OverlayMixin = {
  props: {
    overlayClass?: unknown
    overlayStyle?: unknown
    // overlayOptions?: object?
  }
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
  : RealMix extends [infer first, ...infer rest]
    ? rest extends Array<Mix>
      ? {
        props: getKey<first, 'props'> & getKey<MultiMixin<rest>, 'props'>
        methods: getKey<first, 'methods'> & getKey<MultiMixin<rest>, 'methods'>
        emits: getKey<first, 'emits'> & getKey<MultiMixin<rest>, 'emits'>
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
    toggle(expanded: boolean): unknown
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
