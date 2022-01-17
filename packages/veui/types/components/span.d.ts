import { VeuiDefineInstance } from '../common'

type Slots = {
  default(): unknown
}

type Span = {
  new (...args: any[]): VeuiDefineInstance<{}, {}, Slots, {}>
}

export default Span
