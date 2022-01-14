import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'
import { Item } from './breadcrumb'

type Props = Pick<Item, 'to' | 'type' | 'native'>

type Emits = {
  redirect(event: MouseEvent): unknown
}

type Mixins = UiMixin

type Slots = {
  default(): unknown
}

type BreadcrumbItem = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default BreadcrumbItem
