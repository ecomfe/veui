import Button from './Button'
import Pager from './Pager'

export default [
  {
    path: '/button',
    name: 'Button',
    component: Button
  },

  {
    path: '/pager/:pageNo',
    name: 'Pager',
    params: {
      pageNo: 0
    },
    component: Pager
  }
]
