<template>
    <div class="profile">
        <div class="container">
            <div class="avatar-container">
                <img class="avatar" :src='url' :alt="fullName">
            </div>
            <p class="description">{{fullName}}</p>
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
                <span v-else-if="value && property == 'birthdate'"> <!--handling date string-->
                    {{property}}: {{parseBirthdate(value)}}
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
    methods:{
        parseBirthdate(birthdate){
            let date = new Date(birthdate);

            const month = date.getUTCMonth()+1; //zero based
            const day = date.getUTCDate();
            const year = date.getUTCFullYear();

            return `${month}/${day}/${year}`;
        }
    },
    computed:{
        profile(){
            let profile = this.$store.getters.getProfile;
            // const localProfile = JSON.parse(localStorage.getItem('profile'));
            // let profile = stateProfile || localProfile;

            if(!profile){
                this.$store.dispatch('getProfile').then(res=>{//get new profile data from backend
                    this.$store.commit('setProfile', res);//save to state
                    localStorage.setItem('profile', JSON.stringify(res)); //save to localstorage

                    profile = res;
                });
            }

            return profile;
        },
        fullName(){
            let profile = this.profile
            
            let fullName = "";
            if(profile){
                const name = profile.name;

                for (const key in name) {//get name from profile
                    if (name.hasOwnProperty(key)) { //get every element
                        const element = name[key];
                        if(element){
                            fullName +=  " " + element; //check that element has value and stack over name
                        }
                    }
                }
            
                return fullName.trim();
            }else{
                return "Unknown Profile";
            }
        },
        url(){
            const PICS = this.$store.getters.getPics;
            const DEFAULT_URL = 'https://picsum.photos/100/100/?random';
            let url;

            if(PICS){
                //find main picture
                const pic = PICS.find(element=>{
                    if(element.main == true || element.main == 'true'){
                        return element;
                    }
                });

                const baseUrl = 'http://localhost'//TODO:to be removed on production

                if(pic){
                    url = `${baseUrl}/file/photo/me?name=${pic.filename}`;
                }else{
                    url = DEFAULT_URL;
                }

            }else{
                url =  DEFAULT_URL;
            }

            return url;
        }
    }
}
</script>
<style scoped>
.profile{
    display: grid; 
    grid-template-columns: 1fr;
    /* margin: 0px 15px; */
}
.container{
    padding:.5em;
    margin:1.5em;
    text-align: center;
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    align-items: center;
}
.avatar-container{
    width: 100px;
    height: 100px;
    overflow: hidden;
    display: grid;
    border-radius: 50px;
    justify-content: center;
    align-content: center;
}
.container img{
    max-width: 150px;
    max-height: 150px;
}
.container p{
    font-size: 1em;
    padding: 0;
    margin: 12px 0;
}
.info{
    list-style: none;
    text-align: center;
}

</style>
