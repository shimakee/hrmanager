<template>
    <div class="profile">
            <h2>{{accountType}}</h2>
            <router-view /> 
    </div>
</template>
<script>
export default {
    computed:{
        accountType(){
            return this.$store.getters.getAccountType
        }
    }
}
</script>
<style scoped>
    h2{
        margin: 0;
        padding: 10px;
    }
</style>
