// vue ts 文件问题：
// 1. makeDefaultOptional 中的 Omit 导致 { foo: true, bar: number } | { foo: false, bar: string } 失效
// 2. 从 PropsOption 推导 PropType 很多都推导不出来？

import {
  VNodeProps,
  CreateComponentPublicInstance,
  AllowedComponentProps,
  ComponentCustomProps,
  ComputedOptions,
  MethodOptions,
  EmitsOptions
} from '@vue/runtime-dom'
import { MultiMixin, Mix } from './mixins'
import { KeyType, NullableProp } from './utils'

type PublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps

/**
 * 定义 veui 组件：
 * new (...args: any[]): VeuiDefineInstance<...> ，然后导出时加上 PP
 */
export type VeuiDefineInstance<
  Props = {},
  Emit extends EmitsOptions = {},
  Slots = {},
  Mixin extends Array<Mix> | Mix = [],
  Method extends MethodOptions = {},
  Computed extends ComputedOptions = {},
  MergedMixin = MultiMixin<Mixin>,
  RealProps = NullableProp<Props & KeyType<MergedMixin, 'props'>>,
  RealEmit = Emit & KeyType<MergedMixin, 'emits'>,
  RealMethod = Method & KeyType<MergedMixin, 'methods'>
> = CreateComponentPublicInstance<
  RealProps,
  {},
  {},
  Computed,
  RealMethod extends MethodOptions ? RealMethod : never,
  {},
  {},
  RealEmit extends EmitsOptions ? RealEmit : never
> & {
  $scopedSlots: Slots
}

export type VeuiDefineComponent<T> = T & PublicProps

// 不写成 mixin，因为 mixin 无法在 new() => instance 中捕获泛型
export type SearchableProps<T = unknown> = {
  match?: (
    item: T,
    keyword: string | undefined,
    context: { ancestors: Array<T> }
  ) => boolean | Array<[number, number]>
  filter?: (
    item: T,
    keyword: string | undefined,
    context: { ancestors: Array<T>; offsets: Array<[number, number]> }
  ) => boolean
}

type BaseNormalizedItem<ChildrenKey extends string> =
  | string
  | ({
      label?: string
      value?: unknown
    } & {
      [K in ChildrenKey]?: Array<BaseNormalizedItem<K>> | null
    })

// 不用 Omit/Pick ，因为内部访问 keyof，对于有 [x: string] 这种 key 的参数，直接就把更具体的 key 忽略了
export type Normalized<
  ChildrenKey extends string,
  T extends BaseNormalizedItem<ChildrenKey>,
  Loose extends boolean = false,
  Extra extends Record<any, unknown> = {}
> = T extends string
  ? { label: T; value: T } // string to object
  : T extends BaseNormalizedItem<ChildrenKey>
  ? {
      [K in keyof T]: K extends ChildrenKey // 递归下去
        ? Array<Normalized<K, T, Loose>> | null
        : T[K]
    } & (KeyType<T, 'label'> extends string
      ? {}
      : { label: KeyType<T, 'value'> }) &
      // eslint-disable-next-line no-unused-vars
      (Loose extends true ? { [K in any]: unknown } : {}) &
      Extra
  : never
