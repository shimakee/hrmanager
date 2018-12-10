<template>
    <div class="landing">
        
        <div class="form-container">
            <router-view></router-view>
            <div class="btn-container">
                    <a v-if="to != 'signup'"  class="btn"
                        @click.prevent="changeTo('signup')" 
                        href="/signup">signup</a>

                    <a v-if="to != 'register'"  class="btn"  
                        @click.prevent="changeTo('register')" 
                        href="/register">register</a>

                    <a v-if="to != 'login'"  class="btn" 
                        @click.prevent="changeTo('login')" 
                        href="/login">login</a>
            </div>
        </div>
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
        // let path = window.location.pathname; //get path
        
        // if(path == '/login'){
        //     this.to = 'signup';
        // }else if(path = '/signup'){
        //     this.to = 'login';
        // }
    }
}
</script>
<style>
body, html{
    padding: 0px;
    margin: 0px;
}
.landing{   
    /* position:absolute; */
    margin:0;
    padding: 0px;
    background-image: url("../../assets/hunters-race-408744-unsplash.jpg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    text-align: center;
    display: grid;
    grid-template-columns: 1fr;
    align-content: center;
    justify-items: center;
}
.btn,
.btn:hover,
.btn:active, 
.btn:visited{
    padding: 3px 9px;
    color: black;
    font-size: 1em;
    text-decoration: none;
}
.btn-container .btn:active,.btn-container .btn:hover{
    font-weight: bolder;
    transform: scale(1.5);
    color: rgb(6, 11, 80);
}
.landing .btn-container a{
    color: rgb(6, 11, 80);
    font-size: 20px;
    /* color: dodgerblue; */
    transition: .2s ease-in-out;
}
.landing .btn-container a:active{
    color: dodgerblue;
}
.landing .btn-container{
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 10px;
    justify-content: center;
}
@media (max-width: 480px) { /*mobile*/
    .landing{
        position:absolute;
        height:100%;
        width:100%;
    }
    /* .landing .btn-container{
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 15px;
    } */
    .landing .btn-container :first-child{
        border-right: black 1px solid; 
    }
    .form-container{
        margin: 1em 5px;
        /* padding: 0em 1em 1em 1em; */
        background-color: rgba(149, 198, 221, 0.5);
        border-radius: 5px;
    }
 }
 @media (min-width:480px) and (max-width: 1024px) and (orientation: landscape) { /*tablet*/
    .landing{
        /* position:absolute; */
        height:100%;
        width:100%;
    }
 }
 @media (min-width:480px) and (max-width: 1024px) and (orientation: portrait) { /*tablet*/
    .landing{
        position:absolute;
        height:100%;
        width:100%;
    }
 }

@media (min-width:480px) and (max-width: 1024px) { /*tablet*/
    /* .landing{
        position:absolute;
        height:100%;
        width:100%;
    } */
    .form-container{
        margin: 1em 2em;
        /* padding: 0em 1em 1em 1em; */
        background-color: rgba(149, 198, 221, 0.5);
        border-radius: 5px;
    }
    /* .landing .btn-container{
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 15px;
        justify-content: center;
    } */
}
@media (min-width: 1024px) { /*Laptop & tvs*/
    .landing{
        position:absolute;
        height:100%;
        width:100%;
    }
    .form-container{
        width: 50vw;
        margin: 1em 2em;
        /* padding: 0em 1em 1em 1em; */
        background-color: rgba(149, 198, 221, 0.5);
        border-radius: 5px;
    }
    /* .landing .btn-container{
        display: grid;
        grid-template-columns: 1fr;
        padding: 10px;
        justify-content: center;
    } */
 }
</style>
