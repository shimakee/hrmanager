<template>
    <div>
        <h2>Reset Password</h2>
        <form>
            <label for="password">Password: </label>
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
                new:'',
                newConfirm:'',
                token: this.$store.getters.getResetToken
            },
            submitted: false
        }
    },
    methods:{
        submit(){
            this.submitted = true;
            
            this.$store.dispatch('sendCommit', {url:"/user/reset", method:'put', data: this.password})
                .then(res=>{
                    this.submitted = true;
                    this.$router.push('/login');
                }).catch(err=>{
                    this.submitted = false;
                });
        }
    }
}
</script>
<style scoped>
    div{
        margin: 1em;
    }
</style>
