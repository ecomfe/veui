import { VeuiDefineInstance } from '../common/context'

type Slots = {
  default(): unknown
}

type Span = {
  new (...args: any[]): VeuiDefineInstance<{}, {}, Slots, {}>
}

export default Span
