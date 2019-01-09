<template>
    <div> 
        <ul>
            <li v-for="pic in pics" v-bind:key="pic" class="card-pic">
                <img :src="'/file/photo/me?name='+pic.filename" :alt="pic.filename" srcset="">
                <p class="description">
                        {{pic.filename}}
                </p>
            </li>
        </ul>
        
    </div>
</template>
<script>
export default {
    computed:{
        pics(){
            //get array pics info
            const accountType = this.$store.getters.getAccountType;
            let cacheInfo;
            let stateInfo;

            if(accountType == 'profile'){
                cacheInfo = JSON.parse(localStorage.getItem('profile'));
                stateInfo = this.$store.getters.getProfile;
            }else if( accountType == 'company'){
                cacheInfo = JSON.parse(localStorage.getItem('company'));
                stateInfo = this.$store.getters.getCompany;
            }

            const info = stateInfo || cacheInfo;
            let pics;

            console.log('info', info);
            console.log('state', stateInfo);
            console.log('cache', cacheInfo);

            if(!info.pics){
                //return empty array if no pics found
                console.log('no pics');
                pics = [];
            }else{
                pics = info.pics;
            }

            return pics;
        }
    }
    ,created(){
        let localProfile = JSON.parse(localStorage.getItem('profile'));//get profile data saved on local storage

        if(localProfile){
            this.$store.commit('setProfile', localProfile);//save localstorage profile to state

        }else{
            this.$store.dispatch('getProfile').then(res=>{//get new profile data from backend
                this.$store.commit('setProfile', res);//save to state
                localStorage.setItem('profile', JSON.stringify(res)); //save to localstorage
            });
        }
    }
}
</script>
<style scoped>
ul{
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, auto));
    grid-gap: 10px;
    padding: 0;
}
 ul li.card-pic{
     background-color: cornsilk;
     display: grid;
     grid-template-columns: 1fr;
     justify-items: center;
     align-items: center;
 }

li.card-pic img{
    width: 100%;
}
li.card-pic p{
    font-size: 1em;
    padding: 0;
    margin: 12px 0;
}
</style>
