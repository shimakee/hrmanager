import Vue from 'vue';
import Vuex from 'vuex';
import signup from './modules/signup';//importing modules

Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
        sampleState: 0
    },
    getters:{
        sampleState:(state)=>{
            return state.sampleState;
        },
        doubleSampleState:(state)=>{
            return state.sampleState * 2;
        }
    },
    mutations:{
        increase:(state)=>{
            state.sampleState++;
        },
        increasesBy:(state, payload)=>{//adding payload
            state.sampleState+=payload;
        }
    },
    actions:{ //can be used for async task like sending data to DB
        increase:(context)=>{ //access to most
            context.commit('increase');
        },
        incs:({commit})=>{ //access to only commit mutations
            setTimeout(()=>{
                commit('increasesBy');
            },500);
        },
        withPayloadObj:({commit}, payload)=>{ //access to only commit mutations + PAYLOAD
            setTimeout(()=>{
                commit('increasesBy', payload.amount);
            },payload.time);
        }
        
    },
    modules:{
        signup: signup
    }
}); 