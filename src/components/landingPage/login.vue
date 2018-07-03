<template>
    <div class="login">
        <form>
            <h1 class="title">Login</h1>
            {{getData}}
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" v-model="user.username" placeholder="Username">
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" v-model="user.password" placeholder="Password">
            </div>
            <button @click="submit">Send</button>
        </form>
    </div>
</template>
<script>
export default {
    data(){
        return{
            user:{
                username: '',
                password:''
            },
            submitted: false
        }
    },
    methods:{
        submit(event){
            event.preventDefault();
            let vm=this;
            let result = this.$store.dispatch('login', this.user);
            result.then(res=>{
                this.$router.push('/home');
                // this.$store.commit('setLoginStatus', true);
            }).catch(err=>{
                //display custom error message
            });
        }
    },
    computed:{
        getData(){
            return this.$store.getters.getData;
        }
    }
}
</script>
<style scoped>
.login{
    padding: 10px;
}
.login form{
}

.login .form-group{
    display:grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, auto));
}
.login button{
    margin: 1rem;
}



</style>
