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
import { type } from 'os';

Vue.use(Vuex);
    
export const store = new Vuex.Store({
    state:{
        token:null, //response token obtained
        timeout: null, //autologout feature countdown
        resetToken: null, //token data for reseting account
        errorMessage: null,
        infoMessage: null,
        allowAutoLocate: false,
        allowLocalStorage: true //if true stores & check localstorage before sending get requests

    },
    getters:{
        getToken:(state)=>{//get token header on response
            return state.token;
        },
        hasToken:(state)=>{ //return boolean without exposing token
            return state.token !== null;
        },
        getResetToken:(state)=>{
            return state.resetToken;
        },
        getErrorMessage:(state)=>{
            return state.errorMessage;
        },
        getInfoMessage:(state)=>{
            return state.infoMessage;
        },
        getAllowStorage:(state)=>{
            return state.allowLocalStorage;
        },
        getAllowAutoLocate:(state)=>{
            return state.allowAutoLocate;
        }


    },
    mutations:{//mutate state
        clearAuthData:(state)=>{
            state.data = null;
            state.token = null;
        },
        setLogoutTime:(state, payload)=>{
            state.timeout = payload;
        },
        setToken:(state, payload)=>{//set token on state
            state.token = payload;
        },
        setResetToken:(state, payload)=>{
            state.resetToken = payload;
        },
        setErrorMessage:(state, payload)=>{
            state.errorMessage = payload;
        },
        setInfoMessage:(state, payload)=>{
            state.infoMessage = payload;
        },
        setAllowAutoLocate:(state, payload)=>{
            if(typeof payload == 'boolean'){
                state.allowAutoLocate = payload;
            }else if(typeof payload == 'string'){

                if(payload == "true"){
                    state.allowAutoLocate = true;
                }else if(payload == 'false'){
                    state.allowAutoLocate = false;
                }else{
                    console.log('Erro: could not set allow auto locate.');
                }
            }else{
                console.log('Error: could not set auto locate. Invalid type.');
            }
        }
        
    },
    actions:{ //can be used for async task like sending data to DB
        geoLocate:({commit})=>{
            const AUTO_LOCATE = localStorage.getItem('autoLocate');

            if(!AUTO_LOCATE){
                const CONFIRM = window.confirm("Allow device to get your location?");

                if(CONFIRM){
                    commit('setAllowAutoLocate', true);
                    localStorage.setItem('autoLocate', true);
                }else{
                    commit('setAllowAutoLocate', false);
                    localStorage.setItem('autoLocate', false);
                }
            }
        },
        clearDisplayMessages:({commit})=>{
            
            //display error message
            commit('setErrorMessage', null);
            commit('setInfoMessage', null);
        },
        maintainData:({commit, dispatch}, payload)=>{//this pulls data from backend based on account type, commits them to state and storage;
            //TODO: change to cookies instead of localStorage
            //NOTE* this action should remove components from individually loading their own data;
            const ALLOW_AUTO_LOCATE = localStorage.getItem('autoLocate');

            commit('setAllowAutoLocate', ALLOW_AUTO_LOCATE);
            
            return new Promise((resolve, reject)=>{
                dispatch('getUser')
                .then(res=>{
    
                    dispatch('login', res);
                    resolve(res);
                }).catch(err=>{
                    reject(err);
                });
            });

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

                        if(!err.response){//for component to display error message
                            err.response = {
                                statusText: "Connection error, problem sending image upload request."
                            };
                        }
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

