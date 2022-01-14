import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'

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
  submit(data: Record<any, unknown>, evt: Event): unknown
  invalid(errors: Record<any, unknown>): unknown
}

type Mixins = UiMixin

type Slots = {
  default(): unknown
  actions(slotProps: { submit: () => unknown }): unknown
}

type Methods = {
  submit(): void
  validate(fieldNames?: Array<string> | null): Promise<boolean | Record<string, Record<any, unknown>>>
}

type Form = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins, Methods>
}

export default Form
