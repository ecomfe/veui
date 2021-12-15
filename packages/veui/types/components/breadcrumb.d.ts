import { VeuiDefineInstance, LooseObject } from '../common/context'
import { UiMixin } from '../common/mixins'
import { RawLocation } from 'vue-router'

export type Item = {
  label: string,
  type?: 'text' | 'link',
  to?: string | RawLocation,
  native?: boolean
}

type Props<T extends Item = Item> = {
  routes: Array<T>
}

type Emits = {
  redirect(event: MouseEvent, item: LooseObject<Item>, index: number): unknown
}

type Mixins = UiMixin

type Slots = {
  default(): unknown,
  item(scope: { route: LooseObject<Item>, index: number } & LooseObject<Item>): unknown,
  separator(): unknown
}

type Breadcrumb = {
  new <T extends Item>(...args: any[]): VeuiDefineInstance<Props<T>, Emits, Slots, Mixins>
}

export default Breadcrumb
