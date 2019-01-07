<template>
    <div>
        <div class="profile">
            <div class="avatar-container">
                <!-- <img class="avatar" :src='url' :alt="fullName" @click="displayUrl()"> -->
                <img class="avatar" src="https://picsum.photos/100/100/?random" :alt="fullName">
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
    </div>
</template>
<script>
export default {
    data(){
        return {
            fullName: null,
            token: null
        }
    }
    ,computed:{
        profile(){
            return this.$store.getters.getProfile;
        },
        url(){
            let cachedProfile = JSON.parse(localStorage.getItem('profile'));
            let stateProfile = this.$store.getters.getProfile
            let profile = stateProfile || cachedProfile;

            if(!profile){
                profile = this.$store.dispatch('getProfile').then(res=>{//get new profile data from backend
                    return res;
                });
            }

            // let url = '/file/photo/me?name=default.JPG'; // perhaps public/assets - for default avatar image //TODO
            let url = 'https://picsum.photos/100/100/?random';

            if(profile.pics){
                const pic = profile.pics.find(element=>{
                    if(element.main == true || element.main == 'true'){
                        return element;
                    }
                })

                url = `/file/photo/me?name=${pic.filename}`;

            }

            return url;
        }
    },
    methods:{
        displayUrl(){
            console.log('image url', this.url);
        }
    },
    beforeMount(){
        const vm = this;
        //get full name===================================================

        const cachedName = JSON.parse(localStorage.getItem('profile'));
        let profileName = this.$store.getters.getProfile;

        if(!cachedName && !profileName){
            vm.$store.dispatch('getProfile').then(res=>{//get new profile data from backend
                vm.$store.commit('setProfile', res);//save to state

                if(res.name){
                    vm.fullName = SetName(res.name);
                }else{
                    console.trace('error, no name');
                }

                localStorage.setItem('profile', JSON.stringify(res)); //save to localstorage
            });
        }else{
            if(!cachedName){
                vm.fullName = SetName(profileName.name);
            }else{
                vm.fullName = SetName(cachedName.name);
            }
        }

        function SetName(dataName){//set local component data fullname
            let name = "";
                if(dataName){
                    for (const key in dataName) {//get name from profile
                        if (dataName.hasOwnProperty(key)) { //get every element
                            const element = dataName[key];
                            if(element){
                                name +=  " " + element; //check that element has value and stack over name
                            }
                        }
                    }
                
                    return name.trim();
                }else{
                    console.trace('error invalid value for name');
                }
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
