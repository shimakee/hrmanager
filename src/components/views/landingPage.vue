<template>
    <div class="landing">
        <h1>Landing Page</h1> 
        <component v-bind:is="view"></component>
    </div>
</template>
<script>
import login from '../landingPage/login';
import signup from '../landingPage/signup';
import reset from '../landingPage/reset';

export default {
    data(){
        return{
        }
    },
    components:{
        'login':login,
        'signup':signup,
        'reset':reset
    },
    computed:{
        view(){
            return this.$store.state.view;
        }
    },
    methods:{
        changeView(component){
            this.$store.commit('changeView', component);
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
