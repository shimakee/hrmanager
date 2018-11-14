<template>
    <div class="profile">
        <div class="avatar-container">
            <slot></slot>
            <img class="avatar" src="https://picsum.photos/200/200/?random" :alt="fullName">
            <div>{{fullName}}</div>
        </div>

            <!-- TODO make into individual components -->
        <ul class="info">
            <li v-for="(value, property) in profile" v-bind:key="property"> <!--loop through profile properties-->

                <span v-if="typeof value === 'object'"><!--loop property if property is another object-->
                    <span v-if="value && property === 'email'"><!--only show if it has value && special case for email-->
                        {{property}}:   <span v-for="(object, prop) in value" v-bind:key="prop">
                                            <span v-if="object.main === true"> <!--only show main email-->
                                                {{object.address}}
                                            </span>
                                        </span>
                    </span>
                    <span v-else>
                        <span v-if="value && typeof value === 'string'"><!--only show if it has value-->
                            {{property}}:   <span v-for="(item, k) in value" v-bind:key="k">
                                                {{item}}
                                            </span>
                        </span>
                    </span>
                </span>
                <span v-else>
                    <span v-if="value && typeof value === 'string'"><!--only show if it has value-->
                        {{property}} : {{value}}
                    </span>
                </span>
            </li>     
        </ul>
    </div>
</template>
<script>
export default {
    data(){
        return {
            fullName: null
        }
    }
    ,computed:{
        profile(){
            return this.$store.getters.getProfile;
        }
    },
    beforeMount(){
        //get full name===================================================
        let name = "";
            let profileName = this.$store.getters.getProfile;
            // let profileName = this.profile.name;
                if(profileName.name){
                    for (const key in profileName.name) {//get name from profile
                        if (profileName.name.hasOwnProperty(key)) { //get every element
                            const element = profileName.name[key];
                            if(element){
                                name +=  " " + element; //check that element has value and stack over name
                            }
                        }
                    }
                
                    this.fullName = name.trim();
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
.profile{
    display: grid; 
    grid-template-columns: 1fr;
}
.avatar-container{
    padding:.5em;
    margin:1.5em;
    text-align: center;
}
.avatar{
    border-radius: 20em;
}
.info{
    list-style: none;
    text-align: center;
}
</style>
