import Vue from 'vue'
import Router from 'vue-router'
import routes from '../component-routes'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Empty',
      component: {
        name: 'empty',
        render (h) {
          return h(
            'article',
            [
              h('h1', 'Welcome to VEUI!'),
              h('p', '← Select a demo from the nav bar to get started.')
            ]
          )
        }
      }
    },
    ...routes
  ]
})
