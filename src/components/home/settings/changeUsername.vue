<template>
    <div>
        <!-- <h2>Change Username</h2> -->
        <form>
            <label for="password">Username: </label>
            <input type="text" v-model="user.username" placeholder="new username">
            <button @click="submit">Send</button>
        </form>
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
        submit(event){
            event.preventDefault();
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
