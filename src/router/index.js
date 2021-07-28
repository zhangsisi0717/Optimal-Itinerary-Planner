import Vue from 'vue'
import Router from 'vue-router'
// import NaviBar from '@/components/NaviBar'
import Mapview from '@/components/Mapview'
// import Login from '@/components/Login'
// import Signup from '@/components/Signup'
import Main from '@/pages/Main'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import ResultMapview from '@/pages/ResultMapview'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name:"Main",
      component:Main
    },
    {
      path: '/mapview',
      name: 'Mapview',
      component:Mapview
    },
    {
      path: '/loginPage',
      name: 'LoginPage',
      component: LoginPage
    },
    {
      path: '/signuppage',
      name: 'SignupPage',
      component: SignupPage
    }
    ,
    {
      path: '/resultmapview',
      name: 'ResultMapview',
      component: ResultMapview
    }
    
  ]
})
