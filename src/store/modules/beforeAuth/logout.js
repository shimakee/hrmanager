import {router} from '../../../main';

const state = {
}
const getters = {
}
const mutations = {
}
const actions = {
    logout:(context)=>{
        //clear data
        context.commit('clearAuthData');
        //clear local storage
        localStorage.clear();

        router.replace({path: '/'});
    },
    autoLogout:({state, commit, dispatch})=>{
        let now = new Date();
        let expire = new Date(localStorage.getItem('exp'));
        let timeLeft = expire - now;

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