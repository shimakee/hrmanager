<template>
    <div class="landing">
        <h1>Landing Page</h1> 
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    data(){
        return{
        }
    },
    methods:{
    }
}
</script>
<style scoped>
.landing{
    /* display:grid; */
    /* align-content: center;
    justify-content: center; */
    margin:0;
    padding: 0px;
}
.landing .login{
    text-align: center;
}
</style>
