<template>
    <div class="landing">
        <h1>Landing Page</h1> 
        <button v-show="show"  to="/signup" @click="toSignup">Signup</button>
        <button v-show="!show" to="/login" @click="toLogin">Login</button>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    data(){
        return{
            show:true
        }
    }
    ,methods:{
        toLogin(){
            this.show = !this.show;
            // this.signup = !this.signup;
            this.$router.push('/login');
        },
        toSignup(){
            this.show = !this.show;
            // this.signup = !this.signup;
            this.$router.push('/signup');
        }
    }
}
</script>
<style scoped>
.landing{
    /* display:grid; */
    /* align-content: center;
    justify-content: center; */
    margin:0;
    padding: 0px;
}
.landing .login{
    text-align: center;
}
</style>
