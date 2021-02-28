import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Create from '../views/Create.vue'
import Login from '../views/Login.vue'

const history = createWebHistory()

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/about',
    component: About 
  },
  {
    path: '/create',
    component: Create 
  },
  {
    path: '/login',
    component: Login
  }
]

const router = createRouter({ 
  history, 
  routes, 
  linkActiveClass: 'active', 
//  linkExactActiveClass: 'exact-active' 
})

export default router
