import { VeuiDefineInstance } from '../common/context'
import { UiMixin, InputMixin, ControllableMixin } from '../common/mixins'

type Selected = Date | Array<Date>

type SelectedAndMultiple = ({
  multiple: true
  selected?: Array<Date>
} | {
  multiple?: false
  selected?: Date
})

export type Props = SelectedAndMultiple & {
  type?: 'date' | 'month' | 'year'
  panel?: number
  today?: Date
  weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  range?: boolean
  fillMonth?: boolean
  disabledDate?: (date: Date, picking?: Date) => boolean
  dateClass?: unknown
}

export type Day = {
  year: number
  month: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
  date: number
}

type Emits = {
  viewchange(monthInfo: Pick<Day, 'year' | 'month'> & { index: number }): unknown
  selectstart(selected: Date): unknown
  selectprogress(picking: [Date, Date] | Array<[Date, Date]>): unknown
}

type Mixins = [UiMixin, InputMixin, ControllableMixin<{
  select(selected: Selected): unknown
}>]

type Slots = {
  default(): unknown
  date(day: Day): unknown
  default(): unknown
}

type Calendar = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Calendar
