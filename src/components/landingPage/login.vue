<template>
    <div class="login">
        <form>
            <h1 class="title">Login</h1>
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" v-model="user.username" placeholder="Username" autofocus>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" v-model="user.password" placeholder="Password">
            </div>
            <!-- <div class="form-group">
                <label for="password">Account type</label>
                <select v-model="user.accountType">
                    <option value="profile">Profile</option>
                    <option value="company">Company</option>
                    <option value="staff">Staff</option>
                </select>
            </div> -->
            <button @click.prevent="submitLogin">Send</button>
            <button @click.prevent="submitReset">Forgot Password</button>
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
                    console.log('login failed');
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
                        console.log('reset failed');
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
.login{
    padding: 10px;
}
.login form{
}

.login .form-group{
    /* display:grid; */
    /* grid-template-columns: repeat(auto-fit, minmax(100px, auto)); */
}
.login button{
    margin: 1rem;
}



</style>
