import {router} from '../../../main';
import nameSpace from '../../../util/nameSpace';

const state = {
}
const getters = {
}
const mutations = {
}
const actions = {
    register: ({dispatch}, payload)=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/user/register', method:'post', data: payload})
                .then(res=>{
                    let token_header = nameSpace.token_header
                    let token_expire = nameSpace.token_expire

                    if(!res.headers[token_header]){//check token
                        throw Error('No Token passed');
                    }
                    if(!res.headers[token_expire]){
                        throw Error('No token expiration date');
                    }

                    //TODO: transfer to axios intercetors
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
                    resolve(res);

                }).catch(err=>{

                    reject(err);
                });
        });
    },
    signup: ({dispatch, commit}, payload)=>{
        return new Promise((resolve,reject)=>{
            dispatch('sendCommit', {url:'/user/signup', method:'post', data: payload})
                .then(res=>{
                    let token_header = nameSpace.token_header
                    let token_expire = nameSpace.token_expire

                    if(!res.headers[token_header]){//check token
                        throw Error('No Token passed');
                    }
                    if(!res.headers[token_expire]){
                        throw Error('No token expiration date');
                    }

                    //TODO: transfer to axios intercetors
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
                    resolve(res);

                }).catch(err=>{
                    //return custom error message
                    reject(err);
                });
        });
    }
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}