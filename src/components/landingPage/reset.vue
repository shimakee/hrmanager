<template>
    <div class="reset">
        <h1>Reset Password</h1>
        <form>
            <div class="input-group">
                <label for="username">username</label>
                <input type="text" v-model="user.username" placeholder="Username">
            </div>
            <!-- <div class="input-group">
                <label for="email">email</label>
                <input type="text" v-model="user.email" placeholder="Email address">
            </div> -->
            <button @click="submit">Send</button>
        </form>
    </div>
</template>
<script>
export default {
    data(){
        return{
            user:{
                username: ''
            },
            submitted: false
        }
    },
    methods:{
        submit(event){
            event.preventDefault();
            this.$store.dispatch('resetPass', this.user);
            this.submitted = true;
        }
    }
}
</script>
<style scoped>
.reset{
    padding: 10px;
}
.reset form{
    display: grid;
    justify-items: center;
    grid-template-columns: 1fr;
}
.reset .input-group{
    display: grid;
    justify-items: center;
    margin: 5px 0;
}
</style>
