<template>
    <div> 
        <h3>Explore</h3>

        <input type="text" v-model="searchQuery" placeholder="Search">
        <button @click.prevent="search()">Search</button>

        <router-view :searchQuery="searchQuery"/>
        
    </div>
</template>
<script>
export default {
    data(){
        return {
            searchQuery: null,
            result: null
        }
    },
    methods:{
        search(){
            const AccountType = this.$store.getters.getAccountType;
            if(AccountType == "profile"){
                this.$store.dispatch('findCompany', {name: this.searchQuery});//TODO: by id
            }else if(AccountType == "company"){
                this.$store.dispatch('findProfile', {name: this.searchQuery});//TODO: by id
            }else{
                //staff
            }
        }
    }
}
</script>
<style scoped>
</style>
