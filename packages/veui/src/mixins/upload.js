import { pick } from 'lodash'

export const PUBLIC_FILE_PROPS = ['name', 'src', 'type', 'poster']

export const sharedProps = ['type', 'controls', 'icons', 'realUi', 'uiProps', 'uiParts', 'entries', 'pickerPosition', 'requestMode']

export default {
  // TODO: the provide and inject bindings are NOT reactive
  inject: sharedProps,
  props: {
    files: Array,
    addable: Boolean,
    disabled: Boolean
  },
  methods: {
    getScopeValue (index, file) {
      return {
        index,
        ...file._extra,
        ...pick(file, PUBLIC_FILE_PROPS),
        status: file.status
      }
    }
  }
}
