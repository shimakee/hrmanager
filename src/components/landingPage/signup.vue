<template>
    <div class="signup-form">
        <h1>Signup</h1>
        <form>
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
                <input type="text" v-model="identity.profile.email.address" placeholder="Email address">
            </div>

             <div class="input-group">
                <label for="fullname">Full name</label>
                <input type="text" v-model="identity.profile.name.first" placeholder="First">
                <input type="text" v-model="identity.profile.name.middle" placeholder="Middle">
                <input type="text" v-model="identity.profile.name.last" placeholder="Last">
                <input type="text" v-model="identity.profile.name.suffix" placeholder="Suffix">
            </div>

             <div class="input-group">
                <label>Gender: </label>
                 <div class="input-group">
                    <span>Male</span>
                    <input id="male" type="radio" value="male" v-model="identity.profile.gender">
                    <span>Female</span>
                    <input id="female" type="radio" value="female" v-model="identity.profile.gender">
                 </div>
            </div>

             <div class="input-group">
                <!-- <label for="gender">Civil status</label> -->
                <select v-model="identity.profile.civilStatus">
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="annulled">Annulled</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                </select>
            </div>

            <button class="btn primary" @click.prevent="submit">Send</button>

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
                    username: '',
                    password:'',
                    passConfirm:''
                },
                profile:{
                    email:{main:true,
                        address:''},
                    name:{
                        first:'',
                        middle:'',
                        last:'',
                        suffix:''
                    },
                    gender:'male',
                    civilStatus:'single'
                }
            },
            submitted: false
        }
    },
    methods:{
        submit(){
            this.submitted = true;

            this.$store.dispatch('signup', this.identity)
                .then(res=>{
                    console.log(res);

                    this.$router.push('/home');
                }).catch(err=>{
                    this.submitted = false
                    console.log(err);

                    //display error message
                    console.log('signup failed');
                });
        }
    },
    computed:{
    }
}
</script>
<style scoped>
.signup-form{
    display:grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-content: center;
}
.signup-form .input-group{
    display:grid;
    grid-template-columns: 1fr;
    align-items: center;
    justify-items: center;
}
.signup-form label{
    font-weight: bolder;
}
.form-group input, .form-group select{
    text-align: center;
    font-size: 15px;
    padding: 3px 0px;
    color: rgb(28, 28, 46);
    /* font-weight: bolder; */
}
.signup-form form{
    padding: 15px;
}
.signup-form h1{
    background-color: rgb(6, 11, 80);
    margin: 0;
    padding: 10px 0;
    color:white;
}
.btn.primary{
    color:white;
    background-color: dodgerblue;
    border: solid 3px dodgerblue;
    /* background-color: rgb(6, 11, 80); */
    /* border: solid 3px rgb(6, 11, 80); */
    border-radius: 10px;
    margin: 1em .5em;
    padding: .5em 1em;
    transition: .3s ease-in;
    grid-column: 1/span 2;
    justify-self: center;
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
    .signup-form .form-group{
        display:grid;
        grid-template-columns: 1fr;
        justify-content: stretch;
    }
}
@media (min-width:480px) and (max-width: 1024px) { /*tablet*/
    .signup-form form{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 15px;
    }
    .signup-form .form-group{
        display:grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 15px;
    }
    .signup-form h1{
        grid-column: 1/span 2;
    }
    .signup-form .form-group button{
        grid-column: 1/span 2;
        align-self: center;
        justify-self: center;
    }
 }
@media (min-width: 1024px) { /*Laptop & tvs*/
    .signup-form form{
        display:grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 15px;
    }
    .signup-form .form-group{
        display:grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 15px;
    }
    .signup-form h1{
        grid-column: 1/span 2;
    }
    .signup-form form button{
        grid-column: 1/span 2;
        align-self: center;
        justify-self: center;
    }
 }
</style>
