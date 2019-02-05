<template>
    <div>
        <!-- <h2>Change Password</h2> -->
        <form>
            <label for="password">Password: </label>
            <input type="password" v-model="password.old" placeholder="Old password">
            <input type="password" v-model="password.new" placeholder="New password">
            <input type="password" v-model="password.newConfirm" placeholder="New password confirm">
            <button @click.prevent="submit">Send</button>
        </form>
    </div>
</template>
<script>
export default {
    data(){
        return{
            password:{
                old:'',
                new:'',
                newConfirm:''
            },
            submitted: false
        }
    },
    methods:{
        submit(){
            this.submitted = true;//should be onload?

            this.$store.dispatch('changePassword', this.password)
                .then(res=>{
                    this.submitted = true;
                    
                    this.$store.dispatch('maintainData');
                    this.$store.commit('setInfoMessage', "Password changed.");
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
