<template>
    <div class="signup">
        <form class="form-group">
        <h1>Register</h1>
            <!--TODO create component for input-->
            <div class="form-group">
                <label for="username">username</label>
                <input type="text" v-model="identity.user.username" placeholder="Username">
            </div>

            <div class="form-group">
                <div class="input-group">
                    <label for="password">password</label>
                    <input type="password" v-model="identity.user.password" placeholder="Password">
                </div>
                <div class="input-group">
                    <label for="passConfirm">password confrim</label>
                    <input type="password" v-model="identity.user.passConfirm" placeholder="Confirm password">
                </div>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="text" v-model="identity.company.email.address" placeholder="Email address">
            </div>

             <div class="form-group">
                <label for="fullname">Tradename</label>
                <input type="text" v-model="identity.company.tradename">
            </div>

             <div class="form-group">
                <label for="ownership">Ownership type</label>
                <select v-model="identity.company.ownershipType">
                    <option value="sole">Sole proprietor</option>
                    <option value="partnership">Partnership</option>
                    <option value="corporation">Corporation</option>
                </select>
            </div>

            <button @click.prevent="submit">Send</button>

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
                    owner: [{ //do i need this? or just add owner when updating instead of here in registration
                        profile:'', //get profile ID from store
                        position:'' //default position is proprietor for sole, and CEO for corp
                    }],
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

            this.$store.dispatch('register', this.identity)
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
.signup{
    padding: 10px;
}

.signup form{
    display: grid;
    grid-template-columns: 1fr;
}
.signup .form-group{
    display: grid;
    justify-items: center;
    margin: 5px 0;
}
.signup .input-group{
    display: grid;
    justify-items: center;
}
</style>
