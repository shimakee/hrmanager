<template>
    <div class="profile">
        <div class="avatar-container">
            <h2>Profile</h2>
            <img class="avatar" src="https://picsum.photos/200/200/?random" :alt="profile.name.first">
            <div>{{profile.name.first}} {{profile.name.middle}} {{profile.name.last}} {{profile.name.suffix}}</div>
            <!-- <router-link :to="{name:'account'}">Edit</router-link> -->


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
        }
    },
    beforeMount(){
        let localProfile = JSON.parse(localStorage.getItem('profile'));

        if(localProfile){
            this.$store.commit('setProfile', localProfile);
        }else{
            this.$store.dispatch('getProfile').then(res=>{//get new profile data
                localStorage.setItem('profile', JSON.stringify(res)); //re-set and resave new data
                this.$store.commit('setProfile', res);
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
