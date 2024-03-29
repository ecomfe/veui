import { VeuiDefineComponent, VeuiDefineInstance, UiMixin } from '../common'
import { Item } from './breadcrumb'

type Props = Pick<Item, 'to' | 'type' | 'native'>

type Emits = {
  redirect(event: MouseEvent): unknown
}

type Mixins = UiMixin

type Slots = {
  default(): unknown
}

type BreadcrumbItem = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default BreadcrumbItem
