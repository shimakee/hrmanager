import LandingPage from '../components/views/landingPage';
import Login from '../components/landingPage/login';
import Signup from '../components/landingPage/signup';

//lazy load
import Reset from '../components/landingPage/reset';

import Home from '../components/views/home'
import Settings from '../components/views/settings'

export const routes = [
    {path:'', component: LandingPage},
    // {path:'/login', component: Login},
    // {path:'/reset', component: Reset},
    // {path:'/signup', component: Signup},
    {path:'/index', component: Home},
    {path:'/home', component: Home},
    {path:'/settings', component: Settings},
];