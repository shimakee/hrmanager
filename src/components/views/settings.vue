<template>
    <div>
        <h1>Settings</h1>

        <h2>Change Password</h2>
        <form>
            <label for="password">password</label>
            <input type="password" v-model="password.old" placeholder="Old password">
            <input type="password" v-model="password.new" placeholder="New password">
            <input type="password" v-model="password.newConfirm" placeholder="New password confirm">
            <button @click="submit">Send</button>
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
        submit(event){
            event.preventDefault();

            this.submitted = true;
        }
    }
}
</script>
<style scoped>

</style>
