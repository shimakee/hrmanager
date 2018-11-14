<template>
    <div class="error">
        <h1>Error</h1>
        <p>please logout and relogin</p>
        <p>willauto logout in 10 secods</p>
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
.error{
    background-color: aquamarine;
    padding: 10px;
}
</style>
