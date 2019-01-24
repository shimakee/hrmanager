import {router} from '../../../main';
import nameSpace from '../../../util/nameSpace';

const state = {
}
const getters = {
}
const mutations = {
}
const actions = {
    register: ({getters, dispatch, commit}, payload)=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/user/register', method:'post', data: payload})
                .then(res=>{

                    dispatch('login', res);
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
                    
                    dispatch('login', res);
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