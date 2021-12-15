import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'
import { Matches, TabItem, Slots as TabSlots } from './tab'

type Props = {
  active?: string,
  matches?: Matches,
  addable?: boolean,
  max?: number,
  tip?: string,
  eager?: boolean,
  addLabel?: string
}

type Emits = {
  change(item: TabItem): unknown,
  remove(item: TabItem): unknown,
  add(): unknown
}

type Mixins = UiMixin

type Slots = {
  default(): unknown,
  'tab-item': TabSlots['item']
  'tab-label': TabSlots['label'],
  panel(): unknown,
  extra(): unknown
}

type Tabs = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Tabs
