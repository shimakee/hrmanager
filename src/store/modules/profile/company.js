

const state = {
    company:null,
    tradename: null,
    companiesSearched: null,


}
const getters = {
    getCompany:(state)=>{
        return state.company;
    },
    getTradename:(state)=>{
        return state.tradename;
    },
    getCompaniesSearched:(state)=>{
        return state.companiesSearched;
    }
}
const mutations = {
    setCompany:(state, payload)=>{
        state.company = payload;
    },
    setTradename:(state, payload)=>{
        state.tradename = payload;
    },
    setCompaniesSearched:(state, payload)=>{
        state.companiesSearched = payload;
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
                    pics = [] ;
                }

                let company = res.data;
                let tradename = res.data.tradename;
                let address = res.data.address;
                let contact = res.data.contact;

                //save to storage
                if(getters.getAllowStorage){ //TODO: change to cookie
                    localStorage.setItem('company', JSON.stringify(company)); //save to localstorage
                    localStorage.setItem('tradename', tradename);
                    localStorage.setItem('pics', JSON.stringify(pics));
                    //TODO: to implement - not yet doing anything with the data
                    localStorage.setItem('businesses', JSON.stringify(res.data.businesses));
                    localStorage.setItem('employees', JSON.stringify(res.data.employees));
                    localStorage.setItem('owner', JSON.stringify(res.data.owner));
                    //common data
                    localStorage.setItem('address', JSON.stringify(address));
                    localStorage.setItem('contact', JSON.stringify(contact));
                    localStorage.setItem('government', JSON.stringify(res.data.government));
                }

                // if(!pics){
                //     pics = localStorage.getItem('pics');
                // }

                //save to state
                commit('setCompany', company);
                commit('setTradename', tradename);
                commit('setPics', pics);
                commit('setAddress', address);
                commit('setContact', contact);
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
    },
    findCompany:({dispatch, commit}, payload)=>{
        let query="";
        if(payload.name){
            query=`?name=${payload.name}`;
        }
        if(payload.id){
            query=`?id=${payload.id}`;
        }

        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:`/employment/scout/company${query}`, method:'get', data: null})
                .then(res=>{
                    //TODO: commit search results
                    commit('setCompaniesSearched', res.data);
                    resolve(res.data);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
}

export default{
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}