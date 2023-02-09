import { VeuiDefineComponent, VeuiDefineInstance } from '../common'

type Props = {
  direction?: 'row' | 'column'
  wrap?: boolean
  inline?: boolean
  align?: 'start' | 'end' | 'center' | 'stretch'
  justify?: 'start' | 'end' | 'center' | 'space-between'
  gap?: number | string
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
