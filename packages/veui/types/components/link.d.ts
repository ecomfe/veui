import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  LinkTo
} from '../common'
import { AnchorHTMLAttributes } from '@vue/runtime-dom'

export type Props = {
  to: LinkTo
  native?: boolean
  fallback?: string
  disabled?: boolean
  rel?: AnchorHTMLAttributes['rel']
  target?: AnchorHTMLAttributes['target']

  /** @deprecated */
  replace?: boolean
}

type Emits = {
  click(e: MouseEvent): void
}

type Mixins = UiMixin

type Slots = {
  default(): unknown
}

type Link = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Link
