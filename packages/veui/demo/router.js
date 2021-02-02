import Vue from 'vue'
import Router from 'vue-router'
import routes from './cases'
import FormExperiment from './cases/FormExperiment'

Vue.use(Router)

const router = new Router({
  mode:
    process.env.BASE_URL && process.env.BASE_URL !== '/' ? 'hash' : 'history',
  base: process.env.BASE_URL || '/',
  routes: [
    {
      path: '/',
      name: 'Empty',
      component: {
        name: 'empty',
        render (h) {
          return h('article', [
            h('h1', 'Welcome to VEUI!'),
            h('p', '← Select a demo from the nav bar to get started.')
          ])
        }
      }
    },
    {
      path: '/form-experiment',
      name: 'FormExperiment',
      component: FormExperiment
    },
    ...routes
  ]
})

router.beforeEach((to, from, next) => {
  let name = to.name === 'Empty' ? '' : to.name
  document.title = `Veui${name} - demo`
  next()
})

export default router
