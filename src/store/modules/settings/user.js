import {router} from '../../../main';

const state = {
    username:null,
    accountType:null,
    pics:null
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
}
const actions = {
    getUser:({state, commit, dispatch})=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/user/me', method: 'get', data: null})
                .then(res=>{

                    if(state.allowLocalStorage){//TODO: change to cookie
                        //save to localstorage
                        localStorage.setItem("username", res.username);
                        localStorage.setItem("accountType", res.accountType);
                    }

                    //save to state
                    commit("setUsername", res.username);
                    commit("setAccountType", res.accountType);

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

    }

}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}