<template>
    <div>
        <p>Profile - Actions</p>
        <router-link to="profile">Profile</router-link>
        <router-link to="settings">Settings</router-link>
        <button @click="logout()">logout</button>
    </div>
</template>
<script>
export default {
    data(){
        return {
            fullName: null
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
</style>
