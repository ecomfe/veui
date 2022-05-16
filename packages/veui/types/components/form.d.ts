import { VeuiDefineComponent, VeuiDefineInstance, UiMixin } from '../common'

type Validities = boolean | undefined | Record<any, unknown>

type ValidiateFn = (submitData: Record<any, unknown>) => Validities

type ValidatorItem = {
  fields: Array<string>
  validate: (...args: any[]) => Validities
  triggers?: string | Array<string>
}

type Props = {
  validators?: Array<ValidatorItem>
  beforeValidate?: ValidiateFn
  afterValidate?: ValidiateFn
  disabled?: boolean
  readonly?: boolean
  data?: Record<any, unknown>
}

type Emits = {
  submit(data: Record<any, unknown>, evt: Event): void
  invalid(errors: Record<any, unknown>): void
}

type Mixins = UiMixin

type Slots = {
  default(): unknown
  actions(slotProps: { submit: () => unknown }): unknown
}

type InputValidity = {
  status: 'success' | 'warning' | 'error'
  message: string
}

type Methods = {
  submit(): void
  validate(
    fieldNames?: Array<string> | null
  ): Promise<boolean | Record<string, Record<any, unknown>>>
  clearValidities(fieldNames?: Array<string> | null): void
  setValidities(validities: Record<string, string | InputValidity>): void
}

type Form = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins, Methods>
}>

export default Form
