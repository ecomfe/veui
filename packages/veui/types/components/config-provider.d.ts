import { VeuiDefineInstance } from '../common/context'

type Props = {
  value: Record<string, unknown>
}

type Emits = {}

type Mixins = []

type Slots = {
  default(): unknown
}

type ConfigProvider = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default ConfigProvider
