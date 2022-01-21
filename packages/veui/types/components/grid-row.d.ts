import { VeuiDefineComponent, VeuiDefineInstance } from '../common'

type Props = {}

type Emits = {}

type Mixins = []

type Slots = {
  default(): unknown
}

type GridRow = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default GridRow
