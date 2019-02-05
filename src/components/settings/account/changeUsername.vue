<template>
    <div>
        <!-- <h2>Change Username</h2> -->
        <form>
            <label for="password">Username: </label>
            <input type="text" v-model="user.username" placeholder="new username">
            <button @click.prevent="submit">Send</button>
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
        submit(){
            this.submitted = true;

            this.$store.dispatch('changeUsername', this.user)
                .then(res=>{
                    
                    this.$store.dispatch('maintainData');
                    this.$store.commit('setInfoMessage', "Username changed.");
                    this.$store.commit('setErrorMessage', null);
                }).catch(err=>{
                    this.submitted = false;
                    this.$store.commit('setInfoMessage', null);
                    this.$store.commit('setErrorMessage', err.response.statusText);
                });
        }
    },
    mounted(){
        this.$store.dispatch('clearDisplayMessages');
    }
}
</script>
<style scoped>
div{
        margin: 1em;
    }
</style>
