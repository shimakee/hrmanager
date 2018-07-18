import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../axios-auth';
// import axios from '../axios';
import signup from './modules/beforeAuth/signup';//importing modules
import reset from './modules/beforeAuth/reset';//importing modules
import login from './modules/beforeAuth/login';//importing modules
import logout from './modules/beforeAuth/logout';//importing modules
import settings from './modules/user/settings';//importing modules
import profile from './modules/profile/profile';//importing modules

Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
        data:null, //data to be rendered
        token:null, //response token obtained
        timeout: null,
        env:"tesst",
    },
    getters:{
        hasToken:(state)=>{
            return state.token !== null;
        },
        getData:(state)=>{//get data on state
            return state.data;
        },
        getToken:(state)=>{//get token header on response
            return state.token;
        }

    },
    mutations:{//mutate state
        setLoginStatus(state, payload = false){
            state.loginStatus = payload;
        },
        setData:(state, payload)=>{//set data on state
            state.data = payload;
        },
        setToken:(state, payload)=>{//set token on state
            state.token = payload;
        },
        clearAuthData:(state)=>{
            state.data = null;
            state.token = null;
        },
        setLogoutTime:(state, payload)=>{
            state.timeout = payload;
        }
    },
    actions:{ //can be used for async task like sending data to DB
        autoSetData:({commit, getters})=>{//TODO change to autoLogin
            let data = getters.getData;
            let localData = localStorage.getItem('data');

            if(!data && localData){
                commit('setData', JSON.parse(localData));
            }

            if(!localData && data){
                localStorage.setItem('data', JSON.stringify(data)); //TODO refactor to use vuex actions
            }
        },
        sendCommit:({commit, state}, payload)=>{
            return  new Promise((resolve, reject)=>{
                

                let response = {
                    data:{ "name": { "first": "Kenneth", "middle": "Mitchell", "last": "De Leon", "suffix": "Master" }, "civilStatus": "married", "email": [ { "main": true, "_id": "5b46c448c9979007acde2cab", "address": "sample@mkas.com" } ], "gender": "male", "contact": [], "address": [], "government": [] }
                    ,headers:{
                        auth:'asdasd'
                    }   
                }
                response.headers['x-auth-sampletoken']='token';
                response.headers['exp']=1530722965+76270878+76270878;
                resolve(response);

                    // switch(true){
                    //     case payload.method === 'get':
                    //         axios.get(payload.url)
                    //             .then(res=>{
                    //                 resolve(res);
                    //             }).catch(err=>{
                    //                 reject(err);
                    //             });
                    //         break;
                    //     case payload.method === 'post':
                    //         axios.post(payload.url, payload.data)
                    //             .then(res=>{
                    //                 resolve(res);
                    //             }).catch((err)=>{
                    //                 reject(err);
                    //             });
                    //         break;
                    //     case payload.method === 'put':
                    //         axios.put(payload.url, payload.data)
                    //             .then(res=>{
                    //                 resolve(res);
                    //             }).catch((err)=>{
                    //                 reject(err);
                    //             });
                    //         break;
                    //     case payload.method === 'delete':
                    //         axios.delete(payload.url, payload.data)
                    //             .then(res=>{
                    //                 resolve(res);
                    //             }).catch((err)=>{
                    //                 reject(err);
                    //             });
                    //         break;
    
                    //     default:
                    //         reject(new Error({messaage:'Error sending request to server'}));
                    // }
            });
        }
    },
    modules:{//attach imported modules
        signup,
        login,
        reset,
        logout,
        settings,
        profile
    }
});

