

const state = {
    profile:null,
    employers: null,
    profilesSearched: null
}
const getters = {
    getProfile:(state)=>{
        return state.profile;
    },
    getEmployers:(state)=>{
        return state.Employers;
    },
    getProfilesSearched:(state)=>{
        return state.profilesSearched;
    }
}
const mutations = {
    setProfile:(state, payload)=>{
        state.profile = payload;
    },
    setEmployers:(state, payload)=>{
        state.Employers = payload;
    },
    setProfilesSearched:(state, payload)=>{
        state.profilesSearched = payload;
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

                let profile = res.data;
                let address = res.data.address;
                let contact = res.data.contact;

                //save to state
                commit('setProfile', profile);
                commit('setPics', pics);
                commit('setAddress', address);
                commit('setContact', contact);

                //save to storage
                if(getters.getAllowStorage){//TODO: change to cookie
                    localStorage.setItem('profile', JSON.stringify(profile));
                    localStorage.setItem('pics', JSON.stringify(pics));
                    //common data
                    localStorage.setItem('address', JSON.stringify(address));
                    localStorage.setItem('contact', JSON.stringify(contact));
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
    },
    findProfile:({dispatch, commit}, payload)=>{
        let query="";
        if(payload.name){
            query=`?name=${payload.name}`;
        }
        // if(payload.id){
        //     query=`?profileId=${payload.id}`;
        // }

        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:`/employment/scout/profile${query}`, method:'get', data: null})
                .then(res=>{
                    //TODO: commit search results
                    commit('setProfilesSearched', res.data);
                    resolve(res.data);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    getEmployers:({dispatch, commit})=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/employment/me/employers', method:'get', data: null})
                .then(res=>{
                    commit('setEmployers', res.data);
                    resolve(res.data);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    applyToCompany:({dispatch}, payload)=>{
        let query = `?companyId=${payload}`;

        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:`/employment/me/apply${query}`, method:'get', data: null})
                .then(res=>{
                    //TODO: commit search results
                    resolve(res.data);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    cancelApplication:({dispatch}, payload)=>{
        let query = `?companyId=${payload}`;
        
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:`/employment/me/apply${query}`, method:'put', data: null})
                .then(res=>{
                    //TODO: commit search results
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