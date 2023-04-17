import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  ActivatableMixin,
  InputMixin,
  ControllableMixin
} from '../common'
import { TagEmits, TagProps } from './tag'

export type Props = {
  value?: Array<string>
  inputValue?: string
  placeholder?: string
  selectOnFocus?: boolean
  composition?: boolean
  clearable?: boolean
  maxlength?: number
  max?: number
  getLength?: (value: string) => number
  strict?: boolean
}

type Emits = {
  input(value: string): void
  clear(): void
  change(value: string): void
}

type Mixins = [
  UiMixin,
  ActivatableMixin,
  InputMixin,
  ControllableMixin<{
    input(inputValue: string): void
    change(value: Array<string>): void
  }>
]

type SlotProps = {
  tag: string
  index: number
  invalid: boolean
  readonly: boolean
  disabled: boolean
  key: string
  edit: () => void
  remove: () => void
  attrs: TagProps
  listeners: {
    [key: string]: (e: Event) => unknown
  } & TagEmits
}

type Slots = {
  placeholder(): unknown
  tag(slotProps: SlotProps): unknown
}

type TagInput = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default TagInput
