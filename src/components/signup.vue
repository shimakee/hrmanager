<template>
    <div>
        <h1>Signup</h1>
        <form>
            <div>
                <label for="username">username</label>
                <input type="text" v-model="identity.username" placeholder="Username">
            </div>

            <div>
                <label for="password">password</label>
                <input type="password" v-model="identity.password" placeholder="Password">
                <label for="passConfirm">password confrim</label>
                <input type="password" v-model="identity.passConfirm" placeholder="Confirm password">
            </div>

             <div>
                <label for="fullname">Full name</label>
                <input type="text" v-model="identity.name.first" placeholder="First">
                <input type="text" v-model="identity.name.middle" placeholder="Middle">
                <input type="text" v-model="identity.name.last" placeholder="Last">
                <input type="text" v-model="identity.name.suffix" placeholder="Suffix">
            </div>

             <div>
                <label for="male">Male</label>
                <input id="male" type="radio" value="male" v-model="identity.gender">
                <label for="female">Female</label>
                <input id="female" type="radio" value="female" v-model="identity.gender">
            </div>

             <div>
                <label for="gender">Civil status</label>
                <select v-model="identity.civilStatus">
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
export default {
    data(){
        return{
            identity:{
                username: '',
                password:'',
                passConfirm:'',
                name:{
                    first:'',
                    middle:'',
                    last:'',
                    suffix:''
                },
                gender:'male',
                civilStatus:'single'
            }
        }
    },
    methods:{
        submit(event){
            event.preventDefault();
            var vm=this;
            console.log(this.identity);
        }
    }
}
</script>
<style scoped>

</style>
