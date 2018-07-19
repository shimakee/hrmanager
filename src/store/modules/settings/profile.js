import {router} from '../../../main';

const state = {
}
const getters = {
}
const mutations = {
}
const actions = {
    updateProfile:({dispatch}, payload)=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/profile/me', method: 'put', data: payload})
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
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