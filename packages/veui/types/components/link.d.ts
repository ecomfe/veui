import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'
import { RawLocation } from 'vue-router'

export type To = string | RawLocation

export type Props = {
  to: To,
  native?: boolean,
  replace?: boolean,
  fallback?: string,
  disabled?: boolean,
  rel?: string,
  target?: string
}

type Emits = {
  click(e: MouseEvent): unknown
}

type Mixins = UiMixin

type Slots = {
  default(): unknown
}

type Link = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Link
