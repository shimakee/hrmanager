<template>
    <div>
        <!-- <h2>Change Username</h2> -->
        <form>
            <label for="password">Username: </label>
            <input type="text" v-model="user.username" placeholder="new username">
            <button @click.prevent="submit">Send</button>
        </form>

        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
        <h1>Something</h1>  
    </div>
</template>
<script>
export default {
    data(){
        return{
            user:{
                username:''
            },
            submitted: false
        }
    },
    methods:{
        submit(){
            this.$store.dispatch('changeUsername', this.user);
            this.submitted = true;
        }
    }
}
</script>
<style scoped>
div{
        margin: 1em;
    }
</style>
