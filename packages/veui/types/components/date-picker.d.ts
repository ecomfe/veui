import { VeuiDefineInstance, } from '../common/context'
import { UiMixin, ControllableMixin, InputMixin, DropdownMixin } from '../common/mixins'
import { Props as CalendarProps, Day } from './calendar'

type PickedKeys = 'type' | 'weekStart' | 'fillMonth' | 'today' | 'disabledDate' | 'dateClass'

type Props = ({
  range: true
  selected?: [Date, Date]
  placeholder?: [string, string]
} | {
  range?: false
  selected?: Date
  placeholder?: string
}) & {
  clearable?: boolean
  format?: string | ((date: Date) => string)
  parse?: (date: string) => Date
  shortcuts?: Array<{label: string, from?: number | Record<any, any>, to?: number | Record<any, any>}>
} & Pick<CalendarProps, PickedKeys>

type Emits = {
  selectstart(picking: Date): unknown
  selectprogress(picking: [Date, Date]): unknown
}

type Mixins = [UiMixin, InputMixin, DropdownMixin, ControllableMixin<{
  select(value: Date | [Date, Date]): unknown
}>]

type Slots = {
  date(date: Day): unknown
}

type DatePicker = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default DatePicker
