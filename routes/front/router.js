import Home from '../../src/components/home'
import Login from '../../src/components/login'

export const routes = [
    {path:'/', component: Home},
    {path:'', component: Home},
    {path:'login', component: Login},
    {path:'/login', component: Login}
];