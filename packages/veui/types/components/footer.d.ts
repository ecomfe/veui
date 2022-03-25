import { VeuiDefineComponent, VeuiDefineInstance } from '../common'

type Props = {
  sticky?: boolean
}

type Emits = {}

type Mixins = []

type Slots = {
  default(): unknown
}

type Footer = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Footer
