<template>
    <div>
        <h1>Settings</h1>

        <h2>Reset Password</h2>
        <form>
            <label for="email">email</label>
            <input type="text" v-model="user.email" placeholder="Email">
            <label for="password">password</label>
            <input type="password" v-model="user.password.old" placeholder="Old password">
            <input type="password" v-model="user.password.new" placeholder="New password">
            <input type="password" v-model="user.password.newConfirm" placeholder="New password confirm">
            <button @click="submit">Send</button>
        </form>
    </div>
</template>
<script>
export default {
    data(){
        return{
            user:{
                email: '',
                password:{
                    old:'',
                    new:'',
                    newConfirm:''
                }
            }
        }
    },
    methods:{
        submit(event){
            event.preventDefault();
            
            var vm=this;
            console.log(this.user);
        }
    }
}
</script>
<style scoped>

</style>
