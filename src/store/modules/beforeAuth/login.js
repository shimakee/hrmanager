import {router} from '../../../main';
import nameSpace from '../../../util/nameSpace';

const state = {
}
const getters = {
}
const mutations = {
}
const actions = {
    login:( {commit, dispatch}, payload)=>{
        return new Promise((resolve,reject)=>{
            dispatch('sendCommit', {url:'/user/login', method:'post', data: payload})
                .then(res=>{
                    let token_header = nameSpace.token_header
                    let token_expire = nameSpace.token_expire

                    if(!res.headers[token_header]){//check token
                        throw Error('No Token passed');
                    }
                    if(!res.headers[token_expire]){
                        throw Error('No token expiration date');
                    }
                    
                    //save response data to generic data state
                    commit('setData', res.data);
                    localStorage.setItem('data', JSON.stringify(res.data));
                    
                    //save token to state and localstorage
                    const token = res.headers[token_header];
                    commit('setToken', token);
                    localStorage.setItem('token', token);

                    //save token expiration date to localstorage
                    const dateExpire = new Date(res.headers[token_expire]* 1000);
                    localStorage.setItem('exp', dateExpire);

                    dispatch('autoLogout');
                    router.push('/home');

                }).catch(err=>{
                    console.log(err);
                    //return custom error message
                    reject(err);
                });
        });
    },
    autoLogin:({commit, getters, dispatch})=>{//TODO change to autoLogin
        let token = getters.hasToken;
        let localStorageToken = localStorage.getItem('token');
        let timeExpire = localStorage.getItem('exp');
        
        if(!token){
            if(!localStorageToken){
                dispatch('logout');
                return false;
            }
            commit('setToken', localStorageToken);
        }
        if(!localStorageToken){
            if(!token){
                dispatch('logout');
                return false;
        }
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