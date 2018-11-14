<template>
    <div class="profile">
            <h2>Profile</h2>
            <router-view />
    </div>
</template>
<script>

export default {
    // data(){
    //     return {
    //         accountType: this.$store.getters.getAccountType
    //     }
    // },
    computed:{
        accountType(){
            return this.$store.getters.getAccountType
        }
    }
}
</script>
<style scoped>
</style>
