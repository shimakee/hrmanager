import LandingPage from '../components/views/landingPage';
import Login from '../components/landingPage/login';
import Signup from '../components/landingPage/signup';
import {store} from '../store/store';

//lazy load
import Reset from '../components/landingPage/reset';

import Home from '../components/views/home';
import Profile from '../components/home/profile/profile';
import Posts from '../components/home/profile/post';

import Settings from '../components/settings/settings';
import ChangePassword from '../components/settings/account/changePassword';
import ChangeUsername from '../components/settings/account/changeUsername';
import DeleteAccount from '../components/settings/account/deleteAccount';
import EditProfile from '../components/settings/editProfile';
import EditRelatives from '../components/settings/editRelatives';
import Address from '../components/settings/address/address';
import EditContacts from '../components/settings/editContacts';
import EditGov from '../components/settings/editGov';

export const routes = [
    {path:'/', component: LandingPage,
        beforeEnter:(to, from, next)=>{
            const token = store.getters.hasToken;
            const localToken = localStorage.getItem('token');

            if(token || localToken){
                next({name:'home'});
            }else{
                next();
            }
        },
        children:[
            {path:'/', redirect:'/login'},
            {path:'/login', name:'login', component: Login},
            {path:'/signup', name:'signup', component: Signup},
            {path:'/reset', name:'reset', component: Reset},
        ]
    },
    {path:'/home', component: Home,
        beforeEnter:(to, from, next)=>{
            const token = store.getters.hasToken;
            const localToken = localStorage.getItem('token');

            if(token || localToken){
                next();
            }else{
                next({name: 'login'});
            }
        },
        children:[
            {path:'/', name:'home', redirect:'profile'},
            {path:'profile', component: Profile,
                children:[
                    {path:"/", name:"post", component: Posts}
                ]
            }
        ]
    },
    {path:'/settings', component: Settings, 
        children:[
            {path:'/', name:'settings', redirect:'account'},
            {path:'account', name:'account', components:{default: ChangeUsername, 
                                                        changePassword: ChangePassword,
                                                        deleteAccount: DeleteAccount,
                                                        editProfile: EditProfile,
                                                        editRelatives: EditRelatives,
                                                        editAddress: Address,
                                                        editContacts: EditContacts,
                                                        editGov: EditGov
                                                        }},
        ]
    },
    {path:'*', redirect:'/home'}
];