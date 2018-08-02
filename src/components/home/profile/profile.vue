<template>
    <div class="profile">
        <div class="avatar-container">
            <h2>Profile</h2>
            <img class="avatar" src="https://picsum.photos/200/200/?random" :alt="fullName">
            <div>{{fullName}}</div>
            
            <!-- TODO make into individual components -->
            <ul class="info">
                <li v-for="(value, property) in profile" v-bind:key="property">

                    <span v-if="typeof value === 'object'">

                        <span v-if="property === 'email'">
                            {{property}} : 
                                        <span v-for="(object, prop) in value" v-bind:key="prop">
                                            <span v-if="object.main === true">
                                                {{object.address}}
                                            </span>
                                        </span>
                        </span>
                        <span v-else>
                            {{property}} : 

                            <span v-for="(item, k) in value" v-bind:key="k">
                                    {{item}}
                            </span>
                        </span>
                    </span>
                    <span v-else>
                        {{property}} : {{value}}
                    </span>
                </li>     
            </ul>
        </div>

        <div class="posts">
            <router-view></router-view> 
        </div>
    </div>
</template>
<script>
export default {
    computed:{
        profile(){
            return this.$store.getters.getProfile;
        },
        fullName(){
            let name = "";
            let profile = this.profile;
            for (const key in profile.name) {//get name from profile
                if (profile.name.hasOwnProperty(key)) { //get every element
                    const element = profile.name[key];
                    if(element){
                        name +=  " " + element; //check that element has value and stack over name
                    }
                }
            }
            
            return name.trim();
        }
    },
    beforeMount(){
        let localProfile = JSON.parse(localStorage.getItem('profile'));//get profile data saved on local storage

        if(localProfile){
            this.$store.commit('setProfile', localProfile);//save localstorage profile to state

        }else{
            this.$store.dispatch('getProfile').then(res=>{//get new profile data from backend
                localStorage.setItem('profile', JSON.stringify(res)); //save to localstorage
                this.$store.commit('setProfile', res);//save to state
            });
        }
    }
}
</script>
<style scoped>
.profile{
    display: grid; 
    grid-template-columns: 1fr 4fr;
}
.avatar-container{
    /* position:relative; */
    padding:.5em;
    margin:1.5em;
    text-align: center;
    float: left;
    /* width:20vw; */
}
.avatar{
    border-radius: 20em;
}
.info{
    list-style: none;
    text-align: center;
}
.posts{
    position:relative;
    display:block;
}
</style>
