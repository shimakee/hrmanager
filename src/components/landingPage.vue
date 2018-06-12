<template>
    <div class="landing">
        <h1>Landing Page</h1> 
        <button @click="dynamicPart ='login'">login</button>
        <button @click="dynamicPart ='signup'">signup</button>
        <button @click="dynamicPart ='reset'">forgot password</button>
        <component v-bind:is="dynamicPart"></component>
    </div>
</template>
<script>
import login from './beforeAuth/login';
import signup from './beforeAuth/signup';
import reset from './beforeAuth/reset';

export default {
    data(){
        return{
            dynamicPart:'login'
        }
    },
    components:{
        'login':login,
        'signup':signup,
        'reset':reset
    }
}
</script>
<style scoped>
.landing{
    display:grid;
    align-content: center;
    justify-content: center;
}
.landing .login{
    text-align: center;
}
</style>
