const state = {
    
}
const getters = {

}
const mutations = {

}
const actions = {
    inc:({commit}, payload)=>{ //access to only commit mutations + PAYLOAD
        setTimeout(()=>{
            commit('increasesBy', payload);
        },500);
    },
    withPayloadObj:({commit}, payload)=>{ //access to only commit mutations + PAYLOAD
        setTimeout(()=>{
            commit('increasesBy', payload.amount);
        },payload.time);
    }
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}