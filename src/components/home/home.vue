<template>
    <div>
        <nav-bar />
        <router-view></router-view>
    </div>
</template>
<script>
import Navbar from "../parts/navbar";

export default {
    components:{
        "nav-bar": Navbar
    }
    ,created(){
        this.$store.dispatch('autoLogout'); 
    }
}
</script>
<style scoped>

</style>
