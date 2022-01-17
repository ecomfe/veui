import { VeuiDefineInstance, UiMixin } from '../common'

type RuleItem = {
  name: string
  priority?: number
  triggers?: string
  value?: unknown
  message?: string | ((ruleValue: unknown, value: unknown) => string)
}

type Props = {
  /**
   * 字段名称，一般可以传递在 `data` 中的路径，而忽略 `field`
   */
  name: string
  /**
   * 字段在 `data` 中的路径，一般和 `name` 不同时才需要传递
   */
  field?: string
  label?: string
  tip?: string
  disabled?: boolean
  readonly?: boolean
  rules?: string | Array<string | RuleItem>
}

type Emits = {}

type Mixins = UiMixin

type Slots = {
  default(): unknown
  label(): unknown
  tip(): unknown
}

type Field = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Field
