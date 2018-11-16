<template>
    <div class="home">
        <!-- <nav-bar /> -->
        <router-view class="content"></router-view>
        <router-view name="info" class="info"></router-view>
        <router-view name="actions" class="actions"></router-view>
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
.home{
    display: grid; 
    grid-template-columns: 1fr 3fr;
    text-align: center;
}
.info{
    text-align: center;
    /* background-color: green; */
}
.actions{
    text-align: center;
    /* background-color: blue; */
}
.content{
    grid-row: 1/span 2;
    grid-column: 2/span 2;
    /* background-color: aqua; */
}
</style>
