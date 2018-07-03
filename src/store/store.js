import Vue from 'vue';
import Vuex from 'vuex';
import signup from './modules/signup';//importing modules

Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
        page:'landingPage',
        view:'login',
        isLoggedIn: false
    },
    mutations:{//mutate state
        changeView:(state, payload)=>{
            state.view = payload;
        },
        setLoginStatus(state, payload = false){
            state.isLoggedIn = payload;
        }
    },
    actions:{ //can be used for async task like sending data to DB
    },
    modules:{//attach imported modules
        signup: signup
    }
}); 