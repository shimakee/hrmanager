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
        const accountType = payload.data.accountType;
        let pics;     
        
        //save to storage
        if(getters.getAllowStorage){
            //response body
            localStorage.setItem('username', payload.data.username);
            localStorage.setItem('accountType', payload.data.accountType);
            localStorage.setItem('activity', payload.data.activity);

            //TODO: to implement - not yet doing anything with the data
            localStorage.setItem('address', JSON.stringify(payload.data.address));
            localStorage.setItem('contact', JSON.stringify(payload.data.contact));
            localStorage.setItem('government', JSON.stringify(payload.data.government));
        }

        //save to state
        commit('setAccountType', payload.data.accountType);
        commit('setUsername', payload.data.username);
        commit('setActivity', payload.data.activity);

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

        router.push({name:'home'});
    }
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}