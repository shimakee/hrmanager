import axios from 'axios';
import {store} from './store/store';
import nameSpace from './util/nameSpace';

const instance = axios.create({
    baseURL:'http://localhost'
});

instance.interceptors.request.use(config=>{
    console.log('config', config);
    if(store.getters.hasToken){
        config.headers.common[nameSpace.token_header] = store.getters.getToken;
    }
    return config;
});
instance.interceptors.response.use(response=>{
    console.log('response', response);
    if(response.headers[nameSpace.token_header]){
        //place token in store && local storage
        let token = response.headers[nameSpace.token_header];
        localStorage.setItem('token', token);
    }
    if(response.headers[nameSpace.token_expire]){
        //place expiration date in local storage
        console.log('old expire', localStorage.getItem('exp'));

        const expire = new Date(response.headers[nameSpace.token_expire]* 1000);
        localStorage.setItem('exp', expire);

        console.log('new expire', expire);
        store.dispatch('autoLogout');
    }

    //place data in local storage
    if(response.data){
        console.log('data saved.');
        store.commit('setData', response.data);
        localStorage.setItem('data', JSON.stringify(response.data));
    }
    return response;
});

export default instance;