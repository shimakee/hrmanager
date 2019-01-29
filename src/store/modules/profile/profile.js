

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
    getProfile:({getters, dispatch, commit})=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/profile/me', method:'get', data:null}) //TODO: change depending on account type
            .then(res=>{
                let pics;
                if(res.data.pics){
                    pics = res.data.pics;
                }else{
                    pics = [];
                }

                //save to storage
                if(getters.getAllowStorage){//TODO: change to cookie
                    localStorage.setItem('profile', JSON.stringify(res.data));
                    localStorage.setItem('pics', JSON.stringify(pics));
                }
                
                //save to state
                commit('setProfile', res.data);
                commit('setPics', pics);

                resolve(res.data);
            }).catch(err=>{
                
                if(!err.response){//for component to display error message
                    err.response = {
                        statusText: "Connection error, problem sending profile request."
                    };
                }
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

                    if(!err.response){//for component to display error message
                        err.response = {
                            statusText: "Connection error, problem sending profile request."
                        };
                    }

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