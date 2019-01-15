import {router} from '../../../main';
import nameSpace from '../../../util/nameSpace';

const state = {
}
const getters = {
}
const mutations = {
}
const actions = {
    resetPass:(context, payload)=>{
        return new Promise((resolve, reject)=>{
            context.dispatch('sendCommit', {url:'/user/reset', method: 'post', data: payload})
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    login:( {commit, dispatch}, payload)=>{
        return new Promise((resolve,reject)=>{
            dispatch('sendCommit', {url:'/user/login', method:'post', data: payload})
                .then(res=>{
                    //headers
                    let token_header = nameSpace.token_header//app token header name used
                    let token_expire = nameSpace.token_expire//app token expiration name used
                    //account tpye
                    const accountType = res.data.accountType;
                    let pics;
                    
                    //TODO: check cookie as well
                    //validation
                    if(!res.headers[token_header]){//check token
                        throw Error('No Token passed');
                    }
                    if(!res.headers[token_expire]){//check expiration time
                        throw Error('No token expiration date');
                    }
                
                    //save - general info accross on account
                    //account type
                    commit('setAccountType', res.data.accountType);
                    localStorage.setItem('accountType', res.data.accountType);
                    commit('setUsername', res.data.username);
                    localStorage.setItem('username', res.data.username);

                    //get - necessary info - based on account type
                    switch (accountType) {
                        case 'profile':
                            //get profile info
                            dispatch('getProfile').then(res=>{//get new profile data from backend
                                commit('setProfile', res);//save to state
                                localStorage.setItem('profile', JSON.stringify(res)); //save to localstorage

                                pics = res.pics;
                                //save pics
                                commit('setPics', pics);
                                localStorage.setItem('pics', JSON.stringify(pics));
                            });

                            break;

                        case 'company':
                            //get company info
                            dispatch('getCompany').then(res=>{//get new profile data from backend
                                commit('setCompany', res);//save to state
                                localStorage.setItem('company', JSON.stringify(res)); //save to localstorage

                                pics = res.pics
                                //save pics
                                commit('setPics', pics);
                                localStorage.setItem('pics', JSON.stringify(pics));
                            });
                            
                            break;
                            
                        case 'staff': //not implemented yet

                            
                            break;
                    
                        default: // if none of the above  clear local storage - return to login
                            dispatch('logout');
                            break;
                    }
                    
                //save - necessary info - based on account type
                
                    
                //TODO: find better solution than local storage - use cookies perhaps?
                //save token to state and localstorage
                const token = res.headers[token_header];
                commit('setToken', token);
                localStorage.setItem('token', token);

                //save token expiration date to localstorage
                const dateExpire = new Date(res.headers[token_expire]* 1000); // multiplies seconds by miliseconds
                localStorage.setItem('exp', dateExpire);

                dispatch('autoLogout');

                //return promise - let component handle routing and other steps
                resolve(res);

                }).catch(err=>{
                    //TODO - interpret error first before returning reject 
                    console.log('Store login failed', err);
                    //return false with error message
                    reject(err);
                });
        });
    },
    autoLogin:({commit, getters, dispatch})=>{//TODO change to autoLogin
        let token = getters.hasToken;
        let localStorageToken = localStorage.getItem('token');
        
        if(!token && localStorageToken){
            commit('setToken', localStorageToken);
        }
        if(!localStorageToken && token){
            localStorage.setItem('token', token);
        }

        return true;
    }
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}