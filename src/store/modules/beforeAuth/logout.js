import {router} from '../../../main';

const state = {
}
const getters = {
}
const mutations = {
}
const actions = {
    logout:(context)=>{
        context.commit('clearAuthData');//clear data
        localStorage.clear();//clear local storage
        document.cookie = "token=;expires=1900-01-01T00:00:00.0Z;path=/"; // clear cookies

        router.replace({path: '/login'});
    },
    autoLogout:({state, commit, dispatch})=>{
        //token
        let token = getters.hasToken;
        let localStorageToken = localStorage.getItem('token');
        //dates
        let now = new Date();
        let exp = localStorage.getItem('exp');
        let expire = new Date(exp);
        //expiration
        let timeLeft = expire - now;

        if(!exp || timeLeft <= 0){dispatch('logout')} //logout when invalid time or time expired
        if(!token && !localStorageToken){dispatch('logout')} //logout when no token

        const {timeout} = state;//get store timeout state

        if(timeout){ //if existing timeout - clear it
            clearTimeout(timeout);
        }
        
        let newTime = setTimeout(()=>{//create new time
            dispatch('logout');
        }, timeLeft);
        commit('setLogoutTime', newTime);//commit new timout state
    }
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}