import { Promisify } from './utils'
import { ComponentPublicInstance, AllowedComponentProps } from '@vue/runtime-dom'
import { Route, RawLocation } from 'vue-router'

export type BeforeClose = (type: 'ok' | 'cancel') => Promisify<boolean | void>

type Side = 'top' | 'right' | 'bottom' | 'left'
type Align = 'start' | 'end'
export type OverlayPosition = 'auto' | Side | `${Side}-${Align}`

export type OverlayTarget = string | HTMLElement | ComponentPublicInstance | any // $refs.xxx 好像不能识别

export type OverlayClassAndStyle = {
  overlayClass?: AllowedComponentProps['class']
  overlayStyle?: AllowedComponentProps['style']
}

export type Status = 'success' | 'warning' | 'info' | 'error'

export type RouteMatches = (route: Route, to: Route) => boolean

export type LinkTo = string | RawLocation

export type InputTrim = boolean | 'start' | 'end' | 'both'



