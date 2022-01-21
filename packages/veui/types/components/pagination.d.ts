import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  LinkTo,
  UiMixin
} from '../common'

type Props = {
  page?: number
  pageSize?: number
  pageSizes?: Array<number>
  total?: number
  to?: LinkTo
  native?: boolean
  /**
   * @deprecated
   */
  goto?: boolean
  showGoto?: boolean
  showPageSize?: boolean
  showTotal?: boolean
}

type Emits = {
  pagesizechange(size: number): void
  redirect(page: number, evt: MouseEvent): void
}

type Mixins = UiMixin

type Slots = {}

type Pagination = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Pagination
