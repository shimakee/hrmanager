

const state = {
    company:null
}
const getters = {
    getCompany:(state)=>{
        return state.company;
    }
}
const mutations = {
    setCompany:(state, payload)=>{
        state.company = payload;
    }
}
const actions = {
    getCompany:({dispatch})=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/company/me', method:'get', data:null}) //TODO: change depending on account type
            .then(res=>{
                resolve(res.data);
                console.trace('response data', res.data);
            }).catch(err=>{
                reject(err);
            });
        });
    },
    updateProfile:({dispatch}, payload)=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/company/me', method: 'put', data: payload})
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