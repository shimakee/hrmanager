

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

                //save to state
                commit('setProfile', res.data);
                commit('setPics', pics);
                commit('setAddress', res.data.address);
                commit('setContact', res.data.contact);

                //save to storage
                if(getters.getAllowStorage){//TODO: change to cookie
                    localStorage.setItem('profile', JSON.stringify(res.data));
                    localStorage.setItem('pics', JSON.stringify(pics));
                    //common data
                    localStorage.setItem('address', JSON.stringify(res.data.address));
                    localStorage.setItem('contact', JSON.stringify(res.data.contact));
                    localStorage.setItem('government', JSON.stringify(res.data.government));
                }
                

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
    }
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}