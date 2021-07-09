import Vue from 'vue'
import Router from 'vue-router'
// import NaviBar from '@/components/NaviBar'
import Mapview from '@/components/Mapview'
import Login from '@/components/Login'
import Signup from '@/components/Signup'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Mapview',
      component:Mapview
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    }
    
  ]
})
