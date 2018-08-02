<template>
    <div class="landing">
        <h1>Landing Page</h1> 
        <button @click="changeTo">{{to}}</button>
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
        changeTo(){
            let vm = this;

            if(this.to == 'login'){
                this.$router.push('/login');
                vm.to = 'signup';
            }else{
                this.$router.push('/signup');
                vm.to = 'login';
            }
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
