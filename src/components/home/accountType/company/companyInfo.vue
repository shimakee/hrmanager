<template>
    <div>
        <div class="company">
            <div class="avatar-container">
                <img class="avatar" :src='url'>
                <p class="description">{{tradename}}</p>
            </div>

                <!-- TODO make into individual components -->
            <ul class="info">
                <li v-for="(value, property) in company" v-bind:key="property"> <!--loop through profile properties-->

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
    computed:{
        company(){
            const cachedCompany = JSON.parse(localStorage.getItem('company'));
            const stateCompany = this.$store.getters.getCompany;
            let company = stateCompany || cachedCompany;

            if(!company){
                this.$store.dispatch('getCompany').then(res=>{//get new company data from backend
                    this.$store.commit('setCompany', res);//save to state
                    localStorage.setItem('company', JSON.stringify(res)); //save to localstorage

                    company = res;
                });
            }

            return company;
        },
        tradename(){
            let company = this.company;

            // if(!company){
            //     const cachedCompany = JSON.parse(localStorage.getItem('company'));
            //     const stateCompany = this.$store.getters.getCompany;
            //     company = stateCompany || cachedCompany;

            // }

            // if(company){
            //     return this.company.tradename;
            // }else{
            //     return "Tradename";
            // }

            return company.tradename;
        },
        url(){
            const cachedCompany = JSON.parse(localStorage.getItem('company'));
            const stateCompany = this.$store.getters.getCompany;
            let company = stateCompany || cachedCompany;
            let url;

            if(company && company.pics){
                const pic = company.pics.find(element=>{//find main picture
                    if(element.main == true || element.main == 'true'){
                        return element;
                    }
                });

                if(pic){
                    url = `/file/photo/me?name=${pic.filename}`;
                }
                // else{
                //     url = 'https://picsum.photos/100/100/?random';
                // }

            }
            if(!url){
                url = 'https://picsum.photos/100/100/?random';
            }

            return url;
        }
    }
    // ,created(){
    //     let localCompany = JSON.parse(localStorage.getItem('company'));//get profile data saved on local storage

    //     if(localCompany){
    //         this.$store.commit('setCompany', localCompany);//save localstorage profile to state

    //     }else{
    //         this.$store.dispatch('getCompany').then(res=>{//get new profile data from backend
    //             this.$store.commit('setCompany', res);//save to state
    //             localStorage.setItem('company', JSON.stringify(res)); //save to localstorage
    //         });
    //     }
    // }
}
</script>
<style scoped>
.company{
    display: grid; 
    grid-template-columns: 1fr;
}
.avatar-container{
    padding:.5em;
    margin:1.5em;
    text-align: center;
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    align-items: center;
}
.avatar-container img{
    width: 100%;
    border-radius: 20em;
}
.avatar-container p{
    font-size: 1em;
    padding: 0;
    margin: 12px 0;
}
/* .avatar{
} */
.info{
    list-style: none;
    text-align: center;
}
/* ul{
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, auto));
    grid-gap: 10px;
    padding: 0;
} */
 /* ul li.card-pic{
     background-color: cornsilk;
     display: grid;
     grid-template-columns: 1fr;
     justify-items: center;
     align-items: center;
 } */

</style>
