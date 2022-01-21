import { VeuiDefineComponent, VeuiDefineInstance } from '../common'

type Slots = {
  default(): unknown
}

type Span = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<{}, {}, Slots, {}>
}>

export default Span
