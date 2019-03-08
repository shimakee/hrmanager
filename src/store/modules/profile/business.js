

const state = {
    businesses: null,
    businessEmployees: null
}
const getters = {
    getBusinesses:(state)=>{
        return state.businesses;
    },
}
const mutations = {
    setBusinesses:(state, payload)=>{
        state.businesses = payload;
    }
}
const actions = {
    addBusiness:({dispatch}, payload)=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/business/me', method:'post', data:payload})
            .then(res=>{
                resolve(res.data);
            }).catch(err=>{
                reject(err);
            });
        });
    },
    getBusinesses:({commit, dispatch}, payload)=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/business/me', method:'get', data:payload})
            .then(res=>{
                commit("setBusinesses", res.data);
                resolve(res.data);
            }).catch(err=>{
                reject(err);
            });
        });
    },
    editBusiness:({commit, dispatch}, payload)=>{
        let query = `?id=${payload._id}`;
        console.log(payload);
        
        let businessModel = {
                tradename: payload.tradename,
                address:{
                    city: payload.address.city,
                    country: payload.address.country,
                    province: payload.address.province,
                    street: payload.address.street,
                    zipcode: payload.address.zipcode
                }
        }

        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:`/business/me${query}`, method:'put', data: businessModel})
            .then(res=>{
                dispatch("getBusinesses");
                resolve(res.data);
            }).catch(err=>{
                reject(err);
            });
        });
    },
    deleteBusiness:({commit, dispatch}, payload)=>{
        let query = `?id=${payload._id}`;

        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:`/business/me${query}`, method:'delete', data:null})
            .then(res=>{
                dispatch("getBusinesses");
                resolve(res.data);
            }).catch(err=>{
                reject(err);
            });
        });
    }
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}