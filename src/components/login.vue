<template>
    <div>
        <h1>Login</h1>
        <form>
            <label for="username">username</label>
            <input type="text" v-model="user.name" placeholder="Username">
            <label for="password">password</label>
            <input type="password" v-model="user.password" placeholder="Password">
            <button @click="submit">Send</button>
        </form>
    </div>
</template>
<script>
export default {
    data(){
        return{
            user:{
                name: '',
                password:''
            },
            submitted: false
        }
    },
    methods:{
        submit(event){
            event.preventDefault();

            //perform submit action here

            this.submitted = true;
        }
    }
}
</script>
<style scoped>

</style>
