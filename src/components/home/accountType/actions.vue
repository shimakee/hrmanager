<template>
    <div class="profile-actions">
        <p>Profile - Actions</p>
        <span class="links">
        <router-link to="profile">Profile</router-link>
        <router-link to="settings">Settings</router-link>
        <router-link to="marketing">Marketing</router-link>
        </span>
        <button @click="logout()">logout</button>
        {{accountType}}
    </div>
</template>
<script>
export default {
    data(){
        return {
            fullName: null
        }
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
/* .actions{
        position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
} */
</style>
