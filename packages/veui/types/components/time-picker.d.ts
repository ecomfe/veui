import { VeuiDefineInstance } from '../common/context'
import { UiMixin, InputMixin, DropdownMixin, ControllableMixin } from '../common/mixins'

type Mode = 'hour' | 'minute' | 'second'

type Props = {
  value?: string
  hours?: Array<number>
  minutes?: Array<number>
  seconds?: Array<number>
  placeholder?: string
  mode?: Mode
  min?: string
  max?: string
  autofocus?: boolean
  clearable?: boolean
}

type Emits = {
  clear(): unknown
  change(value: string): unknown
}

type Mixins = [UiMixin, InputMixin, DropdownMixin, ControllableMixin<{
  input(value: string): unknown
}>]

type Slots = {
  option(slotProps: { label: string, value: number, disabled?: boolean, part: Mode }): unknown
}

type TimePicker = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default TimePicker
