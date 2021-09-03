import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Make_community from '../views/Make_community.vue'
import User from '../views/User.vue'
import Community from '../views/Community.vue'
import Discussion from '../views/Discussion.vue'
import Top from '../views/Top.vue'
import Prof from '../views/Prof.vue'
import ComList from '../views/ComList.vue'
import Firstpage from '../views/Firstpage.vue'


const routes = [
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
    component: User
  },
  {
    path: '/user',
    name: 'User',
    component: User
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
  },
  {
    path: '/',
    name: 'Top',
    component: Top
  },
  {
    path: '/comlist',
    name: 'ComList',
    component: ComList
  },
  {
    path: '/prof',
    name: 'Prof',
    component: Prof
  },
  {
    path: '/firstpage',
    name: 'Firstpage',
    component: Firstpage
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
