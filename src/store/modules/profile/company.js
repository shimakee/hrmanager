

const state = {
    company:null,
    tradename: null
}
const getters = {
    getCompany:(state)=>{
        return state.company;
    },
    getTradename:(state)=>{
        return state.tradename;
    }
}
const mutations = {
    setCompany:(state, payload)=>{
        state.company = payload;
    },
    setTradename:(state, payload)=>{
        state.tradename = payload;
    }
}
const actions = {
    getCompany:({getters, commit, dispatch})=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/company/me', method:'get', data:null}) //TODO: change depending on account type
            .then(res=>{
                let pics; 
                if(res.data.pics){
                    pics = res.data.pics;
                }else{
                    pics = [];
                }
                
                //save to state
                commit('setCompany', res.data);
                commit('setTradename', res.data.tradename);
                commit('setPics', pics);
                commit('setAddress', res.data.address);
                commit('setContact', res.data.contact);

                //save to storage
                if(getters.getAllowStorage){ //TODO: change to cookie
                    localStorage.setItem('company', JSON.stringify(res.data)); //save to localstorage
                    localStorage.setItem('tradename', res.data.tradename);
                    localStorage.setItem('pics', JSON.stringify(pics));
                    //TODO: to implement - not yet doing anything with the data
                    localStorage.setItem('businesses', JSON.stringify(res.data.businesses));
                    localStorage.setItem('employees', JSON.stringify(res.data.employees));
                    localStorage.setItem('owner', JSON.stringify(res.data.owner));
                    //common data
                    localStorage.setItem('address', JSON.stringify(res.data.address));
                    localStorage.setItem('contact', JSON.stringify(res.data.contact));
                    localStorage.setItem('government', JSON.stringify(res.data.government));
                }
                //save and commit other data when neccessarry
                //businesses
                //employees
                //owner

                resolve(res.data);
            }).catch(err=>{
                reject(err);
            });
        });
    },
    updateCompany:({dispatch}, payload)=>{
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/company/me', method: 'put', data: payload})
                .then(res=>{
                    resolve(res);
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