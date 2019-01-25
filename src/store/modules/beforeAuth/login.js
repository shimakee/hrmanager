import {router} from '../../../main';
import nameSpace from '../../../util/nameSpace';

const state = {
}
const getters = {
}
const mutations = {
}
const actions = {
    resetPass:(context, payload)=>{
        return new Promise((resolve, reject)=>{
            context.dispatch('sendCommit', {url:'/user/reset', method: 'post', data: payload})
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    sendLogin:({commit, dispatch}, payload)=>{
        return new Promise((resolve,reject)=>{
            dispatch('sendCommit', {url:'/user/login', method:'post', data: payload})
                .then(res=>{
                    dispatch('login', res);

                    resolve(res);

            }).catch(err=>{
                //TODO - interpret error first before returning reject
                
                //for component to display error message
                err.response = {
                    statusText: "Connection error, problem sending request."
                };

                //return false with error message
                reject(err);
            });
        });
    },
    login:( {state, getters, commit, dispatch}, payload)=>{
        //headers
        let token_header = nameSpace.token_header//app token header name used
        let token_expire = nameSpace.token_expire//app token expiration name used
        //account tpye
        const accountType = payload.data.accountType;
        let pics;
        
        //TODO: check cookie as well
        //validation
        if(!payload.headers[token_header]){//check token
            throw Error('No Token passed');
        }
        if(!payload.headers[token_expire]){//check expiration time
            throw Error('No token expiration date');
        }

        //TODO: find better solution than local storage - use cookies perhaps?
        const token = payload.headers[token_header];
        const dateExpire = new Date(payload.headers[token_expire]* 1000); // multiplies seconds by miliseconds

        //save to state
        commit('setAccountType', payload.data.accountType);
        commit('setUsername', payload.data.username);
        commit('setToken', token);
        
        //save to storage
        if(getters.getAllowStorage){
            //response header
            localStorage.setItem('token', token);
            localStorage.setItem('exp', dateExpire);
            //response body
            localStorage.setItem('username', payload.data.username);
            localStorage.setItem('accountType', payload.data.accountType);
        }

        //get - necessary info - based on account type
        switch (accountType) {
            case 'profile':
                dispatch('getProfile').then(res=>{//get new profile data from backend
                });

                break;

            case 'company':
                //get company info
                dispatch('getCompany').then(res=>{//get new profile data from backend
                });
                
                break;
                
            case 'staff': //not implemented yet

                
                break;
        
            default: // if none of the above  clear local storage - return to login
                dispatch('logout');
                break;
        }

        dispatch('autoLogout');
    },
    autoLogin:({commit, getters, dispatch})=>{//TODO: check that token is authentic - or change to cookie
        let token = getters.hasToken;
        let localStorageToken = localStorage.getItem('token');

        //router handles the login - it checks the state and localStorage
        if(!token && localStorageToken){
            commit('setToken', localStorageToken);
        }
        if(!localStorageToken && token){

            if(getters.getAllowStorage){//TODO:change to cookie
                localStorage.setItem('token', token);
            }
        }
    }
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}