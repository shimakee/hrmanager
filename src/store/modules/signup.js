import axios from 'axios';

const state = {
    data:null
}
const getters = {
    getData:(state)=>{
        return state.data;
    }
}
const mutations = {
    setData:(state, payload)=>{
        state.data = payload;
    }
}
const actions = {
    signup:({commit})=>{
        axios.get('/signup')
        .then(res=>{
            console.log(res.data);
            commit('setData', res.data);
        })
        .catch(err=>{
            console.log(err);
        });
    }
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}