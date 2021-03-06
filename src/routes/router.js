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
import Actions from '../components/home/accountType/actions';
import Info from '../components/home/accountType/info';
import Gallery from '../components/home/accountType/common/gallery/gallery';
import GalleryShow from '../components/home/accountType/common/gallery/galleryShow';
import EmailShow from '../components/home/accountType/common/email/emailShow';

//common
import Explore from '../components/home/accountType/common/explore/explore';
import ExploreShow from '../components/home/accountType/common/explore/exploreShow';
import ContactDetail from '../components/home/accountType/common/contact/contactDetail';
import AddressDetail from '../components/home/accountType/common/address/addressDetail';

//Home - profile
import ProfileAccount from '../components/home/accountType/profile/profileAccount';
    //Home - profile - settings
    import EditProfile from '../components/home/accountType/profile/profileEdit';
    import EditRelatives from '../components/home/accountType/common/editRelatives';
    import Address from '../components/home/accountType/common/address/address';
    import AddressShow from '../components/home/accountType/common/address/addressShow';
    import AddressAdd from '../components/home/accountType/common/address/addressAdd';
    import Contact from '../components/home/accountType/common/contact/contact';
    import ContactShow from '../components/home/accountType/common/contact/contactShow';
    import ContactAdd from '../components/home/accountType/common/contact/contactAdd';
    import EditGov from '../components/home/accountType/common/editGov';

//home - company
import CompanyAccount from '../components/home/accountType/company/companyAccount';
    import EditCompany from '../components/home/accountType/company/companyEdit';

//Settings -todo sort out
import ChangePassword from '../components/settings/account/changePassword';
import ChangeUsername from '../components/settings/account/changeUsername';
import DeleteAccount from '../components/settings/account/deleteAccount';

//add - on temporary
import Marketing from '../components/marketing/textblast';
import Business from '../components/home/accountType/common/business/business';
import Employees from '../components/home/accountType/common/employees/employees';

//additional features
import googlemaps from '../store/modules/googlemaps/googlemaps';

export const routes = [
    {path:'/login', component: LandingPage,
        beforeEnter:(to, from, next)=>{//check authentication status
            const TOKEN = store.getters.getToken;
            const ACCOUNT_TYPE = store.getters.getAccountType;

            if(TOKEN && ACCOUNT_TYPE){
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
                    const RESET_TOKEN = to.query.token;//check that it has query token
                    if(!RESET_TOKEN){
                            next(from.path);//return previous path if no token
                    }else{
                        store.commit('setResetToken', RESET_TOKEN); //commit reset token
                        next();
                    }
                }
            }
        ]
    }
    ,{path:'/',
        beforeEnter:(to, from, next)=>{
            const TOKEN = store.getters.getToken;

            if(TOKEN){//check auth
                next();
            }else{
                next({name: 'login'});//no auth return to login
            }
        },
        component: Home,
        children:[
            {path:'', name:'home', //index page - sort by account type - redirect
                beforeEnter:(to,from,next)=>{
                    const TOKEN = store.getters.getToken;
                    const ACCOUNT_TYPE = store.getters.getAccountType;
            
                    if(!ACCOUNT_TYPE || !TOKEN){
                        next({name:'error'});//no account type invalid login redirect to login
                    }else{
                        switch (ACCOUNT_TYPE) { //push based on account type
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
                    const ACCOUNT_TYPE = store.getters.getAccountType;
            
                    if(!ACCOUNT_TYPE || ACCOUNT_TYPE !== 'profile'){
                        console.trace('account', ACCOUNT_TYPE);
                        next({name:'login'});//no account type invalid login redirect to login
                    }else{
                        next();
                    }
                }, 
                components: {
                    default: HomeContentContainer,
                    info: Info,
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
                        },children:[
                            {path: "",
                                components:{
                                    editProfile: EditProfile,
                                    editRelatives: EditRelatives,
                                    contact: Contact,
                                    contactAdd: ContactAdd,
                                    contactShow: ContactShow,
                                    editGov: EditGov
                                }
                            }
                        ]

                    },
                    {path:"gallery",
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
                    {path:"address",
                        component: Address,
                        props:{editable: true}
                        ,
                        children:[
                            {path: "",
                                components:{
                                    addressShow: AddressShow,
                                    addressAdd: AddressAdd
                                }
                            }
                        ]

                    },
                    {path:"explore",
                        components:{
                            default: Explore
                        }
                        ,
                        children:[
                            {path: "",
                                components:{
                                    default: ExploreShow,
                                },
                                children:[
                                    {path: "",
                                        components:{
                                            addressShow: AddressShow,
                                            contactShow: ContactShow,
                                            galleryShow: GalleryShow,
                                            emailShow: EmailShow
                                        }
                                    }
                                ]
                            }
                        ]

                    },
                    // {path:"contact", name:"contact",
                    //     components:{
                    //         default: Contact
                    //     }
                    //     ,
                    //     children:[
                    //         {path: "", name:"contact",
                    //             components:{
                    //                 contactShow: ContactShow,
                    //                 contactAdd: ContactAdd
                    //             }
                    //         }
                    //     ]

                    // },
                    {path:"settings", ///profile/settings - CONTENT
                        components:{
                            default: Settings
                        },
                        children:[
                            {path:"",///profile/settings - main page - CONTENT - details
                                components:{
                                    default: DeleteAccount,
                                    editPic: GalleryShow,
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
                    const ACCOUNT_TYPE = store.getters.getAccountType;
            
                    if(!ACCOUNT_TYPE || ACCOUNT_TYPE !== 'company'){
                        console.trace('account', ACCOUNT_TYPE);
                        next({name:'login'});//no account type invalid login redirect to login
                    }else{
                        next();
                    }
                }, 
                components: {
                    default: HomeContentContainer,
                    info: Info,
                    actions: Actions
                },
                children:[ //this is where the content goes - its children will be the content details
                    {path:"", name: "company", //landing page for company
                        components:{
                            default: HomeDefaulContent
                        }
                    },
                    {path:"account",
                        components:{
                            default: CompanyAccount
                        },children:[
                            {path: "",
                                components:{
                                    editCompany: EditCompany,
                                    contact: Contact,
                                    contactAdd: ContactAdd,
                                    contactShow: ContactShow,
                                    editGov: EditGov
                                }
                            }
                        ]

                    },
                    {path:"gallery",
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
                    {path:"address",
                        components:{
                            default: Address
                        }
                        ,
                        children:[
                            {path: "",
                                components:{
                                    addressShow: AddressShow,
                                    addressAdd: AddressAdd
                                }
                            }
                        ]

                    },
                    {path:"explore",
                        components:{
                            default: Explore
                        }
                        ,
                        children:[
                            {path: "",
                                components:{
                                    default: ExploreShow,
                                },
                                children:[
                                    {path: "",
                                        components:{
                                            addressShow: AddressShow,
                                            contactShow: ContactShow,
                                            galleryShow: GalleryShow,
                                            emailShow: EmailShow
                                        }
                                    }
                                ]
                            }
                        ]

                    },
                    {path:"settings", ///profile/settings - CONTENT
                        components:{
                            default: Settings
                        },
                        children:[
                            {path:"",///profile/settings - main page - CONTENT - details
                                components:{
                                    default: DeleteAccount,
                                    editPic: GalleryShow,
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
                    {path:"business", name: "business",
                        components:{
                            default: Business
                        }
                    },
                    {path:"employees", name: "employees",
                        components:{
                            default: Employees
                        }
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
                    const TOKEN = store.getters.getToken;

                    if(TOKEN){//check auth
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