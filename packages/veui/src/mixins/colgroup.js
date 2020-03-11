import { getTypedAncestorTracker } from '../utils/helper'
import { findIndex } from 'lodash'
import '../common/uiTypes'

export default {
  uiTypes: ['colgroup'],
  data () {
    return {
      columns: []
    }
  },
  computed: getTypedAncestorTracker('colgroup').computed,
  methods: {
    addColumn (col) {
      let length = this.columns.length
      let index = col.index
      if (index >= length) {
        this.columns.push(col)
      } else {
        this.columns.splice(index, 0, col)
      }
    },
    removeColumnById (id) {
      this.columns.splice(
        findIndex(this.columns, col => col.id === id),
        1
      )
    }
  }
}
