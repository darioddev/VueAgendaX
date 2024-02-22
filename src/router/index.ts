import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta : { title: 'Home' },
      component: () => import('@/views/CalendarView.vue')
    },
    {
      path: '/calendario',
      name: 'calendar',
      meta : { title: 'Calendario' },
      component: () => import('@/views/CalendarView.vue')
    },
    {
      path: '/eventos',
      name: 'tasks',
      meta : { title: 'Eventos' },
      component: () => import('@/views/TaskView.vue')      
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string
  next()
})

export default router
