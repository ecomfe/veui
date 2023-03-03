// keep `./components/index` in case of resolving to `./components.json`
export * from './components/index'

export { default as config } from './managers/config'
export { default as ui } from './managers/ui'
export { default as i18n } from './managers/i18n'
export { default as validation } from './managers/rule'
export { default as alert } from './managers/alert'
export { default as confirm } from './managers/confirm'
export { default as prompt } from './managers/prompt'
export { default as toast } from './managers/toast'

export { default as useControllable } from './mixins/controllable'
export { default as useSearchable } from './mixins/searchable'
export { useUi } from './mixins/ui'
export { useInput } from './mixins/input'

export {
  alert as $alert,
  confirm as $confirm,
  prompt as $prompt,
  toast as $toast
} from './plugins'

export * from './directives'
