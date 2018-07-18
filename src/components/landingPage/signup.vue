<template>
    <div class="signup">
        <h1>Signup</h1>
        <form>
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
                <label for="email">email</label>
                <input type="text" v-model="identity.profile.email.address" placeholder="Email address">
            </div>

             <div class="form-group">
                <label for="fullname">Full name</label>
                <input type="text" v-model="identity.profile.name.first" placeholder="First">
                <input type="text" v-model="identity.profile.name.middle" placeholder="Middle">
                <input type="text" v-model="identity.profile.name.last" placeholder="Last">
                <input type="text" v-model="identity.profile.name.suffix" placeholder="Suffix">
            </div>

             <div class="form-group">
                 <div class="input-group">
                    <label for="male">Male</label>
                    <input id="male" type="radio" value="male" v-model="identity.profile.gender">
                 </div>
                 <div class="input-group">
                    <label for="female">Female</label>
                    <input id="female" type="radio" value="female" v-model="identity.profile.gender">
                 </div>
            </div>

             <div class="form-group">
                <label for="gender">Civil status</label>
                <select v-model="identity.profile.civilStatus">
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="annulled">Annulled</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                </select>
            </div>

            <button @click="submit">Send</button>

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
        submit(event){
            event.preventDefault();
            this.$store.dispatch('signup', this.identity);
            this.submitted = true;
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
