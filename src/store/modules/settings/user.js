import {router} from '../../../main';

const state = {
    username:null,
    accountType:null,
    pics:null,
    address:null, //TODO: move less conflict,
    contact:null
}
const getters = {
    getUsername:(state)=>{//get data on state
        return state.username;
    },
    getAccountType:(state)=>{
        return state.accountType;
    },
    getPics:(state)=>{
        return state.pics;
    },
    getAddress:(state)=>{
        return state.address;
    },
    getContact:(state)=>{
        return state.contact;
    }
}
const mutations = {
    setUsername:(state, payload)=>{//set data on state
        state.username = payload;
    },
    setAccountType:(state, payload)=>{//set token on state
        state.accountType = payload;
    },
    setPics:(state, payload)=>{
        state.pics = payload;
    },
    setAddress:(state, payload)=>{
        state.address = payload;
    },
    setContact:(state, payload)=>{
        state.contact = payload
    }
}
const actions = {
    getUser:({getters, commit, dispatch})=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/user/me', method: 'get', data: null})
                .then(res=>{

                    let accountType = res.data.accountType;
                    let username = res.data.username;

                    
                    if(getters.allowStorage){//TODO: change to cookie
                        //save to localstorage
                        localStorage.setItem("username", username);
                        localStorage.setItem("accountType", accountType);
                    }
                    
                    //save to state
                    commit("setUsername", username);
                    commit("setAccountType", accountType);

                    resolve(res);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    changePassword:({dispatch}, payload)=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/user/change_password', method: 'put', data: payload})
                .then(res=>{
                    resolve(res.data);
                }).catch(err=>{
                    
                    if(!err.response){
                        err.response = {statusText:"Error: could not send update request."}
                    }
                    reject(err);
                });
        });
    },
    changeUsername:({dispatch}, payload)=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/user/me', method: 'put', data: payload})
                .then(res=>{
                    resolve(res.data);
                }).catch(err=>{
                    
                    if(!err.response){
                        err.response = {statusText:"Error: could not send update request."}
                    }
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

    },
    updatePic:({dispatch}, payload)=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:`/file/photo/me?id=${payload}`, method:'put', data: null})
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    if(!err.response){
                        err.response = {statusText:"Error: could not send update request."}
                    }
                    reject(err);
                });
            });
    },
    deletePic:({dispatch}, payload)=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:`/file/photo/me?name=${payload}`, method:'delete', data: null})
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    if(!err.response){
                        err.response = {statusText:"Error: could not send delete request."}
                    }
                    reject(err);
                });
            });
    },
    getAddress:({getters, commit, dispatch})=>{
        const ACCOUNT_TYPE = getters.getAccountType;

        return new Promise((resolve, reject)=>{

            dispatch('sendCommit', {url:`/${ACCOUNT_TYPE}/me/address`, method:'get', data: null}) //TODO: change to get address depending on account type
                .then(res=>{
                    if(getters.allowStorage){
                        localStorage.setItem('address', JSON.stringify(res.data));
                    }
                    commit('setAddress', res.data);

                    resolve(res.data);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    addAddress:({getters, dispatch}, payload)=>{
        const ACCOUNT_TYPE = getters.getAccountType;

        return new Promise((resolve, reject)=>{

            dispatch('sendCommit', {url:`/${ACCOUNT_TYPE}/me/address`, method:'post', data: payload}) //TODO: change to add address depending on account type
                .then(res=>{
                    resolve(res.data);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    updateAddress({getters, dispatch}, payload){ //TODO move this in store dispatch action
        const ACCOUNT_TYPE = getters.getAccountType;

        return new Promise((resolve, reject)=>{

        dispatch('sendCommit', {url:`/${ACCOUNT_TYPE}/me/address?id=${payload._id}`, method: 'put', data: payload})//TODO move to store as dispatch action
            .then(res=>{
                resolve(res);
            }).catch(err=>{
                if(!err.response){
                    err.response = {statusText: "Could not send address update request."}
                }
                reject(err);
            });
        });
    },
    deleteAddress({getters, dispatch}, payload){//move this in store dispatch action
        const ACCOUNT_TYPE = getters.getAccountType;
            
            return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:`/${ACCOUNT_TYPE}/me/address?id=${payload}`, method:'delete', data:null} )
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    if(!err.response){
                        err.response = {statusText: "Could not send address update request."}
                    }
                reject(err);
            });
        });
    },
    getContact:({commit, getters, dispatch}, payload)=>{
        const ACCOUNT_TYPE = getters.getAccountType;

        return new Promise((resolve, reject)=>{

            dispatch('sendCommit', {url:`/${ACCOUNT_TYPE}/me/contact`, method:'get', data: null}) //TODO: change to get address depending on account type
                .then(res=>{
                    if(getters.allowStorage){
                        localStorage.setItem('contact', JSON.stringify(res.data));
                    }
                    commit('setContact', res.data);

                    resolve(res.data);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    addContact:({getters, dispatch}, payload)=>{
        const ACCOUNT_TYPE = getters.getAccountType;

        return new Promise((resolve, reject)=>{

            dispatch('sendCommit', {url:`/${ACCOUNT_TYPE}/me/contact`, method:'post', data: payload}) //TODO: change to get address depending on account type
                .then(res=>{
                    resolve(res.data);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    updateContact({getters, dispatch}, payload){ //TODO move this in store dispatch action
        const ACCOUNT_TYPE = getters.getAccountType;

        return new Promise((resolve, reject)=>{

            dispatch('sendCommit', {url:`/${ACCOUNT_TYPE}/me/contact?id=${payload._id}`, method: 'put', data: payload})//TODO move to store as dispatch action
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    if(!err.response){
                        err.response = {statusText: "Could not send address update request."}
                    }
                    reject(err);
                });
        });
    },
    deleteContact({getters, dispatch}, payload){//move this in store dispatch action
        const ACCOUNT_TYPE = getters.getAccountType;
            
            return new Promise((resolve, reject)=>{
                dispatch('sendCommit', {url:`/${ACCOUNT_TYPE}/me/contact?id=${payload}`, method:'delete', data:null} )
                    .then(res=>{
                        resolve(res);
                    }).catch(err=>{
                        if(!err.response){
                            err.response = {statusText: "Could not send address update request."}
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