<template>
    <div class="nav">
        <div v-if="isLoggedIn === false">
            <button @click="changeView('/', 'login')">Login</button>
            <button @click="changeView('/', 'signup')">Signup</button>
            <button @click="changeView('/', 'reset')">Reset</button>
        </div>
        <div v-if="isLoggedIn === true">
            <button @click="changeView('/home', 'home')">Home</button>
            <button @click="changeView('/settings', 'settings')">Settings</button>
            <button @click="logout('/', 'login')">Logout</button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            
        }
    },
    computed:{
        isLoggedIn(){
            return this.$store.state.isLoggedIn;
        }
    },methods:{
        changeView(route, component){
            this.$store.commit('changeView', component);//change page internal component
            this.$router.push(route);//push to page
        },
        logout(route, component){
            this.$store.commit('setLoginStatus', false);//set isLoggedIn to false
            //clear $store data token
            this.$store.commit('changeView', component);//change page internal component
            this.$router.push(route);
        }
    }
}
</script>
<style scoped>
.nav{
    background-color: aquamarine;
    padding: 10px;
}
</style>
