import axios from 'axios';

const state = {
    data:null
}
const getters = {
    getData:(state)=>{//get data on state
        return state.data;
    }
}
const mutations = {
    setData:(state, payload)=>{//set data on state
        state.data = payload;
    }
}
const actions = {
    signup: (context, payload)=>{
        context.dispatch('sendCommit', {url:'/signup', method:'post', data: payload});
    },
    login:(context, payload)=>{
        context.dispatch('sendCommit', {url:'/login', method:'post', data: payload});
    },
    resetPass:()=>{
        context.dispatch('sendCommit', {url:'/reset', method: 'post', data: payload});
    },
    sendCommit:({commit}, payload)=>{
        const req =  new Promise((resolve, reject)=>{
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

        req.then(res=>{
            console.log(res.data);
            commit('setData', res.data);//set response data to store in state
        }).catch(err=>{
            console.log(err); //send error message
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