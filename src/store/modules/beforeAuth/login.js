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
    login:( {commit, dispatch}, payload)=>{
        return new Promise((resolve,reject)=>{
            dispatch('sendCommit', {url:'/user/login', method:'post', data: payload})
                .then(res=>{
                    let token_header = nameSpace.token_header//app token header name used
                    let token_expire = nameSpace.token_expire//app token expiration name used

                    if(!res.headers[token_header]){//check token
                        throw Error('No Token passed');
                    }
                    if(!res.headers[token_expire]){
                        throw Error('No token expiration date');
                    }
                    
                    //probably uneccessary since axios intercepter does it every request/response
                    //but still process it upon login just to be sure

                    //remove upon production, have not found a use for it yet
                    //save response data to generic data state
                    console.trace('login', res.data);
                    commit('setData', res.data);
                    localStorage.setItem('data', JSON.stringify(res.data));

                    //save account type information
                    console.trace(res.data.accountType);
                    commit('setAccountType', res.data.accountType);
                    localStorage.setItem('accountType', res.data.accountType);//no need to stringify since saving only a string and not an object
                    
                    //save token to state and localstorage
                    const token = res.headers[token_header];
                    commit('setToken', token);
                    localStorage.setItem('token', token);

                    //save token expiration date to localstorage
                    const dateExpire = new Date(res.headers[token_expire]* 1000);
                    localStorage.setItem('exp', dateExpire);

                    dispatch('autoLogout');
                    
                    // //auto reroute
                    // router.push('/home');

                    //pass back true and let the component handle next step in logic
                    resolve(res);

                }).catch(err=>{
                    //TODO - interpret error first before returning reject 
                    //return false with error message
                    reject(err);
                });
        });
    },
    autoLogin:({commit, getters, dispatch})=>{//TODO change to autoLogin
        let token = getters.hasToken;
        let localStorageToken = localStorage.getItem('token');
        
        if(!token && localStorageToken){
            commit('setToken', localStorageToken);
        }
        if(!localStorageToken && token){
            localStorage.setItem('token', token);
        }

        return true;
    }
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}