<template>
    <div class="landing">
        <h1>Landing Page</h1>
            <a v-if="to != 'signup'"  
                @click.prevent="changeTo('signup')" 
                href="/signup">signup</a>
            <a v-if="to != 'register'"  
                @click.prevent="changeTo('register')" 
                href="/register">register</a>
            <a  v-if="to != 'login'" 
                @click.prevent="changeTo('login')" 
                href="/login">login</a>

        <router-view></router-view>
    </div>
</template>
<script>
export default {
    data(){
        return{
            to:'login'
        }
    }
    ,methods:{
        changeTo(url){
            let vm = this;
                this.$router.push('/'+url);
                vm.to = url;
        }
    }
    ,beforeMount(){
        let path = window.location.pathname; //get path
        
        if(path == '/login'){
            this.to = 'signup';
        }else if(path = '/signup'){
            this.to = 'login';
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
