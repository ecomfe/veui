interface DialogManagerOptions {
  overlayClass?: string | Array<string> | Record<string, boolean>
  ok?(): Promise<void>
}

interface Statuses {
  status?: 'success' | 'warning' | 'info' | 'error'
  /** @deprecated */
  type?: 'success' | 'warning' | 'info' | 'error'
}

interface AlertDialogManager {
  show(
    content: string,
    title: string,
    options?: DialogManagerOptions & Statuses
  ): Promise<void>

  success(
    content: string,
    title: string,
    options?: DialogManagerOptions
  ): Promise<void>

  info(
    content: string,
    title: string,
    options?: DialogManagerOptions
  ): Promise<void>

  error(
    content: string,
    title: string,
    options?: DialogManagerOptions
  ): Promise<void>

  warn(
    content: string,
    title: string,
    options?: DialogManagerOptions
  ): Promise<void>
}

interface ConfirmDialogManager<R> {
  show(
    content: string,
    title: string,
    options?: DialogManagerOptions & {
      cancel(): Promise<void>
    }
  ): Promise<R>
}

interface ToastOptions {
  duration?: number
}

interface ToastDialogManager {
  show(message: string, options?: ToastOptions & Statuses): void

  success(message: string, options?: ToastOptions): void

  info(message: string, options?: ToastOptions): void

  error(message: string, options?: ToastOptions): void

  warn(message: string, options?: ToastOptions): void
}

export declare const alert: AlertDialogManager
export declare const confirm: ConfirmDialogManager<boolean>
export declare const prompt: ConfirmDialogManager<string | null>
export declare const toast: ToastDialogManager

interface RuleOptions {
  validate(value: unknown, ruleValue: unknown): boolean
  message: string | ((value: unknown, ruleValue: unknown) => string)
  priority: number
}

declare class RuleManager {
  addRule(name: string, ruleOptions: RuleOptions): void
}

export declare const validation: RuleManager

interface ConfigManager {
  defaults(key: string, value: unknown, ns?: string): void
  defaults(values: Record<string, unknown>, ns?: string): void

  set(key: string, val: unknown, ns?: string): void
  set(values: Record<string, unknown>, ns?: string): void

  get(path: string): unknown
}

interface EnumPropDef {
  values: string[]
  default?: string
}

interface BooleanPropDef {
  boolean: true
}

type PropDef = { inherited?: boolean } & (EnumPropDef | BooleanPropDef)
type IconDef = string | unknown
type IllustrationDef = unknown
type PartDef = string | ((props: Record<string, unknown>) => string)

interface PropDefs {
  [key: string]: PropDef
}

interface IconDefs {
  [key: string]: IconDef
}

interface IllustrationDefs {
  [key: string]: IllustrationDef
}

interface PartDefs {
  [key: string]: PartDef
}

type UIConfigKey = 'ui' | 'icons' | 'illustrations' | 'parts'

type UIConfigMap<K extends UIConfigKey> = K extends 'ui'
  ? PropDefs
  : K extends 'icons'
  ? IconDefs
  : K extends 'illustrations'
  ? IllustrationDefs
  : K extends 'parts'
  ? PartDefs
  : never

type EnsureKey<T, U> = U extends string
  ? T extends UIConfigKey
    ? T
    : never
  : `${string}.${UIConfigKey}`

type GetConfigKey<T> = T extends `${string}.${infer K}` ? K : never

type UISetter = (<T, U>(
  key: EnsureKey<T, U>,
  value: T extends UIConfigKey
    ? UIConfigMap<T>
    : T extends `${string}.${infer K extends UIConfigKey}`
    ? UIConfigMap<K>
    : never,
  ns?: (U & string) | undefined
) => void) &
  (<U>(
    values: U extends string
      ? {
          [K in UIConfigKey]?: UIConfigMap<K>
        }
      : {
          [K in `${string}.${UIConfigKey}`]?: UIConfigMap<GetConfigKey<K>>
        },
    ns?: (U & string) | undefined
  ) => void)

interface UIManager extends ConfigManager {
  defaults: UISetter
  set: UISetter
  addPropValue(component: string, prop: string, value: string): void
  setPropDefault(component: string, prop: string, value: string): void
  setProp(component: string, prop: string, propDef: PropDef): void
  setIcon(component: string, icon: string, iconDef: IconDef): void
  setIllustration(
    component: string,
    illustration: string,
    illustrationDef: IllustrationDef
  ): void
  setPart(component: string, part: string, partDef: PartDef): void
}

export declare const config: ConfigManager
export declare const ui: UIManager
