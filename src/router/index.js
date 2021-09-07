import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Make_community from '../views/Make_community.vue'
import User from '../views/User.vue'
import Community from '../views/Community.vue'
import Make_discussion from '../views/Make_discussion.vue'
import Discussion from '../views/Discussion.vue'
import ComList from '../views/ComList.vue'


const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/user/:userId',
    name: 'User',
    component: User
  },
  {
    path: '/make_community',
    name: 'Make_community',
    component: Make_community
  },
  {
    path: '/community',
    name: 'Community',
    component: Community
  },
  {
    path: '/make_discussion/:cid',
    name: 'Make_discussion',
    component: Make_discussion
  },
  {
    path: '/discussion/:did',
    name: 'Discussion',
    component: Discussion
  },
  {
    path: '/comlist',
    name: 'ComList',
    component: ComList
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
