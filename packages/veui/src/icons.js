import Icon from './components/Icon'

if (process.env.THEME_PACKAGE === 'veui-theme-x') {
  const icons = require('veui-theme-x/assets/icons').default
  Icon.register(icons)
} else if (process.env.THEME_PACKAGE === 'veui-theme-dux') {
  const icons = require('veui-theme-dux/assets/icons').default
  Icon.register(icons)
}
