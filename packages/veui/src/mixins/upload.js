import { pick } from 'lodash'

const PUBLIC_FILE_PROPS = ['name', 'src', 'type', 'poster']

export default {
  props: {
    type: String,
    controls: Function,
    files: Array,
    entries: Function,
    addable: Boolean,
    disabled: Boolean,
    pickerPosition: String,
    requestMode: String
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
