import { VeuiDefineComponent, VeuiDefineInstance } from '../common'

type Props = {
  value: Record<string, unknown>
}

type Emits = {}

type Mixins = []

type Slots = {
  default(): unknown
}

type ConfigProvider = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default ConfigProvider
