import { VeuiDefineInstance, UiMixin, InputMixin, ControllableMixin } from '../common'

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
  viewchange(monthInfo: Pick<Day, 'year' | 'month'> & { index: number }): void
  selectstart(selected: Date): void
  selectprogress(picking: [Date, Date] | Array<[Date, Date]>): void
}

type Mixins = [UiMixin, InputMixin, ControllableMixin<{
  select(selected: Selected): void
}>]

type Slots = {
  before(): unknown
  date(day: Day): unknown
  after(): unknown
}

type Calendar = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Calendar
