import {router} from '../../../main';

const state = {
}
const getters = {
}
const mutations = {
}
const actions = {
    logout:({commit})=>{
        commit('clearAuthData');//clear data
        localStorage.clear();//clear local storage
        document.cookie = "token=;expires=1900-01-01T00:00:00.0Z;path=/"; // clear cookies

        router.replace({path: '/login'});
    },
    autoLogout:({getters, state, commit, dispatch})=>{
        //token
        let token = getters.hasToken;
        //dates
        let now = new Date();
        let exp = getters.getExp;
        let expire = new Date(exp);
        //expiration
        let timeLeft = expire - now;
        let {timeout} = state;//get store timeout state


        if(!exp || timeLeft <= 0){dispatch('logout')} //logout when invalid time or time expired
        if(!token){dispatch('logout')} //logout when no token


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