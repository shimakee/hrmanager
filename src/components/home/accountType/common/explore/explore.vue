<template>
    <div> 
        <h3>Explore</h3>

        <input type="text" v-model="searchQuery" placeholder="Search">
        <button @click.prevent="search()">Search</button>

        <router-view />
        
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
            this.$store.dispatch('findCompany', {name: this.searchQuery})//TODO: by id
                .then(res=>{
                    this.$store.commit('setExploreResult', res);
                    this.result = res;
                    console.log(res)
;                }).catch(err=>{ 
                    console.log(err);
                });
        }
    }
}
</script>
<style scoped>
</style>
