import {store} from '../store/store';

import Error from '../components/views/errorPage'

//lazy load - TODO choose which one to lazy load

//Mother pages
import LandingPage from '../components/landingPage/landingPage';
import Home from '../components/home/home';
import Settings from '../components/settings/settings';

//Landingpage
import Reset from '../components/landingPage/components/reset';
import Login from '../components/landingPage/components/login';
import Signup from '../components/landingPage/components/signup';
import Register from '../components/landingPage/components/register';

//Home - others to do after profile
import Staff from '../components/home/accountType/staff';
import Default from '../components/home/accountType/default';

//Home - profile
import Profile from '../components/home/accountType/profile';
import ProfileInfo from '../components/home/accountType/profile/profileInfo';
import ProfileActions from '../components/home/accountType/profile/profileActions';
import ProfileDefault from '../components/home/accountType/profile/profileDefault';
    //Home - profile - settings
    import EditProfile from '../components/settings/editProfile';
    import EditRelatives from '../components/settings/editRelatives';
    import Address from '../components/settings/address/address';
    import EditContacts from '../components/settings/editContacts';
    import EditGov from '../components/settings/editGov';

//home - company
import Company from '../components/home/accountType/company';
import CompanyInfo from '../components/home/accountType/company/companyInfo';
import CompanyActions from '../components/home/accountType/company/companyActions';
import CompanyDefault from '../components/home/accountType/company/companyDefault';


//Settings -todo sort out
import ChangePassword from '../components/settings/account/changePassword';
import ChangeUsername from '../components/settings/account/changeUsername';
import DeleteAccount from '../components/settings/account/deleteAccount';
import EditPic from '../components/settings/account/editPic';

//add - on temporary
import Marketing from '../components/marketing/textblast';

//additional features
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
                beforeEnter:(to,from,next)=>{//only proceed if account type is profile
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
                            default: ProfileDefault
                        }
                    },
                    {path:"settings", ///profile/settings - CONTENT
                        components:{
                            default: Settings
                        },
                        children:[
                            {path:"", name:"profileSettings",///profile/settings - main page - CONTENT - details
                                components:{
                                    default: DeleteAccount,
                                    editPic: EditPic,
                                    changeUsername: ChangeUsername,
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
                    },
                    {path:"marketing",
                        components:{
                            default: Marketing
                        }
                    }
                ]
            },
            //==================================================COMPANY
            {path:'/company',  
                beforeEnter:(to,from,next)=>{//only proceed if account type is company
                    let accountType = store.getters.accountType; //check javascript for account type
                    if(!accountType){ accountType = localStorage.getItem('accountType');} //check localstorage for account type
            
                    if(!accountType || accountType !== 'company'){
                        console.trace('account', accountType);
                        next({name:'login'});//no account type invalid login redirect to login
                    }else{
                        next();
                    }
                }, 
                components: {
                    default: Company,
                    info: CompanyInfo,
                    actions: CompanyActions
                },
                children:[ //this is where the content goes - its children will be the content details
                    {path:"", name: "company", //landing page for profile
                        components:{
                            default: CompanyDefault
                        }
                    },
                    {path:"settings", ///profile/settings - CONTENT
                        components:{
                            default: Settings
                        },
                        children:[
                            {path:"", name:"profileSettings",///profile/settings - main page - CONTENT - details
                                components:{
                                    default: DeleteAccount,
                                    editPic: EditPic,
                                    changeUsername: ChangeUsername,
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
                    },
                    {path:"marketing",
                        components:{
                            default: Marketing
                        }
                    }
                ]
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