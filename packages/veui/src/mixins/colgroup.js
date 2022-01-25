import { useParent } from './coupled'

export default useParent('colgroup', 'table-column', { childrenKey: 'columns' })
