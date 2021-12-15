import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'
import { To } from './link'

type Props = {
  page?: number,
  pageSize?: number,
  pageSizes?: Array<number>,
  total?: number,
  to?: To,
  native?: boolean,
  goto?: boolean,
  showGoto?: boolean,
  showPageSize?: boolean,
  showTotal?: boolean
}

type Emits = {
  pagesizechange(size: number): unknown,
  redirect(page: number, evt: MouseEvent): unknown
}

type Mixins = UiMixin

type Slots = {}

type Pagination = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Pagination
