import {router} from '../../../main';

const state = {
}
const getters = {
}
const mutations = {
}
const actions = {
    changePassword:({dispatch}, payload)=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/user/change_password', method: 'put', data: payload})
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    changeUsername:({dispatch}, payload)=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/user/me', method: 'put', data: payload})
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    deleteAccount:({dispatch})=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/user/me', method:'delete', data:null})
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