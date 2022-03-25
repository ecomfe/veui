import { VeuiDefineComponent, VeuiDefineInstance } from '../common'

type Props = {
  sticky?: boolean
  collapsible?: boolean
  collapsed?: boolean
  autocollapse?: boolean
  collapseMode?: 'slim' | 'hidden'
}

type Emits = {}

type Mixins = []

type Slots = {
  default(): unknown
}

type Sidebar = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Sidebar
