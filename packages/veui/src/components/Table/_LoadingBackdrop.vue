<template>
<transition :name="$c('table-loading-backdrop')">
  <div
    v-if="table.loading"
    :class="$c('table-loading-backdrop')"
    aria-hidden="true"
  />
</transition>
</template>

<script>
import prefix from '../../mixins/prefix'
import table from '../../mixins/table'

export default {
  name: 'veui-table-loading-backdrop',
  mixins: [prefix, table]
}
</script>
