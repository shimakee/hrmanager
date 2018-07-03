import axios from 'axios';

const state = {
    data:null,
    header:null,
    token:null,
    error:null
}
const getters = {
    getData:(state)=>{//get data on state
        return state.data;
    },
    getHeader:(state)=>{//get data on state
        return state.header;
    },
    getToken:(state)=>{//get token header on response
        return state.token;
    },
    getError:(state)=>{//get header on response
        return state.error;
    }
}
const mutations = {
    setData:(state, payload)=>{//set data on state
        state.data = payload;
    },
    setHeader:(state, payload)=>{//set data on state
        state.header = payload;
    },
    setToken:(state, payload)=>{//set token on state
        state.token = payload;
    },
    setError:(state, payload)=>{//set error on state
        state.error = payload;
    }
}
const actions = {
    signup: (context, payload)=>{
        context.dispatch('sendCommit', {url:'/user/signup', method:'post', data: payload});
    },
    login:(context, payload)=>{
        return new Promise((resolve,reject)=>{
            context.dispatch('sendCommit', {url:'/user/login', method:'post', data: payload})
                .then(res=>{
                    context.commit('setData', res.data);//set response data to store in state
                    context.commit('setHeader', res.header);//set response header to store in state
                    //check if there is token if not reject;
                        //set loginStatus to true
                        context.commit('setLoginStatus', true);
                    resolve(res);
                }).catch(err=>{
                    context.commit('setError', err);
                    reject(err);
                });
        });
    },
    resetPass:(context, payload)=>{
        context.dispatch('sendCommit', {url:'/user/reset', method: 'post', data: payload});
    },
    sendCommit:({commit}, payload)=>{
        return  new Promise((resolve, reject)=>{
            resolve('x');
            switch(true){
                case payload.method === 'get':
                    axios.get(payload.url)
                        .then(res=>{
                            resolve(res);
                         }).catch(err=>{
                            reject(err);
                        });
                    break;
                case payload.method === 'post':
                    axios.post(payload.url, payload.data)
                        .then(res=>{
                            resolve(res);
                        }).catch((err)=>{
                            reject(err);
                        });
                    break;
                case payload.method === 'put':
                    axios.put(payload.url, payload.data)
                        .then(res=>{
                            resolve(res);
                        }).catch((err)=>{
                            reject(err);
                        });
                    break;
                case payload.method === 'delete':
                    axios.delete(payload.url, payload.data)
                        .then(res=>{
                            resolve(res);
                        }).catch((err)=>{
                            reject(err);
                        });
                    break;

                default:
                    reject(new Error({messaage:'Error sending request to server'}));
            }
        });
    }
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}

// const req = new Promise((resolve, reject)=>{
//     switch(true){
//         case payload.method === 'get':
//             try{
//                 async function getResponse(){
//                     resolve(await axios.get(payload.url));
//                 }
//                 getResponse();
//             }catch(err){
//                 reject(err);
//             }
//             // axios.get(payload.url).then(res=>{
//             //     resolve(res);
//             // }).catch(err=>{
//             //     reject(err);
//             // });
//             break;
//         case payload.method === 'post':
//             try{
//                 async function getResponse(){
//                     resolve(await axios.post(payload.url, payload.data));
//                 }
//                 getResponse();
//             }catch(err){
//                 reject(err);
//             }

//         //    resolve(axios.post(payload.url, payload.data));
//             break;
//         case payload.method === 'put':
//             resolve(axios.put(payload.url, payload.data));
//             break;
//         case payload.method === 'delete':
//             resolve(axios.delete(payload.url, payload.data));
//             break;
//             default:
//                 reject(new Error({messaage:'Error sending request to server'}));
//     }
// });

// req.then(res=>{
//     console.log(res.data);
//     commit('setData', res.data);//set response data to store in state
// }).catch(err=>{
//     console.log(err); //send error message
// });