<template>
    <div class="nav">
        <div>
            <router-link to="/home">home</router-link>
            <router-link to="/settings">settings</router-link>
            <button @click="logout()">Logout</button>
        </div>
    </div>
</template>

<script>
export default {
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
