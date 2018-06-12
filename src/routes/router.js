import landingPage from '../components/landingPage'
import Login from '../components/beforeAuth/login'
import Signup from '../components/beforeAuth/signup'

//lazy load
import Reset from '../components/beforeAuth/reset'

import Home from '../components/afterAuth/home'
import Settings from '../components/afterAuth/settings'

export const routes = [
    {path:'', component: landingPage},
    {path:'/login', component: Login},
    {path:'/reset', component: Reset},
    {path:'/signup', component: Signup},
    {path:'/index', component: Home},
    {path:'/home', component: Home},
    {path:'/settings', component: Settings},
];