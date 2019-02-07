<template>
    <div class="register-form">
        <h1>Register</h1>
        <form class="form-group">
            <!--TODO create component for input-->
            <div class="input-group">
                <label for="username">Username</label>
                <input type="text" v-model="identity.user.username" placeholder="Username">
            </div>

            <div class="input-group">
                <!-- <div class="input-group"> -->
                    <label for="password">Password</label>
                    <input type="password" v-model="identity.user.password" placeholder="Password">
                <!-- </div> -->
                <!-- <div class="input-group"> -->
                    <!-- <label for="passConfirm">password confrim</label> -->
                    <input type="password" v-model="identity.user.passConfirm" placeholder="Confirm password">
                <!-- </div> -->
            </div>

            <div class="input-group">
                <label for="email">Email</label>
                <input type="text" v-model="identity.company.email.address" placeholder="Email address">
            </div>

             <div class="input-group">
                <label for="fullname">Tradename</label>
                <input type="text" v-model="identity.company.tradename" placeholder="Tradename">
            </div>

             <div class="input-group">
                <label for="ownership">Ownership type</label>
                <select v-model="identity.company.ownershipType">
                    <option value="sole">Sole proprietor</option>
                    <option value="partnership">Partnership</option>
                    <option value="corporation">Corporation</option>
                </select>
            </div>

            <button v-if="!submitted" class="btn primary" @click.prevent="submit">Send</button>
            <span v-else class="info">{{infoMessage}}</span>

            <br>
            <span class="error" v-if="errorMessage">
                {{errorMessage}}
            </span>

        </form>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    data(){
        return{
            identity:{
                user:{
                username:'',
                password:'',
                passConfirm:''
                },
                company:{
                    tradename:'',
                    ownershipType: 'sole',
                    // owner: [{ //do i need this? or just add owner when updating instead of here in registration
                    //     profile:'', //get profile ID from store
                    //     position:'' //default position is proprietor for sole, and CEO for corp
                    // }],
                    owner:[],
                    email:{
                        main:true,
                        address:''
                    }
                }
            },
            submitted:false
        }
    },
    methods:{
        submit(){
            this.submitted = true;

            //set info and error messages
            this.$store.commit('setInfoMessage', "Submitting...");
            this.$store.commit('setErrorMessage', null);

            this.$store.dispatch('register', this.identity)
                .then(res=>{

                    this.$store.commit('setInfoMessage', null);
                    this.$store.commit('setErrorMessage', null);

                    this.$router.push('/home');
                }).catch(err=>{
                    this.submitted = false
                    console.log(err);

                    //display error message
                    this.$store.commit('setInfoMessage', null);
                    this.$store.commit('setErrorMessage', err.response.data.message);
                });
        }
    },
    computed:{
        errorMessage(){
            return this.$store.getters.getErrorMessage;
        },
        infoMessage(){
            return this.$store.getters.getInfoMessage;
        }
    },
    beforeMount(){
        this.$store.dispatch('clearDisplayMessages');
    }
}
</script>
<style scoped>
.info{
    color: rgb(45, 236, 19);
    font-family: sans-serif;
    text-shadow: 0px 0px 1px rgb(6, 11, 80);
    font-weight: bolder;
    text-align: center;
    grid-column: 1/-1;
}
.error{
    color: rgb(240, 16, 54);
    font-family: sans-serif;
    text-shadow: 0px 0px 1px rgb(6, 11, 80);
    font-weight: bolder;
    text-align: center;
    grid-column: 1/-1;
}
.register-form{
    display:grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-content: center;
}
.register-form .input-group{
    display:grid;
    grid-template-columns: 1fr;
    align-items: center;
    justify-items: center;
}
.register-form label{
    font-weight: bolder;
}
.form-group input, .form-group select{
    text-align: center;
    font-size: 15px;
    padding: 3px 0px;
    color: rgb(28, 28, 46);
    /* font-weight: bolder; */
}
.register-form form{
    padding: 15px;
}
.register-form h1{
    background-color: rgb(6, 11, 80);
    margin: 0;
    padding: 10px 0;
    color:white;
}
.btn.primary{
    color:white;
    background-color: rgb(6, 11, 80);
    border: solid 3px rgb(6, 11, 80);
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
}
@media (max-width: 480px) { /*mobile*/
    .register-form .form-group{
        display:grid;
        grid-template-columns: 1fr;
        justify-content: stretch;
    }
}
@media (min-width:480px) and (max-width: 1024px) { /*tablet*/
    .register-form .form-group{
        display:grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 15px;
    }
    .register-form h1{
        grid-column: 1/span 2;
    }
    .register-form .form-group button{
        grid-column: 1/span 2;
        align-self: center;
        justify-self: center;
    }
 }
@media (min-width: 1024px) { /*Laptop & tvs*/
    .register-form .form-group{
        display:grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 15px;
    }
    .register-form h1{
        grid-column: 1/span 2;
    }
    .register-form .form-group button{
        grid-column: 1/span 2;
        align-self: center;
        justify-self: center;
    }
 }
</style>
