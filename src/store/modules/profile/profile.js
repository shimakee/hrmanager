import {router} from '../../../main';

const state = {
    profile:null
}
const getters = {
    getProfile:(state)=>{
        return state.profile;
    }
}
const mutations = {
    setProfile:(state, payload)=>{
        state.profile = payload;
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

    }
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}