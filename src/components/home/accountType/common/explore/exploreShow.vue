<template>
    <div> 
        <ul><!--//iterate over array-->
            <li v-for="(value, key) in exploreResult" v-bind:key="key"
                :class="{chosen: itemActive == value.tradename}"
                class="explore-card">

                <!--TODO: separate pecialized and common components like goc, address, email, contact-->
                <div v-for="(v, k) in value" v-bind:key="k"><!-- iterate over object-->
                    <h3 v-if="k =='tradename'
                         && accountType == 'profile'">{{v}}</h3>
                    <p v-if="k =='ownershipType'
                         && accountType == 'profile'">Ownership type: {{v}}</p>

                    <span v-if="k == 'authenticated'" :class="{authenticated: v, unauthenticated: !v}">

                    </span>

                    <accordion  v-if="k=='contact' && v.length > 0"
                        :inputType="'checkbox'">
                        <h3 slot="title">Contact</h3>
                        <div slot="content">
                            <router-view
                            name="contactShow" 
                            :editable="false"
                            :contacts="v" />
                        </div>
                    </accordion>
                
                    <accordion v-if="k == 'address' && v.length > 0"
                        :inputType="'checkbox'">
                        <h3 slot="title">Address</h3>
                        <div slot="content">
                            <router-view
                            name="addressShow"
                            :autoLocate="autoLocate"
                            :autoAddress="false"
                            :editable="false"
                            :showMap="false"
                            :address="v" />
                        </div>
                    </accordion>

                    <accordion v-if="k == 'email' && v.length > 0"
                        :inputType="'checkbox'">
                        <h3 slot="title">Email</h3>
                        <div slot="content">
                            <router-view
                            name="emailShow"
                            :emails="v" />
                        </div>
                    </accordion>

                    <span v-if="k=='businesses' && v.length > 0 && accountType == 'profile'">
                        <p> {{k}} : {{v}} </p>
                    </span>

                    <accordion v-if="k == 'pics' && v.length > 0"
                        :inputType="'checkbox'">
                        <h3 slot="title">Pictures</h3>
                        <div slot="content">
                            <router-view
                            name="galleryShow"
                            :pics="v"
                            :editable="false"/>
                        </div>
                    </accordion>

                    <!--TODO: generate card for personal details-->
                    <span v-if="k == 'birthdate'">
                            <p><b>{{k}}:</b> {{parseBirthdate(v)}} </p>   
                    </span>
                    <span v-if="k == 'name'" v-for="(n,o) in v">
                            <p><b>{{o}}:</b> {{n}}</p>
                    </span>
                    <span v-if="k == 'civilStatus'">
                            <p><b>{{k}}:</b> {{v}} </p>   
                    </span>
                    <span v-if="k == 'gender'">
                            <p><b>{{k}}:</b> {{v}} </p>   
                    </span>
                    <!-- <span v-if="v.length > 0 && k == 'birthdate' || k == 'civilStatus' || k == 'gender' || k == 'name' || k == 'relatives'">
                            {{k}}: {{v}}    
                    </span> -->

                </div>
                <span v-if="accountType == 'profile'">
                    <button v-if="!hasApplied(value._id)"
                        @click.prevent="apply(value._id)">Apply</button>
                    <button v-if="hasApplied(value._id)"
                        @click.prevent="cancelApplication(value._id)">Cancel Application</button>
                </span>
                <span v-if="accountType == 'company'">
                    <button >Scout</button> <!--Scout employee-->
                    <button >Accept</button> <!--Accept employee if already applied-->
                    <button >Decline</button> <!--Decline employee if already applied-->
                    <button >Cancel Recruitment</button> <!--Cancel recruitment of employee-->
                </span>
            </li>
        </ul>
        
    </div>
</template>
<script>

import Accordion from "../../../../parts/accordion";

export default {
    components:{
        "accordion": Accordion
    },
    computed:{
        accountType(){
            return this.$store.getters.getAccountType;
        },
        companiesApplied(){
            return this.$store.getters.getCompaniesEmployed;
        },
        exploreResult(){//according to account type
            const AccountType = this.$store.getters.getAccountType;
            if(AccountType == "profile"){
                return this.$store.getters.getCompaniesSearched;
            }else if(AccountType == "company"){
                return this.$store.getters.getProfilesSearched;
                console.log('company search result');
            }else{
                //staff
            }
        },
        autoLocate(){
            const AUTO_LOCATE = this.$store.getters.getAllowAutoLocate;
            return AUTO_LOCATE;
        }
    },
    data(){
        return{
            itemActive: null,
            employers: null
        }
    },
    methods:{
        apply(companyId){
            this.$store.dispatch('applyToCompany', companyId)
                .then(res=>{
                    this.$store.dispatch('getEmployers');
                    console.log('applied');
                }).catch(err=>{
                    console.log('applied failed');
                });
        },
        cancelApplication(companyId){
            this.$store.dispatch('cancelApplication', companyId)
                .then(res=>{
                    this.$store.dispatch('getEmployers');
                    console.log('canceled application');
                }).catch(err=>{
                    console.log('cancel failed failed');
                });
        },
        hasApplied(companyId){
            let companiesApplied = this.$store.getters.getCompaniesEmployed;
            
            for (let i = 0; i < companiesApplied.length; i++) {
                const element = companiesApplied[i]._id;
                if(companyId == element.company){
                    return true;
                }else{
                    continue;
                }
            }

            return false;
        },
        parseBirthdate(birthdate){
            let date = new Date(birthdate);

           
            const month =  date.toLocaleString('en-us', { month: 'long' });
            // const month = date.getMonth()+1; //zero based
            const day = date.getDate();
            const year = date.getFullYear();

            return `${month} ${day},${year}`; //use this format to be compatible with input format
        },
    },
    beforeMount(){
        const AccountType = this.$store.getters.getAccountType;

        if(AccountType == 'profile'){
            this.$store.dispatch('getEmployers');
        }
    }
}
</script>
<style scoped>
.chosen{
    outline: solid 3px blue;
}
.authenticated, .unauthenticated{
    border-radius: 50px;
    padding:10px;
    font-size: 5px;
}
.unauthenticated{
    background-color: red;
}
.authenticated{
    background-color: green;
}
ul{
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, auto));
    grid-gap: 20px;
    padding: 0;
}
ul li.explore-card{
    padding: 10px;
}
span p{
    margin: 3px;
}
</style>
