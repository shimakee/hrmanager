import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../axios-auth';
// import axios from '../axios';
import signup from './modules/beforeAuth/signup';//importing modules
import login from './modules/beforeAuth/login';//importing modules
import logout from './modules/beforeAuth/logout';//importing modules
import userSettings from './modules/settings/user';//importing modules
import profile from './modules/profile/profile';//importing modules
import company from './modules/profile/company';//importing modules

import googlemaps from './modules/googlemaps/googlemaps';//googlemaps module

Vue.use(Vuex);
    
export const store = new Vuex.Store({
    state:{
        data:null, //data to be rendered
        token:null, //response token obtained
        accountType:null,
        timeout: null,
        resetToken: null,
        pics:null,
        env:"production"

    },
    getters:{
        getEnv:(state)=>{
            return state.env;
        },
        hasToken:(state)=>{
            return state.token !== null;
        },
        getData:(state)=>{//get data on state
            return state.data;
        },
        getAccountType:(state)=>{
            return state.accountType;
        },
        getToken:(state)=>{//get token header on response
            return state.token;
        },
        getResetToken:(state)=>{
            return state.resetToken;
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
        setAccountType:(state, payload)=>{//set token on state
            state.accountType = payload;
        },
        clearAuthData:(state)=>{
            state.data = null;
            state.token = null;
        },
        setLogoutTime:(state, payload)=>{
            state.timeout = payload;
        },
        setResetToken:(state, payload)=>{
            state.resetToken = payload;
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
        sendCommit:({state}, payload)=>{
            return  new Promise((resolve, reject)=>{
                
                if(state.env == "test"){

                    
                    let response = {
                        data:{ "name": { "first": "Kenneth", "middle": "Mitchell", "last": "De Leon", "suffix": "Master" }, 
                        "token":"asdas",
                        "accountType":"profile",
                        "civilStatus": "married", 
                        "email": [ { "main": true, "_id": "5b46c448c9979007acde2cab", "address": "sample@mkas.com" } ],
                        "gender": "male", "contact": [], 
                        "address": [{"main":false,"_id":"5b50b8f5ec4f044154e61112","description":"asdasd","street":"asdasd","city":"asdasd","province":"asdasd","zipcode":4444},{"main":false,"_id":"5b50b8e8ec4f044154e61111","description":"home","street":"monnstone","city":"digos","province":"davao del sur","zipcode":8002},{"main":true,"_id":"5b50b8e0ec4f044154e61110","description":"asdasd","street":"asdasd","city":"asdasd","province":"asdasd","zipcode":2222}], "government": [] }
                        ,headers:{
                            auth:'asdasd'
                        }
                    }
                    response.headers['x-auth-hureon']='token';
                    response.headers['exp']=1329531994214;

                        setTimeout(function(){
                            resolve(response)
                        }
                            , 2000);
                }else{

                    switch(true){
                        case payload.method === 'get':
                            axios.get(payload.url)
                                .then(res=>{
                                    resolve(res);
                                }).catch(err=>{
                                    reject(err);
                                });
                            break;
                        case payload.method === 'post':
                            axios.post(payload.url, payload.data)
                                .then(res=>{
                                    resolve(res);
                                }).catch((err)=>{
                                    reject(err);
                                });
                            break;
                        case payload.method === 'put':
                            axios.put(payload.url, payload.data)
                                .then(res=>{
                                    resolve(res);
                                }).catch((err)=>{
                                    reject(err);
                                });
                            break;
                        case payload.method === 'delete':
                            axios.delete(payload.url, payload.data)
                                .then(res=>{
                                    resolve(res);
                                }).catch((err)=>{
                                    reject(err);
                                });
                            break;
    
                        default:
                            reject(new Error({messaage:'Error sending request to server'}));
                    }
                }
            });
        },
        uploadPic:(state, payload)=>{
            return new Promise((resolve, reject)=>{
                const formData = new FormData();
                formData.append('imgField', payload.file.imgField, payload.file.imgField.name);
                formData.append('imgName', payload.file.imgName);

                axios.post(payload.url, formData)
                    .then(res=>{
                        resolve(res);
                    }).catch((err)=>{
                        reject(err);
                    });

            });
        }
        // ,
        // sendFile:(state, payload)=>{
        //     console.trace('payload', payload);
        //     return new Promise((resolve, reject)=>{
        //         const formData = new FormData();
        //         formData.append('file', payload.file);
        //         console.trace('formData', formData);

        //         axios.post(payload.url, formData)
        //             .then(res=>{
        //                 console.log('res', res);
        //                 resolve(res);
        //             }).catch((err)=>{
        //                 reject(err);
        //             });

        //     });

        // }
        
    },
    modules:{//attach imported modules
        signup,
        login,
        logout,
        userSettings,
        profile,
        company,
        googlemaps
    }
});

