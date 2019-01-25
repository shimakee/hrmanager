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
import HomeContentContainer from '../components/home/accountType/homeContentContainer';
import HomeDefaulContent from '../components/home/accountType/common/homeDefaultContent';
import Actions from '../components/home/accountType/common/actions';
import Gallery from '../components/home/accountType/common/gallery/gallery';

//Home - profile
import ProfileInfo from '../components/home/accountType/profile/profileInfo';
import ProfileAccount from '../components/home/accountType/profile/profileAccount';
    //Home - profile - settings
    import EditProfile from '../components/home/accountType/profile/editProfile';
    import EditRelatives from '../components/home/accountType/common/editRelatives';
    import Address from '../components/home/accountType/common/address/address';
    import Contact from '../components/home/accountType/common/contact/contact';
    import EditGov from '../components/home/accountType/common/editGov';

//home - company
import CompanyInfo from '../components/home/accountType/company/companyInfo';


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
            // const token = store.getters.hasToken;
            // const localToken = localStorage.getItem('token');
            // let accountType = store.getters.accountType; //check javascript for account type
            // if(!accountType){ accountType = localStorage.getItem('accountType');} //check localstorage for account type

            // if(token || localToken && accountType){
            //     next({name:'home'});//if already logged in - redirect to home page
            // }else{
                next();
            // }
        },
        children:[
            {path:'', name:'login', component: Login},
            {path:'/signup', name:'signup', component: Signup},
            {path:'/register', name:'register', component: Register},
            {path:'/reset', component: Reset,
                beforeEnter:(to, from, next)=>{
                    // const resetToken = to.query.token;//check that it has query token
                    // if(!resetToken){
                    //         next(from.path);//return previous path if no token
                    // }else{
                    //     store.commit('setResetToken', resetToken); //commit reset token
                        next();
                    // }
                }
            }
        ]
    }
    ,{path:'/',
        beforeEnter:(to, from, next)=>{
            // const token = store.getters.hasToken;
            // const localToken = localStorage.getItem('token');
            // let accountType = store.getters.accountType; //check javascript for account type
            // if(!accountType){ accountType = localStorage.getItem('accountType');} //check localstorage for account type

            // if(token || localToken){//check auth
                next();
            // }else{
            //     next({name: 'login'});//no auth return to login
            // }
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
                    // let accountType = store.getters.accountType; //check javascript for account type
                    // if(!accountType){ accountType = localStorage.getItem('accountType');} //check localstorage for account type
            
                    // if(!accountType || accountType !== 'profile'){
                    //     console.trace('account', accountType);
                    //     next({name:'login'});//no account type invalid login redirect to login
                    // }else{
                        next();
                    // }
                }, 
                components: {
                    default: HomeContentContainer,
                    info: ProfileInfo,
                    actions: Actions
                },
                children:[ //this is where the content goes - its children will be the content details
                    {path:"", name: "profile", //landing page for profile
                        components:{
                            default: HomeDefaulContent
                        }
                    },
                    {path:"account",
                        components:{
                            default: ProfileAccount
                        }
                        ,
                        children:[
                            {path: "", 
                                components:{
                                    editProfile: EditProfile,
                                    editRelatives: EditRelatives,
                    
                                    editAddress: Address,
                                    contact: Contact,
                                    editGov: EditGov,

                                    default: DeleteAccount,
                                    editPic: EditPic,
                                    changeUsername: ChangeUsername,
                                    changePassword: ChangePassword,
                                    deleteAccount: DeleteAccount,
                                }
                            }
                        ]

                    },
                    {path:"gallery", name:"gallery",
                        components:{
                            default: Gallery
                        }
                        // ,
                        // children:[
                        //     {path: "", name:"gallery",
                        //         components:{
                        //             default: HomeDefaulContent
                        //         }
                        //     }
                        // ]

                    },
                    {path:"address", name:"address",
                        components:{
                            default: Address
                        }
                        // ,
                        // children:[
                        //     {path: "", name:"address",
                        //         components:{
                        //             default: HomeDefaulContent
                        //         }
                        //     }
                        // ]

                    },
                    {path:"contact", name:"contact",
                        components:{
                            default: HomeDefaulContent
                        }
                        // ,
                        // children:[
                        //     {path: "", name:"address",
                        //         components:{
                        //             default: HomeDefaulContent
                        //         }
                        //     }
                        // ]

                    },
                    {path:"settings", ///profile/settings - CONTENT
                        components:{
                            default: Settings
                        },
                        children:[
                            {path:"",///profile/settings - main page - CONTENT - details
                                components:{
                                    default: DeleteAccount,
                                    editPic: EditPic,
                                    changeUsername: ChangeUsername,
                                    changePassword: ChangePassword,
                                    deleteAccount: DeleteAccount,
                                    editProfile: EditProfile,
                                    editRelatives: EditRelatives,
                                    editAddress: Address,
                                    contact: Contact,
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
                    default: HomeContentContainer,
                    info: CompanyInfo,
                    actions: Actions
                },
                children:[ //this is where the content goes - its children will be the content details
                    {path:"", name: "company", //landing page for profile
                        components:{
                            default: HomeDefaulContent
                        }
                    },
                    {path:"settings", ///profile/settings - CONTENT
                        components:{
                            default: Settings
                        },
                        children:[
                            {path:"", name:"companySettings",///profile/settings - main page - CONTENT - details
                                components:{
                                    default: DeleteAccount,
                                    editPic: EditPic,
                                    changeUsername: ChangeUsername,
                                    changePassword: ChangePassword,
                                    deleteAccount: DeleteAccount,
                                    editProfile: EditProfile,
                                    editRelatives: EditRelatives,
                                    editAddress: Address,
                                    contact: Contact,
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
            {path:'/staff', name:'staff', component: HomeContentContainer //TODO: only proceed if account type is staff
            },

            //these will be put to children
            {path:'/settings', component: Settings, //TODO: settings show based on account type
                beforeEnter:(to, from, next)=>{
                    // const token = store.getters.hasToken;
                    // const localToken = localStorage.getItem('token');

                    // if(token || localToken){//check auth
                        next();
                    // }else{
                    //     next({name: 'login'});//no auth return to login
                    // }
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