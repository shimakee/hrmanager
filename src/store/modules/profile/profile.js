

const state = {
    profile:null,
    address:null //TODO: move less conflict
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
            dispatch('sendCommit', {url:'/profile/me', method:'get', data:null}) //TODO: change depending on account type
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
            dispatch('sendCommit', {url:'/profile/me', method: 'put', data: payload})
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    getAddress:({dispatch})=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/profile/me/address', method:'get', data: null}) //TODO: change to get address depending on account type
                .then(res=>{
                    resolve(res.data);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    addAddress:({dispatch}, payload)=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/profile/me/address', method:'post', data: payload}) //TODO: change to add address depending on account type
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