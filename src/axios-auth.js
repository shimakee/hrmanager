import axios from 'axios';
import {store} from './store/store';
import nameSpace from './util/nameSpace';

const instance = axios.create({
    baseURL:'http://120.28.193.241' //for own server
    // baseURL:'http://localhost' //for local deployment
    // baseURL:'http://120.28.193.241'
});

instance.interceptors.request.use(config=>{
    console.trace('config', config); //emove upon production

    if(store.getters.hasToken){//adding token as header for all request when token is available
        config.headers.common[nameSpace.token_header] = store.getters.getToken;
    }else{

    }
    return config;
});
instance.interceptors.response.use(response=>{
    console.trace('response', response);//Remove upond production

    if(response.headers[nameSpace.token_header]){//save token header
        //place token in store && local storage
        let token = response.headers[nameSpace.token_header];
        localStorage.setItem('token', token);
    }
    if(response.headers[nameSpace.token_expire]){

        console.log('old expire', localStorage.getItem('exp'));//remove on production
        
        //place expiration date in local storage
        const expire = new Date(response.headers[nameSpace.token_expire]* 1000);
        localStorage.setItem('exp', expire);

        console.log('new expire', expire);//remove on production
        store.dispatch('autoLogout');//re-initialize autologout every request
    }

    // //place data in local storage
    // if(response.data){
    //     console.log('data saved.');
    //     store.commit('setData', response.data);
    //     localStorage.setItem('data', JSON.stringify(response.data));
    // }
    return response;
},reject=>{
    console.trace('reject', reject);
    return reject;
});

export default instance;