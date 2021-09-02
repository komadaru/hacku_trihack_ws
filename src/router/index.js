import { createRouter, createWebHistory } from 'vue-router'
import Firstpage from '../views/Firstpage.vue'
import Login from '../components/Login.vue'
import Signup from '../components/Signup.vue'
import Mypage from '../components/Mypage.vue'
import Make_community from '../components/Make_community.vue'
import Community from '../components/Community.vue'
import Discussion from '../components/Discussion.vue'

const routes = [
  {
    path: '/',
    name: 'Firstpage',
    component: Firstpage
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/mypage',
    name: 'Mypage',
    component: Mypage
  },
  {
    path: '/make_community',
    name: 'Make_community',
    component: Make_community
  },
  {
    path: '/community/:cid',
    name: 'Community',
    component: Community
  },
  {
    path: '/discussion/:did',
    name: 'Discussion',
    component: Discussion
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
