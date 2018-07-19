<template>
    <div>
        <!-- <h2>Change Password</h2> -->
        <form>
            <label for="password">Password: </label>
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
            this.$store.dispatch('changePassword', this.password);
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
