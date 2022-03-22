import { VeuiDefineComponent, VeuiDefineInstance } from '../common'

type Props = {
  name: string | Record<keyof any, unknown>
  label?: string
  spin?: boolean
}

type Emits = {}

type Mixins = {}

type Slots = {
  default(): unknown
}

type Icon = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Icon
