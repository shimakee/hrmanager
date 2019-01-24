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

            <button v-if="!loginSubmitted" class="btn primary" @click.prevent="submitLogin">Send</button>
            <span v-else class="info">Submitting...</span>

            <br>
            <span class="error" v-if="errorMessage">
                {{errorMessage}}
            </span>
            <span class="info" v-if="infoMessage">
                {{infoMessage}}
            </span>
        </form>
    </div>
</template>
<script>
export default {
    data(){
        return{
            user:{
                username: '',
                password: ''
            },
            loginSubmitted: false,
            resetSUbmitted: false
            // errorMessage: null
        }
    },
    computed:{
        errorMessage(){
            return this.$store.getters.getErrorMessage;
        },
        infoMessage(){
            return this.$store.getters.getInfoMessage;
        }
    }
    ,methods:{
        submitLogin(){
            this.loginSubmitted=true;
            
            //TODO:clientside form validation
            const username = this.user.username;
            const password = this.user.password;

            
            if(username && password){
                this.$store.dispatch('sendLogin', this.user)
                    .then(res=>{
                        //clear messages
                        this.$store.commit('setInfoMessage', null);
                        this.$store.commit('setErrorMessage', null);
                        //reroute to home page
                        this.$router.push({name:'home'});
                        console.log('login vue sucess');
                    }).catch(err=>{
                        this.loginSubmitted=false;
    
                        //display error message
                        console.log('login vue failed', err.response);
                        this.$store.commit('setErrorMessage', err.response.statusText);
                    });
            }else{
                this.loginSubmitted=false;
                //TODO: change to switch statement
                //clientside validation
                if(!username && !password){//error no input
                    this.$store.commit('setErrorMessage', 'Username & password input required.');
                }else{
                    if(username == null || username == ''){//error no username
                        this.$store.commit('setErrorMessage', 'Username input required.');
                    }
                    if(password == null || password == ''){//error no password
                        this.$store.commit('setErrorMessage', 'Password input required.');
                    }
                }
            }

        }
        ,submitReset(){
            this.resetSubmitted=true;

            if(this.user.username){//validation - username input

                //send commit
                this.$store.dispatch('resetPass', {username: this.user.username})
                    .then(res=>{
                        //clear error message
                        this.$store.commit('setErrorMessage', null);

                        //display success message
                        console.log('Reset Vue success');
                        this.$store.commit('setInfoMessage', 'Account reset success.');
                    }).catch(err=>{
                        this.resetSubmitted=false;
                        
                        //display error message
                        console.log('Reset Vue submit failed', err);
                        this.$store.commit('setErrorMessage', 'Account reset Failed.');
                    });
            }else{
                //display prompt message to input username
                console.log('Reset vue failed, required input on username');
                this.$store.commit('setErrorMessage', 'Input required on username.');
            }
        }
    },
    mounted(){
        this.$store.dispatch('clearDIsplayMessages');
    }
}
</script>
<style scoped>
.landing{
    position:absolute;
}
.error{
    color: rgb(250, 17, 64);
    font-family: sans-serif;
    text-shadow: 0px 0px 1px rgb(6, 11, 80);
    font-weight: bolder;
}
.info{
    color: rgb(45, 236, 19);
    font-family: sans-serif;
    text-shadow: 0px 0px 1px rgb(6, 11, 80);
    font-weight: bolder;
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
