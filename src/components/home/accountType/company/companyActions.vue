<template>
    <div>
        <p>Profile - Actions</p>
        <span class="links">
        <router-link to="company">Company</router-link>
        <router-link to="settings">Settings</router-link>
        <router-link to="marketing">Marketing</router-link>
        </span>
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
