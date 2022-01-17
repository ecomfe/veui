import { VeuiDefineInstance, UiMixin, RouteMatches } from '../common'
import { TabItem, Slots as TabSlots } from './tab'

type Props = {
  active?: string
  matches?: RouteMatches
  addable?: boolean
  max?: number
  tip?: string
  eager?: boolean
  addLabel?: string
}

type Emits = {
  change(item: TabItem): void
  remove(item: TabItem): void
  add(): void
}

type Mixins = UiMixin

type Slots = {
  default(): unknown
  'tab-item': TabSlots['item']
  'tab-label': TabSlots['label']
  panel(): unknown
  extra(): unknown
}

type Tabs = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Tabs
