import {router} from '../../../main';

const state = {
    username:null,
    accountType:null,
    pics:null,
    address:null //TODO: move less conflict
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
    }
}
const actions = {
    getUser:({getters, commit, dispatch})=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/user/me', method: 'get', data: null})
                .then(res=>{

                    if(getters.allowStorage){//TODO: change to cookie
                        //save to localstorage
                        localStorage.setItem("username", res.data.username);
                        localStorage.setItem("accountType", res.data.accountType);
                    }

                    //save to state
                    commit("setUsername", res.data.username);
                    commit("setAccountType", res.data.accountType);

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
    getAddress:({getters, dispatch})=>{
        const ACCOUNT_TYPE = getters.getAccountType;

        return new Promise((resolve, reject)=>{

            dispatch('sendCommit', {url:`/${ACCOUNT_TYPE}/me/address`, method:'get', data: null}) //TODO: change to get address depending on account type
                .then(res=>{
                    resolve(res.data);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    addAddress:({getters, state, dispatch}, payload)=>{
        const ACCOUNT_TYPE = getters.getAccountType;

        return new Promise((resolve, reject)=>{

            dispatch('sendCommit', {url:`/${ACCOUNT_TYPE}/me/address`, method:'post', data: payload}) //TODO: change to add address depending on account type
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