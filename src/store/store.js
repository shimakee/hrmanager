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
        username:null,
        data:null, //data to be rendered
        token:null, //response token obtained
        accountType:null,
        timeout: null, //autologout feature countdown
        resetToken: null, //token data for reseting account
        pics:null,
        errorMessage: null,
        infoMessage: null

    },
    getters:{
        getUsername:(state)=>{//get data on state
            return state.username;
        },
        getData:(state)=>{//get data on state
            return state.data;
        },
        getToken:(state)=>{//get token header on response
            return state.token;
        },
        hasToken:(state)=>{ //return boolean without exposing token
            return state.token !== null;
        },
        getAccountType:(state)=>{
            return state.accountType;
        },
        getResetToken:(state)=>{
            return state.resetToken;
        },
        getPics:(state)=>{
            return state.pics;
        },
        getErrorMessage:(state)=>{
            return state.errorMessage;
        },
        getInfoMessage:(state)=>{
            return state.infoMessage;
        }


    },
    mutations:{//mutate state
        // setLoginStatus(state, payload = false){
        //     state.loginStatus = payload;
        // },
        setUsername:(state, payload)=>{//set data on state
            state.username = payload;
        },
        setData:(state, payload)=>{//set data on state
            state.data = payload;
        },
        clearAuthData:(state)=>{
            state.data = null;
            state.token = null;
        },
        setToken:(state, payload)=>{//set token on state
            state.token = payload;
        },
        setAccountType:(state, payload)=>{//set token on state
            state.accountType = payload;
        },
        setLogoutTime:(state, payload)=>{
            state.timeout = payload;
        },
        setResetToken:(state, payload)=>{
            state.resetToken = payload;
        },
        setPics:(state, payload)=>{
            state.pics = payload;
        },
        setErrorMessage:(state, payload)=>{
            state.errorMessage = payload;
        },
        setInfoMessage:(state, payload)=>{
            state.infoMessage = payload;
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

