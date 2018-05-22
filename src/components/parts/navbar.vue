<template>
    <div>
        <button @click="goHome">home</button>
        <button @click="goLogin">login</button>
        <router-link to="/login">Login</router-link>
    </div>
</template>

<script>
export default {
    data: function(){
        return{
            name: 'kenneth'
        }
    },
    methods:{
        goHome(){
            this.$router.push("/");
        },
        goLogin(){
            this.$router.push("/login");
        }
    }
}
</script>
<style scoped>

</style>
