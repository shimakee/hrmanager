import LandingPage from '../components/landingPage/landingPage';
import Reset from '../components/landingPage/reset';
import Login from '../components/landingPage/login';
import Signup from '../components/landingPage/signup';
import Register from '../components/landingPage/register';
import {store} from '../store/store';

import Error from '../components/views/errorPage'

//lazy load
import Home from '../components/home/home';
import Profile from '../components/home/accountType/profile';
import ProfileInfo from '../components/home/accountType/profile/profileInfo';
import ProfileActions from '../components/home/accountType/profile/profileActions';

import Company from '../components/home/accountType/company';
import Staff from '../components/home/accountType/staff';
import Posts from '../components/home/accountType/post';

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
            let accountType = store.getters.accountType; //check javascript for account type
            if(!accountType){ accountType = localStorage.getItem('accountType');} //check localstorage for account type

            if(token || localToken && accountType){
                next({name:'home'});//if already logged in - redirect to home page
            }else{
                next();
            }
        },
        children:[
            {path:'', name:'login', component: Login},
            {path:'/signup', name:'signup', component: Signup},
            {path:'/register', name:'register', component: Register},
            {path:'/reset', component: Reset,
                beforeEnter:(to, from, next)=>{
                    const resetToken = to.query.token;//check that it has query token
                    if(!resetToken){
                            next(from.path);//return previous path if no token
                    }else{
                        store.commit('setResetToken', resetToken); //commit reset token
                        next();
                    }
                }
            }
        ]
    }
    ,{path:'/',
        beforeEnter:(to, from, next)=>{
            const token = store.getters.hasToken;
            const localToken = localStorage.getItem('token');
            let accountType = store.getters.accountType; //check javascript for account type
            if(!accountType){ accountType = localStorage.getItem('accountType');} //check localstorage for account type

            if(token || localToken){//check auth
                next();
            }else{
                next({name: 'login'});//no auth return to login
            }
        },
        component: Home,
        children:[
            {path:'', name:'home', //index page - sort by account type - redirect
                beforeEnter:(to,from,next)=>{
                    let accountType = store.getters.accountType; //check javascript for account type
                    if(!accountType){ accountType = localStorage.getItem('accountType');} //check localstorage for account type
            
                    if(!accountType){
                        next({name:'error'});//no account type invalid login redirect to login
                    }else{

                        switch (accountType) { //push based on account type
                            case "profile":
                                next({name:'profile'});
                                break;

                            case "company":
                                next({name:'company'});
                                break;
                                
                            case "staff":
                                next({name:'staff'});
                                break;
                        
                            default:
                                next({name:'login'}); // no valid account type return to login
                                break;
                        }
                    }
                }
            },
            //==================================================PROFILE
            {path:'/profile', 
                beforeEnter:(to,from,next)=>{//TODO: only proceed if account type is profile
                    let accountType = store.getters.accountType; //check javascript for account type
                    if(!accountType){ accountType = localStorage.getItem('accountType');} //check localstorage for account type
            
                    if(!accountType || accountType !== 'profile'){
                        console.trace('account', accountType);
                        next({name:'login'});//no account type invalid login redirect to login
                    }else{
                        next();
                    }
                }, 
                components: {
                    default: Profile,
                    info: ProfileInfo,
                    actions: ProfileActions
                },
                children:[ //this is where the content goes - its children will be the content details
                    {path:"", name: "profile", //landing page for profile
                        components:{
                            default: ChangeUsername
                        }
                    },
                    {path:"settings", ///profile/settings - CONTENT
                        components:{
                            default: Settings,
                        },
                        children:[//TODO: to determine layout - this is where the content goes
                            {path:"", name:"profileSettings",///profile/settings - main page - CONTENT - details
                                components:{
                                    default: DeleteAccount, 
                                    changePassword: ChangePassword,
                                    deleteAccount: DeleteAccount,
                                    editProfile: EditProfile,
                                    editRelatives: EditRelatives,
                                    editAddress: Address,
                                    editContacts: EditContacts,
                                    editGov: EditGov
                                }
                            }
                        ]
                    }
                ]
            },
            //==================================================COMPANY
            {path:'/company', name:'company', component: Company //TODO: only proceed if account type is company
            },
            //==================================================STAFF
            {path:'/staff', name:'staff', component: Staff //TODO: only proceed if account type is staff
            },

            //these will be put to children
            {path:'/settings', component: Settings, //TODO: settings show based on account type
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
                    {path:'/', name:'settings', redirect:'account'},
                    {path:'account', name:'account', components:{default: ChangeUsername
                                                                }},
                ]
            }
        ]
    },
    ,{path:'/error', name: 'error', component: Error}
    ,{path:'*', redirect:'/'}

];