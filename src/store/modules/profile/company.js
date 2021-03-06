

const state = {
    company:null,
    tradename: null,
    companiesSearched: null,
    employees: null,
    applicants: null


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
    },
    getEmployees:(state)=>{
        return state.employees;
    },
    getApplicants:(state)=>{
        return state.applicants;
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
    },
    setEmployees:(state, payload)=>{
        state.employees = payload;
    },
    setApplicants:(state, payload)=>{
        state.applicants = payload;
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
    getEmployees:({dispatch, commit})=>{//can be set to specific employee - only searcher user employment list
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/employment/me/employees', method: 'get', data: null})
                .then(res=>{
                    commit('setEmployees',res.data);
                    resolve(res.data);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    getApplicants:({dispatch, commit})=>{ //searches all employee model - more reliable in getting employment data
        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:'/employment/me/applied', method: 'get', data: null})
                .then(res=>{
                    commit('setApplicants',res.data);
                    resolve(res.data);
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
                    // commit('setCompaniesSearched', res.data);
                    commit('setExploreResult', res.data);
                    resolve(res.data);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    recruitProfile:({dispatch}, payload)=>{
        let query = `?profileId=${payload}`;
        
            return new Promise((resolve, reject)=>{
                dispatch('sendCommit', {url:`/employment/me/recruit${query}`, method:'post', data: null})
                    .then(res=>{
                        resolve(res.data);
                    }).catch(err=>{
                        reject(err);
                    });
            });
    },
    cancelRecruitment:({dispatch}, payload)=>{
        let query = `?profileId=${payload}`;
        
            return new Promise((resolve, reject)=>{
                dispatch('sendCommit', {url:`/employment/me/recruit${query}`, method:'put', data: null})
                    .then(res=>{
                        resolve(res.data);
                    }).catch(err=>{
                        reject(err);
                    });
            });
    },
    acceptApplication:({dispatch}, payload)=>{
        let query = `?profileId=${payload}`;

        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:`/employment/me/applied/accepted${query}`, method:'post', data:null})
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject(err);
                });
        });
    },
    declineApplication:({dispatch}, payload)=>{
        let query = `?profileId=${payload}`;

        return new Promise((resolve, reject)=>{
            dispatch('sendCommit', {url:`/employment/me/applied/declined${query}`, method:'post', data:null})
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