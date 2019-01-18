<template>
    <div class="profile-actions">
        <p>{{accountType}} - Actions</p>

        <!-- accordion using css -->
        <ul class="accordion-container">
            <accordion>
                <h3 slot="title">Profile</h3>
                <router-link slot="content" to="/">To {{accountType}}</router-link>
            </accordion>
            <accordion>
                <h3 slot="title">Settings</h3>
                <ul slot="content">
                    <li><router-link to="/">{{accountType}}</router-link></li>
                    <li><router-link to="settings">Settings</router-link></li>
                    <li><router-link to="marketing">Marketing</router-link></li>
                </ul>
            </accordion>
            <accordion>
                <h3 slot="title">Account</h3>
                <button @click="logout()" slot="content">logout</button>
            </accordion>
        </ul>

    </div>
</template>
<script>
import Accordion from "../../parts/accordion";

export default {

    components:{
        "accordion": Accordion
    },
    computed:{
        accountType(){
            const localAccount = localStorage.getItem("accountType");
            const stateAccount = this.$store.getters.getAccountType;
            let accountType = stateAccount || localAccount;

            if(!accountType){
                this.$store.dispatch('getUser').then(res=>{
                        //save username
                        localStorage.setItem("accountType", res.accountType);
                        this.$store.commit("setAccountType", res.accountType);
                        //save account type
                        localStorage.setItem("username", res.username);
                        this.$store.commit("setUsername", res.username);

                        accountType = res.accountType;
                    });
            }

            return accountType;
        }
    },
    methods:{
        logout(){
            this.$store.dispatch('logout');
        }
    }
}
</script>
<style scoped>
.links a, a:active, a:hover, a:visited{
    /* color: black; */
    font-size: 1.5em;
}
.show{
    display: grid;
}
.accordion-container{
    display: grid;
    grid-template-columns: 1fr;
    padding: 0;
}
</style>
