import {router} from '../../../main';

const state = {
    profile:null,
    address:null
}
const getters = {
    getProfile:(state)=>{
        return state.profile;
    },
    getAddress:(state)=>{
        return state.address;
    }
}
const mutations = {
    setProfile:(state, payload)=>{
        state.profile = payload;
    },
    setAddress:(state, payload)=>{
        state.address = payload;
    }
}
const actions = {
    getProfile:({dispatch})=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/profile/me', method:'get', data:null})
            .then(res=>{
                resolve(res.data);
            }).catch(err=>{
                reject(err);
            });
        });
    },
    getAddress:({dispatch})=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/profile/me/address', method:'get', data: null})
                .then(res=>{
                    resolve(res.data);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    addAddress:({dispatch}, payload)=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/profile/me/address', method:'post', data: payload})
                .then(res=>{
                    resolve(res.data);
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