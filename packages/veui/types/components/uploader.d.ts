import {
  VeuiDefineComponent,
  LooseObject,
  VeuiDefineInstance,
  UiMixin,
  InputMixin
} from '../common'
import { PreviewOptions } from './lightbox'

type Item = {
  name: string
  src: string
}

type Validity = LooseObject<
  { valid: true } | { valid: false; message?: string }
>

type UploadResult = LooseObject<
  | {
      success: true
      name: string
      src: string
    }
  | {
      success: false
      message: string
    }
>

type CustomCallbacks = {
  onload: (result: UploadResult) => void
  onprogress: (progress: { loaded: number; total: number }) => void
  oncancel: () => void
  onerror: (error: { message: string }) => void
}

type CancelFn = () => void

type ControlItem = LooseObject<{
  name: string
  label: string
  icon: string
  disabled?: boolean
}>

type FileInfo = LooseObject<{
  name: string
  src: string
  status: string
}>

type PickedFile = {
  name: string
  type: string
  src: string
  poster?: string
  alt?: string
  size?: number
}

type WithKeyField<
  T,
  KeyField extends string,
  UseArray extends boolean
> = KeyField extends keyof T
  ? T[KeyField] extends string
    ? UseArray extends true
      ? Array<T>
      : T
    : never
  : never

type Props<T extends Item, KeyField extends string> = (
  | {
      multiple: true
      value?: WithKeyField<T, KeyField, true>
    }
  | {
      multiple?: false
      value?: WithKeyField<T, KeyField, false>
    }
) & {
  name?: string
  type?: 'file' | 'media' | 'image' | 'video'
  action?: string
  headers?: Record<string, string>
  withCredentials?: boolean
  requestMode?: 'xhr' | 'iframe' | 'custom'
  iframeMode?: string
  callbackNamespace?: string
  dataType?: 'json' | 'text'
  accept?: string
  validator?: (file: File) => Validity | Promise<Validity>
  maxCount?: number
  maxSize?: number | string
  payload?: Record<string, unknown>
  autoupload?: boolean
  order?: 'prepend' | 'append'
  sortable?: boolean
  pickerPosition?: 'before' | 'after' | 'none' | 'top'
  keyField?: KeyField
  convertResponse?: ((data: unknown) => UploadResult) &
    ((data: null | undefined, err: Error) => UploadResult)
  upload?: (file: File, callbacks: CustomCallbacks) => CancelFn
  pick?: (restCount: number) => Promise<PickedFile[] | PickedFile>
  validityDisplay?: 'popup' | 'inline'
  help?: string
  helpPosition?: 'side' | 'bottom'
  pickerLabel?: string
  pickerIcon?: string | Record<keyof any, unknown>
  controls?: (
    file: FileInfo,
    controls: Array<ControlItem>
  ) => Array<ControlItem>
  entries?: (controls: Array<ControlItem>) => Array<ControlItem>
  afterPick?: (files: Array<File>) => void
  previewOptions?: PreviewOptions
}

type LooseItem = LooseObject<Item>

type ErrorInfo = {
  file?: FileInfo // 超过 max-count 这个字段为空。
  errors: Array<{
    type: string
    value: unknown
    message: string
  }>
}

type Emits = {
  change(value: LooseItem | Array<LooseItem>): void
  invalid(error: ErrorInfo): void
  progress(file: FileInfo, index: number, event: ProgressEvent): void
  remove(file: FileInfo, index: number): void
  success(file: FileInfo, index: number): void
  failure(file: FileInfo, index: number): void
  statuschange(status: 'empty' | 'uploading' | 'failure' | 'success'): void
}

type Mixins = [UiMixin, InputMixin]

type SlotProps = FileInfo & { index: number }

type Slots = {
  upload(): unknown
  help(): unknown
  file(slotProps: SlotProps): unknown
  'file-before'(slotProps: SlotProps): unknown
  'file-after'(slotProps: SlotProps): unknown
  uploading(slotProps: SlotProps): unknown
  failure(slotProps: SlotProps): unknown

  /** @deprecated */
  'button-label'(): unknown
  /** @deprecated */
  desc(): unknown
}

type Methods = {
  startUpload(): void
}

type Uploader = VeuiDefineComponent<{
  new <T extends Item = Item, KeyField extends string = 'key'>(
    ...args: any[]
  ): VeuiDefineInstance<Props<T, KeyField>, Emits, Slots, Mixins, Methods>
}>

export default Uploader
