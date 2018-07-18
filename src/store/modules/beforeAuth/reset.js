import {router} from '../../../main';

const state = {
}
const getters = {
}
const mutations = {
}
const actions = {
    resetPass:(context, payload)=>{
        context.dispatch('sendCommit', {url:'/user/reset', method: 'post', data: payload})
            .then(res=>{
            });
    }
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}