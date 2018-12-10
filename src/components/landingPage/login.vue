<template>
    <div class="login-form">
        <h1 class="title">Login</h1>
        <form>
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" v-model="user.username" placeholder="Username" autofocus>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" v-model="user.password" placeholder="Password">
            </div>
            <a @click.prevent="submitReset">Forgot Password?</a>
            <button class="btn primary" @click.prevent="submitLogin">Send</button>
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
            loginSubmitted: false,
            resetSUbmitted: false
        }
    }
    ,methods:{
        submitLogin(){
            this.loginSubmitted=true;
            this.$store.dispatch('login', this.user)
                .then(res=>{

                    this.$router.push({name:'home'});
                    //display error message
                    console.log('login sucess');
                }).catch(err=>{
                    this.loginSubmitted=true;

                    //display error message
                    console.log('login failed', err);
                });
        }
        ,submitReset(){
            this.resetSubmitted=true;

            if(this.user.username){//check that it has value to be submitted
                this.$store.dispatch('resetPass', {username: this.user.username})
                    .then(res=>{
                        //display success message
                        console.log('reset success');
                    }).catch(err=>{
                        this.resetSubmitted=false;
                        
                        //display error message
                        console.log('reset failed', err);
                    });
            }else{
                //display prompt message to input username
                console.log('Input in username required');
            }
        }
    }
}
</script>
<style scoped>
.landing{
    position:absolute;
}
.login-form{
    /* margin: 20px 0; */
    display: grid;
    grid-template-columns: 1fr;
}
.login-form h1{
    background-color: rgb(6, 11, 80);
    color:white;
    margin: 0 0 15px 0;
    padding: 15px 0;
    width: 100%;
}
.btn.primary{
    color:white;
    background-color: dodgerblue;
    border: solid 3px dodgerblue;
    /* background-color: rgb(6, 11, 80);
    border: solid 3px rgb(6, 11, 80); */
    border-radius: 10px;
    margin: 1em .5em;
    padding: .5em 1em;
    transition: .3s ease-in;
}
.btn.primary:active{
    text-shadow: 0px 0px 10px rgb(3, 6, 46);
    background-color: rgb(6, 11, 80, .0);
    border: solid 3px dodgerblue;
}
.btn.primary:hover{
    text-shadow: 0px 0px 10px rgb(3, 6, 46);
    background-color: rgb(6, 11, 80, .0);
    border: solid 3px rgb(6, 11, 80);
    /* transform: scale(1.1); */
}
.form-group input, .form-group select{
    text-align: center;
    font-size: 15px;
    padding: 3px 0px;
    color: rgb(28, 28, 46);
    /* font-weight: bolder; */
}
.login-form form{
    padding: 10px 15px;
}
.login-form .form-group{
    display:grid;
    grid-template-columns: 1fr 2fr;
    /* justify-self: stretch; */
}
.login-form .btn.primary{
    justify-self: center;
    align-self: center;
}
@media (max-width: 480px) { /*mobile*/
}
@media (min-width:480px) and (max-width: 1024px) { /*tablet*/
    .login-form form{
        margin: 15px 0;
    }

 }
@media (min-width: 1024px) { /*Laptop & tvs*/
    .login-form form{
        /* width: 600px; */
        margin: 0 1.5em;
        display:grid;
        grid-template-columns: minmax(100px, 500px);
        justify-content: center;
    }
    /* .login-form .form-group{
        display:grid;
        grid-template-columns: 1fr 2fr;
    } */
 }
</style>
