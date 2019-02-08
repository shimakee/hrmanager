<template>
    <div> 
        <h3>Explore</h3>

        <input type="text" v-model="searchQuery" placeholder="Search">
        <button @click.prevent="search()">Search</button>
        
    </div>
</template>
<script>
export default {
    data(){
        return {
            searchQuery: null
        }
    },
    methods:{
        search(){
            this.$store.dispatch('findCompany', {name: this.searchQuery})//TODO: by id
                .then(res=>{
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
