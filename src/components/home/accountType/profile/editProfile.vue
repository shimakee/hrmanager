<template>
    <div>
        <form>
            <div class="formGroup">
                <select v-model="formProfile.civilStatus" id="">
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="annulled">Annuled</option>
                    <option value="widowed">Widowed</option>
                </select>
            </div>

            <div class="formGroup">
                <label>male</label>
                <input type="radio" v-model="formProfile.gender" value="male">
                <label>female</label>
                <input type="radio" v-model="formProfile.gender" value="female">
            </div>

            <div class="formGroup">
                <label>name:</label>
                <input type="text" v-model="formProfile.name.first" placeholder="first">
                <input type="text" v-model="formProfile.name.middle" placeholder="middle">
                <input v-if="formProfile.gender === 'female' && formProfile.civilStatus !== 'single'"
                    type="text" v-model="formProfile.name.maiden" placeholder="maiden">
                <input type="text" v-model="formProfile.name.last" placeholder="last">
                <input type="text" v-model="formProfile.name.suffix" placeholder="suffix">
            </div>

            <div class="formGroup">
                <input type="date" v-model="formProfile.birthdate">
            </div>

            <div class="formGroup">
                <input type="text" v-model="formProfile.nationality" placeholder="nationality">
            </div>

            <button @click.prevent="submit">Send</button>
        </form>
    </div>
</template>
<script>
export default {
    data(){
        return {
            formProfile:{ name:{first: "",
                                middle: "",
                                maiden:"",
                                last: "",
                                suffix: "" },
                        civilStatus: "single",
                        nationality:"",
                        gender: "male",
                        birthdate:"",}
        }
    },
    methods:{
        submit(){

            this.$store.dispatch('updateProfile', this.formProfile)
                .then(response=>{
                    this.$store.dispatch('getProfile')
                        .then(res=>{
                            localStorage.setItem('profile', JSON.stringify(res));
                            this.$store.commit('setProfile', res);
                    });
                });
        }
    },
    computed:{
        profile(){
            return this.$store.getters.getProfile;
        }
    },
}
</script>
<style scoped>
.profile{
    display: grid; 
    grid-template-columns: 1fr 4fr;
}
.avatar-container{
    /* position:relative; */
    padding:.5em;
    margin:1.5em;
    text-align: center;
    float: left;
    /* width:20vw; */
}
.avatar{
    border-radius: 20em;
}
.info{
    list-style: none;
    text-align: center;
}
.posts{
    position:relative;
    display:block;
}
</style>
