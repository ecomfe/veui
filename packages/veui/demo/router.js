import Vue from 'vue'
import Router from 'vue-router'
import routes from './cases'

Vue.use(Router)

const router = new Router({
  mode:
    process.env.BASE_URL && process.env.BASE_URL !== '/' ? 'hash' : 'history',
  base: process.env.BASE_URL || '/',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: {
        name: 'home',
        render (h) {
          return h('article', [
            h('h1', 'Welcome to VEUI!'),
            h('p', '← Select a demo from the nav bar to get started.')
          ])
        }
      }
    },
    ...routes
  ]
})

router.beforeEach((to, _, next) => {
  let name = to.name === 'Home' ? '' : to.name
  document.title = `Veui${name} - demo`
  next()
})

export default router
