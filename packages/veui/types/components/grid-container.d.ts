import { VeuiDefineInstance } from '../common/context'

type Props = {
  width?: number,
  columns?: number,
  gutter?: number,
  margin?: number
}

type Emits = {}

type Mixins = []

type Slots = {
  default(): unknown
}

type GridContainer = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default GridContainer
