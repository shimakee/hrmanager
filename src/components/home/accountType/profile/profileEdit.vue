<template>
    <div>
        <form class="form-container">
            <div class="form-group">
                <div class="label-group">
                    <label class="input">Gender</label>
                    <select v-model="formProfile.civilStatus" id="">
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="annulled">Annuled</option>
                        <option value="widowed">Widowed</option>
                    </select>
                </div>
                
                <div class="label-group">
                    <label>Birthdate</label>
                    <input type="date" v-model="formProfile.birthdate">
                </div>
            </div>

            <div class="form-group">
                <div class="form-group">
                    <div>
                        <label>male</label>
                        <input type="radio" v-model="formProfile.gender" value="male">
                    </div>
                    <div>
                        <label>female</label>
                        <input type="radio" v-model="formProfile.gender" value="female">
                    </div>
                </div>
                <div class="label-group">
                    <label>Nationality</label>
                    <input type="text" v-model="formProfile.nationality" placeholder="nationality">
                </div>
            </div>

            <div class="input-group">
                <input type="text" v-model="formProfile.name.first" placeholder="first">
                <input type="text" v-model="formProfile.name.middle" placeholder="middle">
                <input type="text" v-model="formProfile.name.last" placeholder="last">
                <input type="text" v-model="formProfile.name.suffix" placeholder="suffix">
                <input v-if="formProfile.gender === 'female' && formProfile.civilStatus !== 'single'"
                    type="text" v-model="formProfile.name.maiden" placeholder="maiden">
            </div>

            <button @click.prevent="submit">Send</button>

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
        return {
            formProfile:{ name:{first: "",
                                middle: "",
                                maiden:"",
                                last: "",
                                suffix: "" },
                        civilStatus: "single",
                        nationality:"",
                        gender: "male",
                        birthdate:""}
        }
    },
    methods:{
        submit(){

            this.$store.dispatch('updateProfile', this.formProfile) //TODO: unit by account type - updateAccount information
                .then(response=>{
                    this.$store.dispatch('getProfile')
                        .then(res=>{
                            localStorage.setItem('profile', JSON.stringify(res));
                            this.$store.commit('setProfile', res);
                    });
                    
                }).catch(err=>{
                    

                    this.$store.commit('setErrorMessage', 'Account update failed. Invalid input.');
                });
        },
        giveFormValue(data){
            
                    this.formProfile.civilStatus = data.civilStatus;
                    let name = this.formProfile.name;

                    for (const key in this.formProfile.name) {
                        if (this.formProfile.name.hasOwnProperty(key)) {
                            const element = this.formProfile.name[key];
                            
                            name[key] = data.name[key];
                        }
                    }

                    this.formProfile.nationality = data.nationality;
                    this.formProfile.gender = data.gender;
                    this.formProfile.birthdate = data.birthdate;
        }
    },
    computed:{
        profile(){
            return this.$store.getters.getProfile;
        },
        errorMessage(){
            return this.$store.getters.getErrorMessage;
        },
        infoMessage(){
            return this.$store.getters.getInfoMessage;
        }
    },
    mounted(){
        let profile = this.$store.getters.getProfile; //get information

        if(!profile){
            this.$store.dispatch('getProfile') 
                .then(res=>{
                    // localStorage.setItem('profile', JSON.stringify(res));
                    // this.$store.commit('setProfile', res);

                    //assign value to form
                    this.giveFormValue(res);
            });
        }else{
            //assign value to form
            this.giveFormValue(profile);
        }
    }
}
</script>
<style scoped>
/*======INFO & ERROR message========*/
.error{
    color: red;
    text-align: center;
}



/*==========================FORM===================================*/
.form-container{
    display:grid;
    grid-template-columns: 1fr;
    /* justify-content: center;
    align-content: center; */
    grid-row-gap: 10px;
}
.form-container button{
    align-self: center;
    justify-self: center;
}
.form-group{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1em;
    /* margin: 5px 0; */
}
.input-group{   
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, auto));
    grid-gap: 10px;
    /* margin: 5px 0; */
}
.label-group{
    display: grid;
    grid-template-columns: 1fr 4fr;
}
.form-group .input-group{
    display: grid;
    grid-template-columns: 1fr;
}
.input{
    max-width: fit-content;
}


@media (max-width: 480px) { /*mobile*/
    .label-group{
        grid-template-columns: 1fr;
    }
}
</style>
