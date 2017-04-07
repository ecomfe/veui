import Button from './Button'
import Pager from './Pager'
import UploaderIframe from './Uploader-iframe'
import Uploader from './Uploader'

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
  },
  {
    path: '/uploader-iframe',
    name: 'UploaderIframe',
    component: UploaderIframe
  },
  {
    path: '/uploader',
    name: 'Uploader',
    component: Uploader
  }
]
