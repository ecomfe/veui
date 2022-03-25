import { VeuiDefineComponent, VeuiDefineInstance } from '../common'

type Props = {
  direction?: 'column' | 'row'
}

type Emits = {}

type Mixins = []

type Slots = {
  default(): unknown
}

type Layout = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Layout
