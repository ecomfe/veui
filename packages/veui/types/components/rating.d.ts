import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  InputMixin,
  ControllableMixin
} from '../common'

type Props = {
  max?: number
  value?: number
  labels?: Record<number, string> | ((value: number) => string)
  labelPosition?: 'inline' | 'popup'
  clearable?: boolean
  allowHalf?: boolean
}

type Emits = {}

type Mixins = [
  UiMixin,
  InputMixin,
  ControllableMixin<{
    change(value: number): void
  }>
]

type Slots = {
  symbol(item: { value: number }): unknown
  label(item: { value: number }): unknown
}

type Rating = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Rating
