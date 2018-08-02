import LandingPage from '../components/landingPage/landingPage';
import Reset from '../components/landingPage/reset';
import Login from '../components/landingPage/login';
import Signup from '../components/landingPage/signup';
import {store} from '../store/store';

//lazy load
import Home from '../components/home/home';
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
import googlemaps from '../store/modules/googlemaps/googlemaps';

export const routes = [
    {path:'/login', component: LandingPage,
        beforeEnter:(to, from, next)=>{//check authentication status
            const token = store.getters.hasToken;
            const localToken = localStorage.getItem('token');

            if(token || localToken){
                next({name:'home'});//if already logged in - redirect to home page
            }else{
                next();
            }
        },
        children:[
            {path:'/', name:'login', component: Login},
            {path:'/signup', name:'signup', component: Signup},
            {path:'/reset', component: Reset,
                beforeEnter:(to, from, next)=>{
                    const resetToken = to.query.token;//check that it has query token
                    if(!resetToken){
                            next(from.path);//return previous path
                    }else{
                        store.commit('setResetToken', resetToken); //commit reset token
                        next();
                    }
                }
            }
        ]
    }
    ,{path:'/', component: Home,
        beforeEnter:(to, from, next)=>{
            const token = store.getters.hasToken;
            const localToken = localStorage.getItem('token');

            if(token || localToken){//check auth
                next();
            }else{
                next({name: 'login'});//no auth return to login
            }
        },
        children:[
            {path:'', name:'home', redirect:'profile'},
            {path:'/profile', component: Profile,
                children:[
                    {path:"/", name:"post", component: Posts}
                ]
            },
            {path:'/settings', component: Settings, 
                beforeEnter:(to, from, next)=>{
                    const token = store.getters.hasToken;
                    const localToken = localStorage.getItem('token');

                    
                    console.log('query', to.query);

                    if(token || localToken){//check auth
                        next();
                    }else{
                        next({name: 'login'});//no auth return to login
                    }
                },
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
            }
        ]
    },
    ,{path:'*', redirect:'/'}
];