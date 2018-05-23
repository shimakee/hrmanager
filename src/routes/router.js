import Home from '../../src/components/home'
import Login from '../../src/components/login'
import Signup from '../../src/components/signup'
import Settings from '../../src/components/settings'

export const routes = [
    {path:'', component: Home},
    {path:'/login', component: Login},
    {path:'/signup', component: Signup},
    {path:'/settings', component: Settings}
];