<template>
    <div class="nav">
        <!-- <div v-if="isLoggedIn === false">
            <router-link to="/login">login</router-link>
            <router-link to="/signup">signup</router-link>
            <router-link to="/reset">reset</router-link>
        </div> -->
        <div v-if="isLoggedIn === true">
            <router-link to="/home">home</router-link>
            <router-link to="/settings">settings</router-link>
            <button @click="logout()">Logout</button>
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
            return this.$store.getters.hasToken;
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
.nav{
    background-color: aquamarine;
    padding: 10px;
}
</style>
