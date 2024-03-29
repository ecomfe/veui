import { VeuiDefineComponent, VeuiDefineInstance } from '../common'

type Props = {
  span?: number
  offset?: number
  pull?: number
  push?: number
}

type Emits = {}

type Mixins = []

type Slots = {
  default(): unknown
}

type GridColumn = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default GridColumn
